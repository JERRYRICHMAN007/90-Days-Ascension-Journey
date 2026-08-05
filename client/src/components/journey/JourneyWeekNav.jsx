import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Check, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { isDayAvailableForUser, getWeeklyGoal } from '../../utils/journeyPlanning.js';
import { hasScheduledActivities } from '../../utils/daySchedule.js';
import { getWeeklyPlan } from '../../utils/journeyWeeklyPlan.js';

/**
 * Premium sticky week/day navigation with horizontal scroll and today highlight.
 */
export function JourneyWeekNav({
  journeyId,
  weeks,
  selectedWeek,
  selectedDay,
  onWeekChange,
  onDayChange,
  colors,
  isDayComplete,
  isPreparationPhase,
  preparationData,
  isConfigured = true,
  currentDayNumber = null,
}) {
  const weekScrollRef = useRef(null);
  const dayScrollRef = useRef(null);

  if (!isConfigured) {
    return (
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] shrink-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Your learning plan appears here after you start this journey.
          </p>
        </div>
      </div>
    );
  }

  const currentWeek = weeks.find((w) => w.weekNumber === selectedWeek) || weeks[0];
  const daysWithActivities = (currentWeek?.days || []).filter(
    (d) => d?.dayNumber > 0 && hasScheduledActivities(d, journeyId)
  );
  const weekDayNumbers = daysWithActivities.map((d) => d.dayNumber);
  const weeklyGoal = getWeeklyGoal(journeyId, weekDayNumbers);
  const weeklyPlan = getWeeklyPlan(journeyId);
  const WEEKDAY_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const weekIndex = weeks.findIndex((w) => w.weekNumber === selectedWeek);
  const goWeek = (delta) => {
    const next = weeks[weekIndex + delta];
    if (next) onWeekChange(next.weekNumber);
  };

  return (
    <div className="sticky top-0 z-30 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] shrink-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display text-sm font-bold text-[var(--text-primary)]">Learning plan</h3>
            {weeklyGoal.message && (
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate max-w-[280px] sm:max-w-md">
                {weeklyGoal.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goWeek(-1)}
              disabled={weekIndex <= 0}
              className="p-2 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] disabled:opacity-30"
              aria-label="Previous week"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => goWeek(1)}
              disabled={weekIndex >= weeks.length - 1}
              className="p-2 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] disabled:opacity-30"
              aria-label="Next week"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div
          ref={weekScrollRef}
          className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin snap-x snap-mandatory"
          role="tablist"
          aria-label="Weeks"
        >
          {weeks.map((week) => {
            const isActive = week.weekNumber === selectedWeek;
            return (
              <button
                key={week.weekNumber}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onWeekChange(week.weekNumber)}
                className={cn(
                  'snap-start shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border',
                  isActive
                    ? cn('text-white border-transparent bg-gradient-to-r shadow-md', colors?.gradient)
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] bg-[var(--bg-card)]'
                )}
              >
                Week {week.weekNumber}
              </button>
            );
          })}
        </div>

        {Object.keys(weeklyPlan).length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-thin">
            {Object.entries(weeklyPlan)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([d, act]) => (
                <div
                  key={d}
                  className="shrink-0 px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[10px]"
                >
                  <span className="font-semibold text-[var(--text-primary)]">{WEEKDAY_FULL[Number(d)]}</span>
                  <span className="text-[var(--text-muted)] mx-1">·</span>
                  <span className="text-[var(--text-secondary)]">{act.label}</span>
                  {act.time && (
                    <span className="text-[var(--text-muted)] ml-1 inline-flex items-center gap-0.5">
                      <Clock className="size-2.5" />
                      {act.time}
                    </span>
                  )}
                </div>
              ))}
          </div>
        )}

        <div
          ref={dayScrollRef}
          className="flex gap-2 overflow-x-auto pt-1 pb-1 scrollbar-thin snap-x snap-mandatory"
          role="tablist"
          aria-label="Days"
        >
          {isPreparationPhase && preparationData && (
            <DayChip
              label="Day 0"
              sub="Prep"
              isActive={selectedDay === 0}
              onClick={() => onDayChange(0)}
            />
          )}
          {(currentWeek?.days || [])
            .filter((d) => d?.dayNumber > 0 && hasScheduledActivities(d, journeyId))
            .map((day) => {
              const available = isDayAvailableForUser(journeyId, day.dayNumber);
              const complete = isDayComplete?.(day);
              const isToday = currentDayNumber === day.dayNumber;
              return (
                <DayChip
                  key={day.dayNumber}
                  label={`Day ${day.dayNumber}`}
                  sub={isToday ? 'Today' : complete ? 'Done' : undefined}
                  isActive={selectedDay === day.dayNumber}
                  isComplete={complete}
                  isToday={isToday}
                  isUnavailable={!available}
                  onClick={() => onDayChange(day.dayNumber)}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

function DayChip({ label, sub, isActive, isComplete, isToday, isUnavailable, onClick }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={cn(
        'snap-start shrink-0 relative min-w-[3.75rem] px-3 py-2 rounded-full border text-center transition-all duration-200',
        isActive
          ? 'bg-[var(--neon-green)]/20 border-[var(--neon-green)] text-[var(--neon-green)] shadow-sm scale-[1.02]'
          : isToday
            ? 'border-[var(--neon-green)]/40 bg-[var(--neon-green)]/8 text-[var(--text-primary)]'
            : isComplete
              ? 'border-emerald-500/25 text-emerald-500/90 bg-emerald-500/5'
              : isUnavailable
                ? 'border-[var(--border-subtle)] text-[var(--text-muted)]/45 opacity-55'
                : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-card)]/80'
      )}
      title={isUnavailable ? 'Rest day on your schedule' : undefined}
    >
      {isComplete && !isActive && (
        <Check className="absolute -top-0.5 -right-0.5 size-3 text-emerald-400 bg-[var(--bg-primary)] rounded-full" />
      )}
      <span className="block text-xs font-semibold leading-tight">{label}</span>
      {sub && (
        <span className="block text-[9px] uppercase tracking-wider opacity-70 mt-0.5">{sub}</span>
      )}
    </button>
  );
}
