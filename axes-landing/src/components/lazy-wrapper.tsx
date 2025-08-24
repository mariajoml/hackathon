"use client";

import { Suspense, lazy } from "react";
import { LoadingSpinner } from "./loading-spinner";

// Lazy load de componentes pesados
export const LazyHero = lazy(() => import("./hero").then(module => ({ default: module.Hero })));
export const LazyNavbar = lazy(() => import("./navbar").then(module => ({ default: module.Navbar })));

// Componentes de dashboard lazy
export const LazyDashboard = lazy(() => 
  import("../app/dashboard/page").then(module => ({ default: module.default }))
);

export const LazyOnboarding = lazy(() => 
  import("../app/onboarding/page").then(module => ({ default: module.default }))
);

export const LazyChatbot = lazy(() => 
  import("../app/chatbot/page").then(module => ({ default: module.default }))
);

// Wrapper con suspense
export function LazyComponent({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback || <LoadingSpinner size="lg" className="min-h-[200px]" />}>
      {children}
    </Suspense>
  );
}
