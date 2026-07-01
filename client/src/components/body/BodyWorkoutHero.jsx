import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { Card } from '../ui/card';
import { MuscleMapPanel } from './MuscleMapPanel';
import { WorkoutCircuitCards } from '../journey/WorkoutCircuitCards';
import { SessionCompletionButton } from '../SessionCompletionButton';

export function BodyWorkoutHero({
  focus,
  workout,
  workoutLink,
  nutrition,
  mindset,
  journeyId,
  dayNumber,
  focusLabel = "Today's Focus",
}) {
  const [activeGuideKey, setActiveGuideKey] = useState(null);
  const hasCircuit = workout?.exercises?.length > 0;

  return (
    <Card className="p-4 sm:p-6 border border-border/50 glass-glow overflow-hidden">
      <div className="flex items-center gap-2 mb-1">
        <Target className="w-5 h-5 text-primary shrink-0" />
        <h3 className="text-base sm:text-lg font-semibold">{focusLabel}</h3>
      </div>
      <p className="text-lg sm:text-xl font-bold text-foreground mb-4">{focus}</p>

      {hasCircuit ? (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(200px,240px)_1fr] gap-4 lg:gap-6 items-start">
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
          />
        </div>
      ) : (
        <MuscleMapPanel exercises={[]} />
      )}

      {(nutrition || mindset) && (
        <div className="mt-4 pt-4 border-t border-border/50 grid sm:grid-cols-2 gap-3">
          {nutrition && (
            <div className="glass-panel rounded-lg p-3">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Nutrition</p>
              <p className="text-sm text-foreground">{nutrition}</p>
            </div>
          )}
          {mindset && (
            <div className="glass-panel rounded-lg p-3">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Mindset</p>
              <p className="text-sm text-muted-foreground italic">&ldquo;{mindset}&rdquo;</p>
            </div>
          )}
        </div>
      )}

      {dayNumber !== undefined && hasCircuit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 pt-4 border-t border-border/50"
        >
          <SessionCompletionButton
            journeyId={journeyId}
            dayNumber={dayNumber}
            sessionType="daily"
            sessionIndex={0}
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
    </Card>
  );
}
