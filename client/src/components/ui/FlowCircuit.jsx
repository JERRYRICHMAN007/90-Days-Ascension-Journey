import { Children } from 'react';
import { ArrowRight } from 'lucide-react';

export function FlowCircuit({
  label = 'Flow · complete in order',
  children,
  footer,
  className = '',
  accentColor = 'var(--neon-green)',
  forceScroll = false,
}) {
  const items = Children.toArray(children).filter(Boolean);

  return (
    <div
      className={`relative rounded-2xl border p-5 space-y-4 overflow-hidden min-w-0 bg-[var(--bg-card)] ${className}`}
      style={{ borderColor: 'var(--border-subtle)' }}
    >
      <p
        className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1"
        style={{ color: accentColor }}
      >
        {label}
      </p>

      <div
        className={
          forceScroll
            ? 'flex flex-nowrap items-stretch gap-3 w-full min-w-0 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide -mx-1 px-1'
            : 'flex flex-wrap xl:flex-nowrap items-center justify-start xl:justify-between gap-y-3 gap-x-1 sm:gap-x-2 w-full min-w-0 overflow-x-auto xl:overflow-visible pb-2 xl:pb-0 snap-x xl:snap-none -mx-1 px-1 scrollbar-hide'
        }
      >
        {items.map((child, idx) => (
          <div
            key={idx}
            className={
              forceScroll
                ? 'flex items-center gap-2 snap-start shrink-0'
                : 'flex items-center gap-1 sm:gap-2 snap-start xl:flex-1 xl:justify-center xl:min-w-0 shrink-0'
            }
          >
            {child}
            {idx < items.length - 1 && (
              <ArrowRight
                className="w-4 h-4 shrink-0 hidden sm:block opacity-40"
                style={{ color: accentColor }}
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>

      {footer && (
        <div className="pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          {footer}
        </div>
      )}
    </div>
  );
}
