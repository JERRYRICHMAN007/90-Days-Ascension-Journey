import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getJourneyAccent } from '../../utils/journeyAccents.js';
import { getJourneyTheme } from '../../utils/journeyTheme.js';
import { computeMasteryScore, getJourneyTrace } from '../../utils/tracing.js';
import { getJourneyData } from '../../data/journeys/index.js';
import {
  collectDaySessionKeys,
  isDayFullyComplete,
} from '../../utils/progressTracking.js';
import { getCurrentDayNumber } from '../../utils/journeyPlanning.js';
import { JOURNEY_COVER_IMAGES } from '../../utils/dashboardAssets.js';
import { useGamification } from '../../hooks/useGamification';

function getWeeklyMomentum(journeyId, currentDay) {
  if (!currentDay || currentDay < 1) return Array(7).fill(false);
  try {
    const { weeks } = getJourneyData(journeyId);
    const allDays = weeks.flatMap((w) => w.days || []);
    const bars = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const dayNum = currentDay - offset;
      if (dayNum < 1) {
        bars.push(false);
        continue;
      }
      const day = allDays.find((d) => d.dayNumber === dayNum);
      if (!day) {
        bars.push(false);
        continue;
      }
      const keys = collectDaySessionKeys(journeyId, day);
      if (keys.length === 0) {
        bars.push(false);
        continue;
      }
      bars.push(isDayFullyComplete(journeyId, day));
    }
    return bars;
  } catch {
    return Array(7).fill(false);
  }
}

export function DashboardJourneyRow({ journeyId, index = 0, tick = 0 }) {
  const navigate = useNavigate();
  const accent = getJourneyAccent(journeyId);
  const theme = getJourneyTheme(journeyId);
  const { getLevel } = useGamification();
  const currentDay = getCurrentDayNumber(journeyId);

  const { description, mastery, level, momentum, displayTitle } = useMemo(() => {
    void tick;
    const journeyData = getJourneyData(journeyId);
    const trace = getJourneyTrace(journeyId);
    const m = computeMasteryScore(trace);
    const levelData = getLevel(journeyId);
    const day = trace.completion.currentDay || currentDay || 0;
    return {
      description: journeyData?.journey?.description || accent.subtitle,
      mastery: m,
      level: levelData.level,
      momentum: getWeeklyMomentum(journeyId, day),
      displayTitle: accent.fullLabel,
    };
  }, [journeyId, tick, accent, currentDay, getLevel]);

  const cover = JOURNEY_COVER_IMAGES[journeyId];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      role="button"
      tabIndex={0}
      onClick={() => navigate(theme.path)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') navigate(theme.path);
      }}
      className="flex w-full cursor-pointer flex-col gap-4 rounded-[12px] border border-[#222] bg-[#141414] p-2 pr-6 transition-colors hover:bg-[var(--bg-card-hover)] sm:flex-row sm:items-center sm:gap-6"
    >
      <div className="size-24 shrink-0 overflow-hidden rounded-[8px] border border-[rgba(59,73,76,0.3)]">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <div
            className="flex size-full items-center justify-center text-2xl"
            style={{ background: `rgba(${accent.rgb}, 0.12)` }}
          >
            {accent.icon}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-[18px] font-bold leading-7 text-[#dce4e5]">
            {displayTitle}
          </h3>
          <span
            className="rounded-[4px] border px-2 py-0.5 text-[10px] font-bold uppercase"
            style={{
              color: accent.color,
              background: `rgba(${accent.rgb}, 0.1)`,
              borderColor: `rgba(${accent.rgb}, 0.3)`,
            }}
          >
            {accent.pathTag}
          </span>
        </div>
        <p className="mt-1 line-clamp-1 text-[14px] leading-5 text-[#bac9cc]">
          {description}
        </p>
      </div>

      <div className="hidden shrink-0 flex-col items-center md:flex">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#bac9cc]">
          WEEKLY MOMENTUM
        </p>
        <div className="flex gap-1">
          {momentum.map((active, i) => (
            <div
              key={i}
              className="h-4 w-2 rounded-[2px]"
              style={{
                background: active
                  ? accent.color
                  : `rgba(${accent.rgb}, 0.2)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-end justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:pl-4">
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase text-[#bac9cc]">
            LEVEL {level}
          </p>
          <p className="text-[18px] font-black leading-7 text-[#dce4e5]">
            {mastery}
            <span className="ml-0.5 text-[12px] font-normal text-[#bac9cc]">
              /100
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(theme.path);
          }}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#3b494c] text-[#bac9cc] transition-colors hover:border-[var(--neon-cyan-alt)] hover:text-[var(--neon-cyan-alt)]"
          aria-label={`Open ${displayTitle}`}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </motion.div>
  );
}
