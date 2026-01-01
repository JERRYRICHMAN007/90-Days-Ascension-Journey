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
    <div className={cn("p-4 rounded-lg border bg-card", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
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

