import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Play, Star } from 'lucide-react';
import { Button } from './button';

/**
 * Task Card v2.0 - PRD Design
 * Features:
 * - Journey color border glow on hover
 * - Pulsing indicator when active
 * - Completion animation (checkmark, strikethrough)
 * - XP float animation
 * - Confetti on completion
 */
export function TaskCardV2({ 
  title, 
  xpReward, 
  priority = 'normal',
  journeyId,
  onComplete,
  completed = false,
  inProgress = false,
}) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showXP, setShowXP] = useState(false);

  const priorityColors = {
    high: 'border-l-4 border-red-500',
    medium: 'border-l-4 border-yellow-500',
    normal: 'border-l-4 border-blue-500',
  };

  const journeyColors = {
    'body-transformation': 'hover:border-journey-body hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    'dual-brand': 'hover:border-journey-brand hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    'reading': 'hover:border-journey-reading hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]',
    'writers': 'hover:border-journey-writing hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]',
    'software-engineering': 'hover:border-journey-software hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
  };

  const handleComplete = () => {
    if (completed || isCompleting) return;
    
    setIsCompleting(true);
    setShowXP(true);
    
    // Trigger completion animation
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
      setIsCompleting(false);
      setTimeout(() => setShowXP(false), 1000);
    }, 300);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="relative"
    >
      <motion.div
        className={`
          glass-card rounded-xl p-4
          ${completed ? 'opacity-60' : ''}
          ${inProgress ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
          ${priorityColors[priority]}
          ${journeyColors[journeyId] || ''}
          transition-all duration-200
          ${completed ? '' : 'hover:shadow-lg'}
        `}
        whileHover={!completed ? { scale: 1.01 } : {}}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Checkbox & Title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={handleComplete}
              disabled={completed || isCompleting}
              className={`
                relative w-6 h-6 rounded-md border-2 flex items-center justify-center
                flex-shrink-0
                ${completed 
                  ? 'bg-primary border-primary' 
                  : 'border-muted-foreground/30 hover:border-primary'
                }
                transition-all duration-200
                ${isCompleting ? 'scale-110' : ''}
              `}
            >
              <AnimatePresence>
                {completed && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3, type: 'spring' }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {inProgress && !completed && (
                <motion.div
                  className="absolute inset-0 rounded-md bg-primary/20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <motion.h3
                className={`
                  font-semibold text-foreground
                  ${completed ? 'line-through text-muted-foreground' : ''}
                `}
                animate={completed ? { opacity: 0.6 } : { opacity: 1 }}
              >
                {title}
              </motion.h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground capitalize">
                  {priority} priority
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-xp" />
                  <span className="text-xs font-semibold text-xp">
                    +{xpReward} XP
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {!completed && (
            <Button
              size="sm"
              variant={inProgress ? "default" : "outline"}
              onClick={() => !inProgress && handleComplete()}
              className="flex-shrink-0"
            >
              {inProgress ? (
                <>
                  <motion.div
                    className="w-2 h-2 rounded-full bg-current mr-2"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  In Progress
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          )}
        </div>

        {/* XP Float Animation */}
        <AnimatePresence>
          {showXP && (
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -30, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute top-4 right-16 pointer-events-none"
            >
              <div className="flex items-center gap-1 text-xp font-bold">
                <Star className="w-4 h-4" />
                <span>+{xpReward} XP</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

