import { ChevronRight, Dumbbell } from 'lucide-react';
import { isTomorrow } from '../../utils/dates';

const BODY_ACCENT = '#00ff87';

export function BodyTomorrowPreview({ nextDay, onPreview }) {
  if (!nextDay?.dayNumber || !isTomorrow(nextDay.dayNumber)) return null;

  const exerciseCount = nextDay.workout?.exercises?.length ?? 0;
  const isRest = exerciseCount === 0;

  return (
    <button
      type="button"
      onClick={() => onPreview?.(nextDay.dayNumber)}
      className="w-full text-left rounded-xl border p-4 transition-all duration-200 group hover:border-[var(--neon-green)]"
      style={{
        background: 'var(--bg-elevated)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: BODY_ACCENT, boxShadow: 'var(--neon-glow-green)' }}
            />
            <p className="aether-label">Tomorrow&apos;s Preview</p>
          </div>
          <p className="text-lg font-bold text-[var(--text-primary)] tracking-tight truncate">
            {nextDay.focus || (isRest ? 'Rest & Recovery' : 'Workout')}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
            {isRest
              ? nextDay.workout?.name || 'Recovery day — light stretching and hydration'
              : `${nextDay.workout?.name || 'Circuit'} · ${exerciseCount} exercises`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1">
          <div
            className="size-9 rounded-lg flex items-center justify-center border"
            style={{
              background: 'rgba(0,255,135,0.08)',
              borderColor: 'rgba(0,255,135,0.25)',
            }}
          >
            <Dumbbell className="w-4 h-4" style={{ color: BODY_ACCENT }} />
          </div>
          <ChevronRight
            className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--neon-green)] transition-colors"
          />
        </div>
      </div>
    </button>
  );
}
