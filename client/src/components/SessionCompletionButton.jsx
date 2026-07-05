import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { markSessionComplete, isSessionComplete } from '../utils/progressTracking';
import { useGamification } from '../hooks/useGamification';

export function SessionCompletionButton({
  journeyId,
  dayNumber,
  sessionType,
  sessionIndex,
  discipline = null,
  onComplete = null,
  className = '',
  accentColor = 'var(--neon-green)',
  accentGlow = 'var(--neon-glow-green)',
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
      const success = markSessionComplete(
        journeyId,
        dayNumber,
        sessionType,
        sessionIndex,
        discipline,
        { completedAt: new Date().toISOString() }
      );

      if (success) {
        setIsCompleted(true);
        if (completeTask) {
          completeTask('medium', journeyId, dayNumber);
        }
        if (onComplete) {
          onComplete({ journeyId, dayNumber, sessionType, sessionIndex, discipline });
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
      <div
        className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 border transition-all duration-200 ${className}`}
        style={{
          color: accentColor,
          borderColor: accentColor,
          background: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
          boxShadow: accentGlow,
        }}
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>Completed</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleComplete}
      disabled={isCompleting}
      className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide border transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 ${className}`}
      style={{
        borderColor: 'var(--border-subtle)',
        color: 'var(--text-secondary)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accentColor;
        e.currentTarget.style.color = accentColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.color = 'var(--text-secondary)';
      }}
    >
      {isCompleting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Completing...</span>
        </>
      ) : (
        <span>Mark as Complete</span>
      )}
    </button>
  );
}
