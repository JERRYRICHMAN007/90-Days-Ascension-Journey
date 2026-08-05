import { useMemo, useState, useEffect } from 'react';
import { getJourneyTrace, computeMasteryScore } from '../../utils/tracing.js';
import {
  getJourneyTimeline,
  getJourneyState,
  getNextMilestone,
} from '../../utils/journeyPlanning.js';
import { calculateSessionBasedProgress } from '../../utils/progressTracking.js';
import { useGamification } from '../../hooks/useGamification';

function StatSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 animate-pulse">
      <div className="h-2.5 w-20 rounded bg-[var(--bg-badge)]" />
      <div className="h-7 w-14 rounded bg-[var(--bg-badge)] mt-3" />
    </div>
  );
}

export function JourneyStatsPage({ journeyId, weeks, progressTick = 0 }) {
  const [tick, setTick] = useState(0);
  const { streaks } = useGamification();

  useEffect(() => {
    const refresh = () => setTick((t) => t + 1);
    window.addEventListener('journey-start-updated', refresh);
    window.addEventListener('progress-updated', refresh);
    return () => {
      window.removeEventListener('journey-start-updated', refresh);
      window.removeEventListener('progress-updated', refresh);
    };
  }, []);

  const stats = useMemo(() => {
    void tick;
    void progressTick;
    const state = getJourneyState(journeyId);
    const timeline = getJourneyTimeline(journeyId);
    const session = calculateSessionBasedProgress(journeyId, weeks || []);
    const trace = getJourneyTrace(journeyId);
    const totalDays = timeline.totalDays || 184;
    const milestone = getNextMilestone(journeyId, session.completedDays ?? 0, totalDays);

    return {
      state,
      mastery: computeMasteryScore(trace),
      percentComplete: session.percentage ?? 0,
      completedDays: session.completedDays ?? 0,
      daysRemaining: timeline.daysRemaining ?? Math.max(0, totalDays - (timeline.currentDay || 1)),
      streak: streaks?.current ?? trace.consistency?.currentStreak ?? 0,
      timeElapsed: timeline.timeElapsedPercent ?? 0,
      totalDays,
      currentDay: timeline.currentDay ?? 1,
      milestone,
    };
  }, [journeyId, weeks, tick, progressTick, streaks?.current]);

  if (stats.state === 'not_started') {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          Statistics appear after you confirm and start this journey.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">Statistics</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Days completed" value={stats.completedDays} highlight />
        <StatCard label="Days remaining" value={stats.daysRemaining} />
        <StatCard label="Progress" value={`${stats.percentComplete}%`} />
        <StatCard label="Current streak" value={`${stats.streak}d`} />
        <StatCard label="Calendar day" value={`Day ${stats.currentDay}`} />
        <StatCard label="Mastery score" value={stats.mastery} />
      </div>

      <div
        className="rounded-xl border p-4 flex items-start gap-3"
        style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}
      >
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Next milestone</p>
          <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">
            {stats.milestone?.icon} {stats.milestone?.label || 'Keep going'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Timeline</p>
          <p className="text-sm font-semibold text-[var(--text-primary)] mt-1">{stats.timeElapsed}% elapsed</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }) {
  return (
    <div
      className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4"
      style={highlight ? { borderColor: 'rgba(110,231,183,0.25)' } : undefined}
    >
      <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
      <p className="text-2xl font-bold text-[var(--text-primary)] mt-1 tabular-nums">{value}</p>
    </div>
  );
}

export { StatSkeleton };
