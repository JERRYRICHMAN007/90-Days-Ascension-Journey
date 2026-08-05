import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatYmd, parseYmd } from '../../utils/dates.js';
import {
  getDateParts,
  getMonthGrid,
  isSameYmd,
  isToday,
  WEEKDAY_HEADERS,
} from '../../utils/dateFormat.js';

/**
 * Premium start + finish date pairing with custom calendar popover.
 */
export function JourneyDateRangePicker({
  startYmd,
  onStartChange,
  endYmd,
  totalDays,
  accentColor = '#6ee7b7',
  accentRgb = '110,231,183',
  className,
  startLabel = 'Start',
  endLabel = 'Finish',
}) {
  const [open, setOpen] = useState(false);
  const startParts = getDateParts(startYmd);
  const endParts = getDateParts(endYmd);

  return (
    <div className={cn('space-y-3', className)}>
      <div
        className={cn(
          'flex flex-col sm:flex-row sm:items-stretch gap-3',
          endYmd ? 'sm:gap-0' : ''
        )}
      >
        <DateCard
          label={startLabel}
          parts={startParts}
          icon={CalendarDays}
          accentColor={accentColor}
          accentRgb={accentRgb}
          editable
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          startYmd={startYmd}
          onStartChange={onStartChange}
          endYmd={endYmd}
        />

        {endYmd != null && totalDays != null && (
          <>
            <DurationBridge days={totalDays} accentRgb={accentRgb} accentColor={accentColor} />
            <DateCard
              label={endLabel}
              parts={endParts}
              icon={Flag}
              accentColor={accentColor}
              accentRgb={accentRgb}
              editable={false}
            />
          </>
        )}
      </div>
    </div>
  );
}

function DurationBridge({ days, accentRgb, accentColor }) {
  return (
    <div className="flex sm:flex-col items-center justify-center px-0 sm:px-3 py-2 sm:py-0 shrink-0">
      <div className="hidden sm:block w-px flex-1 min-h-[12px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div
        className="flex items-center gap-2 sm:flex-col sm:gap-1 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest whitespace-nowrap my-1"
        style={{
          borderColor: `rgba(${accentRgb},0.25)`,
          background: `rgba(${accentRgb},0.08)`,
          color: accentColor,
        }}
      >
        <span className="hidden sm:inline w-8 h-px bg-white/10" />
        <span>{days} days</span>
        <span className="hidden sm:inline w-8 h-px bg-white/10" />
      </div>
      <div className="hidden sm:block w-px flex-1 min-h-[12px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div className="sm:hidden flex-1 h-px mx-2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

function DateCard({
  label,
  parts,
  icon: Icon,
  accentColor,
  accentRgb,
  editable,
  open,
  onOpen,
  onClose,
  startYmd,
  onStartChange,
  endYmd,
}) {
  const cardRef = useRef(null);
  const labelId = useId();

  const handleKeyDown = (e) => {
    if (!editable) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen?.();
    }
  };

  return (
    <>
      <div
        ref={cardRef}
        role={editable ? 'button' : undefined}
        tabIndex={editable ? 0 : undefined}
        aria-haspopup={editable ? 'dialog' : undefined}
        aria-expanded={editable ? open : undefined}
        aria-labelledby={labelId}
        onClick={editable ? () => onOpen?.() : undefined}
        onKeyDown={handleKeyDown}
        className={cn(
          'group relative flex-1 min-w-0 rounded-xl border px-4 py-3 transition-all duration-200',
          editable && 'cursor-pointer hover:border-white/20 hover:bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-card)]',
          !editable && 'opacity-90'
        )}
        style={{
          borderColor: `rgba(${accentRgb},0.18)`,
          background: `linear-gradient(160deg, rgba(${accentRgb},0.05) 0%, transparent 100%)`,
          ...(editable && {
            '--tw-ring-color': `rgba(${accentRgb},0.45)`,
          }),
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p
              id={labelId}
              className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] mb-1"
            >
              {label}
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={parts.compact}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-xs text-[var(--text-secondary)] mb-0.5 truncate">
                  {parts.weekday}
                </p>
                <p className="font-display text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight leading-tight">
                  {parts.compact}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            className={cn(
              'flex size-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-200',
              editable && 'group-hover:scale-105 group-hover:shadow-md group-active:scale-95'
            )}
            style={{
              borderColor: `rgba(${accentRgb},0.22)`,
              background: `rgba(${accentRgb},0.1)`,
              color: accentColor,
              boxShadow: editable ? `0 0 0 0 rgba(${accentRgb},0)` : undefined,
            }}
            aria-hidden={!editable}
          >
            <Icon className="size-4" strokeWidth={2.25} />
          </div>
        </div>
      </div>

      {editable && open && (
        <CalendarPopover
          anchorRef={cardRef}
          startYmd={startYmd}
          endYmd={endYmd}
          accentColor={accentColor}
          accentRgb={accentRgb}
          onSelect={(ymd) => {
            onStartChange?.(ymd);
            onClose?.();
          }}
          onClose={onClose}
        />
      )}
    </>
  );
}

function CalendarPopover({ anchorRef, startYmd, endYmd, accentColor, accentRgb, onSelect, onClose }) {
  const popoverRef = useRef(null);
  const [viewDate, setViewDate] = useState(() => parseYmd(startYmd));
  const [focusedDay, setFocusedDay] = useState(() => parseYmd(startYmd));
  const titleId = useId();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const grid = getMonthGrid(year, month);
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const positionPopover = useCallback(() => {
    const anchor = anchorRef.current;
    const popover = popoverRef.current;
    if (!anchor || !popover) return;

    const rect = anchor.getBoundingClientRect();
    const popW = popover.offsetWidth;
    const popH = popover.offsetHeight;
    const pad = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top = rect.bottom + pad;
    let left = rect.left;

    if (vw < 640) {
      top = Math.max(pad, vh - popH - 24);
      left = Math.max(pad, (vw - popW) / 2);
    } else {
      if (left + popW > vw - pad) left = vw - popW - pad;
      if (left < pad) left = pad;
      if (top + popH > vh - pad) top = rect.top - popH - pad;
    }

    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
  }, [anchorRef]);

  useEffect(() => {
    setViewDate(parseYmd(startYmd));
    setFocusedDay(parseYmd(startYmd));
  }, [startYmd]);

  useEffect(() => {
    popoverRef.current?.querySelector('[tabindex="0"]')?.focus();
  }, []);

  useEffect(() => {
    positionPopover();
    window.addEventListener('resize', positionPopover);
    window.addEventListener('scroll', positionPopover, true);
    return () => {
      window.removeEventListener('resize', positionPopover);
      window.removeEventListener('scroll', positionPopover, true);
    };
  }, [positionPopover]);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (
        popoverRef.current?.contains(e.target) ||
        anchorRef.current?.contains(e.target)
      ) {
        return;
      }
      onClose();
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [anchorRef, onClose]);

  const moveMonth = (delta) => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));
  };

  const moveFocus = (deltaDays) => {
    setFocusedDay((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + deltaDays);
      setViewDate(new Date(next.getFullYear(), next.getMonth(), 1));
      return next;
    });
  };

  const handleGridKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        moveFocus(-1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        moveFocus(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveFocus(-7);
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveFocus(7);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(formatYmd(focusedDay));
        break;
      default:
        break;
    }
  };

  const startDate = parseYmd(startYmd);
  const endDate = endYmd ? parseYmd(endYmd) : null;

  const inRange = (date) => {
    if (!endDate || !date) return false;
    const t = date.getTime();
    return t >= startDate.getTime() && t <= endDate.getTime();
  };

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[199] bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <AnimatePresence>
      <motion.div
        ref={popoverRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.96 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed z-[200] w-[min(100vw-24px,320px)] rounded-2xl border p-4 shadow-2xl"
        style={{
          background: 'var(--bg-card)',
          borderColor: `rgba(${accentRgb},0.25)`,
          boxShadow: `0 24px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(${accentRgb},0.12)`,
        }}
        onKeyDown={handleGridKeyDown}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => moveMonth(-1)}
            className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <p id={titleId} className="text-sm font-display font-bold text-[var(--text-primary)]">
            {monthLabel}
          </p>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => moveMonth(1)}
            className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5 transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-0.5 mb-1" role="row">
          {WEEKDAY_HEADERS.map((d) => (
            <div
              key={d}
              className="text-center text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] py-1"
              aria-hidden
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5" role="grid" aria-label="Choose start date">
          {grid.map((date, i) => {
            if (!date) {
              return <div key={`empty-${i}`} role="gridcell" aria-hidden />;
            }

            const ymd = formatYmd(date);
            const selected = isSameYmd(date, startYmd);
            const today = isToday(date);
            const inJourneyRange = inRange(date);
            const focused = isSameYmd(date, focusedDay);

            return (
              <button
                key={ymd}
                type="button"
                role="gridcell"
                tabIndex={focused ? 0 : -1}
                aria-label={getDateParts(date).long}
                aria-selected={selected}
                onClick={() => onSelect(ymd)}
                onFocus={() => setFocusedDay(date)}
                className={cn(
                  'relative flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-all duration-150',
                  selected
                    ? 'text-[#0a0a0a] font-bold shadow-md scale-105'
                    : inJourneyRange
                      ? 'text-[var(--text-primary)] bg-white/[0.04]'
                      : 'text-[var(--text-secondary)] hover:bg-white/[0.06] hover:text-[var(--text-primary)]',
                  today && !selected && 'ring-1 ring-inset',
                  focused && !selected && 'ring-2 ring-offset-1 ring-offset-[var(--bg-card)]'
                )}
                style={{
                  ...(selected && {
                    background: `linear-gradient(135deg, ${accentColor}, rgba(${accentRgb},0.85))`,
                    boxShadow: `0 4px 12px rgba(${accentRgb},0.35)`,
                  }),
                  ...(today && !selected && {
                    ringColor: `rgba(${accentRgb},0.5)`,
                  }),
                  ...(focused && !selected && {
                    '--tw-ring-color': `rgba(${accentRgb},0.45)`,
                  }),
                }}
              >
                {date.getDate()}
                {today && !selected && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full"
                    style={{ background: accentColor }}
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-[10px] text-center text-[var(--text-muted)]">
          {endYmd
            ? `Tap a date · Range shows your ${totalDaysHint(endYmd, startYmd)} journey`
            : 'Tap a date to choose your start'}
        </p>
      </motion.div>
      </AnimatePresence>
    </>,
    document.body
  );
}

function totalDaysHint(endYmd, startYmd) {
  if (!endYmd || !startYmd) return '6-month';
  try {
    const ms = parseYmd(endYmd) - parseYmd(startYmd);
    const days = Math.round(ms / (1000 * 60 * 60 * 24)) + 1;
    return `${days}-day`;
  } catch {
    return '6-month';
  }
}

/** Single start-date card with calendar (compact contexts) */
export function JourneyDatePicker({
  value,
  onChange,
  accentColor = '#6ee7b7',
  accentRgb = '110,231,183',
  label = 'Start date',
  className,
}) {
  return (
    <JourneyDateRangePicker
      startYmd={value}
      onStartChange={onChange}
      accentColor={accentColor}
      accentRgb={accentRgb}
      className={className}
      startLabel={label}
    />
  );
}
