import { Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';

/**
 * Sun/moon toggle — switches between light and dark themes.
 */
export function ThemeToggleButton({ className, size = 'icon' }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size={size}
      className={cn(
        'h-11 w-11 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-badge)]',
        className
      )}
      onClick={() => toggleTheme()}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
}
