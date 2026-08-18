import { Children } from 'react';
import { ArrowRight } from 'lucide-react';

export function FlowCircuit({
  label = 'Flow · complete in order',
  children,
  footer,
  className = '',
  accentColor = 'var(--neon-green)',
  forceScroll = false,
  fitInView = false,
}) {
  const items = Children.toArray(children).filter(Boolean);

  const flowClass = fitInView
    ? 'grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 w-full min-w-0'
    : forceScroll
      ? 'flex flex-nowrap items-stretch gap-3 w-full min-w-0 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-1 px-1'
      : 'flex flex-wrap xl:flex-nowrap items-center justify-start xl:justify-between gap-y-3 gap-x-1 sm:gap-x-2 w-full min-w-0 overflow-x-auto xl:overflow-visible pb-2 xl:pb-0 snap-x xl:snap-none -mx-1 px-1 scrollbar-hide';

  const itemClass = fitInView
    ? 'w-full min-w-0'
    : forceScroll
      ? 'flex items-center gap-2 snap-start shrink-0'
      : 'flex items-center gap-1 sm:gap-2 snap-start xl:flex-1 xl:justify-center xl:min-w-0 shrink-0';

  return (
    <div
      className={`relative rounded-xl border p-3 sm:p-3.5 space-y-3 overflow-hidden min-w-0 bg-[var(--bg-card)] ${className}`}
      style={{ borderColor: 'var(--border-subtle)' }}
    >
      <p
        className="text-[9px] sm:text-[10px] font-bold tracking-[0.16em] uppercase"
        style={{ color: accentColor }}
      >
        {label}
      </p>

      <div className={flowClass}>
        {items.map((child, idx) => (
          <div key={idx} className={itemClass}>
            {child}
            {!fitInView && idx < items.length - 1 && (
              <ArrowRight
                className="w-3.5 h-3.5 shrink-0 hidden sm:block opacity-40"
                style={{ color: accentColor }}
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>

      {footer && (
        <div className="pt-2.5 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          {footer}
        </div>
      )}
    </div>
  );
}
