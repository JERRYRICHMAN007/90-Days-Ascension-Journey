import { cn } from '../../lib/utils';
import { isDayAvailableForUser, getWeeklyGoal } from '../../utils/journeyPlanning.js';
import { Check } from 'lucide-react';

/**
 * Sticky week/day navigation with availability indicators.
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
}) {
  if (!isConfigured) {
    return (
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] shrink-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Your learning plan appears here after you save a start date.
          </p>
        </div>
      </div>
    );
  }

  const currentWeek = weeks.find((w) => w.weekNumber === selectedWeek) || weeks[0];
  const weekDayNumbers = (currentWeek?.days || [])
    .filter((d) => d?.dayNumber > 0)
    .map((d) => d.dayNumber);
  const weeklyGoal = getWeeklyGoal(journeyId, weekDayNumbers);

  return (
    <div className="sticky top-0 z-30 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border-subtle)] shrink-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-xs font-display uppercase tracking-widest text-[var(--text-muted)]">
            Learning plan
          </h3>
          {weeklyGoal.message && (
            <p className="text-[10px] sm:text-xs text-[var(--text-muted)] truncate max-w-[50%]">
              {weeklyGoal.message}
            </p>
          )}
        </div>

        {/* Weeks */}
        <div
          id="weeks-nav"
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10"
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
                data-week={week.weekNumber}
                onClick={() => onWeekChange(week.weekNumber)}
                className={cn(
                  'shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all border',
                  isActive
                    ? cn('text-white border-transparent bg-gradient-to-r shadow-lg', colors?.gradient)
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-white/20 bg-[var(--bg-card)]'
                )}
              >
                Week {week.weekNumber}
              </button>
            );
          })}
        </div>

        {/* Days */}
        <div
          className="flex gap-1.5 sm:gap-2 overflow-x-auto pt-2 scrollbar-thin"
          role="tablist"
          aria-label="Days"
        >
          {isPreparationPhase && preparationData && (
            <DayPill
              dayNumber={0}
              label="Day 0"
              isActive={selectedDay === 0}
              onClick={() => onDayChange(0)}
            />
          )}
          {(currentWeek?.days || [])
            .filter((d) => d?.dayNumber > 0)
            .map((day) => {
              const available = isDayAvailableForUser(journeyId, day.dayNumber);
              const complete = isDayComplete?.(day);
              return (
                <DayPill
                  key={day.dayNumber}
                  dayNumber={day.dayNumber}
                  label={`Day ${day.dayNumber}`}
                  isActive={selectedDay === day.dayNumber}
                  isComplete={complete}
                  isUnavailable={!available}
                  onClick={() => onDayChange(day.dayNumber)}
                  data-day={day.dayNumber}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

function DayPill({ dayNumber, label, isActive, isComplete, isUnavailable, onClick, ...rest }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      {...rest}
      className={cn(
        'shrink-0 relative px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-all',
        isActive
          ? 'bg-[var(--neon-green)]/20 border-[var(--neon-green)] text-[var(--neon-green)]'
          : isComplete
            ? 'border-emerald-500/30 text-emerald-400/80 bg-emerald-500/5'
            : isUnavailable
              ? 'border-[var(--border-subtle)] text-[var(--text-muted)]/40 opacity-60'
              : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-white/20 hover:text-[var(--text-primary)] bg-[var(--bg-card)]'
      )}
      title={isUnavailable ? 'Rest day on your schedule' : undefined}
    >
      {isComplete && !isActive && (
        <Check className="absolute -top-1 -right-1 size-3.5 text-emerald-400" />
      )}
      {label}
    </button>
  );
}
