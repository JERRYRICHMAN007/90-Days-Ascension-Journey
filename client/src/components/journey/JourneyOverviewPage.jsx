import { motion } from 'framer-motion';
import { ChevronLeft, Sparkles, Target } from 'lucide-react';
import { Button } from '../ui/button';
import { JourneyScheduleCard } from './JourneyScheduleCard';
import { JourneyMotivationQuote } from './JourneyMotivationQuote';
import { JourneyGoalsSection } from './JourneyGoalsSection';
import { JourneyAIAssistant } from './JourneyAIAssistant';
import { getJourneySetup } from '../../utils/journeySetup.js';
import { useJourneyTimeline } from '../../hooks/useJourneyTimeline';
import { getJourneyState } from '../../utils/journeyPlanning.js';
import { cn } from '../../lib/utils';

/** Swipe page 1 — progress ring, status, schedule, milestone */
export function JourneyOverviewPage({
  journey,
  journeyId,
  journeyTitle,
  completedDays,
  progressPercentage,
  accentColor,
  accentRgb,
  iconEmoji,
  IconComponent,
  colors,
  onBack,
  onTimelineRefresh,
  onEditSetup,
}) {
  const totalDays = journey?.totalDays ?? 184;
  const { timeline, milestone, refresh } = useJourneyTimeline(journeyId, completedDays, totalDays);
  const state = timeline.state || getJourneyState(journeyId);
  const rgb = accentRgb || '110,231,183';
  const accent = accentColor || '#6ee7b7';
  const setupProfile = getJourneySetup(journeyId);

  const handleSaved = () => {
    refresh();
    onTimelineRefresh?.();
  };

  return (
    <div className="w-full max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex items-center gap-3 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          aria-label="Back"
          className="shrink-0 text-[var(--text-primary)] bg-[var(--bg-badge)] hover:bg-[var(--surface-hover)] border border-[var(--border-subtle)]"
        >
          <ChevronLeft className="size-5" />
        </Button>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={cn('flex size-12 sm:size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br', colors?.gradient)}
          >
            {IconComponent ? <IconComponent className="size-6 sm:size-7 text-white" /> : <span className="text-xl sm:text-2xl">{iconEmoji}</span>}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)] truncate">
              {journeyTitle || journey.title}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {state === 'not_started' && (timeline.configured ? 'Journey ready — press Start when you\'re ready' : 'Waiting to start')}
              {state === 'active' && timeline.currentDay != null && `Day ${timeline.currentDay} of ${timeline.totalDays}`}
              {state === 'completed' && 'Completed'}
            </p>
          </div>
        </div>
      </div>

      {state === 'active' && (
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 sm:gap-8 items-center">
          <ProgressRing value={progressPercentage} accent={accent} label={`${progressPercentage}%`} sub="Complete" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <StatChip label="Streak" value={completedDays > 0 ? `${completedDays}d` : '—'} />
            <StatChip label="Remaining" value={timeline.daysRemaining ?? '—'} />
          </div>
        </div>
      )}

      <JourneyScheduleCard
        journeyId={journeyId}
        accentColor={accent}
        accentRgb={rgb}
        onSaved={handleSaved}
        onEditSetup={onEditSetup}
      />

      {state === 'not_started' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-8 sm:p-10 text-center"
          style={{
            background: `linear-gradient(160deg, rgba(${rgb},0.06) 0%, var(--bg-card) 100%)`,
            borderColor: `rgba(${rgb},0.2)`,
          }}
        >
          <div
            className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl"
            style={{ background: `rgba(${rgb},0.15)`, color: accent }}
          >
            <Sparkles className="size-7" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
            {timeline.configured ? 'Journey Ready' : 'Waiting to Start'}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-md mx-auto leading-relaxed">
            {timeline.configured
              ? 'Your schedule is set. Press Start Journey when you\'re ready — progress tracking begins only after you start.'
              : 'Set your start date above, then press Start Journey when you\'re ready.'}
          </p>
        </motion.div>
      )}

      <JourneyGoalsSection
        journeyId={journeyId}
        accentColor={accent}
        accentRgb={rgb}
        onEdit={onEditSetup}
      />

      <JourneyAIAssistant
        journeyId={journeyId}
        profile={setupProfile}
        accentColor={accent}
        onApplied={handleSaved}
      />

      <JourneyMotivationQuote
        journeyId={journeyId}
        domain={journeyId}
        accentColor={accent}
        accentRgb={rgb}
      />

      {state === 'active' && (
        <div
          className="rounded-xl p-4 sm:p-5 flex items-start gap-3"
          style={{ background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.2)` }}
        >
          <Target className="size-5 shrink-0 mt-0.5" style={{ color: accent }} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accent }}>
              Next milestone
            </p>
            <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
              {milestone.icon} {milestone.label}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressRing({ value, accent, label, sub }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="relative size-28 sm:size-32 shrink-0 mx-auto sm:mx-0">
      <svg className="size-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--bg-badge)" strokeWidth="8" />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">{label}</span>
        <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{sub}</span>
      </div>
    </div>
  );
}

function StatChip({ label, value }) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
      <p className="text-lg font-bold text-[var(--text-primary)] mt-0.5">{value}</p>
    </div>
  );
}
