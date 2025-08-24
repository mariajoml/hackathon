"use client";

import { useState, useCallback, useEffect } from "react";
import type { CompanyProfile } from "./use-company-auth";

export interface CompanyOnboardingData extends CompanyProfile {
  currentStep: number;
  isCompleted: boolean;
}

const INITIAL_DATA: CompanyOnboardingData = {
  currentStep: 1,
  isCompleted: false,
  companyName: "",
  industry: "",
  companySize: "",
  website: "",
  description: "",
  contactEmail: "",
  contactName: "",
  contactPosition: "",
  location: "",
  benefits: [],
  culture: [],
  logo: "",
  banner: "",
  bio: "",
      socialLinks: {
      linkedin: "",
      twitter: "",
      website: ""
    }
};

export function useCompanyOnboarding() {
  const [data, setData] = useState<CompanyOnboardingData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const savedData = localStorage.getItem("company-onboarding");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setData(parsed);
      } catch (error) {
        console.error("Error parsing company onboarding data:", error);
      }
    }
  }, []);

  // Guardar en localStorage cada vez que cambien los datos
  useEffect(() => {
    localStorage.setItem("company-onboarding", JSON.stringify(data));
  }, [data]);

  const updateData = useCallback((updates: Partial<CompanyOnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setData(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  }, []);

  const prevStep = useCallback(() => {
    setData(prev => ({ 
      ...prev, 
      currentStep: Math.max(1, prev.currentStep - 1) 
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setData(prev => ({ ...prev, currentStep: step }));
  }, []);

  const addBenefit = useCallback((benefit: string) => {
    if (benefit.trim()) {
      setData(prev => ({
        ...prev,
        benefits: [...prev.benefits, benefit.trim()]
      }));
    }
  }, []);

  const removeBenefit = useCallback((index: number) => {
    setData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  }, []);

  const addCultureValue = useCallback((value: string) => {
    if (value.trim()) {
      setData(prev => ({
        ...prev,
        culture: [...prev.culture, value.trim()]
      }));
    }
  }, []);

  const removeCultureValue = useCallback((index: number) => {
    setData(prev => ({
      ...prev,
      culture: prev.culture.filter((_, i) => i !== index)
    }));
  }, []);

  const completeOnboarding = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Simular guardado en el servidor
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Marcar como completado
      const completedData = { ...data, isCompleted: true };
      setData(completedData);
      
      // Guardar perfil final en localStorage
      const {currentStep, isCompleted, ...companyProfile} = completedData;
      localStorage.setItem("company-profile", JSON.stringify(companyProfile));
      localStorage.setItem("company-auth", "true");
      
      return { success: true };
    } catch (error) {
      console.error("Error completing onboarding:", error);
      return { success: false, error: "Error al completar el registro" };
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  const resetOnboarding = useCallback(() => {
    setData(INITIAL_DATA);
    localStorage.removeItem("company-onboarding");
  }, []);

  const getStepValidation = useCallback((step: number) => {
    switch (step) {
      case 1: // Información básica
        return !!(data.companyName && data.industry && data.companySize);
      case 2: // Detalles de contacto
        return !!(data.contactName && data.contactEmail && data.contactPosition && data.location);
      case 3: // Perfil empresarial
        return !!(data.description && data.website);
      case 4: // Cultura y beneficios
        return data.benefits.length > 0 && data.culture.length > 0;
      case 5: // Chatbot de validación
        return true; // Siempre puede proceder después del chatbot
      case 6: // Perfil completo (imagen, bio)
        return !!(data.logo && data.bio);
      default:
        return false;
    }
  }, [data]);

  const canProceed = getStepValidation(data.currentStep);

  return {
    data,
    isLoading,
    canProceed,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    addBenefit,
    removeBenefit,
    addCultureValue,
    removeCultureValue,
    completeOnboarding,
    resetOnboarding,
    getStepValidation
  };
}
