import { useGamification } from '../hooks/useGamification';
import { AchievementTile } from '../components/ui/achievement-tile';
import { Trophy, Flame, Star, Target, Zap } from 'lucide-react';

const allAchievements = [
  {
    id: '3-day-start',
    title: '3-Day Start',
    description: 'Maintain a 3-day streak',
    icon: Flame,
    category: 'streak',
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Complete 7 days in a row',
    icon: Trophy,
    category: 'streak',
  },
  {
    id: 'month-master',
    title: 'Month Master',
    description: 'Achieve a 30-day streak',
    icon: Star,
    category: 'streak',
  },
  {
    id: 'first-thousand',
    title: 'First Thousand',
    description: 'Earn 1,000 XP',
    icon: Target,
    category: 'xp',
  },
  {
    id: 'body-builder',
    title: 'Body Builder',
    description: 'Complete 30 body transformation tasks',
    icon: Zap,
    category: 'domain',
  },
];

export function AchievementsPage() {
  const { achievements, xp, streaks } = useGamification();

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Achievements</h1>
        <p className="text-muted-foreground">
          Track your progress and unlock rewards
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allAchievements.map((achievement) => {
          const unlocked = achievements.includes(achievement.id);
          const progress = unlocked ? 100 : getProgress(achievement.id);

          return (
            <AchievementTile
              key={achievement.id}
              title={achievement.title}
              description={achievement.description}
              icon={achievement.icon}
              unlocked={unlocked}
              progress={progress}
            />
          );
        })}
      </div>
    </div>
  );
}

