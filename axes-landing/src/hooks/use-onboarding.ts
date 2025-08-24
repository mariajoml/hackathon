"use client";

import { useState } from "react";

interface ProfileData {
  // Información Personal
  fullName: string;
  age: string;
  location: string;
  
  // Información Profesional
  currentRole: string;
  company: string;
  experience: string;
  education: string;
  
  // Habilidades Técnicas
  skills: string[];
  
  // Objetivos
  careerGoals: string;
  
  // Perfil Visual
  profileImage?: string;
  bannerImage?: string;
  biography?: string;
  
  // Social Links (opcional)
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

interface OnboardingResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// Por ahora usaremos localStorage, pero esto se puede conectar a una API
const PROFILE_STORAGE_KEY = "axes_user_profile";

export function useOnboarding() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveProfile = async (profileData: ProfileData): Promise<OnboardingResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Guardar en localStorage por ahora
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({
        ...profileData,
        completedAt: new Date().toISOString(),
        status: "profile_completed"
      }));

      console.log("✅ Perfil guardado:", profileData);

      setIsLoading(false);
      return {
        success: true,
        message: "Perfil guardado exitosamente",
        data: profileData
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      setIsLoading(false);

      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const getProfile = (): ProfileData | null => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  };

  const clearProfile = () => {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  };

  const isProfileComplete = (): boolean => {
    const profile = getProfile();
    // Verificar si el perfil tiene los campos básicos requeridos
    return !!(profile?.fullName && profile?.currentRole && profile?.skills && profile?.skills.length > 0);
  };

  const clearError = () => setError(null);

  return {
    saveProfile,
    getProfile,
    clearProfile,
    isProfileComplete,
    isLoading,
    error,
    clearError,
  };
}
