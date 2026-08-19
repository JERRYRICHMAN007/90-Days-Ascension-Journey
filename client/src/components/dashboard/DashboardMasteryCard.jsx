import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Target, X } from 'lucide-react';
import { getJourneyAccent } from '../../utils/journeyAccents.js';
import { getContentTemplateId, removeJourney } from '../../utils/journeyRegistry.js';
import {
  getJourneyState,
  getJourneyTimeline,
  getNextMilestone,
} from '../../utils/journeyPlanning.js';
import { calculateSessionBasedProgress } from '../../utils/progressTracking.js';
import { getJourneyData } from '../../data/journeys/index.js';
import { SettingsConfirmDialog } from '../settings/SettingsConfirmDialog.jsx';

/**
 * Lightweight dashboard card — summary only; tap opens dedicated journey page.
 */
export function DashboardMasteryCard({ entry, index = 0, tick = 0 }) {
  const navigate = useNavigate();
  const journeyId = entry.id;
  const templateId = getContentTemplateId(journeyId);
  const accent = getJourneyAccent(templateId);

  const { state, progress, completedDays, milestone, statusLine } = useMemo(() => {
    void tick;
    const st = getJourneyState(journeyId);
    const timeline = getJourneyTimeline(journeyId);
    let pct = 0;
    let completed = 0;
    if (st !== 'not_started') {
      try {
        const { weeks } = getJourneyData(templateId);
        const session = calculateSessionBasedProgress(journeyId, weeks || []);
        pct = session.percentage ?? 0;
        completed = session.completedDays ?? 0;
      } catch {
        /* ignore */
      }
    }
    const mile = getNextMilestone(journeyId, completed, timeline.totalDays || 184);
    let line = 'Not started';
    if (st === 'active') line = timeline.currentDay ? `Day ${timeline.currentDay} of ${timeline.totalDays}` : 'In progress';
    if (st === 'completed') line = 'Completed 🎉';
    return { state: st, progress: pct, completedDays: completed, milestone: mile, statusLine: line };
  }, [journeyId, templateId, tick]);

  const color = entry.color || accent.color;
  const [removeOpen, setRemoveOpen] = useState(false);

  return (
    <>
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => navigate(`/journey/${journeyId}`)}
      className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 sm:p-5 text-left transition-all duration-300 hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-muted)] w-full group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-lg"
            style={{ background: `rgba(${accent.rgb}, 0.12)` }}
          >
            {entry.icon || accent.icon}
          </div>
          <div className="min-w-0">
            <p className="font-display text-base font-bold text-[var(--text-primary)] truncate">{entry.title}</p>
            <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)] truncate">{statusLine}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {state === 'active' && (
            <span className="text-sm font-bold tabular-nums" style={{ color }}>
              {progress}%
            </span>
          )}
          <span
            role="button"
            tabIndex={0}
            aria-label={`Remove ${entry.title}`}
            onClick={(e) => {
              e.stopPropagation();
              setRemoveOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                setRemoveOpen(true);
              }
            }}
            className="flex size-8 items-center justify-center rounded-full text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          >
            <X className="size-4" />
          </span>
        </div>
      </div>

      {state === 'active' && (
        <div className="h-1.5 rounded-full bg-[var(--bg-badge)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.max(progress, progress > 0 ? 4 : 0)}%`,
              background: `linear-gradient(90deg, ${color}, ${accent.light})`,
            }}
          />
        </div>
      )}

      {state !== 'not_started' && (
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <Target className="size-3.5 shrink-0" style={{ color }} />
          <span className="truncate">{milestone.label}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: state === 'not_started' ? 'var(--text-muted)' : color }}>
          {state === 'not_started' ? 'Start journey' : 'Continue'}
        </span>
        <ChevronRight className="size-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
      </div>
    </motion.button>
    <SettingsConfirmDialog
      open={removeOpen}
      title={`Remove ${entry.title}?`}
      description="This takes it off your dashboard and clears its progress. You can add the same type again anytime."
      confirmLabel="Remove"
      variant="danger"
      onCancel={() => setRemoveOpen(false)}
      onConfirm={() => {
        removeJourney(journeyId);
        setRemoveOpen(false);
      }}
    />
    </>
  );
}
