import {
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import { getJourneyTheme } from '../../utils/journeyTheme.js';

export function MiniSparkline({ trend, color }) {
  const data = (trend?.last14Days ?? []).slice(-7).map((d) => ({
    v: d.sessionsScheduled > 0
      ? Math.round((d.sessionsCompleted / d.sessionsScheduled) * 100)
      : 0,
  }));

  if (data.length === 0) return null;

  return (
    <div className="h-10 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StreakHeatmap({ last14Days }) {
  if (!last14Days?.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {last14Days.map((day, i) => {
        const pct =
          day.sessionsScheduled > 0
            ? day.sessionsCompleted / day.sessionsScheduled
            : 0;
        const bg =
          pct >= 1
            ? 'bg-primary'
            : pct > 0
              ? 'bg-primary/40'
              : 'bg-muted';
        return (
          <div
            key={i}
            title={`${day.date || `Day ${day.dayNumber}`}: ${day.sessionsCompleted}/${day.sessionsScheduled}`}
            className={`w-7 h-7 rounded-md ${bg} border border-border/40 transition-transform hover:scale-110`}
          />
        );
      })}
    </div>
  );
}

export function getJourneyChartColor(journeyId) {
  return getJourneyTheme(journeyId).chartColor;
}
