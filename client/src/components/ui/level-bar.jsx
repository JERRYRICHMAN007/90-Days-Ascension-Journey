import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

export function LevelBar({ 
  level, 
  currentXP, 
  xpToNext, 
  domain = null,
  className 
}) {
  const progress = xpToNext > 0 ? (currentXP / xpToNext) * 100 : 100;

  return (
    <div className={cn('space-y-1.5 sm:space-y-2', className)}>
      <div className="flex items-center justify-between gap-1 min-w-0">
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-warning fill-warning shrink-0" />
          <span className="text-xs sm:text-sm font-semibold truncate">
            {domain ? `${domain} ` : ''}Level {level}
          </span>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-muted-foreground shrink-0">
          <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span className="tabular-nums">{currentXP}/{xpToNext}</span>
        </div>
      </div>
      <div className="w-full bg-muted rounded-full h-2 sm:h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary via-accent to-secondary"
        />
      </div>
    </div>
  );
}

