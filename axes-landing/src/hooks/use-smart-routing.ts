"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

type UserType = "Empleado" | "Empresa";

interface AuthResult {
  success: boolean;
  data?: {
    type?: UserType;
    display_name?: string;
    [key: string]: any;
  };
  profile?: any;
  error?: string;
}

export function useSmartRouting() {
  const router = useRouter();

  const routeAfterAuth = useCallback((userType: UserType, isNewUser: boolean = false) => {
    if (userType === "Empleado") {
      if (isNewUser) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } else if (userType === "Empresa") {
      if (isNewUser) {
        router.push("/company/onboarding");
      } else {
        router.push("/company/dashboard");
      }
    }
  }, [router]);

  const routeBasedOnAuth = useCallback((authResult: AuthResult, isSignup: boolean = false) => {
    if (authResult.success && authResult.data?.type) {
      routeAfterAuth(authResult.data.type, isSignup);
      return true;
    }
    return false;
  }, [routeAfterAuth]);

  const getDefaultRoute = useCallback((userType: UserType) => {
    return userType === "Empleado" ? "/dashboard" : "/company/dashboard";
  }, []);

  const getOnboardingRoute = useCallback((userType: UserType) => {
    return userType === "Empleado" ? "/onboarding" : "/company/onboarding";
  }, []);

  const getAuthRoute = useCallback((userType: UserType) => {
    return userType === "Empleado" ? "/auth/employee" : "/auth/company";
  }, []);

  const redirectToCorrectAuth = useCallback((userType: UserType) => {
    router.push(getAuthRoute(userType));
  }, [router, getAuthRoute]);

  return {
    routeAfterAuth,
    routeBasedOnAuth,
    getDefaultRoute,
    getOnboardingRoute,
    getAuthRoute,
    redirectToCorrectAuth
  };
}
