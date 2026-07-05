import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { getJourneyAccent, masteryToRank } from '../../utils/journeyAccents.js';
import { getJourneyTheme } from '../../utils/journeyTheme.js';
import { computeMasteryScore, getJourneyTrace } from '../../utils/tracing.js';

function splitMobileTitle(journeyId, label) {
  if (journeyId === 'body-transformation') return ['Body', 'Transformation'];
  if (journeyId === 'software-engineering') return ['Software', 'Engineering'];
  return [label];
}

function useMultilineRank(journeyId) {
  return journeyId === 'body-transformation' || journeyId === 'software-engineering';
}

export function DashboardMobileCard({ journeyId, index = 0, tick = 0 }) {
  const navigate = useNavigate();
  const accent = getJourneyAccent(journeyId);
  const theme = getJourneyTheme(journeyId);
  const Icon = theme.icon;
  const multilineRank = useMultilineRank(journeyId);

  const { percentComplete, streak, rank } = useMemo(() => {
    void tick;
    const trace = getJourneyTrace(journeyId);
    const mastery = computeMasteryScore(trace);
    return {
      percentComplete: trace.completion.percentComplete ?? 0,
      streak: trace.consistency.currentStreak ?? 0,
      rank: masteryToRank(mastery),
    };
  }, [journeyId, tick]);

  const titleLines = splitMobileTitle(journeyId, accent.fullLabel);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(theme.path)}
      className="flex w-full flex-col gap-6 rounded-[12px] border border-[#222] bg-[#141414] p-[25px] text-left transition-colors hover:bg-[var(--bg-card-hover)]"
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border p-px"
            style={{
              background: '#192122',
              borderColor: 'rgba(59,73,76,0.2)',
            }}
          >
            <Icon className="size-5" style={{ color: accent.color }} />
          </div>

          <div className="min-w-0">
            {titleLines.map((line) => (
              <p
                key={line}
                className="text-left text-[24px] font-bold leading-[28.8px] tracking-[-0.48px] text-[#dce4e5]"
              >
                {line}
              </p>
            ))}
            <div className="mt-2 flex items-center gap-2">
              <Flame className="size-2.5 shrink-0 text-[#bac9cc]" />
              <span className="text-[12px] font-bold uppercase tracking-[1.2px] text-[#bac9cc]">
                {streak} DAY STREAK
              </span>
            </div>
          </div>
        </div>

        <div
          className="shrink-0 rounded-[4px] border bg-[#242b2d] px-2 py-1"
          style={{
            color: accent.color,
            borderColor: `rgba(${accent.rgb}, 0.4)`,
          }}
        >
          {multilineRank ? (
            <>
              <p className="text-[12px] font-bold uppercase leading-3 tracking-[1.2px]">
                RANK
              </p>
              <p className="text-[12px] font-bold uppercase leading-3 tracking-[1.2px]">
                {rank}
              </p>
            </>
          ) : (
            <p className="text-[12px] font-bold uppercase leading-3 tracking-[1.2px] whitespace-nowrap">
              RANK {rank}
            </p>
          )}
        </div>
      </div>

      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold uppercase tracking-[1.2px] text-[#bac9cc]">
            PROGRESS
          </span>
          <span className="text-[12px] font-bold uppercase tracking-[1.2px] text-[#bac9cc]">
            {percentComplete}%
          </span>
        </div>
        <div className="h-[6px] overflow-hidden rounded-full bg-[#192122]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.max(percentComplete, percentComplete > 0 ? 4 : 0)}%`,
              background: `linear-gradient(90deg, ${accent.color}, ${accent.light})`,
              boxShadow: percentComplete > 0 ? `0 0 12px ${accent.color}` : 'none',
            }}
          />
        </div>
      </div>
    </motion.button>
  );
}
