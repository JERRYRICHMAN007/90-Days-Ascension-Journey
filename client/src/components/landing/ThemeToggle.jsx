import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        {isDark ? 'Dark Mode' : 'Light Mode'}
      </span>
      <button
        onClick={handleToggle}
        className="relative w-14 h-8 rounded-full bg-muted border border-border p-1 transition-colors hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <motion.div
          layout
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
          className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg ${
            isDark ? 'translate-x-6' : 'translate-x-0'
          }`}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-white" />
          ) : (
            <Sun className="w-4 h-4 text-white" />
          )}
        </motion.div>
      </button>
    </div>
  );
}
