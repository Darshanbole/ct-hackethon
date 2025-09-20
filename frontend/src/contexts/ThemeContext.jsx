import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('system');
  const [isDark, setIsDark] = useState(false);

  // Theme options
  const themes = {
    light: 'light',
    dark: 'dark',
    system: 'system',
    cyberpunk: 'cyberpunk',
    neon: 'neon',
    sunset: 'sunset'
  };

  useEffect(() => {
    // Load theme from localStorage or default to system
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'cyberpunk', 'neon', 'sunset');
    
    let effectiveTheme = newTheme;
    
    if (newTheme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Apply theme class
    root.classList.add(effectiveTheme);
    setIsDark(effectiveTheme === 'dark' || effectiveTheme === 'cyberpunk' || effectiveTheme === 'neon');
    
    // Apply custom theme styles
    switch (effectiveTheme) {
      case 'cyberpunk':
        root.style.setProperty('--background', '0 0% 3%');
        root.style.setProperty('--foreground', '300 100% 95%');
        root.style.setProperty('--primary', '300 100% 50%');
        root.style.setProperty('--primary-foreground', '0 0% 0%');
        root.style.setProperty('--accent', '180 100% 50%');
        root.style.setProperty('--accent-foreground', '0 0% 0%');
        break;
      
      case 'neon':
        root.style.setProperty('--background', '240 10% 4%');
        root.style.setProperty('--foreground', '60 100% 95%');
        root.style.setProperty('--primary', '60 100% 50%');
        root.style.setProperty('--primary-foreground', '240 10% 4%');
        root.style.setProperty('--accent', '120 100% 50%');
        root.style.setProperty('--accent-foreground', '240 10% 4%');
        break;
      
      case 'sunset':
        root.style.setProperty('--background', '20 14% 4%');
        root.style.setProperty('--foreground', '60 9% 98%');
        root.style.setProperty('--primary', '20 100% 60%');
        root.style.setProperty('--primary-foreground', '20 14% 4%');
        root.style.setProperty('--accent', '30 100% 60%');
        root.style.setProperty('--accent-foreground', '20 14% 4%');
        break;
      
      default:
        // Reset to default CSS variables for light/dark themes
        root.style.removeProperty('--background');
        root.style.removeProperty('--foreground');
        root.style.removeProperty('--primary');
        root.style.removeProperty('--primary-foreground');
        root.style.removeProperty('--accent');
        root.style.removeProperty('--accent-foreground');
        break;
    }
  };

  const setThemeAndSave = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setThemeAndSave(newTheme);
  };

  const getThemeIcon = (themeName) => {
    const icons = {
      light: '☀️',
      dark: '🌙',
      system: '💻',
      cyberpunk: '🤖',
      neon: '⚡',
      sunset: '🌅'
    };
    return icons[themeName] || '🎨';
  };

  const getThemeDescription = (themeName) => {
    const descriptions = {
      light: 'Light theme for daytime use',
      dark: 'Dark theme for low-light environments',
      system: 'Automatically match your system preference',
      cyberpunk: 'Futuristic cyberpunk aesthetic with neon colors',
      neon: 'Bright neon colors for a vibrant experience',
      sunset: 'Warm sunset colors for a cozy feel'
    };
    return descriptions[themeName] || 'Custom theme';
  };

  const value = {
    theme,
    isDark,
    themes,
    setTheme: setThemeAndSave,
    toggleTheme,
    getThemeIcon,
    getThemeDescription
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};