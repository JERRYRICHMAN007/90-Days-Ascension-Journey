import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Sparkles, Star } from 'lucide-react';
import { markSessionComplete, isSessionComplete } from '../utils/progressTracking';
import { useGamification } from '../hooks/useGamification';
import { cn } from '../lib/utils';

const ENCOURAGEMENTS = [
  'Nice work — keep the momentum!',
  'Another step closer to your goal.',
  'Consistency wins. Well done!',
  'You showed up. That matters.',
  'Great job — your future self thanks you.',
];

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
  label = 'Complete task',
}) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(() =>
    isSessionComplete(journeyId, dayNumber, sessionType, sessionIndex, discipline)
  );
  const [showReward, setShowReward] = useState(false);
  const { completeTask } = useGamification();

  const encouragement = useMemo(
    () => ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)],
    [isCompleted]
  );

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
        setShowReward(true);
        setTimeout(() => setShowReward(false), 2800);
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

  return (
    <div className={cn('relative', className)}>
      <AnimatePresence mode="wait">
        {isCompleted ? (
          <motion.div
            key="done"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full rounded-2xl border overflow-hidden"
            style={{
              borderColor: accentColor,
              background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
              boxShadow: accentGlow,
            }}
          >
            <div className="py-3.5 px-4 flex items-center justify-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 12 }}
              >
                <CheckCircle2 className="w-5 h-5" style={{ color: accentColor }} />
              </motion.div>
              <span className="font-bold text-sm tracking-wide" style={{ color: accentColor }}>
                Completed
              </span>
              <Star className="w-3.5 h-3.5 opacity-70" style={{ color: accentColor }} />
            </div>
            <AnimatePresence>
              {showReward && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="text-xs text-center px-4 pb-3 text-[var(--text-secondary)]"
                >
                  {encouragement}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.button
            key="pending"
            type="button"
            onClick={handleComplete}
            disabled={isCompleting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'w-full py-3.5 px-4 rounded-2xl font-bold text-sm tracking-wide border transition-all duration-200',
              'flex flex-col items-center justify-center gap-1 disabled:opacity-60',
              'bg-[var(--bg-card)] hover:bg-[var(--surface-hover)]'
            )}
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
          >
            {isCompleting ? (
              <span className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Completing…
              </span>
            ) : (
              <>
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
                  {label}
                </span>
                <span className="text-[10px] font-normal text-[var(--text-muted)]">
                  Tap when finished — earn XP &amp; streak credit
                </span>
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
