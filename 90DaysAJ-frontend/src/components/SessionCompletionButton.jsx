import { useState } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { markSessionComplete, isSessionComplete } from '../utils/progressTracking';
import { useGamification } from '../hooks/useGamification';

/**
 * Session Completion Button Component
 * 
 * Allows users to explicitly mark a session as complete.
 * Progress is only earned through explicit completion.
 */
export function SessionCompletionButton({
  journeyId,
  dayNumber,
  sessionType,
  sessionIndex,
  discipline = null,
  onComplete = null,
  className = ''
}) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(() => 
    isSessionComplete(journeyId, dayNumber, sessionType, sessionIndex, discipline)
  );
  const { completeTask } = useGamification();

  const handleComplete = async () => {
    if (isCompleted || isCompleting) return;

    setIsCompleting(true);
    
    try {
      // Mark session as complete
      const success = markSessionComplete(
        journeyId,
        dayNumber,
        sessionType,
        sessionIndex,
        discipline,
        {
          completedAt: new Date().toISOString()
        }
      );

      if (success) {
        setIsCompleted(true);
        
        // Award XP for session completion
        if (completeTask) {
          completeTask('medium', journeyId, dayNumber);
        }
        
        // Trigger completion callback
        if (onComplete) {
          onComplete({
            journeyId,
            dayNumber,
            sessionType,
            sessionIndex,
            discipline
          });
        }
      }
    } catch (error) {
      console.error('Error completing session:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className={`flex items-center gap-2 text-green-600 dark:text-green-400 ${className}`}>
        <CheckCircle2 className="w-5 h-5" />
        <span className="text-sm font-medium">Completed</span>
      </div>
    );
  }

  return (
    <Button
      onClick={handleComplete}
      disabled={isCompleting}
      className={`flex items-center gap-2 ${className}`}
      variant="outline"
    >
      {isCompleting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Completing...</span>
        </>
      ) : (
        <>
          <Circle className="w-4 h-4" />
          <span>Mark as Complete</span>
        </>
      )}
    </Button>
  );
}

