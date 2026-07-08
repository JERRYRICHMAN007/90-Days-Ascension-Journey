import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ArrowLeft, Flame, Zap, Brain, Code } from 'lucide-react';
import {
  getJourneyTrace,
  computeMasteryScore,
} from '../../utils/tracing.js';
import { getJourneyAccent, masteryToRank } from '../../utils/journeyAccents.js';
import MasteryScoreRing from './MasteryScoreRing.jsx';

function formatChartDate(dateStr) {
  if (!dateStr) return '';
  const [, m, d] = dateStr.split('-');
  return `${m}/${d}`;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
    >
      <p className="font-bold text-[var(--text-primary)] mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export function JourneyAnalyticsDetail({ journeyId }) {
  const [tick, setTick] = useState(0);
  const accent = getJourneyAccent(journeyId);

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

  const masteryScore = computeMasteryScore(trace);
  const displayRank = masteryToRank(masteryScore);
  const daysRemaining = Math.max(0, trace.completion.totalDays - trace.completion.currentDay);

  const chartData = trace.trend.last14Days.map((row) => ({
    label: formatChartDate(row.date),
    completed: row.sessionsCompleted,
    scheduled: row.sessionsScheduled,
  }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto min-w-0">
      <Link
        to="/analytics"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        All journeys
      </Link>

      {/* Header — Figma Frame 6 */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="forge-eyebrow mb-2" style={{ color: accent.color }}>
          {accent.subtitle?.toUpperCase() || 'JOURNEY ANALYTICS'}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="forge-heading-xl">{trace.journeyTitle}</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Day {trace.completion.currentDay} of {trace.completion.totalDays}
              {daysRemaining > 0 && ` · ${daysRemaining} days remaining`}
            </p>
          </div>
          <div
            className="forge-rank-badge shrink-0"
            style={{
              color: accent.color,
              border: `1px solid rgba(${accent.rgb}, 0.4)`,
            }}
          >
            RANK {displayRank}
          </div>
        </div>
        <div className="w-24 h-1 rounded-full mt-4" style={{ background: accent.color }} />
      </motion.div>

      {/* Mastery score hero — animated neon ring */}
      <div
        className="rounded-[12px] border p-6 sm:p-8"
        style={{ background: '#000', borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex justify-center items-center py-8">
          <MasteryScoreRing
            score={masteryScore}
            change={12.2}
            size={280}
          />
        </div>
        <p className="text-center text-xs text-[var(--text-secondary)] uppercase tracking-wide">
          {trace.completion.percentComplete}% journey complete
        </p>
      </div>

      {/* Streak + Quiz + XP — Figma stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Current Streak"
          value={trace.consistency.currentStreak}
          suffix="days"
          icon={Flame}
          accent={accent}
          highlight
        />
        <StatCard
          label="Longest Streak"
          value={trace.consistency.longestStreak}
          suffix="days"
          icon={Flame}
          accent={accent}
        />
        <StatCard
          label="Quiz Average"
          value={
            trace.mastery.quizAverageScore !== null
              ? trace.mastery.quizAverageScore
              : '—'
          }
          suffix={trace.mastery.quizAverageScore !== null ? '%' : ''}
          icon={Brain}
          accent={accent}
        />
        <StatCard
          label="Journey XP"
          value={trace.mastery.xpEarnedInJourney.toLocaleString()}
          icon={Zap}
          accent={accent}
        />
      </div>

      {/* 14-day activity chart */}
      {chartData.length > 0 && (
        <div
          className="rounded-[12px] border p-5 sm:p-6 min-w-0 overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <p className="forge-label mb-4">14-Day Activity</p>
          <div className="h-56 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barGap={2}>
                <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                  axisLine={{ stroke: 'var(--border-subtle)' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="scheduled"
                  name="Scheduled"
                  fill="var(--bg-badge)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill={accent.color}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-4 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[var(--text-secondary)]">
              <span className="w-3 h-3 rounded-sm" style={{ background: accent.color }} />
              Completed
            </span>
            <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[var(--text-secondary)]">
              <span className="w-3 h-3 rounded-sm bg-[var(--bg-badge)]" />
              Scheduled
            </span>
          </div>
        </div>
      )}

      {/* Completion detail */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div
          className="rounded-[12px] border p-5"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <p className="forge-label mb-2">Sessions</p>
          <p className="text-2xl font-extrabold text-[var(--text-primary)] tabular-nums">
            {trace.completion.completedSessions}
            <span className="text-base font-normal text-[var(--text-secondary)]">
              {' '}/ {trace.completion.totalSessions}
            </span>
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            {trace.consistency.completionRateLast7Days}% last 7 days ·{' '}
            {trace.consistency.completionRateLast30Days}% last 30 days
          </p>
        </div>
        <div
          className="rounded-[12px] border p-5"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <p className="forge-label mb-2">Days Complete</p>
          <p className="text-2xl font-extrabold text-[var(--text-primary)] tabular-nums">
            {trace.completion.daysFullyComplete}
            <span className="text-base font-normal text-[var(--text-secondary)]">
              {' '}/ {trace.completion.totalDays}
            </span>
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            {trace.mastery.quizzesTaken} / {trace.mastery.quizzesAvailable} quizzes taken
          </p>
        </div>
      </div>

      {/* Software Engineering disciplines */}
      {trace.mastery.disciplinesUnlocked && journeyId === 'software-engineering' && (
        <div
          className="rounded-[12px] border p-5 sm:p-6"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-4 h-4" style={{ color: accent.color }} />
            <p className="forge-label">Active Disciplines</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Mobile', 'Frontend', 'Backend', 'WordPress'].map((d) => {
              const active = trace.mastery.disciplinesUnlocked.includes(d);
              return (
                <div
                  key={d}
                  className="rounded-lg border px-3 py-3 text-center transition-colors"
                  style={{
                    background: active ? `rgba(${accent.rgb}, 0.08)` : 'var(--bg-elevated)',
                    borderColor: active ? `rgba(${accent.rgb}, 0.35)` : 'var(--border-subtle)',
                  }}
                >
                  <p
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: active ? accent.color : 'var(--text-secondary)' }}
                  >
                    {d}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                    {active ? 'Active' : 'Locked'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, suffix = '', icon: Icon, accent, highlight = false }) {
  return (
    <div
      className="rounded-[12px] border p-4 sm:p-5 flex flex-col gap-3"
      style={{
        background: highlight ? `rgba(${accent.rgb}, 0.06)` : 'var(--bg-card)',
        borderColor: highlight ? `rgba(${accent.rgb}, 0.25)` : 'var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="forge-label text-[10px]">{label}</p>
        <Icon className="w-4 h-4 shrink-0 opacity-70" style={{ color: accent.color }} />
      </div>
      <p className="text-2xl sm:text-[32px] font-extrabold tabular-nums leading-none tracking-tight text-[var(--text-primary)]">
        {value}
        {suffix && (
          <span className="text-sm font-normal text-[var(--text-secondary)] ml-1">{suffix}</span>
        )}
      </p>
    </div>
  );
}
