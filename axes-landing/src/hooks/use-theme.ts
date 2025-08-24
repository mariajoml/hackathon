"use client";

import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

// Función para inicializar el tema antes de que React se hidrate
function initializeTheme(): Theme {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("axes-theme") as Theme;
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      return savedTheme;
    }
    
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }
  return "dark"; // Fallback para SSR
}

// Función para aplicar el tema - Solo localStorage para evitar hydration mismatch
function applyTheme(theme: Theme) {
  if (typeof window !== "undefined") {
    localStorage.setItem("axes-theme", theme);
  }
}

export function useTheme() {
  // Inicializar siempre con dark para evitar hydration mismatch
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Efecto para manejar la hidratación
  useEffect(() => {
    const initialTheme = initializeTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  // Efecto para aplicar cambios de tema
  useEffect(() => {
    if (mounted) {
      applyTheme(theme);
    }
  }, [theme, mounted]);

  const setMode = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setMode(newTheme);
  }, [theme, setMode]);

  const setLightMode = useCallback(() => {
    setMode("light");
  }, [setMode]);

  const setDarkMode = useCallback(() => {
    setMode("dark");
  }, [setMode]);

  return {
    theme,
    toggleTheme,
    setLightMode,
    setDarkMode,
    mounted
  };
}

// Ya no necesitamos script pre-hidratación para evitar mismatch
