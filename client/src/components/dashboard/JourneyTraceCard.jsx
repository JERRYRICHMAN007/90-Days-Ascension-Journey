import { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getJourneyTrace, computeMasteryScore } from '../../utils/tracing.js';
import { getJourneyAccent, masteryToRank } from '../../utils/journeyAccents.js';

export function JourneyTraceCard({ journeyId, index = 0, compact = false }) {
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => setTick((t) => t + 1);
    window.addEventListener('session-completed', refresh);
    window.addEventListener('progress-updated', refresh);
    return () => {
      window.removeEventListener('session-completed', refresh);
      window.removeEventListener('progress-updated', refresh);
    };
  }, []);

  const trace = useMemo(() => {
    void tick;
    return getJourneyTrace(journeyId);
  }, [journeyId, tick]);

  const accent = getJourneyAccent(journeyId);
  const masteryScore = computeMasteryScore(trace);
  const { completion, consistency } = trace;
  const percentComplete = completion.percentComplete ?? 0;
  const isNotStarted = percentComplete === 0 && (completion.completedSessions ?? 0) === 0;
  const rank = masteryToRank(masteryScore);

  const goAnalytics = (e) => {
    e?.stopPropagation?.();
    navigate(`/analytics/${journeyId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="min-w-0 w-full"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate(`/analytics/${journeyId}`)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') navigate(`/analytics/${journeyId}`);
        }}
        className="aether-card flex flex-col gap-6 overflow-hidden cursor-pointer transition-all duration-300 hover:bg-[var(--bg-card-hover)] min-h-[160px]"
        style={{
          borderColor: 'var(--border-subtle)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = accent.color;
          e.currentTarget.style.boxShadow = accent.glow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Header: icon + title + streak | rank badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="shrink-0 flex items-center justify-center size-10 rounded-[8px] border"
              style={{
                background: 'var(--bg-elevated)',
                borderColor: 'rgba(59,73,76,0.2)',
              }}
            >
              <span className="text-lg leading-none" aria-hidden>{accent.icon}</span>
            </div>
            <div className="min-w-0">
              <h3 className="aether-heading-lg truncate">{accent.fullLabel}</h3>
              <p className="aether-label mt-2 flex items-center gap-2">
                <span aria-hidden>🔥</span>
                {consistency.currentStreak} DAY STREAK
              </p>
            </div>
          </div>
          <div
            className="aether-rank-badge shrink-0"
            style={{
              color: accent.color,
              border: `1px solid rgba(${accent.rgb}, 0.4)`,
            }}
          >
            RANK {rank}
          </div>
        </div>

        {/* Progress */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <span className="aether-label">PROGRESS</span>
            <span className="aether-label">{percentComplete}%</span>
          </div>
          <div className="aether-progress-track">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(percentComplete, 0)}%`,
                background: `linear-gradient(90deg, ${accent.color}, ${accent.light})`,
                boxShadow: percentComplete > 0 ? accent.glow : 'none',
              }}
            />
          </div>
          {!compact && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] uppercase text-[var(--text-secondary)]">
                Day {completion.currentDay} of {completion.totalDays}
              </span>
              {isNotStarted ? (
                <span className="text-[10px] uppercase text-[var(--text-secondary)] px-2 py-0.5 rounded bg-[var(--bg-badge)]">
                  Not started
                </span>
              ) : (
                <button
                  type="button"
                  onClick={goAnalytics}
                  className="text-[10px] font-bold uppercase tracking-[1.2px] hover:opacity-80"
                  style={{ color: accent.color }}
                >
                  View Analytics →
                </button>
              )}
            </div>
          )}
          {compact && (
            <div className="pt-2 border-t mt-2" style={{ borderColor: 'rgba(59,73,76,0.1)' }}>
              <div className="flex justify-between items-end">
                <div>
                  <p className="aether-label mb-1">MASTERY SCORE</p>
                  <p
                    className="text-[32px] font-extrabold tracking-[-0.64px] leading-none"
                    style={{ color: accent.color }}
                  >
                    {masteryScore}
                  </p>
                </div>
                <div className="text-right">
                  <p className="aether-label mb-1">STREAK</p>
                  <p className="text-[var(--text-primary)] font-extrabold text-xl leading-none">
                    {consistency.currentStreak}
                    <span className="text-sm font-normal text-[var(--text-secondary)] ml-1">Days</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
