import { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getJourneyTrace, computeMasteryScore } from '../../utils/tracing.js';
import { getJourneyAccent } from '../../utils/journeyAccents.js';

export function JourneyTraceCard({ journeyId, index = 0 }) {
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

  const handleNavigate = (e) => {
    e.stopPropagation();
    navigate(`/analytics/${journeyId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="min-w-0"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate(`/analytics/${journeyId}`)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') navigate(`/analytics/${journeyId}`);
        }}
        className="relative overflow-hidden rounded-2xl p-5 min-h-[220px] flex flex-col justify-between border bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-all duration-300 cursor-pointer"
        style={{
          borderColor: 'var(--border-subtle)',
          ['--journey-accent']: accent.color,
          ['--neon-glow']: accent.glow,
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
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, ${accent.color}, transparent)` }}
        />

        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0" aria-hidden>{accent.icon}</span>
            <div className="min-w-0">
              <p
                className="text-xs font-semibold tracking-widest uppercase truncate"
                style={{ color: accent.color }}
              >
                {accent.label}
              </p>
              <p className="text-white font-bold text-lg leading-tight truncate">
                {trace.journeyTitle}
              </p>
            </div>
          </div>
          <div
            className="text-xs font-bold px-2 py-1 rounded-full shrink-0 border"
            style={{
              color: accent.color,
              borderColor: accent.color,
              background: `rgba(${accent.rgb}, 0.1)`,
            }}
          >
            {masteryScore}% Mastery
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
            <span>Day {completion.currentDay} of {completion.totalDays}</span>
            <span className="tabular-nums">{percentComplete}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--bg-elevated)]">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(percentComplete, isNotStarted ? 0 : percentComplete)}%`,
                minWidth: isNotStarted ? 0 : undefined,
                background: `linear-gradient(90deg, ${accent.color}, ${accent.light})`,
                boxShadow: percentComplete > 0 ? `0 0 8px ${accent.color}` : 'none',
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 gap-2">
          <div className="flex items-center gap-3 sm:gap-4 text-xs text-[var(--text-secondary)] min-w-0">
            <span className="shrink-0">🔥 {consistency.currentStreak} day streak</span>
            <span className="tabular-nums truncate">
              {completion.completedSessions}/{completion.totalSessions} sessions
            </span>
          </div>
          {isNotStarted ? (
            <span className="text-xs px-2 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] shrink-0">
              Not started
            </span>
          ) : (
            <button
              type="button"
              className="text-xs font-semibold shrink-0 hover:opacity-80 transition-opacity"
              style={{ color: accent.color }}
              onClick={handleNavigate}
            >
              View Analytics →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
