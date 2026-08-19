import { useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getContentTemplateId } from '../../utils/journeyRegistry.js';
import {
  getDefaultCustomPlanDraft,
  SE_DISCIPLINES,
  WEEKDAY_FULL,
} from '../../utils/journeyCustomPlan.js';
import { EXERCISE_CATALOG, WORKOUT_LEVELS } from '../../data/journeys/bodyWorkoutPlan.js';
import { getWeeklyPlan } from '../../utils/journeyWeeklyPlan.js';

const ACTIVITY_TYPES = [
  { id: 'workout', label: 'Workout' },
  { id: 'learning', label: 'Learning' },
  { id: 'custom', label: 'Session' },
  { id: 'recovery', label: 'Rest' },
];

export function CustomContentEditor({
  journeyId,
  draft,
  onChange,
  accentColor = 'var(--neon-green)',
}) {
  const templateId = getContentTemplateId(journeyId);
  const plan = draft || getDefaultCustomPlanDraft(journeyId);

  const patch = (partial) => onChange({ ...plan, ...partial });

  return (
    <div className="space-y-4">
      {templateId === 'reading' && (
        <ReadingQueueEditor
          queue={plan.readingQueue || []}
          onChange={(readingQueue) => patch({ readingQueue })}
          accentColor={accentColor}
        />
      )}
      {templateId === 'body-transformation' && (
        <WorkoutWeekEditor
          workoutPlan={plan.workoutPlan || { level: 'starter', days: {} }}
          onChange={(workoutPlan) => patch({ workoutPlan })}
          accentColor={accentColor}
        />
      )}
      {templateId === 'writers' && (
        <WritersDaysEditor
          days={plan.writersDays || {}}
          onChange={(writersDays) => patch({ writersDays })}
        />
      )}
      {templateId === 'dual-brand' && (
        <BrandDaysEditor
          days={plan.brandDays || {}}
          onChange={(brandDays) => patch({ brandDays })}
        />
      )}
      {templateId === 'software-engineering' && (
        <SeDaysEditor
          days={plan.seDays || {}}
          onChange={(seDays) => patch({ seDays })}
          accentColor={accentColor}
        />
      )}
      {templateId === 'custom-scratch' && (
        <GenericDaysEditor
          days={plan.genericDays || {}}
          onChange={(genericDays) => patch({ genericDays })}
        />
      )}
    </div>
  );
}

export function WeeklyPlanEditor({
  journeyId,
  weeklyPlan,
  availableDays = [0, 1, 2, 3, 4, 5, 6],
  onChange,
}) {
  const plan = weeklyPlan || getWeeklyPlan(journeyId);

  const setDay = (d, patch) => {
    onChange({
      ...plan,
      [d]: { ...(plan[d] || { type: 'custom', label: 'Session', time: '09:00' }), ...patch },
    });
  };

  return (
    <div className="space-y-2">
      {availableDays.map((d) => {
        const act = plan[d] || { type: 'custom', label: 'Session', time: '09:00' };
        return (
          <div
            key={d}
            className="rounded-xl border p-3 space-y-2"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
          >
            <p className="text-xs font-bold text-[var(--text-primary)]">{WEEKDAY_FULL[d]}</p>
            <div className="flex flex-wrap gap-2">
              {ACTIVITY_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setDay(d, { type: t.id, label: t.id === 'recovery' ? 'Rest' : act.label })}
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border',
                    act.type === t.id
                      ? 'border-[var(--neon-green)] text-[var(--neon-green)]'
                      : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={act.label || ''}
                onChange={(e) => setDay(d, { label: e.target.value })}
                className="flex-1 rounded-lg border px-2 py-1.5 text-xs bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-primary)]"
                placeholder="Label"
              />
              <input
                type="time"
                value={act.time || '09:00'}
                onChange={(e) => setDay(d, { time: e.target.value })}
                className="w-[7rem] rounded-lg border px-2 py-1.5 text-xs bg-[var(--bg-primary)] border-[var(--border-subtle)]"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReadingQueueEditor({ queue, onChange, accentColor }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const move = (i, dir) => {
    const next = [...queue];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next.map((b, idx) => ({ ...b, queueOrder: idx + 1 })));
  };

  const remove = (i) => {
    onChange(queue.filter((_, idx) => idx !== i).map((b, idx) => ({ ...b, queueOrder: idx + 1 })));
  };

  const add = () => {
    if (!title.trim()) return;
    onChange([
      ...queue,
      { title: title.trim(), author: author.trim(), url: '', purpose: '', queueOrder: queue.length + 1 },
    ]);
    setTitle('');
    setAuthor('');
  };

  const coreCount = Math.min(6, queue.length);

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--text-secondary)]">
        First {coreCount} books cover the 6-month core (need at least 6). Extra titles are stretch.
      </p>
      <ul className="space-y-1.5">
        {queue.map((book, i) => (
          <li
            key={`${book.title}-${i}`}
            className="flex items-center gap-2 rounded-lg border px-2.5 py-2"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
          >
            <span className="text-[10px] font-bold tabular-nums w-10" style={{ color: accentColor }}>
              {i < 6 ? `M${i + 1}` : 'S'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{book.title}</p>
              {book.author && <p className="text-[10px] text-[var(--text-muted)] truncate">{book.author}</p>}
            </div>
            <button type="button" onClick={() => move(i, -1)} className="p-1 text-[var(--text-muted)]" aria-label="Move up">
              <ArrowUp className="size-3.5" />
            </button>
            <button type="button" onClick={() => move(i, 1)} className="p-1 text-[var(--text-muted)]" aria-label="Move down">
              <ArrowDown className="size-3.5" />
            </button>
            <button type="button" onClick={() => remove(i)} className="p-1 text-red-400" aria-label="Remove">
              <Trash2 className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>
      {queue.length < 6 && (
        <p className="text-[11px] text-amber-400">Add at least {6 - queue.length} more book(s) for a 6-month core.</p>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Book title"
          className="flex-1 rounded-lg border px-3 py-2 text-sm bg-[var(--bg-primary)] border-[var(--border-subtle)]"
        />
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author"
          className="sm:w-40 rounded-lg border px-3 py-2 text-sm bg-[var(--bg-primary)] border-[var(--border-subtle)]"
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-black"
          style={{ background: accentColor }}
        >
          <Plus className="size-3.5" /> Add
        </button>
      </div>
    </div>
  );
}

function WorkoutWeekEditor({ workoutPlan, onChange, accentColor }) {
  const days = workoutPlan.days || {};
  const level = workoutPlan.level || 'starter';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {WORKOUT_LEVELS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => onChange({ ...workoutPlan, level: l.id })}
            className={cn(
              'text-xs font-bold px-3 py-1.5 rounded-full border',
              level === l.id
                ? 'border-[var(--neon-green)] text-[var(--neon-green)]'
                : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
            )}
          >
            {l.label}
          </button>
        ))}
      </div>
      {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
        const day = days[String(idx)] || { isRest: true, focus: 'Rest', exercises: [], rounds: 0 };
        return (
          <div
            key={idx}
            className="rounded-xl border p-3 space-y-2"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
              </p>
              <label className="text-[10px] flex items-center gap-1.5 text-[var(--text-muted)]">
                <input
                  type="checkbox"
                  checked={Boolean(day.isRest)}
                  onChange={(e) =>
                    onChange({
                      ...workoutPlan,
                      days: {
                        ...days,
                        [String(idx)]: { ...day, isRest: e.target.checked, exercises: e.target.checked ? [] : day.exercises },
                      },
                    })
                  }
                />
                Rest
              </label>
            </div>
            {!day.isRest && (
              <>
                <input
                  value={day.focus || ''}
                  onChange={(e) =>
                    onChange({
                      ...workoutPlan,
                      days: { ...days, [String(idx)]: { ...day, focus: e.target.value, name: e.target.value } },
                    })
                  }
                  className="w-full rounded-lg border px-2 py-1.5 text-xs bg-[var(--bg-primary)] border-[var(--border-subtle)]"
                  placeholder="Focus"
                />
                <p className="text-[10px] text-[var(--text-muted)]">
                  {(day.exercises || []).map((ex) => ex.label).join(' · ') || 'No exercises yet'}
                </p>
                <select
                  className="w-full rounded-lg border px-2 py-1.5 text-xs bg-[var(--bg-primary)] border-[var(--border-subtle)]"
                  defaultValue=""
                  onChange={(e) => {
                    const item = EXERCISE_CATALOG.find((c) => c.guideKey === e.target.value);
                    if (!item) return;
                    const exercises = [
                      ...(day.exercises || []),
                      {
                        id: `ex-${Date.now()}`,
                        guideKey: item.guideKey,
                        label: item.label,
                        reps: item.defaultReps,
                        durationSec: item.defaultDurationSec,
                        eachSide: item.eachSide,
                      },
                    ];
                    onChange({
                      ...workoutPlan,
                      days: { ...days, [String(idx)]: { ...day, exercises, isRest: false } },
                    });
                    e.target.value = '';
                  }}
                >
                  <option value="">Add exercise…</option>
                  {EXERCISE_CATALOG.map((c) => (
                    <option key={c.guideKey} value={c.guideKey}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function WritersDaysEditor({ days, onChange }) {
  return (
    <div className="space-y-2">
      {WEEKDAY_FULL.map((name, d) => {
        const row = days[String(d)] || { rest: false, theme: '', execution: '' };
        return (
          <div
            key={d}
            className="rounded-xl border p-3 space-y-2"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold">{name}</p>
              <label className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={Boolean(row.rest)}
                  onChange={(e) => onChange({ ...days, [String(d)]: { ...row, rest: e.target.checked } })}
                />
                Rest
              </label>
            </div>
            {!row.rest && (
              <>
                <input
                  value={row.theme || ''}
                  onChange={(e) => onChange({ ...days, [String(d)]: { ...row, theme: e.target.value } })}
                  placeholder="Theme / learning"
                  className="w-full rounded-lg border px-2 py-1.5 text-xs bg-[var(--bg-primary)] border-[var(--border-subtle)]"
                />
                <input
                  value={row.execution || ''}
                  onChange={(e) => onChange({ ...days, [String(d)]: { ...row, execution: e.target.value } })}
                  placeholder="Execution task"
                  className="w-full rounded-lg border px-2 py-1.5 text-xs bg-[var(--bg-primary)] border-[var(--border-subtle)]"
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function BrandDaysEditor({ days, onChange }) {
  return (
    <div className="space-y-2">
      {WEEKDAY_FULL.map((name, d) => {
        const row = days[String(d)] || { rest: false, personal: '', company: '' };
        return (
          <div
            key={d}
            className="rounded-xl border p-3 space-y-2"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold">{name}</p>
              <label className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={Boolean(row.rest)}
                  onChange={(e) => onChange({ ...days, [String(d)]: { ...row, rest: e.target.checked } })}
                />
                Rest
              </label>
            </div>
            {!row.rest && (
              <>
                <input
                  value={row.personal || ''}
                  onChange={(e) => onChange({ ...days, [String(d)]: { ...row, personal: e.target.value } })}
                  placeholder="Personal brand"
                  className="w-full rounded-lg border px-2 py-1.5 text-xs bg-[var(--bg-primary)] border-[var(--border-subtle)]"
                />
                <input
                  value={row.company || ''}
                  onChange={(e) => onChange({ ...days, [String(d)]: { ...row, company: e.target.value } })}
                  placeholder="Company brand"
                  className="w-full rounded-lg border px-2 py-1.5 text-xs bg-[var(--bg-primary)] border-[var(--border-subtle)]"
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SeDaysEditor({ days, onChange, accentColor }) {
  return (
    <div className="space-y-2">
      {WEEKDAY_FULL.map((name, d) => {
        const row = days[String(d)] || { rest: false, disciplines: [...SE_DISCIPLINES], time: '04:00' };
        return (
          <div
            key={d}
            className="rounded-xl border p-3 space-y-2"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold">{name}</p>
              <label className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={Boolean(row.rest)}
                  onChange={(e) =>
                    onChange({
                      ...days,
                      [String(d)]: { ...row, rest: e.target.checked, disciplines: e.target.checked ? [] : row.disciplines },
                    })
                  }
                />
                Rest
              </label>
            </div>
            {!row.rest && (
              <>
                <div className="flex flex-wrap gap-1.5">
                  {SE_DISCIPLINES.map((disc) => {
                    const on = (row.disciplines || []).includes(disc);
                    return (
                      <button
                        key={disc}
                        type="button"
                        onClick={() => {
                          const next = on
                            ? (row.disciplines || []).filter((x) => x !== disc)
                            : [...(row.disciplines || []), disc];
                          onChange({ ...days, [String(d)]: { ...row, disciplines: next } });
                        }}
                        className={cn(
                          'text-[10px] font-bold px-2 py-1 rounded-full border',
                          on ? 'border-[var(--neon-green)] text-[var(--neon-green)]' : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                        )}
                      >
                        {disc}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="time"
                  value={row.time || '04:00'}
                  onChange={(e) => onChange({ ...days, [String(d)]: { ...row, time: e.target.value } })}
                  className="rounded-lg border px-2 py-1.5 text-xs bg-[var(--bg-primary)] border-[var(--border-subtle)]"
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function GenericDaysEditor({ days, onChange }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-[var(--text-primary)]">What you do each day</p>
      <p className="text-[11px] text-[var(--text-muted)]">One simple task per weekday. Rest days skip the session.</p>
      {WEEKDAY_FULL.map((name, d) => {
        const row = days[String(d)] || { rest: false, task: '' };
        return (
          <div
            key={d}
            className="rounded-xl border p-3 space-y-2"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold">{name}</p>
              <label className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={Boolean(row.rest)}
                  onChange={(e) => onChange({ ...days, [String(d)]: { ...row, rest: e.target.checked } })}
                />
                Rest
              </label>
            </div>
            {!row.rest && (
              <input
                value={row.task || ''}
                onChange={(e) => onChange({ ...days, [String(d)]: { ...row, task: e.target.value } })}
                placeholder="What should you do this day?"
                className="w-full rounded-lg border px-2 py-1.5 text-xs bg-[var(--bg-primary)] border-[var(--border-subtle)]"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function DefaultPlanPreview({ items = [], blurb, accentColor = 'var(--neon-green)' }) {
  return (
    <div
      className="rounded-xl border p-4 space-y-3"
      style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
    >
      {blurb && <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{blurb}</p>}
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm text-[var(--text-primary)] flex gap-2">
            <span style={{ color: accentColor }}>•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
