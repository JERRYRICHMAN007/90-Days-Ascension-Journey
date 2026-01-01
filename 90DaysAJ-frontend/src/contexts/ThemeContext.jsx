import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return 'light';
    }
    
    const saved = localStorage.getItem('ascensionTheme');
    // Check system preference if no saved theme
    if (!saved) {
      try {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
      } catch (e) {
        return 'light';
      }
    }
    return saved || 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('ascensionTheme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    // Add/remove dark class for Tailwind dark mode
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = (newTheme) => {
    if (newTheme) {
      setTheme(newTheme);
    } else {
      // Toggle between light and dark if no theme specified
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
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

