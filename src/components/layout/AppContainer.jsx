import { cn } from '../../lib/utils';

export function AppContainer({ children, className }) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {children}
    </div>
  );
}

