import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';

const ACHIEVEMENT_LABELS = {
  '3-day-start': '3-Day Start',
  'week-warrior': 'Week Warrior',
  'month-master': 'Month Master',
  'first-thousand': 'First Thousand XP',
  'body-builder': 'Body Builder',
};

/**
 * Toast notifications for XP gains and achievement unlocks.
 */
export function GamificationToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const show = (message, type = 'xp') => {
      setToast({ message, type, id: Date.now() });
      window.setTimeout(() => setToast(null), 3500);
    };

    const onXp = (e) => {
      const { amount } = e.detail || {};
      if (amount) show(`+${amount} XP earned`, 'xp');
    };
    const onAch = (e) => {
      const { achievementId } = e.detail || {};
      const label = ACHIEVEMENT_LABELS[achievementId] || 'Achievement unlocked';
      show(label, 'achievement');
    };

    window.addEventListener('xp-gained', onXp);
    window.addEventListener('achievement-unlocked', onAch);
    return () => {
      window.removeEventListener('xp-gained', onXp);
      window.removeEventListener('achievement-unlocked', onAch);
    };
  }, []);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12 }}
          className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
        >
          <div className="flex items-center gap-2 px-4 py-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xl backdrop-blur-md">
            {toast.type === 'achievement' ? (
              <Trophy className="size-5 text-[var(--neon-purple)]" />
            ) : (
              <Star className="size-5 text-yellow-400" />
            )}
            <span className="text-sm font-semibold text-[var(--text-primary)]">{toast.message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
