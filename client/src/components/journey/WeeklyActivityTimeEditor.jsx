import { useState, useEffect } from 'react';
import { Clock, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { getWeeklyPlan, saveWeeklyPlan } from '../../utils/journeyWeeklyPlan.js';
import { cn } from '../../lib/utils';

const WEEKDAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Activity time editor with explicit save — prevents accidental time commits.
 */
export function WeeklyActivityTimeEditor({ journeyId, availableDays, accentColor = '#6ee7b7' }) {
  const [plan, setPlan] = useState(() => getWeeklyPlan(journeyId));
  const [drafts, setDrafts] = useState({});
  const [savedDay, setSavedDay] = useState(null);

  useEffect(() => {
    const refresh = () => setPlan(getWeeklyPlan(journeyId));
    window.addEventListener('journey-weekly-plan-updated', refresh);
    return () => window.removeEventListener('journey-weekly-plan-updated', refresh);
  }, [journeyId]);

  useEffect(() => {
    if (savedDay == null) return;
    const t = window.setTimeout(() => setSavedDay(null), 2500);
    return () => clearTimeout(t);
  }, [savedDay]);

  const handleDraft = (weekday, value) => {
    setDrafts((prev) => ({ ...prev, [weekday]: value }));
  };

  const handleSave = (weekday) => {
    const time = drafts[weekday] ?? plan[weekday]?.time ?? '06:00';
    const next = { ...plan, [weekday]: { ...plan[weekday], time } };
    saveWeeklyPlan(journeyId, next);
    setPlan(next);
    setDrafts((prev) => {
      const copy = { ...prev };
      delete copy[weekday];
      return copy;
    });
    setSavedDay(weekday);
  };

  const hasDraft = (weekday) => {
    if (drafts[weekday] === undefined) return false;
    return drafts[weekday] !== (plan[weekday]?.time || '06:00');
  };

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
        <Clock className="size-3" /> Activity times
      </p>
      {availableDays.map((d) => {
        const act = plan[d];
        if (!act) return null;
        const current = plan[d]?.time || '06:00';
        const display = drafts[d] ?? current;
        const dirty = hasDraft(d);
        const justSaved = savedDay === d;

        return (
          <div key={d} className="flex items-center gap-2 text-sm">
            <span className="text-[var(--text-secondary)] shrink-0 w-20 text-xs">{WEEKDAY_FULL[d]}</span>
            <span className="text-[10px] text-[var(--text-muted)] truncate flex-1 min-w-0">{act.label}</span>
            <input
              type="time"
              value={display}
              onChange={(e) => handleDraft(d, e.target.value)}
              className="rounded-md border px-1.5 py-0.5 text-xs bg-[var(--bg-primary)] border-[var(--border-subtle)] w-[7rem]"
            />
            {dirty && (
              <Button
                size="sm"
                className="rounded-full h-7 text-[10px] px-2.5 shrink-0"
                style={{ background: accentColor, color: '#0a0a0a' }}
                onClick={() => handleSave(d)}
              >
                Save time
              </Button>
            )}
            {justSaved && !dirty && (
              <span className="flex items-center gap-0.5 text-[10px] font-medium shrink-0" style={{ color: accentColor }}>
                <Check className="size-3" /> Time updated
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
