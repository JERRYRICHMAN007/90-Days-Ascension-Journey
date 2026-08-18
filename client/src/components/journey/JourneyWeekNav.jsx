import { useRef, useMemo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Clock, CalendarRange } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  isDayAvailableForUser,
  getWeeklyGoal,
  getDateForDay as getJourneyDateForDay,
  getJourneyTimeline,
  isJourneyDayToday,
  shouldShowPlanWeekday,
  WEEKDAY_DISPLAY_ORDER,
} from '../../utils/journeyPlanning.js';
import { hasScheduledActivities } from '../../utils/daySchedule.js';
import { getDisplayWeeklyPlan } from '../../utils/journeyWeeklyPlan.js';

const WEEKDAY_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
/** Sunday-first — matches weekly analysis and calendar weeks */
const WEEKDAY_ORDER = WEEKDAY_DISPLAY_ORDER;

/**
 * Premium sticky week/day navigation — hidden scrollbars, live weekday labels.
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
  const [timelineTick, setTimelineTick] = useState(0);

  useEffect(() => {
    const refresh = (e) => {
      if (e.detail?.journeyId && e.detail.journeyId !== journeyId) return;
      setTimelineTick((n) => n + 1);
    };
    window.addEventListener('journey-start-updated', refresh);
    window.addEventListener('journey-setup-updated', refresh);
    return () => {
      window.removeEventListener('journey-start-updated', refresh);
      window.removeEventListener('journey-setup-updated', refresh);
    };
  }, [journeyId]);

  const timeline = useMemo(
    () => getJourneyTimeline(journeyId),
    [journeyId, timelineTick]
  );

  // Keep the active week + day scrolled into view as the user progresses
  useEffect(() => {
    if (!isConfigured) return;
    const container = weekScrollRef.current;
    if (!container || selectedWeek == null) return;
    const active = container.querySelector(`[data-week="${selectedWeek}"]`);
    active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [isConfigured, selectedWeek, weeks?.length]);

  useEffect(() => {
    if (!isConfigured) return;
    const container = dayScrollRef.current;
    if (!container || selectedDay == null) return;
    const active = container.querySelector(`[data-day="${selectedDay}"]`);
    active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [isConfigured, selectedDay, selectedWeek]);

  if (!isConfigured) {
    return (
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] shrink-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Your journey schedule appears here after you start this journey.
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
  const weeklyPlan = getDisplayWeeklyPlan(journeyId);
  const isStartWeek = currentWeek?.days?.some((d) => d?.dayNumber === 1);

  const weekIndex = weeks.findIndex((w) => w.weekNumber === selectedWeek);
  const goWeek = (delta) => {
    const next = weeks[weekIndex + delta];
    if (next) onWeekChange(next.weekNumber);
  };

  const planEntries = WEEKDAY_ORDER
    .filter((d) => weeklyPlan[d])
    .filter((d) => shouldShowPlanWeekday(journeyId, d, isStartWeek))
    .map((d) => [String(d), weeklyPlan[d]]);

  return (
    <div className="sticky top-0 z-30 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] shrink-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="font-display text-sm font-bold text-[var(--text-primary)]">Journey schedule</h3>
            {(timeline.startLabel || timeline.endLabel) && (
              <p className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] mt-0.5">
                <CalendarRange className="size-3 shrink-0" />
                <span className="truncate">
                  {timeline.startLabel}
                  {timeline.endLabel ? ` → ${timeline.endLabel}` : ''}
                </span>
              </p>
            )}
            {weeklyGoal.message && (
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate max-w-[280px] sm:max-w-md">
                {weeklyGoal.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
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
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory -mx-1 px-1"
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
                data-week={week.weekNumber}
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

        {planEntries.length > 0 && (
          <div className="flex gap-1.5 py-2 overflow-x-auto scrollbar-hide">
            {planEntries.map(([d, act]) => {
              const weekday = Number(d);
              const selectedDate = selectedDay
                ? getJourneyDateForDay(journeyId, selectedDay)
                : null;
              const isSelectedWeekday = selectedDate
                ? selectedDate.getDay() === weekday
                : false;
              const isTodayWeekday =
                currentDayNumber != null &&
                (() => {
                  const date = getJourneyDateForDay(journeyId, currentDayNumber);
                  return date ? date.getDay() === weekday : false;
                })();
              const shortLabel =
                act.type === 'recovery' || /rest/i.test(act.label || '')
                  ? 'Rest'
                  : /mobile|frontend|backend|learning|code/i.test(act.label || '') ||
                      act.type === 'learning'
                    ? 'Code'
                    : act.type === 'workout' || /workout/i.test(act.label || '')
                      ? 'Workout'
                      : (act.label || '').split(/[·•|]/)[0]?.trim().split(' ')[0] || act.label;
              return (
                <div
                  key={d}
                  className={cn(
                    'min-w-0 flex-1 rounded-lg border px-1.5 py-1.5 text-center',
                    isSelectedWeekday
                      ? 'border-[var(--neon-green)]/45 bg-[var(--neon-green)]/10'
                      : isTodayWeekday
                        ? 'border-[var(--neon-green)]/25 bg-[var(--neon-green)]/6'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-card)]'
                  )}
                >
                  <p className="text-[10px] font-bold text-[var(--text-primary)] leading-tight">
                    {WEEKDAY_FULL[weekday]}
                  </p>
                  <p className="text-[9px] text-[var(--text-secondary)] truncate leading-tight mt-0.5">
                    {shortLabel}
                  </p>
                  {act.time && (
                    <p className="text-[9px] text-[var(--text-muted)] tabular-nums leading-tight mt-0.5 inline-flex items-center justify-center gap-0.5 w-full">
                      <Clock className="size-2.5 shrink-0" />
                      <span className="truncate">{act.time}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div
          ref={dayScrollRef}
          className="flex gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-hide snap-x snap-mandatory -mx-1 px-1"
          role="tablist"
          aria-label="Days"
        >
          {isPreparationPhase && preparationData && (
            <DayChip
              dayNumber={0}
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
              const isToday = isJourneyDayToday(journeyId, day.dayNumber);
              const liveDate = getJourneyDateForDay(journeyId, day.dayNumber);
              const weekdayShort = liveDate ? WEEKDAY_FULL[liveDate.getDay()] : null;
              return (
                <DayChip
                  key={day.dayNumber}
                  dayNumber={day.dayNumber}
                  label={`Day ${day.dayNumber}`}
                  sub={isToday ? 'Today' : weekdayShort || (complete ? 'Done' : undefined)}
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

function DayChip({ dayNumber, label, sub, isActive, isComplete, isToday, isUnavailable, onClick }) {
  return (
    <button
      type="button"
      role="tab"
      data-day={dayNumber}
      aria-selected={isActive}
      onClick={onClick}
      className={cn(
        'snap-start shrink-0 relative min-w-[3.25rem] sm:min-w-[3.75rem] px-2 sm:px-3 py-2 rounded-xl border text-center transition-all duration-200',
        isActive
          ? 'bg-[var(--neon-green)]/20 border-[var(--neon-green)] text-[var(--neon-green)] shadow-sm'
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
      <span className="block text-[11px] sm:text-xs font-semibold leading-tight truncate">{label}</span>
      {sub && (
        <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider opacity-70 mt-0.5 truncate">{sub}</span>
      )}
    </button>
  );
}
