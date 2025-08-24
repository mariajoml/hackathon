"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-transparent border-t-[#7C3AED] border-r-[#7C3AED]",
          sizeClasses[size]
        )}
        style={{
          animation: "spin 1s linear infinite"
        }}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-axes-bg-primary to-axes-bg-secondary">
      <div className="text-center space-y-4">
        <div className="bg-[#7C3AED] rounded-lg w-16 h-16 flex items-center justify-center shadow-lg mx-auto">
          <span className="text-white font-bold text-2xl">A</span>
        </div>
        <LoadingSpinner size="lg" />
        <p className="text-axes-text-secondary">Cargando AXES...</p>
      </div>
    </div>
  );
}
