import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/storageKeys.js';

const ThemeContext = createContext();

const DARK_THEMES = new Set(['dark', 'neon', 'vibrant']);
const DEFAULT_DARK_THEME = 'dark';

export function isDarkTheme(theme) {
  return DARK_THEMES.has(theme);
}

function applyThemeToDocument(theme) {
  if (typeof document === 'undefined') return;

  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.toggle('dark', isDarkTheme(theme));
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_DARK_THEME;
    }

    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) return saved;
    return DEFAULT_DARK_THEME;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    applyThemeToDocument(theme);
  }, [theme]);

  const setThemeMode = useCallback((newTheme) => {
    setTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(
    (newTheme) => {
      if (newTheme && typeof newTheme === 'string') {
        setTheme(newTheme);
        return;
      }
      setTheme((prev) => (isDarkTheme(prev) ? 'light' : DEFAULT_DARK_THEME));
    },
    []
  );

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: setThemeMode, toggleTheme, isDark: isDarkTheme(theme) }}
    >
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
