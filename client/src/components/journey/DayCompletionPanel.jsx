import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  Play,
  Sparkles,
  Target,
} from 'lucide-react';
import { cn } from '../../lib/utils';

function formatLongDate(dateYmd) {
  if (!dateYmd) return '';
  const [year, month, day] = dateYmd.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function DayCompletionPanel({
  dayNumber,
  dayName,
  dateYmd,
  timeBlock,
  isTomorrow = false,
  isComplete = false,
  canComplete = true,
  isWeekEnd = false,
  tasks = [],
  taskCompletion = {},
  allTasksCompleted = false,
  onMarkComplete,
  onToggleTask,
  accentColor = 'var(--neon-green)',
}) {
  const completedCount = tasks.filter((t) => taskCompletion[t.id]).length;
  const progressPct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const tasksBlockCompletion = !isComplete && tasks.length > 0 && !allTasksCompleted;

  const markLabel = isComplete
    ? 'Day complete'
    : isWeekEnd
      ? 'Complete week'
      : 'Mark day complete';

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Header strip */}
      <div
        className="px-4 sm:px-5 py-4 sm:py-5 border-b flex flex-col sm:flex-row sm:items-center gap-4"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {tasks.length > 0 && (
            <div className="relative shrink-0 size-12 sm:size-14">
              <svg className="size-full -rotate-90" viewBox="0 0 36 36" aria-hidden>
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke={isComplete ? accentColor : accentColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${isComplete ? 100 : progressPct} 100`}
                  pathLength="100"
                  style={{ opacity: isComplete || progressPct > 0 ? 1 : 0.35 }}
                />
              </svg>
              <span
                className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold tabular-nums"
                style={{ color: isComplete ? accentColor : 'var(--text-secondary)' }}
              >
                {isComplete ? '✓' : `${progressPct}%`}
              </span>
            </div>
          )}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full"
                style={{
                  color: accentColor,
                  background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${accentColor} 30%, transparent)`,
                }}
              >
                Day {dayNumber}
              </span>
              {isTomorrow && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                  Tomorrow
                </span>
              )}
              {isComplete && (
                <span
                  className="text-[10px] font-bold uppercase tracking-wide flex items-center gap-1"
                  style={{ color: accentColor }}
                >
                  <CheckCircle2 className="size-3" />
                  Done
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] leading-tight truncate">
              {dayName ? `${dayName}` : `Day ${dayNumber}`}
            </h2>
            {dateYmd && (
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5 flex items-center gap-1.5">
                <Calendar className="size-3.5 shrink-0 opacity-70" />
                {formatLongDate(dateYmd)}
              </p>
            )}
            {timeBlock && (
              <p className="text-[11px] text-[var(--text-muted)] mt-1 flex items-center gap-1.5">
                <Clock className="size-3 shrink-0" />
                {timeBlock}
              </p>
            )}
          </div>
        </div>

        {canComplete && (
          <AnimatePresence mode="wait">
            <motion.button
              key={isComplete ? 'done' : 'pending'}
              type="button"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={!tasksBlockCompletion ? { scale: 1.02 } : undefined}
              whileTap={!tasksBlockCompletion ? { scale: 0.98 } : undefined}
              onClick={onMarkComplete}
              disabled={tasksBlockCompletion}
              className={cn(
                'shrink-0 w-full sm:w-auto min-h-[46px] px-5 py-2.5 rounded-xl font-semibold text-sm',
                'flex items-center justify-center gap-2 transition-all duration-200',
                tasksBlockCompletion && 'opacity-45 cursor-not-allowed'
              )}
              style={
                isComplete
                  ? {
                      color: accentColor,
                      background: `color-mix(in srgb, ${accentColor} 14%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${accentColor} 45%, transparent)`,
                      boxShadow: `0 0 24px color-mix(in srgb, ${accentColor} 18%, transparent)`,
                    }
                  : tasksBlockCompletion
                    ? {
                        color: 'var(--text-muted)',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-subtle)',
                      }
                    : {
                        color: '#0a0a0a',
                        background: `linear-gradient(135deg, color-mix(in srgb, ${accentColor} 78%, #0a0a0a), color-mix(in srgb, ${accentColor} 58%, #0a0a0a))`,
                        border: `1px solid color-mix(in srgb, ${accentColor} 40%, transparent)`,
                        boxShadow: `0 4px 20px color-mix(in srgb, ${accentColor} 22%, transparent)`,
                      }
              }
            >
              {isComplete ? (
                <>
                  <Check className="size-4" />
                  {markLabel}
                </>
              ) : (
                <>
                  {isWeekEnd ? <Sparkles className="size-4" /> : <Play className="size-4 fill-current" />}
                  {markLabel}
                </>
              )}
            </motion.button>
          </AnimatePresence>
        )}
      </div>

      {/* Tasks */}
      {tasks.length > 0 && (
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Target className="size-4" style={{ color: accentColor }} />
              Today&apos;s tasks
            </h3>
            <span
              className="text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-full"
              style={{
                color: accentColor,
                background: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
              }}
            >
              {completedCount}/{tasks.length}
            </span>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => {
              const done = taskCompletion[task.id] === true;
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onToggleTask?.(task.id)}
                  className={cn(
                    'w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all duration-200',
                    done
                      ? 'opacity-70'
                      : 'hover:border-[var(--border-muted)] hover:bg-[var(--surface-hover)]'
                  )}
                  style={{
                    borderColor: done
                      ? `color-mix(in srgb, ${accentColor} 25%, var(--border-subtle))`
                      : 'var(--border-subtle)',
                    background: done
                      ? `color-mix(in srgb, ${accentColor} 6%, var(--bg-elevated))`
                      : 'var(--bg-elevated)',
                  }}
                >
                  <span className="mt-0.5 shrink-0">
                    {done ? (
                      <CheckCircle2 className="size-5" style={{ color: accentColor }} />
                    ) : (
                      <Circle className="size-5 text-[var(--text-muted)]" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'block text-sm font-medium leading-snug',
                        done ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                      )}
                    >
                      {task.text}
                    </span>
                    {task.category && (
                      <span
                        className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
                        style={{
                          color: 'var(--text-secondary)',
                          background: 'var(--bg-card)',
                        }}
                      >
                        {task.category}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {!allTasksCompleted && (
            <p className="text-[11px] text-[var(--text-muted)] text-center pt-1">
              Finish all tasks, then mark the day complete
            </p>
          )}
        </div>
      )}
    </div>
  );
}
