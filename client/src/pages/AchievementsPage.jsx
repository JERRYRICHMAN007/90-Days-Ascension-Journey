import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGamification } from '../hooks/useGamification';
import { AchievementTile } from '../components/ui/achievement-tile';
import { Trophy, Flame, Star, Target, Zap } from 'lucide-react';
import { staggerContainer } from '../lib/motion.js';

const allAchievements = [
  { id: '3-day-start', title: '3-Day Start', description: 'Maintain a 3-day streak', icon: Flame, category: 'streak' },
  { id: 'week-warrior', title: 'Week Warrior', description: 'Complete 7 days in a row', icon: Trophy, category: 'streak' },
  { id: 'month-master', title: 'Month Master', description: 'Achieve a 30-day streak', icon: Star, category: 'streak' },
  { id: 'first-thousand', title: 'First Thousand', description: 'Earn 1,000 XP', icon: Target, category: 'xp' },
  { id: 'body-builder', title: 'Body Builder', description: 'Complete 30 body transformation tasks', icon: Zap, category: 'domain' },
];

const CATEGORIES = ['all', 'streak', 'xp', 'domain'];

export function AchievementsPage() {
  const { achievements, xp, streaks } = useGamification();
  const [filter, setFilter] = useState('all');

  const getProgress = (achievementId) => {
    switch (achievementId) {
      case '3-day-start':
        return (streaks.current / 3) * 100;
      case 'week-warrior':
        return (streaks.current / 7) * 100;
      case 'month-master':
        return (streaks.current / 30) * 100;
      case 'first-thousand':
        return Math.min((xp.global / 1000) * 100, 100);
      default:
        return 0;
    }
  };

  const filtered = allAchievements.filter(
    (a) => filter === 'all' || a.category === filter
  );
  const unlockedCount = allAchievements.filter((a) => achievements.includes(a.id)).length;
  const collectionPct = Math.round((unlockedCount / allAchievements.length) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Track your progress and unlock rewards
        </p>
      </motion.div>

      <div className="glass-panel rounded-xl p-5 flex flex-wrap items-center gap-6">
        <div className="relative w-20 h-20 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeDasharray={`${collectionPct} 100`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary">
            {collectionPct}%
          </span>
        </div>
        <div>
          <p className="text-lg font-semibold">{unlockedCount} / {allAchievements.length} unlocked</p>
          <p className="text-sm text-muted-foreground">Keep going — every session counts</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
              filter === cat
                ? 'bg-primary text-primary-foreground'
                : 'glass-panel text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filtered.map((achievement) => {
          const unlocked = achievements.includes(achievement.id);
          const progress = unlocked ? 100 : getProgress(achievement.id);

          return (
            <motion.div
              key={achievement.id}
              variants={{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }}
              className={unlocked ? 'unlock-shimmer rounded-xl' : ''}
            >
              <AchievementTile
                title={achievement.title}
                description={achievement.description}
                icon={achievement.icon}
                unlocked={unlocked}
                progress={progress}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
