import React, { createContext, useContext, useEffect, useState } from 'react';
import { cn } from '../../utils/cn';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children, defaultTheme = 'system' }) => {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem('fashiongen-theme');
    if (savedTheme && ['light', 'dark', 'system']?.includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document?.documentElement;
    
    // Remove previous theme classes
    root.classList?.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')?.matches
        ? 'dark' :'light';
      root.classList?.add(systemTheme);
    } else {
      root.classList?.add(theme);
    }
    
    // Save theme to localStorage
    localStorage.setItem('fashiongen-theme', theme);
  }, [theme]);

  // Listen for system theme changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const root = window.document?.documentElement;
      root.classList?.remove('light', 'dark');
      root.classList?.add(mediaQuery?.matches ? 'dark' : 'light');
    };

    mediaQuery?.addEventListener('change', handleChange);
    return () => mediaQuery?.removeEventListener('change', handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      if (['light', 'dark', 'system']?.includes(newTheme)) {
        setTheme(newTheme);
      }
    },
    toggleTheme: () => {
      setTheme(current => {
        if (current === 'light') return 'dark';
        if (current === 'dark') return 'light';
        // For system, toggle to opposite of current system preference
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')?.matches
          ? 'dark' :'light';
        return systemTheme === 'dark' ? 'light' : 'dark';
      });
    },
    isDark: () => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)')?.matches;
      }
      return theme === 'dark';
    },
    isLight: () => {
      if (theme === 'system') {
        return !window.matchMedia('(prefers-color-scheme: dark)')?.matches;
      }
      return theme === 'light';
    }
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={cn(
        "min-h-screen bg-background text-foreground transition-colors duration-300",
        "selection:bg-primary/20"
      )}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;