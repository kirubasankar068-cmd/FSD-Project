import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  light: {
    name: 'Light',
    primary: 'from-purple-500 to-blue-600',
    primaryHover: 'hover:from-purple-600 hover:to-blue-700',
    bg: 'bg-gray-50',
    bgGradient: 'bg-gradient-to-br from-gray-50 to-gray-100',
    card: 'bg-white',
    cardBorder: 'border-gray-200',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    textMuted: 'text-gray-500',
    nav: 'bg-white',
    navBorder: 'border-gray-200',
    sidebar: 'bg-white',
    sidebarBorder: 'border-gray-200',
    input: 'bg-gray-50',
    inputBorder: 'border-gray-200',
    buttonPrimary: 'from-purple-500 to-blue-600',
    accent: 'purple',
  },
  dark: {
    name: 'Dark',
    primary: 'from-purple-500 to-blue-600',
    primaryHover: 'hover:from-purple-600 hover:to-blue-700',
    bg: 'bg-gray-900',
    bgGradient: 'bg-gradient-to-br from-gray-900 to-gray-800',
    card: 'bg-gray-800',
    cardBorder: 'border-gray-700',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    textMuted: 'text-gray-400',
    nav: 'bg-gray-800',
    navBorder: 'border-gray-700',
    sidebar: 'bg-gray-800',
    sidebarBorder: 'border-gray-700',
    input: 'bg-gray-700',
    inputBorder: 'border-gray-600',
    buttonPrimary: 'from-purple-500 to-blue-600',
    accent: 'purple',
  },
  blueTech: {
    name: 'Blue Tech',
    primary: 'from-cyan-500 to-blue-600',
    primaryHover: 'hover:from-cyan-600 hover:to-blue-700',
    bg: 'bg-slate-900',
    bgGradient: 'bg-gradient-to-br from-slate-900 to-slate-800',
    card: 'bg-slate-800',
    cardBorder: 'border-slate-700',
    text: 'text-white',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-400',
    nav: 'bg-slate-900',
    navBorder: 'border-slate-700',
    sidebar: 'bg-slate-800',
    sidebarBorder: 'border-slate-700',
    input: 'bg-slate-700',
    inputBorder: 'border-slate-600',
    buttonPrimary: 'from-cyan-500 to-blue-600',
    accent: 'cyan',
  },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'blueTech';
      return 'light';
    });
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    themeConfig: themes[theme],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
