import { motion } from 'framer-motion';
import { Trophy, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

export function AchievementTile({ 
  title, 
  description, 
  icon, 
  unlocked = false, 
  progress = 0,
  className 
}) {
  const Icon = icon || Trophy;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "p-4 rounded-lg border transition-all",
        unlocked 
          ? "bg-card border-primary/20 shadow-md" 
          : "bg-muted/50 border-muted opacity-60",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}>
          {unlocked ? (
            <Icon className="w-5 h-5" />
          ) : (
            <Lock className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold mb-1",
            unlocked ? "text-foreground" : "text-muted-foreground"
          )}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {description}
          </p>
          {!unlocked && progress > 0 && (
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

