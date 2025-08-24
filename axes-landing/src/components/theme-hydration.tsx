"use client";

import { useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeHydration() {
  const { theme, mounted } = useTheme();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Detectar tema inicial inmediatamente sin esperar mounted
      const savedTheme = localStorage.getItem("axes-theme");
      const initialTheme = (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) 
        ? savedTheme 
        : (window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light');
      
      const html = document.documentElement;
      
      // Aplicar tema inicial
      html.setAttribute("data-theme", initialTheme);
      html.classList.remove("light", "dark");
      html.classList.add(initialTheme);
    }
  }, []); // Solo ejecutar una vez al montar

  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      // Actualizar cuando el tema cambie después de la hidratación
      const html = document.documentElement;
      
      html.setAttribute("data-theme", theme);
      html.classList.remove("light", "dark");
      html.classList.add(theme);
    }
  }, [theme, mounted]);

  // Este componente no renderiza nada, solo maneja efectos de hidratación
  return null;
}
