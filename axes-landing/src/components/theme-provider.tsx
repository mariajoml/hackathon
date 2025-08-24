"use client";

import { createContext, useContext } from 'react';
import { useTheme } from '@/hooks/use-theme';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setLightMode: () => void;
  setDarkMode: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeHook = useTheme();

  return (
    <ThemeContext.Provider value={themeHook}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
