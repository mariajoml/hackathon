"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSmartRouting } from "@/hooks/use-smart-routing";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedUserTypes: ("Empleado" | "Empresa")[];
  redirectTo?: string;
}

export function RouteGuard({ 
  children, 
  allowedUserTypes, 
  redirectTo 
}: RouteGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { getAuthRoute } = useSmartRouting();

  useEffect(() => {
    const checkAuth = () => {
      // Verificar autenticación de empleado
      const employeeAuth = localStorage.getItem("axes-employee-auth");
      const employeeProfile = localStorage.getItem("axes-employee-profile");
      
      // Verificar autenticación de empresa
      const companyAuth = localStorage.getItem("company-auth");
      const companyProfile = localStorage.getItem("company-profile");

      let currentUserType: "Empleado" | "Empresa" | null = null;

      if (employeeAuth === "true" && employeeProfile) {
        currentUserType = "Empleado";
      } else if (companyAuth === "true" && companyProfile) {
        currentUserType = "Empresa";
      }

      if (currentUserType && allowedUserTypes.includes(currentUserType)) {
        setIsAuthorized(true);
      } else if (currentUserType && !allowedUserTypes.includes(currentUserType)) {
        // Usuario autenticado pero del tipo incorrecto
        const correctRoute = currentUserType === "Empleado" ? "/dashboard" : "/company/dashboard";
        router.push(correctRoute);
      } else {
        // No autenticado
        const authRoute = redirectTo || getAuthRoute(allowedUserTypes[0]);
        router.push(authRoute);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [allowedUserTypes, redirectTo, router, getAuthRoute]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

// Guardias específicos para conveniencia
export function EmployeeRouteGuard({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedUserTypes={["Empleado"]} redirectTo="/auth/employee">
      {children}
    </RouteGuard>
  );
}

export function CompanyRouteGuard({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedUserTypes={["Empresa"]} redirectTo="/auth/company">
      {children}
    </RouteGuard>
  );
}
