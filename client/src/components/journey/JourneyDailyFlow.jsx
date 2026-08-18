import { Children } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Compact shared shell for journey "daily flow" sections
 * (Writing, Brand, Reading extras, SE sessions, etc.)
 */
export function JourneyDailyFlow({
  icon: Icon,
  title,
  label,
  accentColor = 'var(--neon-green)',
  children,
  footer = null,
  className = '',
  columns = 'auto',
}) {
  const kids = Children.toArray(children).filter(Boolean);
  const childCount = kids.length;

  const gridClass =
    columns === 1 || childCount <= 1
      ? 'grid grid-cols-1 gap-2.5 max-w-none'
      : columns === 2 || childCount === 2
        ? 'grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 sm:gap-2.5 items-stretch'
        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5';

  const useArrowRow = (columns === 2 || childCount === 2) && childCount === 2;

  return (
    <section
      className={cn('rounded-xl border overflow-hidden min-w-0', className)}
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <div
        className="px-3.5 sm:px-4 py-3 border-b flex items-center gap-2.5 min-w-0"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {Icon && (
          <span
            className="flex size-7 items-center justify-center rounded-lg shrink-0"
            style={{
              color: accentColor,
              background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
            }}
          >
            <Icon className="size-3.5" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-[15px] font-bold text-[var(--text-primary)] truncate leading-tight">
            {title}
          </h3>
          {label && (
            <p
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] mt-0.5 truncate"
              style={{ color: accentColor }}
            >
              {label}
            </p>
          )}
        </div>
      </div>

      <div className={cn('p-3 sm:p-3.5', gridClass)}>
        {useArrowRow
          ? kids.map((child, idx) => (
              <div key={child.key ?? idx} className="contents">
                <div className="min-w-0 w-full">{child}</div>
                {idx === 0 && (
                  <div className="hidden sm:flex items-center justify-center px-0.5" aria-hidden>
                    <ArrowRight className="size-3.5 opacity-50" style={{ color: accentColor }} />
                  </div>
                )}
              </div>
            ))
          : kids.map((child, idx) => (
              <div key={child.key ?? idx} className="min-w-0 w-full">
                {child}
              </div>
            ))}
      </div>

      {footer && (
        <div
          className="px-3.5 sm:px-4 pb-3 pt-0 border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="pt-3">{footer}</div>
        </div>
      )}
    </section>
  );
}

/** Compact flip-card face shared across journeys */
export function FlowCardFace({
  icon: Icon,
  badge,
  badgeColor,
  eyebrow,
  title,
  hint = 'Tap for details',
  accentColor = 'var(--neon-green)',
  children,
  className = '',
}) {
  return (
    <div
      className={cn(
        'w-full h-full rounded-xl border p-3 flex flex-col gap-2 text-left',
        className
      )}
      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-start justify-between gap-2">
        {Icon ? (
          <Icon className="size-3.5 shrink-0 mt-0.5" style={{ color: accentColor }} />
        ) : (
          <span />
        )}
        {badge && (
          <span
            className="text-[9px] font-bold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded"
            style={{
              color: badgeColor || accentColor,
              background: `color-mix(in srgb, ${badgeColor || accentColor} 14%, transparent)`,
            }}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-center gap-0.5">
        {eyebrow && (
          <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">{eyebrow}</p>
        )}
        {title && (
          <p className="text-[13px] sm:text-sm font-semibold text-[var(--text-primary)] leading-snug line-clamp-3">
            {title}
          </p>
        )}
        {children}
      </div>

      <p
        className="text-[9px] font-bold uppercase tracking-[0.1em] flex items-center gap-1 pt-1 border-t"
        style={{ color: accentColor, borderColor: 'var(--border-subtle)' }}
      >
        {hint}
      </p>
    </div>
  );
}

export function FlowCardBack({
  eyebrow,
  children,
  accentColor = 'var(--neon-green)',
  className = '',
}) {
  return (
    <div
      className={cn(
        'w-full h-full rounded-xl border p-3 flex flex-col gap-1.5 overflow-y-auto text-left',
        className
      )}
      style={{
        background: 'var(--bg-elevated)',
        borderColor: `color-mix(in srgb, ${accentColor} 35%, var(--border-subtle))`,
      }}
    >
      {eyebrow && (
        <p
          className="text-[9px] font-bold uppercase tracking-[0.12em] shrink-0"
          style={{ color: accentColor }}
        >
          {eyebrow}
        </p>
      )}
      <div className="flex-1 min-h-0 text-[11px] sm:text-xs text-[var(--text-primary)] leading-relaxed">
        {children}
      </div>
      <p className="text-[9px] text-[var(--text-muted)] shrink-0 text-center pt-1">Tap to flip back</p>
    </div>
  );
}
