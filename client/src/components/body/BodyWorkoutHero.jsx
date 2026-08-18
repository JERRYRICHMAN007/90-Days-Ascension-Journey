import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Repeat, Play, Pencil, TrendingUp } from 'lucide-react';
import { MuscleMapPanel } from './MuscleMapPanel';
import { BodyTomorrowPreview } from './BodyTomorrowPreview';
import { WorkoutPlanEditor } from './WorkoutPlanEditor';
import { WorkoutCircuitCards } from '../journey/WorkoutCircuitCards';
import { SessionCompletionButton } from '../SessionCompletionButton';
import { isTomorrow } from '../../utils/dates';
import {
  dayNameToBodyDayIndex,
  resolveBodyWorkout,
} from '../../utils/workoutPlan';

const BODY_ACCENT = '#00ff87';
const BODY_GLOW = 'var(--neon-glow-green)';

export function BodyWorkoutHero({
  focus,
  workout: _workoutProp,
  workoutLink,
  nutrition,
  mindset,
  journeyId = 'body-transformation',
  dayNumber,
  weekNum = 1,
  dayName,
  dayIndex: dayIndexProp,
  focusLabel = "Today's Focus",
  dailyLearning = null,
  nextDay = null,
  onPreviewDay = null,
}) {
  const [activeGuideKey, setActiveGuideKey] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [planVersion, setPlanVersion] = useState(0);

  const dayIndex = useMemo(() => {
    if (typeof dayIndexProp === 'number') return dayIndexProp;
    if (dayName) return dayNameToBodyDayIndex(dayName);
    return 0;
  }, [dayIndexProp, dayName]);

  const refreshPlan = useCallback(() => {
    setPlanVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    const onUpdate = () => refreshPlan();
    window.addEventListener('workout-plan-updated', onUpdate);
    window.addEventListener('journey-setup-updated', onUpdate);
    return () => {
      window.removeEventListener('workout-plan-updated', onUpdate);
      window.removeEventListener('journey-setup-updated', onUpdate);
    };
  }, [refreshPlan]);

  const workout = useMemo(() => {
    return resolveBodyWorkout({
      journeyId,
      weekNum,
      dayIndex,
    });
    // planVersion forces re-resolve after edits
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journeyId, weekNum, dayIndex, planVersion]);

  const resolvedLink = workout?.link || workoutLink || null;
  const displayFocus = workout?.focus || focus;
  const hasCircuit = workout?.exercises?.length > 0;
  const previewingTomorrow = isTomorrow(dayNumber);
  const showTomorrowPreview =
    nextDay && !previewingTomorrow && isTomorrow(nextDay.dayNumber);

  const nextDayResolved = useMemo(() => {
    if (!nextDay) return null;
    const nextIndex =
      typeof nextDay.dayIndex === 'number'
        ? nextDay.dayIndex
        : dayNameToBodyDayIndex(nextDay.dayName);
    const nextWeek = nextDay.weekNumber || weekNum;
    const nextWorkout = resolveBodyWorkout({
      journeyId,
      weekNum: nextWeek,
      dayIndex: nextIndex,
    });
    return {
      ...nextDay,
      focus: nextWorkout.focus || nextDay.focus,
      workout: nextWorkout,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextDay, journeyId, weekNum, planVersion]);

  return (
    <div className="space-y-4 min-w-0">
      <div
        className="rounded-[12px] border overflow-hidden min-w-0"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: BODY_ACCENT, boxShadow: BODY_GLOW }}
              />
              <p className="aether-label">{focusLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => setEditorOpen(true)}
              className="inline-flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[1.2px] border transition-colors hover:border-[var(--neon-green)]"
              style={{
                color: 'var(--text-secondary)',
                borderColor: 'var(--border-subtle)',
                background: 'var(--bg-elevated)',
              }}
            >
              <Pencil className="w-3 h-3" />
              Edit plan
            </button>
          </div>
          <h2 className="text-2xl sm:text-[32px] font-extrabold text-[var(--text-primary)] tracking-[-0.64px] leading-tight">
            {displayFocus}
          </h2>
          {dailyLearning?.description && (
            <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
              {dailyLearning.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[1.2px]"
              style={{
                color: BODY_ACCENT,
                border: '1px solid rgba(0,255,135,0.35)',
                background: 'rgba(0,255,135,0.08)',
              }}
              title="Advances with journey progress: Starter → Intermediate → Professional"
            >
              <TrendingUp className="w-3 h-3" />
              {workout.levelLabel || 'Starter'}
            </span>
            {hasCircuit && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[1.2px]"
                style={{
                  color: BODY_ACCENT,
                  border: '1px solid rgba(0,255,135,0.35)',
                  background: 'rgba(0,255,135,0.08)',
                }}
              >
                <Repeat className="w-3 h-3" />
                {workout.rounds} rounds
              </span>
            )}
            {workout.isCustom && (
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[1.2px]"
                style={{
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-elevated)',
                }}
              >
                Customized
              </span>
            )}
            {resolvedLink && hasCircuit && (
              <a
                href={resolvedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[1.2px] border transition-colors hover:border-[var(--neon-green)]"
                style={{
                  color: 'var(--text-secondary)',
                  borderColor: 'var(--border-subtle)',
                  background: 'var(--bg-elevated)',
                }}
              >
                <Play className="w-3 h-3" />
                Guided video
              </a>
            )}
          </div>
        </div>

        {/* Circuit + muscle map */}
        <div className="p-5 sm:p-6">
          {hasCircuit ? (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(200px,240px)_1fr] gap-5 lg:gap-6 items-start">
              <MuscleMapPanel
                exercises={workout.exercises}
                activeGuideKey={activeGuideKey}
                className="lg:sticky lg:top-4"
              />
              <WorkoutCircuitCards
                workout={workout}
                workoutLink={resolvedLink}
                activeGuideKey={activeGuideKey}
                onExerciseHover={setActiveGuideKey}
                compactHeader
                hideHeader
              />
            </div>
          ) : (
            <div
              className="rounded-xl border border-dashed p-8 text-center"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
            >
              <p className="text-base font-semibold text-[var(--text-primary)]">
                {workout?.name || 'Rest Day'}
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                Light stretching · hydrate · recover
              </p>
              <MuscleMapPanel exercises={[]} className="mt-4 !bg-transparent !border-0 !shadow-none" />
              <button
                type="button"
                onClick={() => setEditorOpen(true)}
                className="mt-4 text-xs font-semibold"
                style={{ color: BODY_ACCENT }}
              >
                Convert to a workout day
              </button>
            </div>
          )}

          {(nutrition || mindset) && (
            <div className="mt-5 pt-5 border-t grid sm:grid-cols-2 gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
              {nutrition && (
                <div
                  className="rounded-xl p-4 border"
                  style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
                >
                  <p className="aether-label mb-2" style={{ color: BODY_ACCENT }}>
                    Nutrition
                  </p>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed">{nutrition}</p>
                </div>
              )}
              {mindset && (
                <div
                  className="rounded-xl p-4 border"
                  style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
                >
                  <p className="aether-label mb-2" style={{ color: BODY_ACCENT }}>
                    Mindset
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">
                    &ldquo;{mindset}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}

          {dayNumber !== undefined && hasCircuit && !previewingTomorrow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-5 pt-5 border-t"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <SessionCompletionButton
                journeyId={journeyId}
                dayNumber={dayNumber}
                sessionType="daily"
                sessionIndex={0}
                accentColor={BODY_ACCENT}
                accentGlow={BODY_GLOW}
                onComplete={() => {
                  window.dispatchEvent(
                    new CustomEvent('session-completed', {
                      detail: { journeyId, dayNumber },
                    })
                  );
                }}
              />
            </motion.div>
          )}
        </div>
      </div>

      {showTomorrowPreview && nextDayResolved && (
        <BodyTomorrowPreview nextDay={nextDayResolved} onPreview={onPreviewDay} />
      )}

      {editorOpen && (
        <WorkoutPlanEditor
          journeyId={journeyId}
          dayIndex={dayIndex}
          weekNum={weekNum}
          onClose={() => setEditorOpen(false)}
          onSaved={refreshPlan}
        />
      )}
    </div>
  );
}
