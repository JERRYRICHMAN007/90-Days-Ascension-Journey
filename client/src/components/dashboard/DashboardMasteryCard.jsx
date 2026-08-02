import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { getJourneyAccent } from '../../utils/journeyAccents.js';
import { getJourneyTheme } from '../../utils/journeyTheme.js';
import { computeMasteryScore, getJourneyTrace } from '../../utils/tracing.js';
import {
  collectDaySessionKeys,
  getJourneyCompletions,
} from '../../utils/progressTracking.js';
import { getJourneyData } from '../../data/journeys/index.js';
import { getCurrentDayNumber } from '../../utils/dates.js';
import { hasJourneyStartDate } from '../../utils/journeyPlanning.js';

function getTodaySessionStats(journeyId, currentDay) {
  if (!currentDay) return { completed: 0, scheduled: 0 };
  try {
    const { weeks } = getJourneyData(journeyId);
    const day = weeks
      .flatMap((w) => w.days || [])
      .find((d) => d.dayNumber === currentDay);
    if (!day) return { completed: 0, scheduled: 0 };
    const keys = collectDaySessionKeys(journeyId, day);
    const completions = getJourneyCompletions(journeyId);
    const completed = keys.filter((k) => completions[k]?.completed).length;
    return { completed, scheduled: keys.length };
  } catch {
    return { completed: 0, scheduled: 0 };
  }
}

export function DashboardMasteryCard({ journeyId, index = 0, tick = 0 }) {
  const navigate = useNavigate();
  const accent = getJourneyAccent(journeyId);
  const theme = getJourneyTheme(journeyId);
  const Icon = theme.icon;
  const started = hasJourneyStartDate(journeyId);
  const currentDay = started ? getCurrentDayNumber() : null;

  const { mastery, percentComplete, streak, statusLabel } = useMemo(() => {
    void tick;
    const t = getJourneyTrace(journeyId);
    const m = computeMasteryScore(t);
    const pct = t.completion.percentComplete ?? 0;
    const st = t.consistency.currentStreak ?? 0;
    const day = started ? (t.completion.currentDay || currentDay || 0) : 0;
    const stats = getTodaySessionStats(journeyId, day);
    let status = 'Not started';
    if (!started) status = 'Set start date';
    else if (day > 0) status = `Day ${day}`;
    else if (stats.scheduled > 0) status = `${stats.completed}/${stats.scheduled} today`;
    return {
      mastery: m,
      percentComplete: pct,
      streak: st,
      statusLabel: status,
    };
  }, [journeyId, tick, currentDay, started]);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => navigate(theme.path)}
      className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 sm:p-5 text-left transition-all duration-300 hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-default)] w-full"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)]"
            style={{ background: `rgba(${accent.rgb}, 0.1)` }}
          >
            <Icon className="size-5" style={{ color: accent.color }} />
          </div>
          <div className="min-w-0">
            <p className="font-display text-base font-bold text-[var(--text-primary)] truncate">
              {accent.label}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] truncate">
              {accent.subtitle}
            </p>
          </div>
        </div>
        <p
          className="text-xl font-extrabold tabular-nums shrink-0"
          style={{ color: accent.color }}
        >
          {mastery}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-[var(--bg-secondary)]/50 px-2.5 py-2">
          <p className="text-[10px] uppercase text-[var(--text-muted)]">Streak</p>
          <p className="text-lg font-bold text-[var(--text-primary)] tabular-nums flex items-center gap-1">
            <Flame className="size-3.5 text-orange-400" />
            {streak}
          </p>
        </div>
        <div className="rounded-lg bg-[var(--bg-secondary)]/50 px-2.5 py-2">
          <p className="text-[10px] uppercase text-[var(--text-muted)]">Complete</p>
          <p className="text-lg font-bold tabular-nums" style={{ color: accent.color }}>
            {percentComplete}%
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-1.5 rounded-full bg-[var(--bg-badge)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.max(percentComplete, percentComplete > 0 ? 4 : 0)}%`,
              background: `linear-gradient(90deg, ${accent.color}, ${accent.light})`,
            }}
          />
        </div>
        <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
          {statusLabel}
        </p>
      </div>
    </motion.button>
  );
}
