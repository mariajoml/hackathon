"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Evitar hidration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-9 h-9 rounded-xl axes-btn-ghost"
        disabled
      >
        <div className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 rounded-xl axes-btn-ghost hover:axes-btn-secondary transition-all duration-300"
      title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-yellow-400 transition-all duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-all duration-300" />
      )}
    </Button>
  );
}
