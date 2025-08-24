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
  skills: Array<{name: string, percentage: number}>;
  
  // Descripción Personal
  personalDescription: string;
  
  // Objetivos
  careerGoals: string;
  
  // Perfil Visual
  profileImage?: string;
  bannerImage?: string;
  biography?: string;
  
  // Social Links removed
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
      // Preparar datos para el webhook
      const webhookData = {
        email: localStorage.getItem("user-email") || "usuario@axes.com",
        nombre_completo: profileData.fullName,
        edad: parseInt(profileData.age) || 0,
        ciudad: profileData.location.split(",")[0]?.trim() || profileData.location,
        pais: profileData.location.split(",")[1]?.trim() || "Colombia",
        cargo_actual: profileData.currentRole,
        empresa_actual: profileData.company,
        anos_experiencia: profileData.experience,
        nivel_educacion: profileData.education
      };

      // Enviar datos al webhook
      const response = await fetch("https://techrea.app.n8n.cloud/webhook/datos_usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const webhookResult = await response.json();
      console.log("✅ Datos enviados al webhook:", webhookResult);
      
      // Guardar en localStorage también
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({
        ...profileData,
        completedAt: new Date().toISOString(),
        status: "profile_completed",
        webhookData: webhookData
      }));

      console.log("✅ Perfil guardado localmente:", profileData);

      setIsLoading(false);
      return {
        success: true,
        message: "Perfil guardado y enviado exitosamente",
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
