import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';

/**
 * Animated sun/moon theme switch — clearly shows active mode.
 */
export function ThemeToggleButton({ className, size = 'default' }) {
  const { isDark, toggleTheme } = useTheme();
  const compact = size === 'icon';

  return (
    <button
      type="button"
      onClick={() => toggleTheme()}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={cn(
        'relative inline-flex items-center rounded-full border p-1 transition-colors',
        'border-[var(--border-subtle)] bg-[var(--bg-badge)]',
        compact ? 'h-11 w-[4.5rem]' : 'h-10 w-[5.5rem]',
        className
      )}
    >
      <motion.div
        className="absolute top-1 bottom-1 rounded-full shadow-sm"
        style={{ background: 'var(--bg-card)' }}
        initial={false}
        animate={{ left: isDark ? 'calc(50% - 2px)' : 4, right: isDark ? 4 : 'calc(50% - 2px)' }}
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
      />
      <span
        className={cn(
          'relative z-10 flex flex-1 items-center justify-center transition-colors',
          !isDark ? 'text-amber-500' : 'text-[var(--text-muted)]'
        )}
      >
        <Sun className={compact ? 'size-4' : 'size-[18px]'} />
      </span>
      <span
        className={cn(
          'relative z-10 flex flex-1 items-center justify-center transition-colors',
          isDark ? 'text-indigo-300' : 'text-[var(--text-muted)]'
        )}
      >
        <Moon className={compact ? 'size-4' : 'size-[18px]'} />
      </span>
    </button>
  );
}
