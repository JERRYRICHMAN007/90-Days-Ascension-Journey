import { Flame } from 'lucide-react';
import { cn } from '../../lib/utils';

export function StreakIndicator({ 
  currentStreak, 
  longestStreak, 
  variant = 'default',
  className 
}) {
  const getStreakColor = (streak) => {
    if (streak >= 30) return 'text-orange-500';
    if (streak >= 14) return 'text-yellow-500';
    if (streak >= 7) return 'text-green-500';
    return 'text-muted-foreground';
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Flame className={cn("w-5 h-5", getStreakColor(currentStreak))} />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">{currentStreak}</span>
          <span className="text-sm text-muted-foreground">day streak</span>
        </div>
        {longestStreak && longestStreak > currentStreak && (
          <span className="text-xs text-muted-foreground">
            Best: {longestStreak} days
          </span>
        )}
      </div>
    </div>
  );
}

