import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { getJourneyTrace, computeMasteryScore } from '../../utils/tracing.js';
import { getJourneyAccent, masteryToRank } from '../../utils/journeyAccents.js';
import { getJourneyTheme } from '../../utils/journeyTheme.js';

function formatLastActive(trend) {
  const days = [...(trend?.last14Days ?? [])].reverse();
  const lastIdx = days.findIndex((d) => d.sessionsCompleted > 0);
  if (lastIdx === -1) return 'Not started';
  if (lastIdx === 0) return 'Today';
  if (lastIdx === 1) return 'Yesterday';
  return `${lastIdx}d ago`;
}

export function AnalyticsOverviewCard({ journeyId, index = 0 }) {
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);
  const theme = getJourneyTheme(journeyId);
  const Icon = theme.icon;

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
  const rank = masteryToRank(masteryScore);
  const percentComplete = trace.completion.percentComplete ?? 0;
  const lastActive = formatLastActive(trace.trend);
  const streak = trace.consistency.currentStreak ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="min-w-0 w-full"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate(`/analytics/${journeyId}`)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') navigate(`/analytics/${journeyId}`);
        }}
        className="group flex flex-col gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:bg-[var(--bg-card-hover)]"
        style={{ ['--accent']: accent.color }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = accent.color;
          e.currentTarget.style.boxShadow = accent.glow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Top row: identity + rank */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-lg"
              style={{ background: `rgba(${accent.rgb}, 0.12)` }}
            >
              <Icon className="size-5" style={{ color: accent.color }} />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-base sm:text-lg font-bold text-[var(--text-primary)] truncate">
                {accent.label}
              </h3>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-[var(--text-muted)] truncate">
                {accent.subtitle}
              </p>
            </div>
          </div>
          <span
            className="shrink-0 rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-wide"
            style={{
              color: accent.color,
              borderColor: `rgba(${accent.rgb}, 0.35)`,
              background: `rgba(${accent.rgb}, 0.08)`,
            }}
          >
            Rank {rank}
          </span>
        </div>

        {/* Stats row — horizontal, compact */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <StatBlock label="Mastery" value={masteryScore} accent={accent.color} />
          <StatBlock
            label="Streak"
            value={streak}
            suffix="d"
            icon={<Flame className="size-3 text-orange-400 inline mr-0.5 -mt-0.5" />}
          />
          <StatBlock label="Done" value={`${percentComplete}%`} accent={accent.color} />
        </div>

        {/* Progress + last active */}
        <div className="space-y-2 pt-1 border-t border-[var(--border-subtle)]">
          <div className="h-1.5 rounded-full overflow-hidden bg-[var(--bg-badge)]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(percentComplete, percentComplete > 0 ? 4 : 0)}%`,
                background: `linear-gradient(90deg, ${accent.color}, ${accent.light})`,
              }}
            />
          </div>
          <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
            Last active: {lastActive}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function StatBlock({ label, value, suffix, accent, icon }) {
  return (
    <div className="rounded-lg bg-[var(--bg-secondary)]/60 px-2.5 py-2 text-center sm:text-left">
      <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
        {label}
      </p>
      <p
        className="text-lg sm:text-xl font-extrabold tabular-nums leading-none text-[var(--text-primary)]"
        style={accent ? { color: accent } : undefined}
      >
        {icon}
        {value}
        {suffix && (
          <span className="text-xs font-normal text-[var(--text-muted)] ml-0.5">{suffix}</span>
        )}
      </p>
    </div>
  );
}
