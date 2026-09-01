import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import {
  WEEKDAY_DISPLAY_ORDER,
  getWeekdayLabels,
} from '../../utils/journeyPlanning.js';
import { applyJourneyPatches, getJourneySetup } from '../../utils/journeySetup.js';
import { getWeeklyPlan, saveWeeklyPlan, getDefaultActivityForWeekday } from '../../utils/journeyWeeklyPlan.js';
import { getRegistryEntry } from '../../utils/journeyRegistry.js';
import { resolveJourneyAIContext } from '../../utils/journeyAIContext.js';

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function isRest(act) {
  return act?.type === 'recovery' || act?.type === 'rest';
}

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
  const [nameDraft, setNameDraft] = useState(null);
  const [allTime, setAllTime] = useState('');

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
  const ctx = resolveJourneyAIContext(journeyId);
  const fallbackName = getRegistryEntry(journeyId)?.title || ctx.journeyTitle || 'Session';

  const sharedName = useMemo(() => {
    const labels = days
      .map((d) => plan[d])
      .filter((act) => act && !isRest(act))
      .map((act) => act.label)
      .filter(Boolean);
    const unique = [...new Set(labels)];
    return unique[0] || fallbackName;
  }, [days, plan, fallbackName]);

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

  const persistPlan = (next, markDay = null) => {
    saveWeeklyPlan(journeyId, next);
    if (markDay != null) setSavedDay(markDay);
    setTick((n) => n + 1);
  };

  const handleSaveTime = (weekday) => {
    const time = drafts[weekday] ?? plan[weekday]?.time ?? '06:00';
    const base = plan[weekday] || getDefaultActivityForWeekday(journeyId, weekday);
    persistPlan({ ...plan, [weekday]: { ...base, time } }, weekday);
    setDrafts((prev) => {
      const copy = { ...prev };
      delete copy[weekday];
      return copy;
    });
  };

  const applyNameToActiveDays = (name) => {
    const trimmed = name.trim() || fallbackName;
    const next = { ...plan };
    days.forEach((d) => {
      const act = next[d] || getDefaultActivityForWeekday(journeyId, d);
      if (isRest(act)) return;
      next[d] = { ...act, label: trimmed };
    });
    persistPlan(next, 'name');
  };

  const applyTimeToAll = () => {
    const time = allTime || days.map((d) => drafts[d] ?? plan[d]?.time).find(Boolean) || '19:00';
    const next = { ...plan };
    days.forEach((d) => {
      const act = next[d] || getDefaultActivityForWeekday(journeyId, d);
      if (isRest(act)) return;
      next[d] = { ...act, time };
    });
    persistPlan(next, 'all');
    setAllTime('');
    setDrafts({});
  };

  const displayName = nameDraft ?? sharedName;

  return (
    <div
      data-tour="days-times"
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
          Tap the days this journey happens. Name the sessions and set a time — you can change this anytime, even after you start.
        </p>
      </div>

      <label className="block space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Session name
        </span>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setNameDraft(e.target.value)}
          onBlur={() => {
            if (nameDraft == null) return;
            applyNameToActiveDays(nameDraft);
            setNameDraft(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
          }}
          placeholder={fallbackName}
          className="w-full rounded-lg border px-3 py-2 text-sm bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-primary)]"
        />
      </label>

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
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <Clock className="size-3" /> Session times
          </p>
          <div className="flex-1" />
          <input
            type="time"
            value={allTime}
            onChange={(e) => setAllTime(e.target.value)}
            className="rounded-md border px-1.5 py-0.5 text-xs bg-[var(--bg-primary)] border-[var(--border-subtle)] w-[7rem]"
            aria-label="Time for all days"
          />
          <Button
            size="sm"
            variant="outline"
            className="rounded-full h-7 text-[10px] px-2.5"
            disabled={!allTime}
            onClick={applyTimeToAll}
          >
            Apply to all
          </Button>
        </div>
        {WEEKDAY_DISPLAY_ORDER.filter((d) => days.includes(d)).map((d) => {
          const act = plan[d];
          const current = act?.time || '06:00';
          const display = drafts[d] ?? current;
          const dirty = drafts[d] !== undefined && drafts[d] !== current;
          const justSaved = savedDay === d;
          const rest = isRest(act);

          return (
            <div key={d} className="flex items-center gap-2 text-sm">
              <span className="text-[var(--text-secondary)] shrink-0 w-[4.5rem] text-xs font-medium">
                {DAY_SHORT[d]}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] truncate flex-1 min-w-0">
                {rest ? (act?.label || 'Rest day') : (act?.label || sharedName)}
              </span>
              <input
                type="time"
                value={display}
                onChange={(e) => setDrafts((prev) => ({ ...prev, [d]: e.target.value }))}
                onBlur={() => {
                  if (drafts[d] !== undefined && drafts[d] !== current) handleSaveTime(d);
                }}
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
