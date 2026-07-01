import { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';
import {
  ArrowLeft,
  Flame,
  Target,
  Brain,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { JourneyTraceCard } from '../components/dashboard/JourneyTraceCard';
import {
  MiniSparkline,
  StreakHeatmap,
  getJourneyChartColor,
} from '../components/analytics/AnalyticsCharts.jsx';
import { getJourneyTheme } from '../utils/journeyTheme.js';
import {
  getJourneyTrace,
  getAllJourneyTraces,
  computeMasteryScore,
  JOURNEY_IDS,
} from '../utils/tracing.js';

function formatChartDate(dateStr) {
  if (!dateStr) return '';
  const [, m, d] = dateStr.split('-');
  return `${m}/${d}`;
}

function JourneyAnalyticsDetail({ journeyId }) {
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

  const masteryScore = computeMasteryScore(trace);
  const daysRemaining = Math.max(
    0,
    trace.completion.totalDays - trace.completion.currentDay
  );

  const chartData = trace.trend.last14Days.map((row) => ({
    label: formatChartDate(row.date),
    completed: row.sessionsCompleted,
    scheduled: row.sessionsScheduled,
  }));

  const radarData = [
    { metric: 'Completion', value: trace.completion.percentComplete },
    { metric: '7d Rate', value: trace.consistency.completionRateLast7Days },
    { metric: '30d Rate', value: trace.consistency.completionRateLast30Days },
    { metric: 'Quiz', value: trace.mastery.quizAverageScore ?? 0 },
    { metric: 'Mastery', value: masteryScore },
  ];

  const theme = getJourneyTheme(journeyId);
  const chartColor = theme.chartColor;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          to="/analytics"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          All journeys
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{trace.journeyTitle}</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Day {trace.completion.currentDay} of {trace.completion.totalDays}
              {daysRemaining > 0 && ` · ${daysRemaining} days remaining`}
            </p>
          </div>
          <div className="text-center px-5 py-3 rounded-xl glass-panel border border-primary/20">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Mastery</p>
            <p className="text-4xl font-bold text-primary tabular-nums">{masteryScore}</p>
          </div>
        </div>
      </motion.div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Completion
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Sessions completed</p>
            <p className="text-2xl font-bold mt-1">
              {trace.completion.completedSessions}
              <span className="text-base font-normal text-muted-foreground">
                {' '}
                / {trace.completion.totalSessions}
              </span>
            </p>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${trace.completion.percentComplete}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {trace.completion.percentComplete}% of all sessions
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Days fully complete</p>
            <p className="text-2xl font-bold mt-1">
              {trace.completion.daysFullyComplete}
              <span className="text-base font-normal text-muted-foreground">
                {' '}
                / {trace.completion.totalDays}
              </span>
            </p>
          </Card>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Consistency
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="p-4 flex items-center gap-3">
            <Flame className="w-8 h-8 text-orange-500 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Current streak</p>
              <p className="text-xl font-bold">{trace.consistency.currentStreak} days</p>
            </div>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Longest streak</p>
            <p className="text-xl font-bold">{trace.consistency.longestStreak} days</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Last 7 days</p>
            <p className="text-xl font-bold">{trace.consistency.completionRateLast7Days}%</p>
            <p className="text-xs text-muted-foreground">Last 30: {trace.consistency.completionRateLast30Days}%</p>
          </Card>
        </div>

        {chartData.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-4 min-w-0">
            <Card className="p-4 glass-panel border-border/50 min-w-0 overflow-x-auto">
              <p className="text-sm font-medium mb-4">14-day activity</p>
              <div className="h-56 w-full min-w-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="scheduled" name="Scheduled" fill="hsl(var(--muted-foreground))" opacity={0.35} />
                    <Bar dataKey="completed" name="Completed" fill={chartColor} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-4 glass-panel border-border/50 min-w-0 overflow-x-auto">
              <p className="text-sm font-medium mb-4">Performance radar</p>
              <div className="h-56 w-full min-w-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke={chartColor}
                      fill={chartColor}
                      fillOpacity={0.35}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {trace.trend.last14Days.length > 0 && (
          <Card className="p-4 glass-panel border-border/50">
            <p className="text-sm font-medium mb-3">14-day streak heatmap</p>
            <StreakHeatmap last14Days={trace.trend.last14Days} />
            <p className="text-xs text-muted-foreground mt-3">
              Darker = more sessions completed that day
            </p>
          </Card>
        )}

        {trace.consistency.missedDays.length > 0 && (
          <Card className="p-4">
            <p className="text-sm font-medium flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" />
              Missed days (no sessions completed)
            </p>
            <p className="text-sm text-muted-foreground">
              Days: {trace.consistency.missedDays.join(', ')}
            </p>
          </Card>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Mastery
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Quiz average</p>
            <p className="text-2xl font-bold">
              {trace.mastery.quizAverageScore !== null
                ? `${trace.mastery.quizAverageScore}%`
                : '—'}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Quizzes taken</p>
            <p className="text-2xl font-bold">
              {trace.mastery.quizzesTaken}
              <span className="text-base font-normal text-muted-foreground">
                {' '}
                / {trace.mastery.quizzesAvailable}
              </span>
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Journey XP</p>
            <p className="text-2xl font-bold">{trace.mastery.xpEarnedInJourney.toLocaleString()}</p>
          </Card>
        </div>

        {trace.mastery.disciplinesUnlocked && (
          <Card className="p-4">
            <p className="text-sm font-medium mb-2">Active disciplines (Software Engineering)</p>
            <div className="flex flex-wrap gap-2">
              {['Mobile', 'Frontend', 'Backend', 'WordPress'].map((d) => {
                const active = trace.mastery.disciplinesUnlocked.includes(d);
                return (
                  <span
                    key={d}
                    className={`text-xs px-2.5 py-1 rounded-full border ${
                      active
                        ? 'bg-primary/15 border-primary/40 text-primary'
                        : 'bg-muted/50 border-border text-muted-foreground'
                    }`}
                  >
                    {d}
                    {active ? ' ✓' : ' (locked)'}
                  </span>
                );
              })}
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}

export function AnalyticsPage() {
  const { journeyId } = useParams();
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

  if (journeyId && JOURNEY_IDS.includes(journeyId)) {
    return <JourneyAnalyticsDetail journeyId={journeyId} />;
  }

  void tick;
  const traces = getAllJourneyTraces();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Completion, consistency, and mastery across all Forge90 journeys
        </p>
      </div>
      <motion.div
        variants={{ animate: { transition: { staggerChildren: 0.06 } } }}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {traces.map((t, i) => (
          <motion.div
            key={t.journeyId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="space-y-1"
          >
            <JourneyTraceCard journeyId={t.journeyId} index={i} />
            <div className="glass-panel rounded-lg px-3 pb-2 pt-1 mx-1">
              <p className="text-[10px] uppercase text-muted-foreground mb-0.5">7-day trend</p>
              <MiniSparkline trend={t.trend} color={getJourneyChartColor(t.journeyId)} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
