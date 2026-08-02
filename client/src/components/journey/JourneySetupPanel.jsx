import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Flag,
  RotateCcw,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import {
  setJourneyStartDateFor,
  resetJourneySchedule,
  setJourneyAvailability,
  getJourneyAvailability,
  getWeekdayLabels,
  formatDisplayDate,
  getJourneyTimeline,
  getDefaultPickerDate,
  hasJourneyStartDate,
} from '../../utils/journeyPlanning.js';
import { addMonths, parseYmd, JOURNEY_DURATION_MONTHS, formatYmd } from '../../utils/dates.js';

/**
 * Journey schedule: start date, mastery deadline preview, availability, reset arc.
 */
export function JourneySetupPanel({ journeyId, onSaved, accentColor, accentRgb, className }) {
  const [configured, setConfigured] = useState(() => hasJourneyStartDate(journeyId));
  const [timeline, setTimeline] = useState(() => getJourneyTimeline(journeyId));
  const [startDate, setStartDate] = useState(
    timeline.configured ? timeline.startYmd : getDefaultPickerDate()
  );
  const [expanded, setExpanded] = useState(!timeline.configured);
  const [saved, setSaved] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [avail, setAvail] = useState(() => getJourneyAvailability(journeyId));

  const rgb = accentRgb || '110,231,183';
  const accent = accentColor || '#6ee7b7';

  const refreshTimeline = () => {
    const next = getJourneyTimeline(journeyId);
    setTimeline(next);
    setConfigured(hasJourneyStartDate(journeyId));
    if (next.configured) setStartDate(next.startYmd);
  };

  useEffect(() => {
    const onUpdate = (e) => {
      if (e.detail?.journeyId !== journeyId) return;
      refreshTimeline();
      if (e.detail?.reset) {
        setStartDate(getDefaultPickerDate());
        setExpanded(true);
        setResetConfirm(false);
      }
    };
    window.addEventListener('journey-start-updated', onUpdate);
    return () => window.removeEventListener('journey-start-updated', onUpdate);
  }, [journeyId]);

  const previewEnd = formatDisplayDate(
    formatYmd(addMonths(parseYmd(startDate), JOURNEY_DURATION_MONTHS))
  );
  const weekdayLabels = getWeekdayLabels();

  const handleSaveStart = () => {
    if (!startDate) return;
    setJourneyStartDateFor(journeyId, startDate);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    refreshTimeline();
    onSaved?.();
  };

  const handleReset = () => {
    resetJourneySchedule(journeyId);
    refreshTimeline();
    onSaved?.();
  };

  const toggleDay = (dayIndex) => {
    const next = avail.availableDays.includes(dayIndex)
      ? avail.availableDays.filter((d) => d !== dayIndex)
      : [...avail.availableDays, dayIndex].sort((a, b) => a - b);
    const updated = { ...avail, availableDays: next.length ? next : [dayIndex] };
    setAvail(updated);
    setJourneyAvailability(journeyId, updated);
    onSaved?.();
  };

  const toggleAvailability = () => {
    const updated = { ...avail, enabled: !avail.enabled };
    setAvail(updated);
    setJourneyAvailability(journeyId, updated);
    onSaved?.();
  };

  return (
    <div
      className={cn('relative rounded-2xl overflow-hidden', className)}
      style={{
        background: `linear-gradient(145deg, rgba(${rgb},0.08) 0%, var(--bg-card) 45%, rgba(196,181,253,0.06) 100%)`,
        boxShadow: `0 0 0 1px rgba(${rgb},0.25), 0 12px 40px rgba(0,0,0,0.35)`,
      }}
    >
      {/* Accent glow */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full blur-3xl opacity-40"
        style={{ background: accent }}
        aria-hidden
      />

      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="relative w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-xl shadow-lg"
            style={{
              background: `linear-gradient(135deg, rgba(${rgb},0.35), rgba(${rgb},0.12))`,
              boxShadow: `0 0 20px rgba(${rgb},0.25)`,
            }}
          >
            <CalendarDays className="size-5" style={{ color: accent }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-display font-bold text-[var(--text-primary)]">
              {configured ? 'Journey schedule' : 'Start your journey'}
            </p>
            <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
              {configured
                ? `${timeline.startLabel} → ${timeline.masteryDeadlineLabel}`
                : 'Pick Day 1 — we’ll calculate your mastery deadline'}
            </p>
          </div>
        </div>
        <div
          className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5"
          style={{ color: accent }}
        >
          {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden relative"
          >
            <div className="px-5 pb-5 space-y-6 border-t border-white/10 pt-5">
              {/* Timeline preview strip */}
              <div
                className="rounded-xl p-4 flex items-center gap-2 sm:gap-4"
                style={{
                  background: `rgba(${rgb},0.1)`,
                  border: `1px solid rgba(${rgb},0.25)`,
                }}
              >
                <TimelineNode label="Day 1" value={formatDisplayDate(startDate)} accent={accent} active />
                <ArrowRight className="size-4 shrink-0 opacity-50" style={{ color: accent }} />
                <TimelineNode label="6 months" value={`${JOURNEY_DURATION_MONTHS} mo arc`} accent={accent} />
                <ArrowRight className="size-4 shrink-0 opacity-50 hidden sm:block" style={{ color: accent }} />
                <TimelineNode label="Mastery" value={previewEnd} accent={accent} icon={Flag} />
              </div>

              <div className="space-y-3">
                <label
                  htmlFor={`start-${journeyId}`}
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: accent }}
                >
                  Journey start date
                </label>
                <input
                  id={`start-${journeyId}`}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full max-w-sm rounded-xl border px-4 py-3 text-sm font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 transition-shadow"
                  style={{
                    background: 'rgba(0,0,0,0.25)',
                    borderColor: `rgba(${rgb},0.35)`,
                    boxShadow: `inset 0 0 0 1px rgba(${rgb},0.08)`,
                  }}
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={handleSaveStart}
                    className="rounded-full font-display text-xs uppercase tracking-wider text-[#0a0a0a] font-bold shadow-lg hover:opacity-95"
                    style={{
                      background: `linear-gradient(135deg, ${accent}, rgba(${rgb},0.85))`,
                      boxShadow: `0 4px 20px rgba(${rgb},0.4)`,
                    }}
                  >
                    <Check className="size-3.5 mr-1.5" />
                    Save start date
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full text-xs border-white/20 bg-white/5 hover:bg-white/10 text-[var(--text-primary)]"
                    onClick={() => {
                      const today = formatYmd(new Date());
                      setStartDate(today);
                      setJourneyStartDateFor(journeyId, today);
                      refreshTimeline();
                      onSaved?.();
                    }}
                  >
                    Start today
                  </Button>
                </div>
                {saved && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-medium flex items-center gap-1.5"
                    style={{ color: accent }}
                  >
                    <Sparkles className="size-3.5" /> Schedule saved — your roadmap is live
                  </motion.p>
                )}
              </div>

              {/* Weekly availability */}
              <div
                className="space-y-3 pt-4 border-t border-white/10"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">Weekly availability</p>
                    <p className="text-xs text-[var(--text-secondary)]">Optional — we adapt your plan to your week</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={avail.enabled}
                    onClick={toggleAvailability}
                    className={cn(
                      'relative w-12 h-7 rounded-full transition-all duration-300',
                      avail.enabled ? 'shadow-lg' : 'bg-[var(--bg-badge)]'
                    )}
                    style={
                      avail.enabled
                        ? { background: accent, boxShadow: `0 0 16px rgba(${rgb},0.5)` }
                        : undefined
                    }
                  >
                    <span
                      className={cn(
                        'absolute top-1 size-5 rounded-full bg-white shadow transition-transform',
                        avail.enabled ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                {avail.enabled && (
                  <div className="flex flex-wrap gap-2">
                    {weekdayLabels.map((label, i) => {
                      const on = avail.availableDays.includes(i);
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => toggleDay(i)}
                          className={cn(
                            'px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200',
                            on
                              ? 'text-[#0a0a0a] shadow-md'
                              : 'border border-white/15 text-[var(--text-muted)] hover:border-white/30 hover:text-[var(--text-primary)]'
                          )}
                          style={
                            on
                              ? {
                                  background: `linear-gradient(135deg, ${accent}, rgba(${rgb},0.9))`,
                                  boxShadow: `0 2px 12px rgba(${rgb},0.35)`,
                                }
                              : undefined
                          }
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Reset journey arc */}
              {configured && (
                <div
                  className="pt-4 border-t border-white/10 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/15"
                    >
                      <RotateCcw className="size-4 text-rose-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">Reset journey arc</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                        End this 6-month schedule and pick a new start date. Your completed tasks stay saved.
                      </p>
                    </div>
                  </div>
                  {!resetConfirm ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs border-rose-500/40 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
                      onClick={() => setResetConfirm(true)}
                    >
                      Reset start date
                    </Button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25">
                      <p className="text-xs text-rose-200 flex-1 min-w-[200px]">
                        Clear your schedule and start fresh?
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        className="rounded-full text-xs bg-rose-500 hover:bg-rose-600 text-white"
                        onClick={handleReset}
                      >
                        Yes, reset
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="rounded-full text-xs text-[var(--text-muted)]"
                        onClick={() => setResetConfirm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TimelineNode({ label, value, accent, active, icon: Icon = CalendarDays }) {
  return (
    <div className="flex-1 min-w-0 text-center sm:text-left">
      <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
        <Icon className="size-3.5 shrink-0" style={{ color: accent }} />
        <span className="text-[9px] uppercase tracking-wider font-bold" style={{ color: accent }}>
          {label}
        </span>
      </div>
      <p
        className={cn(
          'text-xs font-semibold truncate',
          active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
        )}
      >
        {value}
      </p>
    </div>
  );
}
