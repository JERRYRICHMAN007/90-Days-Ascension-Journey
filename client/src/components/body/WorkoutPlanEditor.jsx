import { useEffect, useState } from 'react';
import { Plus, Trash2, RotateCcw, X, GripVertical } from 'lucide-react';
import { EXERCISE_CATALOG, getDayName, WORKOUT_LEVELS } from '../../data/journeys/bodyWorkoutPlan';
import {
  clearDayOverride,
  createExerciseFromCatalog,
  getEditableDayDraft,
  getWorkoutPlanState,
  saveDayOverride,
  setLevelOverride,
} from '../../utils/workoutPlan';

const BODY_ACCENT = '#00ff87';

function emptyExercise() {
  return createExerciseFromCatalog(EXERCISE_CATALOG[3]); // push-ups default
}

export function WorkoutPlanEditor({
  journeyId = 'body-transformation',
  dayIndex = 0,
  weekNum = 1,
  onClose,
  onSaved,
}) {
  const [editDay, setEditDay] = useState(dayIndex);
  const [draft, setDraft] = useState(() => getEditableDayDraft(journeyId, dayIndex, weekNum));
  const [levelOverride, setLevelOverrideLocal] = useState(
    () => getWorkoutPlanState(journeyId).levelOverride || ''
  );

  useEffect(() => {
    setDraft(getEditableDayDraft(journeyId, editDay, weekNum));
  }, [journeyId, editDay, weekNum]);

  const updateExercise = (idx, patch) => {
    setDraft((prev) => {
      const exercises = prev.exercises.map((ex, i) => (i === idx ? { ...ex, ...patch } : ex));
      return { ...prev, exercises, isRest: false };
    });
  };

  const removeExercise = (idx) => {
    setDraft((prev) => {
      const exercises = prev.exercises.filter((_, i) => i !== idx);
      return {
        ...prev,
        exercises,
        isRest: exercises.length === 0,
        rounds: exercises.length === 0 ? 0 : prev.rounds || 1,
      };
    });
  };

  const addExercise = (catalogItem) => {
    const ex = catalogItem ? createExerciseFromCatalog(catalogItem) : emptyExercise();
    setDraft((prev) => ({
      ...prev,
      isRest: false,
      rounds: prev.rounds > 0 ? prev.rounds : 1,
      exercises: [...prev.exercises, ex],
    }));
  };

  const markRest = () => {
    setDraft((prev) => ({
      ...prev,
      isRest: true,
      rounds: 0,
      exercises: [],
      focus: 'Rest & Recovery',
      name: `${getDayName(editDay)} — Rest Day`,
    }));
  };

  const handleSave = () => {
    saveDayOverride(journeyId, editDay, {
      ...draft,
      lockedAtLevel: true, // keep user's exact numbers; progression won't re-scale this day
    });
    onSaved?.();
    onClose?.();
  };

  const handleResetDay = () => {
    clearDayOverride(journeyId, editDay);
    setDraft(getEditableDayDraft(journeyId, editDay, weekNum));
    onSaved?.();
  };

  const handleLevelChange = (value) => {
    setLevelOverrideLocal(value);
    setLevelOverride(journeyId, value || null);
    onSaved?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Edit workout plan"
    >
      <div
        className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border shadow-xl"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 border-b"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <div>
            <p className="aether-label" style={{ color: BODY_ACCENT }}>
              Customize workout
            </p>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              {getDayName(editDay)} plan
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--bg-elevated)]"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Day picker */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {[0, 1, 2, 3, 4, 5, 6].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setEditDay(d)}
                className="shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide border"
                style={{
                  borderColor: editDay === d ? BODY_ACCENT : 'var(--border-subtle)',
                  background: editDay === d ? 'rgba(0,255,135,0.12)' : 'var(--bg-elevated)',
                  color: editDay === d ? BODY_ACCENT : 'var(--text-secondary)',
                }}
              >
                {getDayName(d).slice(0, 3)}
              </button>
            ))}
          </div>

          {/* Progression level */}
          <div
            className="rounded-xl border p-3 space-y-2"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
          >
            <p className="text-xs font-semibold text-[var(--text-primary)]">
              Progression level
            </p>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Auto-advances with your journey (weeks 1–8 Starter, 9–16 Intermediate, 17+ Professional).
              Override only if you want to force a level.
            </p>
            <select
              value={levelOverride}
              onChange={(e) => handleLevelChange(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm bg-[var(--bg-card)] text-[var(--text-primary)]"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <option value="">Auto (from journey progress)</option>
              {WORKOUT_LEVELS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-1 gap-3">
            <label className="block space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">
                Focus / name
              </span>
              <input
                value={draft.name || ''}
                onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value, focus: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                style={{ borderColor: 'var(--border-subtle)' }}
              />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-[var(--text-primary)]">
                <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">
                  Rounds
                </span>
                <input
                  type="number"
                  min={0}
                  max={10}
                  disabled={draft.isRest}
                  value={draft.rounds ?? 0}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, rounds: Math.max(0, Number(e.target.value) || 0) }))
                  }
                  className="w-16 rounded-lg border px-2 py-1.5 text-sm bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                  style={{ borderColor: 'var(--border-subtle)' }}
                />
              </label>
              <button
                type="button"
                onClick={markRest}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border"
                style={{
                  borderColor: draft.isRest ? BODY_ACCENT : 'var(--border-subtle)',
                  color: draft.isRest ? BODY_ACCENT : 'var(--text-secondary)',
                  background: draft.isRest ? 'rgba(0,255,135,0.1)' : 'transparent',
                }}
              >
                Mark as rest day
              </button>
            </div>
          </div>

          {/* Exercises */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">
              Exercises
            </p>
            {draft.isRest && draft.exercises.length === 0 && (
              <p className="text-sm text-[var(--text-secondary)] text-center py-4">
                Rest day — add an exercise below to turn this into a workout day.
              </p>
            )}
            {draft.exercises.map((ex, idx) => (
              <div
                key={ex.id || idx}
                className="rounded-xl border p-3 space-y-2"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
              >
                <div className="flex items-start gap-2">
                  <GripVertical className="w-4 h-4 mt-2 text-[var(--text-muted)] shrink-0" />
                  <div className="flex-1 space-y-2 min-w-0">
                    <input
                      value={ex.label || ''}
                      onChange={(e) => updateExercise(idx, { label: e.target.value })}
                      placeholder="Exercise name"
                      className="w-full rounded-lg border px-2.5 py-1.5 text-sm bg-[var(--bg-card)] text-[var(--text-primary)]"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    />
                    <div className="flex flex-wrap gap-2">
                      <label className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                        Reps
                        <input
                          type="number"
                          min={0}
                          value={ex.reps ?? ''}
                          onChange={(e) => {
                            const v = e.target.value === '' ? undefined : Number(e.target.value);
                            updateExercise(idx, {
                              reps: v,
                              durationSec: v != null ? undefined : ex.durationSec,
                            });
                          }}
                          className="w-14 rounded border px-1.5 py-1 bg-[var(--bg-card)] text-[var(--text-primary)]"
                          style={{ borderColor: 'var(--border-subtle)' }}
                        />
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                        Sec
                        <input
                          type="number"
                          min={0}
                          value={ex.durationSec ?? ''}
                          onChange={(e) => {
                            const v = e.target.value === '' ? undefined : Number(e.target.value);
                            updateExercise(idx, {
                              durationSec: v,
                              reps: v != null ? undefined : ex.reps,
                            });
                          }}
                          className="w-14 rounded border px-1.5 py-1 bg-[var(--bg-card)] text-[var(--text-primary)]"
                          style={{ borderColor: 'var(--border-subtle)' }}
                        />
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                        <input
                          type="checkbox"
                          checked={Boolean(ex.eachSide)}
                          onChange={(e) => updateExercise(idx, { eachSide: e.target.checked })}
                        />
                        Each side
                      </label>
                    </div>
                    <select
                      value={ex.guideKey || 'plankCenter'}
                      onChange={(e) => updateExercise(idx, { guideKey: e.target.value })}
                      className="w-full rounded-lg border px-2 py-1.5 text-xs bg-[var(--bg-card)] text-[var(--text-primary)]"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      {EXERCISE_CATALOG.map((c) => (
                        <option key={c.guideKey} value={c.guideKey}>
                          Form guide: {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExercise(idx)}
                    className="p-2 rounded-lg hover:bg-red-500/10"
                    aria-label="Remove exercise"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-2 pt-1">
              {EXERCISE_CATALOG.map((c) => (
                <button
                  key={c.guideKey}
                  type="button"
                  onClick={() => addExercise(c)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                >
                  <Plus className="w-3 h-3" />
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="sticky bottom-0 flex flex-wrap gap-2 px-4 py-3 border-t"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <button
            type="button"
            onClick={handleResetDay}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset day
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold border"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-sm font-bold text-black"
            style={{ background: BODY_ACCENT }}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
