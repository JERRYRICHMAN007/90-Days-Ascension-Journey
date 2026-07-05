import { ChevronRight, BookOpen } from 'lucide-react';
import { isTomorrow } from '../../utils/dates';

const READING_ACCENT = '#a78bfa';

export function ReadingTomorrowPreview({ nextDay, onPreview }) {
  if (!nextDay?.dayNumber || !isTomorrow(nextDay.dayNumber)) return null;

  const session = nextDay.readingSessions?.[0];
  const material =
    session?.type === 'Bible Reading' && typeof session?.material === 'object'
      ? session.material.text
      : session?.material;

  return (
    <button
      type="button"
      onClick={() => onPreview?.(nextDay.dayNumber)}
      className="w-full text-left rounded-xl border p-4 transition-all duration-200 group hover:border-[var(--neon-purple)]"
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
              style={{ background: READING_ACCENT, boxShadow: 'var(--neon-glow-purple)' }}
            />
            <p className="forge-label">Tomorrow&apos;s Preview</p>
          </div>
          <p className="text-lg font-bold text-[var(--text-primary)] tracking-tight truncate">
            {nextDay.dailyLearning?.title || material || 'Reading Session'}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
            {session?.time
              ? `Session at ${session.time.split(' - ')[0]}`
              : nextDay.theme
              ? `Theme: ${nextDay.theme}`
              : 'Preview tomorrow\'s reading'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1">
          <div
            className="size-9 rounded-lg flex items-center justify-center border"
            style={{
              background: 'rgba(167,139,250,0.1)',
              borderColor: 'rgba(167,139,250,0.3)',
            }}
          >
            <BookOpen className="w-4 h-4" style={{ color: READING_ACCENT }} />
          </div>
          <ChevronRight
            className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--neon-purple)] transition-colors"
          />
        </div>
      </div>
    </button>
  );
}
