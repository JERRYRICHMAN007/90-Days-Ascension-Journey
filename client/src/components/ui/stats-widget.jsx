import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

export function StatsWidget({ 
  label, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  className 
}) {
  const changeColors = {
    positive: 'text-success',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  const ChangeIcon = changeType === 'positive' 
    ? TrendingUp 
    : changeType === 'negative' 
    ? TrendingDown 
    : Minus;

  return (
    <div className={cn('p-3 sm:p-4 rounded-lg border bg-card', className)}>
      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
        <span className="text-xs sm:text-sm text-muted-foreground truncate">{label}</span>
        {Icon && <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />}
      </div>
      <div className="flex items-baseline gap-1.5 sm:gap-2 min-w-0">
        <span className="text-lg sm:text-xl md:text-2xl font-bold truncate">{value}</span>
        {change !== undefined && change !== null && (
          <span className={cn(
            "text-sm flex items-center gap-1",
            changeColors[changeType]
          )}>
            <ChangeIcon className="w-3 h-3" />
            {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );
}

