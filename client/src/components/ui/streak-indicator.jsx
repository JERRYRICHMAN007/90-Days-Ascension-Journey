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
    <div className={cn('flex items-center gap-1.5 sm:gap-2 min-w-0', className)}>
      <Flame className={cn('w-4 h-4 sm:w-5 sm:h-5 shrink-0', getStreakColor(currentStreak))} />
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="font-bold text-base sm:text-lg tabular-nums">{currentStreak}</span>
          <span className="text-xs sm:text-sm text-muted-foreground">day streak</span>
        </div>
        {longestStreak && longestStreak > currentStreak && (
          <span className="text-[10px] sm:text-xs text-muted-foreground">
            Best: {longestStreak} days
          </span>
        )}
      </div>
    </div>
  );
}

