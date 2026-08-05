import { useEffect, useMemo, useState } from 'react';
import { Target, Edit3, Clock, Dumbbell, Leaf, Sparkles, ChevronRight, RotateCcw, Minus } from 'lucide-react';
import {
  getJourneySetup,
  getStructuredGoalsFromSetup,
  resetJourneyGoalsToDefault,
} from '../../utils/journeySetup.js';
import { getDisplayWeeklyPlan } from '../../utils/journeyWeeklyPlan.js';
import { resolveJourneyAIContext } from '../../utils/journeyAIContext.js';
import { Button } from '../ui/button';
import { ResetGoalsConfirmDialog } from './ResetGoalsConfirmDialog.jsx';
import { cn } from '../../lib/utils';

const WEEK_DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatTime12h(time) {
  if (!time) return null;
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function activityMeta(type, category) {
  if (type === 'recovery' || type === 'rest') {
    const label = category === 'fitness' ? 'Recovery' : category === 'faith' ? 'Prayer' : 'Rest';
    return { icon: Leaf, short: label, tone: 'rest' };
  }
  if (type === 'off') {
    return { icon: Minus, short: 'Off', tone: 'off' };
  }
  if (type === 'learning') {
    const label =
      category === 'reading' ? 'Reading' : category === 'faith' ? 'Devotional' : 'Learning';
    return { icon: Sparkles, short: label, tone: 'work' };
  }
  if (type === 'custom') {
    return { icon: Sparkles, short: 'Session', tone: 'work' };
  }
  return { icon: Dumbbell, short: 'Workout', tone: 'work' };
}

function buildWeekDisplay(weeklyPlan, category) {
  return WEEK_DISPLAY_ORDER.map((weekday) => {
    const act = weeklyPlan[weekday];
    if (act) {
      return {
        weekday,
        label: act.label,
        time: act.time,
        ...activityMeta(act.type, category),
        isToday: weekday === new Date().getDay(),
      };
    }
    return {
      weekday,
      label: 'Off',
      time: null,
      ...activityMeta('off', category),
      isToday: weekday === new Date().getDay(),
    };
  });
}

/**
 * Compact goals + full-week rhythm overview card.
 */
export function JourneyGoalsSection({ journeyId, accentColor = '#6ee7b7', accentRgb = '110,231,183', onEdit }) {
  const [, setTick] = useState(0);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => {
    const refresh = () => setTick((t) => t + 1);
    window.addEventListener('journey-setup-updated', refresh);
    window.addEventListener('journey-weekly-plan-updated', refresh);
    return () => {
      window.removeEventListener('journey-setup-updated', refresh);
      window.removeEventListener('journey-weekly-plan-updated', refresh);
    };
  }, [journeyId]);

  useEffect(() => {
    if (!resetDone) return;
    const t = window.setTimeout(() => setResetDone(false), 2500);
    return () => clearTimeout(t);
  }, [resetDone]);

  const profile = getJourneySetup(journeyId);
  const { focus, highlights, motivation } = getStructuredGoalsFromSetup(profile);
  const weeklyPlan = getDisplayWeeklyPlan(journeyId);
  const aiContext = resolveJourneyAIContext(journeyId);

  const weekDays = useMemo(
    () => buildWeekDisplay(weeklyPlan, aiContext.category),
    [weeklyPlan, aiContext.category]
  );

  const activeCount = weekDays.filter((d) => d.tone === 'work').length;
  const recoveryCount = weekDays.filter((d) => d.tone === 'rest').length;
  const hasGoals = focus.length > 0 || highlights.length > 0;

  const handleResetGoals = () => {
    resetJourneyGoalsToDefault(journeyId);
    setResetOpen(false);
    setResetDone(true);
    setTick((t) => t + 1);
  };

  if (!hasGoals && activeCount === 0 && recoveryCount === 0 && !onEdit) return null;

  return (
    <>
      <ResetGoalsConfirmDialog
        open={resetOpen}
        onConfirm={handleResetGoals}
        onCancel={() => setResetOpen(false)}
        accentColor={accentColor}
        journeyTitle={aiContext.journeyTitle}
      />
      <section
        className="rounded-xl border overflow-hidden"
        style={{
          background: `linear-gradient(160deg, rgba(${accentRgb},0.06) 0%, var(--bg-card) 50%)`,
          borderColor: `rgba(${accentRgb},0.15)`,
        }}
      >
        <div className="px-4 py-3 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="flex size-7 items-center justify-center rounded-md shrink-0"
                style={{ background: `rgba(${accentRgb},0.12)`, color: accentColor }}
              >
                <Target className="size-3.5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-base font-bold text-[var(--text-primary)] leading-tight">Goals</h2>
                <p className="text-[10px] text-[var(--text-muted)] truncate">What you&apos;re building toward</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {resetDone && (
                <span className="text-[10px] font-medium mr-1" style={{ color: accentColor }}>
                  Goals restored
                </span>
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-[10px] h-7 px-2"
                  onClick={() => setResetOpen(true)}
                  title="Reset to template default goals"
                >
                  <RotateCcw className="size-3 mr-0.5" /> Reset
                </Button>
              )}
              {onEdit && (
                <Button variant="ghost" size="sm" className="rounded-full text-[10px] h-7 px-2" onClick={onEdit}>
                  <Edit3 className="size-3 mr-0.5" /> Edit
                </Button>
              )}
            </div>
          </div>

          {hasGoals ? (
            <div className="space-y-2">
              {focus.length > 0 && (
                <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
                  {focus.join(' · ')}
                </p>
              )}
              {highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {highlights.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] text-[var(--text-secondary)]"
                      style={{
                        borderColor: `rgba(${accentRgb},0.2)`,
                        background: `rgba(${accentRgb},0.06)`,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
              {motivation && (
                <p
                  className="text-[11px] italic text-[var(--text-muted)] border-l-2 pl-2 leading-snug"
                  style={{ borderColor: accentColor }}
                >
                  &ldquo;{motivation}&rdquo;
                </p>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onEdit}
              disabled={!onEdit}
              className={cn(
                'w-full text-left rounded-lg border border-dashed px-3 py-2.5 transition-colors',
                onEdit && 'hover:border-[var(--border-muted)] hover:bg-[var(--surface-hover)]/30 cursor-pointer group'
              )}
              style={{ borderColor: `rgba(${accentRgb},0.22)` }}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-[var(--text-secondary)]">
                  Set what success looks like — quick-select options in setup.
                </p>
                {onEdit && (
                  <span
                    className="flex items-center gap-0.5 text-[10px] font-semibold shrink-0"
                    style={{ color: accentColor }}
                  >
                    Edit goals
                    <ChevronRight className="size-3" />
                  </span>
                )}
              </div>
            </button>
          )}
        </div>

        <div
          className="px-3 sm:px-4 py-2.5 border-t"
          style={{ borderColor: `rgba(${accentRgb},0.1)`, background: `rgba(${accentRgb},0.02)` }}
        >
          <div className="flex items-center justify-between gap-2 mb-2 px-0.5">
            <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              Weekly rhythm
            </p>
            <span className="text-[9px] text-[var(--text-muted)]">
              {activeCount} active · {recoveryCount} recovery
            </span>
          </div>

          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {weekDays.map((day) => {
              const Icon = day.icon;
              const timeLabel = formatTime12h(day.time);
              const isWork = day.tone === 'work';
              const isRest = day.tone === 'rest';
              const isOff = day.tone === 'off';

              return (
                <div
                  key={day.weekday}
                  className={cn(
                    'flex flex-col items-center rounded-lg px-0.5 py-1.5 text-center min-w-0',
                    day.isToday && 'ring-1',
                    isOff && 'opacity-40'
                  )}
                  style={
                    day.isToday
                      ? { background: `rgba(${accentRgb},0.1)`, ringColor: `rgba(${accentRgb},0.35)` }
                      : isRest
                        ? { background: 'rgba(148,163,184,0.06)' }
                        : { background: 'var(--bg-primary)/30' }
                  }
                >
                  <span
                    className={cn(
                      'text-[9px] font-bold uppercase',
                      day.isToday ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
                    )}
                  >
                    {DAY_LABELS[day.weekday]}
                  </span>
                  {day.isToday && (
                    <span className="text-[7px] font-bold uppercase leading-none" style={{ color: accentColor }}>
                      Today
                    </span>
                  )}
                  <div
                    className="flex size-6 items-center justify-center rounded-md my-0.5"
                    style={{
                      background: isWork
                        ? `rgba(${accentRgb},0.15)`
                        : isRest
                          ? 'rgba(148,163,184,0.12)'
                          : 'transparent',
                      color: isWork ? accentColor : isRest ? 'var(--text-muted)' : 'var(--text-muted)',
                    }}
                  >
                    <Icon className="size-3" />
                  </div>
                  <span
                    className={cn(
                      'text-[8px] font-medium leading-tight line-clamp-1 w-full',
                      isOff ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                    )}
                  >
                    {isOff ? '—' : day.label || day.short}
                  </span>
                    {timeLabel && !isOff && (
                      <span className="flex items-center gap-0.5 text-[7px] text-[var(--text-muted)]">
                        <Clock className="size-2 shrink-0" />
                        <span className="truncate">{timeLabel}</span>
                      </span>
                    )}
                    {!timeLabel && isRest && !isOff && (
                      <span className="text-[7px] text-[var(--text-muted)]">Flexible</span>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
