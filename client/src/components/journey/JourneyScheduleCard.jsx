import { useState, useEffect } from 'react';
import { CalendarDays, Flag, Clock, RotateCcw, Play } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import {
  setJourneyPlannedStartDate,
  resetJourneySchedule,
  getJourneyTimeline,
  getDefaultPickerDate,
  getJourneyState,
  formatDisplayDate,
} from '../../utils/journeyPlanning.js';
import { addMonths, parseYmd, JOURNEY_DURATION_MONTHS, formatYmd } from '../../utils/dates.js';
import { JourneyDateRangePicker } from './JourneyDatePicker.jsx';
import { JourneyReviewModal } from './JourneyReviewModal.jsx';

/**
 * Balanced schedule card — Starts / Ends / Duration with explicit Start Journey CTA.
 */
export function JourneyScheduleCard({ journeyId, onSaved, onEditSetup, accentColor, accentRgb, className }) {
  const [timeline, setTimeline] = useState(() => getJourneyTimeline(journeyId));
  const [startDate, setStartDate] = useState(getDefaultPickerDate());
  const [resetConfirm, setResetConfirm] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const rgb = accentRgb || '110,231,183';
  const accent = accentColor || '#6ee7b7';
  const state = timeline.state || getJourneyState(journeyId);

  const refresh = () => setTimeline(getJourneyTimeline(journeyId));

  useEffect(() => {
    const onUpdate = (e) => {
      if (e.detail?.journeyId !== journeyId) return;
      refresh();
      if (e.detail?.reset) {
        setStartDate(getDefaultPickerDate());
        setResetConfirm(false);
      }
    };
    window.addEventListener('journey-start-updated', onUpdate);
    return () => window.removeEventListener('journey-start-updated', onUpdate);
  }, [journeyId]);

  const previewEndYmd = formatYmd(addMonths(parseYmd(startDate), JOURNEY_DURATION_MONTHS));
  const previewDays = timeline.configured
    ? timeline.totalDays
    : Math.round(
        (addMonths(parseYmd(startDate), JOURNEY_DURATION_MONTHS) - parseYmd(startDate)) /
          (1000 * 60 * 60 * 24)
      ) + 1;

  const handleStart = () => {
    if (!startDate) return;
    setJourneyPlannedStartDate(journeyId, startDate);
    refresh();
    setReviewOpen(true);
  };

  const handleConfirmedStart = () => {
    refresh();
    onSaved?.();
  };

  const handleReset = () => {
    resetJourneySchedule(journeyId);
    refresh();
    onSaved?.();
  };

  if (state === 'not_started') {
    return (
      <div
        className={cn('rounded-2xl border p-5 sm:p-6 space-y-5', className)}
        style={{
          background: `linear-gradient(160deg, rgba(${rgb},0.06) 0%, var(--bg-card) 100%)`,
          borderColor: `rgba(${rgb},0.2)`,
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-xl"
            style={{ background: `rgba(${rgb},0.15)`, color: accent }}
          >
            <CalendarDays className="size-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-[var(--text-primary)]">Journey Schedule</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
              This journey has not started yet. Pick a start date and press{' '}
              <strong className="text-[var(--text-primary)]">Start Journey</strong> when you&apos;re ready.
            </p>
          </div>
        </div>

        <JourneyDateRangePicker
          startYmd={startDate}
          onStartChange={setStartDate}
          endYmd={previewEndYmd}
          totalDays={previewDays}
          accentColor={accent}
          accentRgb={rgb}
        />

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleStart}
            className="rounded-full font-display text-xs uppercase tracking-wider font-bold text-[#0a0a0a]"
            style={{
              background: `linear-gradient(135deg, rgba(${rgb},0.72), rgba(${rgb},0.55))`,
              boxShadow: `0 4px 16px rgba(${rgb},0.22)`,
            }}
          >
            <Play className="size-3.5 mr-1.5 fill-current" />
            Start Journey
          </Button>
        </div>

        <JourneyReviewModal
          journeyId={journeyId}
          open={reviewOpen}
          startYmd={startDate}
          onClose={() => setReviewOpen(false)}
          onConfirm={handleConfirmedStart}
          onEdit={() => {
            setReviewOpen(false);
            onEditSetup?.();
          }}
          accentColor={accent}
          accentRgb={rgb}
          totalDays={previewDays}
        />
      </div>
    );
  }

  if (state === 'completed') {
    return (
      <div
        className={cn('rounded-2xl border p-5 sm:p-6', className)}
        style={{ borderColor: `rgba(${rgb},0.25)`, background: `rgba(${rgb},0.08)` }}
      >
        <p className="text-lg font-display font-bold text-[var(--text-primary)] mb-1">
          Journey Completed 🎉
        </p>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          {timeline.startLabel} → {timeline.endLabel} · {timeline.totalDays} days
        </p>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full text-xs border-rose-500/40 text-rose-300"
          onClick={() => setResetConfirm(true)}
        >
          Start a new arc
        </Button>
        {resetConfirm && (
          <div className="mt-3 flex gap-2">
            <Button size="sm" className="rounded-full bg-rose-500" onClick={handleReset}>
              Confirm reset
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setResetConfirm(false)}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Active
  return (
    <div
      className={cn('rounded-2xl border p-5 sm:p-6 space-y-4', className)}
      style={{
        background: 'var(--bg-card)',
        borderColor: `rgba(${rgb},0.18)`,
      }}
    >
      <h3 className="text-sm font-display font-bold text-[var(--text-primary)]">Journey Schedule</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ScheduleRow icon={CalendarDays} label="Starts" value={timeline.startLabel} accent={accent} />
        <ScheduleRow icon={Flag} label="Ends" value={timeline.endLabel} accent={accent} />
        <ScheduleRow icon={Clock} label="Duration" value={`${timeline.totalDays} days`} accent={accent} />
      </div>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        Your journey runs from <strong className="text-[var(--text-primary)]">{timeline.startLabel}</strong> to{' '}
        <strong className="text-[var(--text-primary)]">{timeline.endLabel}</strong>
        {timeline.currentDay != null && (
          <>
            {' '}
            · Day {timeline.currentDay} of {timeline.totalDays}
            {timeline.daysRemaining != null && ` · ${timeline.daysRemaining} days remaining`}
          </>
        )}
        .
      </p>
      <Button
        size="sm"
        variant="ghost"
        className="rounded-full text-xs text-rose-300 hover:text-rose-200"
        onClick={() => setResetConfirm(true)}
      >
        <RotateCcw className="size-3 mr-1" /> Reset journey
      </Button>
      {resetConfirm && (
        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25">
          <p className="text-xs text-rose-200 flex-1">
            Wipe all progress and restart from Day 1 on your next start date?
          </p>
          <Button size="sm" className="rounded-full bg-rose-500" onClick={handleReset}>
            Yes, reset
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setResetConfirm(false)}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

function ScheduleRow({ icon: Icon, label, value, accent }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: accent }}>
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="text-sm font-medium text-[var(--text-primary)] leading-snug">{value}</p>
    </div>
  );
}
