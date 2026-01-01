import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Star } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { cn } from '../../lib/utils';

export function TaskCard({ 
  title, 
  description, 
  completed = false, 
  priority = 'normal',
  xpReward = 0,
  dueDate,
  onToggle,
  onComplete,
  className 
}) {
  const priorityColors = {
    high: 'bg-destructive/10 text-destructive border-destructive/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    normal: 'bg-muted text-muted-foreground',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={cn(
        "p-4 rounded-lg border bg-card transition-all",
        completed && "opacity-60",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className="mt-1 flex-shrink-0"
        >
          {completed ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground hover:text-blue-500 transition-colors" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={cn(
              "font-semibold",
              completed && "line-through text-muted-foreground"
            )}>
              {title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              {xpReward > 0 && (
                <Badge variant="outline" className="gap-1">
                  <Star className="w-3 h-3 text-warning fill-warning" />
                  {xpReward} XP
                </Badge>
              )}
              {priority !== 'normal' && (
                <Badge className={priorityColors[priority]}>
                  {priority}
                </Badge>
              )}
            </div>
          </div>
          
          {description && (
            <p className="text-sm text-muted-foreground mb-2">
              {description}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-3">
            {dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {new Date(dueDate).toLocaleDateString()}
              </div>
            )}
            {!completed && onComplete && (
              <Button 
                size="sm" 
                onClick={onComplete}
                className="ml-auto"
              >
                Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

