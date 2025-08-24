"use client";

import { useState, useCallback } from "react";

export interface CompanyProfile {
  id?: string;
  companyName: string;
  industry: string;
  companySize: string;
  website: string;
  description: string;
  contactEmail: string;
  contactName: string;
  contactPosition: string;
  location: string;
  benefits: string[];
  culture: string[];
  logo?: string;
  banner?: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface CompanyAuthState {
  isLoggedIn: boolean;
  profile: CompanyProfile | null;
  isLoading: boolean;
  error: string | null;
}

export function useCompanyAuth() {
  const [state, setState] = useState<CompanyAuthState>({
    isLoggedIn: false,
    profile: null,
    isLoading: false,
    error: null
  });

  const signup = useCallback(async (email: string, password: string, companyName: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("https://techrea.app.n8n.cloud/webhook/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          data: {
            display_name: companyName,
            type: "Empresa"
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        const companyProfile: CompanyProfile = {
          id: data.id || Date.now().toString(),
          companyName,
          industry: "",
          companySize: "",
          website: "",
          description: "",
          contactEmail: email,
          contactName: "",
          contactPosition: "",
          location: "",
          benefits: [],
          culture: [],
          socialLinks: {}
        };

        // Guardar en localStorage
        localStorage.setItem("company-profile", JSON.stringify(companyProfile));
        localStorage.setItem("company-auth", "true");

        setState({
          isLoggedIn: true,
          profile: companyProfile,
          isLoading: false,
          error: null
        });

        return { 
          success: true, 
          profile: companyProfile,
          data: {
            type: "Empresa" as const,
            display_name: companyName,
            profile: companyProfile
          }
        };
      } else {
        throw new Error("Error en el registro de empresa");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("https://techrea.app.n8n.cloud/webhook/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          data: {
            type: "Empresa"
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Recuperar perfil guardado o crear uno nuevo
        const savedProfile = localStorage.getItem("company-profile");
        const companyProfile: CompanyProfile = savedProfile 
          ? JSON.parse(savedProfile)
          : {
              id: data.id || Date.now().toString(),
              companyName: data.companyName || "Mi Empresa",
              industry: "",
              companySize: "",
              website: "",
              description: "",
              contactEmail: email,
              contactName: "",
              contactPosition: "",
              location: "",
              benefits: [],
              culture: [],
              socialLinks: {}
            };

        localStorage.setItem("company-auth", "true");
        localStorage.setItem("company-profile", JSON.stringify(companyProfile));

        setState({
          isLoggedIn: true,
          profile: companyProfile,
          isLoading: false,
          error: null
        });

        return { 
          success: true, 
          profile: companyProfile,
          data: {
            type: "Empresa" as const,
            display_name: companyProfile.companyName,
            profile: companyProfile
          }
        };
      } else {
        throw new Error("Credenciales incorrectas");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("company-auth");
    localStorage.removeItem("company-profile");
    setState({
      isLoggedIn: false,
      profile: null,
      isLoading: false,
      error: null
    });
  }, []);

  const updateProfile = useCallback((updatedProfile: Partial<CompanyProfile>) => {
    setState(prev => {
      if (!prev.profile) return prev;
      
      const newProfile = { ...prev.profile, ...updatedProfile };
      localStorage.setItem("company-profile", JSON.stringify(newProfile));
      
      return {
        ...prev,
        profile: newProfile
      };
    });
  }, []);

  // Verificar autenticación al cargar
  const checkAuth = useCallback(() => {
    const isAuthenticated = localStorage.getItem("company-auth") === "true";
    const savedProfile = localStorage.getItem("company-profile");
    
    if (isAuthenticated && savedProfile) {
      const profile = JSON.parse(savedProfile);
      setState({
        isLoggedIn: true,
        profile,
        isLoading: false,
        error: null
      });
    }
  }, []);

  return {
    ...state,
    signup,
    login,
    logout,
    updateProfile,
    checkAuth
  };
}
