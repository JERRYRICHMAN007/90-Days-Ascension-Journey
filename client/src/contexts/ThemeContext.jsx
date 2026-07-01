import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/storageKeys.js';

const ThemeContext = createContext();

const DARK_THEMES = new Set(['dark', 'neon', 'vibrant']);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'neon';
    }

    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) return saved;
    return 'neon';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);

    if (DARK_THEMES.has(theme)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = (newTheme) => {
    if (newTheme) {
      setTheme(newTheme);
    } else {
      setTheme((prev) => (DARK_THEMES.has(prev) ? 'light' : 'neon'));
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
