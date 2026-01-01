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
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-warning fill-warning" />
          <span className="font-semibold">
            {domain ? `${domain} ` : ''}Level {level}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <TrendingUp className="w-3 h-3" />
          <span>{currentXP} / {xpToNext} XP</span>
        </div>
      </div>
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
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

