import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ChecklistItem({ 
  label, 
  checked = false, 
  onToggle,
  className 
}) {
  return (
    <label className={cn(
      "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
      "hover:bg-muted/50",
      className
    )}>
      <button
        type="button"
        onClick={onToggle}
        className="flex-shrink-0"
      >
        {checked ? (
          <CheckCircle2 className="w-5 h-5 text-success" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      <span className={cn(
        "flex-1",
        checked && "line-through text-muted-foreground"
      )}>
        {label}
      </span>
    </label>
  );
}

