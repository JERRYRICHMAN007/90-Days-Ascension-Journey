import { useState, useRef, useCallback } from 'react';
import { LayoutDashboard, Map, BarChart3, Award, StickyNote } from 'lucide-react';
import { cn } from '../../lib/utils';

const PAGES = [
  { id: 'overview', label: 'Overview', shortLabel: 'Overview', Icon: LayoutDashboard },
  { id: 'learning', label: 'Daily Journey', shortLabel: 'Journey', Icon: Map },
  { id: 'stats', label: 'Stats', shortLabel: 'Stats', Icon: BarChart3 },
  { id: 'achievements', label: 'Badges', shortLabel: 'Badges', Icon: Award },
  { id: 'notes', label: 'Notes', shortLabel: 'Notes', Icon: StickyNote },
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
      {/* Primary navigation tabs */}
      <div className="shrink-0 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/98 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5">
          <div
            className="flex items-stretch gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide"
            role="tablist"
            aria-label="Journey sections"
          >
            {PAGES.map((p, i) => {
              const Icon = p.Icon;
              const isActive = i === activeIndex;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => goTo(i)}
                  className={cn(
                    'shrink-0 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2',
                    'min-w-[4.5rem] sm:min-w-0 flex-1 px-2.5 sm:px-4 py-2.5 rounded-xl border text-center transition-all',
                    isActive
                      ? 'bg-[var(--neon-green)]/15 border-[var(--neon-green)]/50 text-[var(--neon-green)] shadow-[0_0_20px_rgba(0,255,135,0.12)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-muted)] hover:bg-[var(--surface-hover)]'
                  )}
                >
                  <Icon className={cn('size-4 sm:size-[18px] shrink-0', isActive && 'drop-shadow-[0_0_6px_rgba(0,255,135,0.5)]')} />
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide leading-tight">
                    <span className="sm:hidden">{p.shortLabel}</span>
                    <span className="hidden sm:inline">{p.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
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
        Swipe or tap a tab · {PAGES[activeIndex]?.label} · {activeIndex + 1} / {PAGES.length}
      </p>
    </div>
  );
}
