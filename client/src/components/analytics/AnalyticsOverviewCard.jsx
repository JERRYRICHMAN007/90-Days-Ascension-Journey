import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getJourneyTrace, computeMasteryScore } from '../../utils/tracing.js';
import { getJourneyAccent, masteryToRank } from '../../utils/journeyAccents.js';
import { getJourneyTheme } from '../../utils/journeyTheme.js';

function splitTagline(subtitle) {
  if (!subtitle) return ['', ''];
  const words = subtitle.trim().split(/\s+/);
  if (words.length <= 1) return [subtitle, ''];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

function formatLastActive(trend) {
  const days = [...(trend?.last14Days ?? [])].reverse();
  const lastIdx = days.findIndex((d) => d.sessionsCompleted > 0);
  if (lastIdx === -1) return 'NOT STARTED';
  if (lastIdx === 0) return 'TODAY';
  if (lastIdx === 1) return 'YESTERDAY';
  return `${lastIdx}D AGO`;
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
  const [taglineA, taglineB] = splitTagline(accent.subtitle);
  const lastActive = formatLastActive(trace.trend);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="min-w-0 w-full h-full"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate(`/analytics/${journeyId}`)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') navigate(`/analytics/${journeyId}`);
        }}
        className="flex flex-col justify-between h-full min-h-[380px] p-[25px] rounded-[12px] border cursor-pointer transition-all duration-300"
        style={{
          background: 'var(--bg-card)',
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
        <div className="flex flex-col gap-1 w-full">
          {/* Icon + rank badge */}
          <div className="flex items-start justify-between w-full">
            <div
              className="flex h-10 items-center justify-center rounded-[8px] shrink-0 px-2.5"
              style={{ background: `rgba(${accent.rgb}, 0.1)` }}
            >
              <Icon className="w-5 h-5" style={{ color: accent.color }} />
            </div>
            <div
              className="rounded-[4px] border px-[9px] py-[5px] shrink-0"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: `rgba(${accent.rgb}, 0.3)`,
              }}
            >
              <p
                className="text-[10px] font-bold leading-[15px]"
                style={{ color: accent.color }}
              >
                MASTERY
                <br />
                {rank}
              </p>
            </div>
          </div>

          {/* Title + tagline */}
          <h3 className="text-2xl font-bold text-[var(--text-primary)] tracking-[-0.48px] leading-[28.8px] pt-5">
            {accent.label}
          </h3>
          <div className="forge-label leading-[12px] mt-1">
            <p>{taglineA}</p>
            {taglineB && <p>{taglineB}</p>}
          </div>

          {/* Mastery score + streak */}
          <div className="flex flex-col gap-6 pt-7">
            <div className="flex flex-col gap-2">
              <div className="forge-label leading-[12px]">
                <p>MASTERY</p>
                <p>SCORE</p>
              </div>
              <p
                className="text-[32px] font-extrabold tracking-[-0.64px] leading-[32px] tabular-nums"
                style={{ color: accent.color }}
              >
                {masteryScore}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="forge-label leading-[12px]">STREAK</p>
              <p className="flex items-baseline gap-1.5">
                <span className="text-[32px] font-extrabold text-[var(--text-primary)] tracking-[-0.64px] leading-none tabular-nums">
                  {trace.consistency.currentStreak}
                </span>
                <span className="text-base text-[var(--text-secondary)]">Days</span>
              </p>
            </div>
          </div>
        </div>

        {/* Completion footer */}
        <div
          className="pt-8 mt-4 border-t flex flex-col gap-2"
          style={{ borderColor: 'rgba(59,73,76,0.1)' }}
        >
          <div className="flex items-end justify-between">
            <span className="forge-label leading-[12px]">COMPLETION</span>
            <span
              className="forge-label leading-[12px]"
              style={{ color: accent.color }}
            >
              {percentComplete}%
            </span>
          </div>
          <div className="h-[6px] rounded-full overflow-hidden bg-[var(--bg-badge)]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(percentComplete, percentComplete > 0 ? 4 : 0)}%`,
                background: accent.color,
                boxShadow: percentComplete > 0 ? `0 0 4px ${accent.color}` : 'none',
              }}
            />
          </div>
          <p className="text-[10px] uppercase text-[var(--text-secondary)] leading-[15px] pt-2">
            LAST ACTIVE: {lastActive}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
