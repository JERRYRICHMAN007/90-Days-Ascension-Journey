import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';

const ACHIEVEMENT_META = {
  '3-day-start': { title: '3-Day Start', icon: '🔥' },
  'week-warrior': { title: 'Week Warrior', icon: '🏆' },
  'month-master': { title: 'Month Master', icon: '⭐' },
  'first-thousand': { title: 'First Thousand', icon: '💎' },
  'body-builder': { title: 'Body Builder', icon: '💪' },
};

/**
 * Celebratory toast when achievements unlock.
 */
export function AchievementUnlockToast() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const onUnlock = (e) => {
      const id = e.detail?.achievementId;
      if (!id) return;
      const meta = ACHIEVEMENT_META[id] || { title: 'Achievement unlocked', icon: '🎉' };
      setQueue((q) => [...q, { id, ...meta, key: `${id}-${Date.now()}` }]);
    };
    window.addEventListener('achievement-unlocked', onUnlock);
    return () => window.removeEventListener('achievement-unlocked', onUnlock);
  }, []);

  useEffect(() => {
    if (queue.length === 0) return undefined;
    const t = window.setTimeout(() => {
      setQueue((q) => q.slice(1));
    }, 4500);
    return () => window.clearTimeout(t);
  }, [queue]);

  const dismiss = () => setQueue((q) => q.slice(1));

  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 z-[100] pointer-events-none flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {queue[0] && (
          <motion.div
            key={queue[0].key}
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="pointer-events-auto rounded-2xl border p-4 shadow-xl flex items-start gap-3"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'rgba(110,231,183,0.35)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.2), 0 0 0 1px rgba(110,231,183,0.15)',
            }}
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-2xl">
              {queue[0].icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                <Trophy className="size-3" />
                Achievement unlocked
              </div>
              <p className="font-display font-bold text-[var(--text-primary)] mt-0.5">{queue[0].title}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Keep going — momentum builds mastery.</p>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
              aria-label="Dismiss"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
