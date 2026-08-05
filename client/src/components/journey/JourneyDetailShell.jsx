import { useState, useRef, useCallback } from 'react';
import { cn } from '../../lib/utils';

const PAGES = [
  { id: 'overview', label: 'Overview' },
  { id: 'learning', label: 'Plan' },
  { id: 'stats', label: 'Stats' },
  { id: 'achievements', label: 'Badges' },
  { id: 'notes', label: 'Notes' },
];

/**
 * Horizontal swipe shell for journey detail — scroll-snap pages.
 */
export function JourneyDetailShell({ pages, className }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.clientWidth || 1;
    const idx = Math.round(el.scrollLeft / w);
    setActiveIndex(Math.min(PAGES.length - 1, Math.max(0, idx)));
  }, []);

  const goTo = (index) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
    setActiveIndex(index);
  };

  return (
    <div className={cn('flex flex-col flex-1 min-h-0', className)}>
      {/* Page dots + labels */}
      <div className="shrink-0 flex items-center justify-center gap-1 px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/95 backdrop-blur-sm overflow-x-auto scrollbar-hide">
        {PAGES.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => goTo(i)}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors',
              i === activeIndex
                ? 'bg-[var(--neon-green)]/20 text-[var(--neon-green)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {pages.map((page, i) => (
          <section
            key={PAGES[i]?.id || i}
            className="w-full shrink-0 snap-start snap-always overflow-y-auto h-full"
            aria-label={PAGES[i]?.label}
          >
            {page}
          </section>
        ))}
      </div>

      <p className="shrink-0 text-center text-[10px] text-[var(--text-muted)] py-2 border-t border-[var(--border-subtle)]">
        Swipe or tap tabs to navigate · {activeIndex + 1} / {PAGES.length}
      </p>
    </div>
  );
}
