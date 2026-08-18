import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import {
  WEEKDAY_DISPLAY_ORDER,
  getWeekdayLabels,
} from '../../utils/journeyPlanning.js';
import { applyJourneyPatches, getJourneySetup } from '../../utils/journeySetup.js';
import { getWeeklyPlan, saveWeeklyPlan } from '../../utils/journeyWeeklyPlan.js';

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Change which days a journey runs and at what time — available during setup and after start.
 */
export function JourneyRhythmEditor({
  journeyId,
  availableDays: availableDaysProp,
  onDaysChange,
  accentColor = '#6ee7b7',
  accentRgb = '110,231,183',
  compact = false,
}) {
  const [tick, setTick] = useState(0);
  const [drafts, setDrafts] = useState({});
  const [savedDay, setSavedDay] = useState(null);

  useEffect(() => {
    const refresh = () => setTick((n) => n + 1);
    window.addEventListener('journey-setup-updated', refresh);
    window.addEventListener('journey-weekly-plan-updated', refresh);
    return () => {
      window.removeEventListener('journey-setup-updated', refresh);
      window.removeEventListener('journey-weekly-plan-updated', refresh);
    };
  }, [journeyId]);

  useEffect(() => {
    if (savedDay == null) return;
    const t = window.setTimeout(() => setSavedDay(null), 2000);
    return () => window.clearTimeout(t);
  }, [savedDay]);

  const plan = useMemo(() => {
    void tick;
    return getWeeklyPlan(journeyId);
  }, [journeyId, tick]);

  const days = useMemo(() => {
    void tick;
    if (availableDaysProp?.length) return [...availableDaysProp].sort((a, b) => a - b);
    const setup = getJourneySetup(journeyId);
    if (setup.availableDays?.length) return [...setup.availableDays].sort((a, b) => a - b);
    const fromPlan = Object.keys(plan).map(Number);
    return fromPlan.length ? fromPlan.sort((a, b) => a - b) : [...WEEKDAY_DISPLAY_ORDER];
  }, [availableDaysProp, journeyId, plan, tick]);

  const weekdayLabels = getWeekdayLabels();

  const persistDays = (nextDays) => {
    const sorted = [...nextDays].sort((a, b) => a - b);
    onDaysChange?.(sorted);
    applyJourneyPatches(journeyId, { availableDays: sorted });
    setTick((n) => n + 1);
  };

  const toggleDay = (d) => {
    const on = days.includes(d);
    if (on && days.length === 1) return;
    persistDays(on ? days.filter((x) => x !== d) : [...days, d]);
  };

  const handleSaveTime = (weekday) => {
    const time = drafts[weekday] ?? plan[weekday]?.time ?? '06:00';
    const next = { ...plan, [weekday]: { ...(plan[weekday] || { type: 'custom', label: 'Session' }), time } };
    saveWeeklyPlan(journeyId, next);
    setDrafts((prev) => {
      const copy = { ...prev };
      delete copy[weekday];
      return copy;
    });
    setSavedDay(weekday);
    setTick((n) => n + 1);
  };

  return (
    <div
      className={cn('rounded-2xl border p-4 sm:p-5 space-y-4', compact && 'p-3')}
      style={{
        background: `linear-gradient(160deg, rgba(${accentRgb},0.05) 0%, var(--bg-card) 55%)`,
        borderColor: `rgba(${accentRgb},0.18)`,
      }}
    >
      <div>
        <h3 className="font-display text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <CalendarDays className="size-4" style={{ color: accentColor }} />
          Days & times
        </h3>
        <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">
          Tap the days this journey happens. Set a time for each active day — you can change this anytime.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {WEEKDAY_DISPLAY_ORDER.map((d) => {
          const on = days.includes(d);
          return (
            <button
              key={d}
              type="button"
              onClick={() => toggleDay(d)}
              className={cn(
                'size-9 rounded-full text-[10px] font-bold border transition-colors',
                on
                  ? 'text-[#0a0a0a]'
                  : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-muted)]'
              )}
              style={
                on
                  ? { background: accentColor, borderColor: accentColor }
                  : undefined
              }
              aria-pressed={on}
              title={weekdayLabels[d]}
            >
              {DAY_SHORT[d]}
            </button>
          );
        })}
      </div>

      <div className="space-y-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
          <Clock className="size-3" /> Session times
        </p>
        {WEEKDAY_DISPLAY_ORDER.filter((d) => days.includes(d)).map((d) => {
          const act = plan[d];
          const current = act?.time || '06:00';
          const display = drafts[d] ?? current;
          const dirty = drafts[d] !== undefined && drafts[d] !== current;
          const justSaved = savedDay === d;

          return (
            <div key={d} className="flex items-center gap-2 text-sm">
              <span className="text-[var(--text-secondary)] shrink-0 w-[4.5rem] text-xs font-medium">
                {DAY_SHORT[d]}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] truncate flex-1 min-w-0">
                {act?.label || 'Session'}
              </span>
              <input
                type="time"
                value={display}
                onChange={(e) => setDrafts((prev) => ({ ...prev, [d]: e.target.value }))}
                className="rounded-md border px-1.5 py-0.5 text-xs bg-[var(--bg-primary)] border-[var(--border-subtle)] w-[7rem]"
              />
              {dirty && (
                <Button
                  size="sm"
                  className="rounded-full h-7 text-[10px] px-2.5 shrink-0"
                  style={{ background: accentColor, color: '#0a0a0a' }}
                  onClick={() => handleSaveTime(d)}
                >
                  Save
                </Button>
              )}
              {justSaved && !dirty && (
                <span
                  className="flex items-center gap-0.5 text-[10px] font-medium shrink-0"
                  style={{ color: accentColor }}
                >
                  <Check className="size-3" /> Saved
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
