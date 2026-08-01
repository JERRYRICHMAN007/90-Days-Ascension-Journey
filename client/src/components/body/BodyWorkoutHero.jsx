import { useState } from 'react';
import { motion } from 'framer-motion';
import { Repeat, Play } from 'lucide-react';
import { MuscleMapPanel } from './MuscleMapPanel';
import { BodyTomorrowPreview } from './BodyTomorrowPreview';
import { WorkoutCircuitCards } from '../journey/WorkoutCircuitCards';
import { SessionCompletionButton } from '../SessionCompletionButton';
import { isTomorrow } from '../../utils/dates';

const BODY_ACCENT = '#00ff87';
const BODY_GLOW = 'var(--neon-glow-green)';

export function BodyWorkoutHero({
  focus,
  workout,
  workoutLink,
  nutrition,
  mindset,
  journeyId,
  dayNumber,
  focusLabel = "Today's Focus",
  dailyLearning = null,
  nextDay = null,
  onPreviewDay = null,
}) {
  const [activeGuideKey, setActiveGuideKey] = useState(null);
  const hasCircuit = workout?.exercises?.length > 0;
  const previewingTomorrow = isTomorrow(dayNumber);
  const showTomorrowPreview =
    nextDay && !previewingTomorrow && isTomorrow(nextDay.dayNumber);

  return (
    <div className="space-y-4 min-w-0">
      <div
        className="rounded-[12px] border overflow-hidden min-w-0"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        {/* Header — Figma Frame 3 */}
        <div className="p-5 sm:p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: BODY_ACCENT, boxShadow: BODY_GLOW }}
            />
            <p className="aether-label">{focusLabel}</p>
          </div>
          <h2 className="text-2xl sm:text-[32px] font-extrabold text-[var(--text-primary)] tracking-[-0.64px] leading-tight">
            {focus}
          </h2>
          {dailyLearning?.description && (
            <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
              {dailyLearning.description}
            </p>
          )}
          {workout?.name && hasCircuit && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
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
              {workoutLink && (
                <a
                  href={workoutLink}
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
          )}
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
                workoutLink={workoutLink}
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

      {showTomorrowPreview && (
        <BodyTomorrowPreview nextDay={nextDay} onPreview={onPreviewDay} />
      )}
    </div>
  );
}
