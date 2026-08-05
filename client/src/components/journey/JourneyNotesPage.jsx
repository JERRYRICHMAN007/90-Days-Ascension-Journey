import { useState, useEffect, useMemo } from 'react';
import { BookOpen, ChevronDown, Smile } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  getDayNote,
  saveDayNote,
  getJourneyNoteDays,
  ensureDayNote,
} from '../../utils/journeyDailyNotes.js';
import { getCurrentDayNumber, isJourneyStarted } from '../../utils/journeyPlanning.js';

const MOODS = ['😊', '😐', '😔', '🔥', '💪', '🙏', '✨'];

export function JourneyNotesPage({ journeyId }) {
  const started = isJourneyStarted(journeyId);
  const currentDay = started ? getCurrentDayNumber(journeyId) : 1;
  const [selectedDay, setSelectedDay] = useState(currentDay || 1);
  const [note, setNote] = useState(() => getDayNote(journeyId, selectedDay));
  const [savedDays, setSavedDays] = useState(() => getJourneyNoteDays(journeyId));

  useEffect(() => {
    ensureDayNote(journeyId, selectedDay);
    setNote(getDayNote(journeyId, selectedDay));
  }, [journeyId, selectedDay]);

  useEffect(() => {
    const refresh = () => setSavedDays(getJourneyNoteDays(journeyId));
    window.addEventListener('journey-notes-updated', refresh);
    return () => window.removeEventListener('journey-notes-updated', refresh);
  }, [journeyId]);

  const dayOptions = useMemo(() => {
    const max = Math.max(currentDay || 1, ...savedDays, 1);
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [currentDay, savedDays]);

  const patch = (field, value) => {
    const next = saveDayNote(journeyId, selectedDay, { [field]: value });
    setNote(next);
    setSavedDays(getJourneyNoteDays(journeyId));
  };

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-sm text-[var(--text-secondary)]">
        Your daily journal unlocks after you start this journey.
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5 h-full flex flex-col">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <BookOpen className="size-5" /> Daily Journal
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Each day has its own reflection space.</p>
        </div>
        <div className="relative">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(Number(e.target.value))}
            className="appearance-none rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] pl-4 pr-9 py-2 text-sm font-medium text-[var(--text-primary)]"
          >
            {dayOptions.map((d) => (
              <option key={d} value={d}>
                Day {d}{d === currentDay ? ' (Today)' : ''}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[var(--text-muted)] pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
          <Smile className="size-3.5" /> Mood
        </span>
        {MOODS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => patch('mood', m)}
            className={cn(
              'size-9 rounded-full border text-lg transition-transform hover:scale-105',
              note.mood === m ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/10' : 'border-[var(--border-subtle)]'
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <JournalField label="Notes" value={note.notes} onChange={(v) => patch('notes', v)} placeholder="What happened today?" />
      <JournalField label="Reflection" value={note.reflection} onChange={(v) => patch('reflection', v)} placeholder="How did today feel?" />
      <JournalField label="Lessons learned" value={note.lessons} onChange={(v) => patch('lessons', v)} placeholder="What will you carry forward?" />

      {note.updatedAt && (
        <p className="text-[10px] text-[var(--text-muted)]">
          Last saved {new Date(note.updatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}

function JournalField({ label, value, onChange, placeholder }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
      />
    </label>
  );
}
