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

function formatDoneLabel(completed, scheduled) {
  if (scheduled === 0) return { line1: 'No', line2: 'session' };
  if (completed >= scheduled) return { line1: 'Full', line2: 'complete' };
  return { line1: `${completed} of ${scheduled}`, line2: 'done' };
}

function splitTitle(label) {
  if (label === 'Body Transformation') return ['Body', 'Transformation'];
  if (label === 'Software Engineering') return ['Software Eng.'];
  return [label];
}

export function DashboardMasteryCard({ journeyId, index = 0, tick = 0 }) {
  const navigate = useNavigate();
  const accent = getJourneyAccent(journeyId);
  const theme = getJourneyTheme(journeyId);
  const Icon = theme.icon;
  const currentDay = getCurrentDayNumber();

  const { trace, mastery, percentComplete, streak, dayLabel, doneLabel } = useMemo(() => {
    void tick;
    const t = getJourneyTrace(journeyId);
    const m = computeMasteryScore(t);
    const pct = t.completion.percentComplete ?? 0;
    const st = t.consistency.currentStreak ?? 0;
    const day = t.completion.currentDay || currentDay || 0;
    const stats = getTodaySessionStats(journeyId, day);
    return {
      trace: t,
      mastery: m,
      percentComplete: pct,
      streak: st,
      dayLabel: day > 0 ? `DAY ${day} OF 90` : 'NOT STARTED',
      doneLabel: formatDoneLabel(stats.completed, stats.scheduled),
    };
  }, [journeyId, tick, currentDay]);

  const titleLines = splitTitle(accent.fullLabel);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(theme.path)}
      className="relative flex flex-col items-start overflow-hidden rounded-[12px] border border-[#222] bg-[#141414] p-[25px] text-left transition-colors hover:bg-[var(--bg-card-hover)] min-w-[148px] sm:min-w-0 w-full h-full"
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 size-24 blur-[32px]"
        style={{ background: `rgba(${accent.rgb}, 0.05)` }}
      />

      <div className="mb-6 flex w-full items-start justify-between">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-[8px] border"
          style={{
            background: 'var(--bg-elevated)',
            borderColor: 'rgba(59,73,76,0.2)',
          }}
        >
          <Icon className="size-5" style={{ color: accent.color }} />
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[1px] text-[#bac9cc]">
            MASTERY
          </p>
          <p
            className="text-[32px] font-extrabold leading-none tracking-[-0.64px]"
            style={{ color: accent.color }}
          >
            {mastery}
          </p>
        </div>
      </div>

      <div className="mb-1 w-full">
        {titleLines.map((line) => (
          <p key={line} className="text-[16px] leading-6 text-[#dce4e5]">
            {line}
          </p>
        ))}
      </div>

      <p className="mb-6 text-[12px] uppercase tracking-[0.6px] text-[#bac9cc]">
        {dayLabel}
      </p>

      <div className="mt-auto w-full space-y-4">
        <div className="h-[6px] overflow-hidden rounded-full bg-[#111]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.max(percentComplete, trace.completion.percentComplete > 0 ? 4 : 0)}%`,
              background: `linear-gradient(90deg, ${accent.color}, ${accent.light})`,
              boxShadow: percentComplete > 0 ? `0 0 4px ${accent.color}` : 'none',
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Flame className="size-2.5 text-[#bac9cc]" />
            <div className="text-[12px] leading-4 text-[#bac9cc]">
              <span>Streak:</span>
              <span className="block text-[#dce4e5]">{streak}</span>
            </div>
          </div>
          <div className="text-right text-[12px] leading-4 text-[#bac9cc]">
            <span>{doneLabel.line1}</span>
            <span className="block">{doneLabel.line2}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
