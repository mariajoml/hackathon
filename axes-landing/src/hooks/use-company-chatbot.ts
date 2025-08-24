"use client";

import { useState, useCallback } from "react";

export interface CompanyChatMessage {
  id: string;
  content: string;
  sender: "ai" | "company";
  timestamp: Date;
}

export interface CompanyRequirements {
  position: string;
  department: string;
  level: "junior" | "mid" | "senior" | "lead";
  workMode: "remoto" | "presencial" | "hibrido";
  contractType: "tiempo-completo" | "tiempo-parcial" | "contrato" | "freelance";
  requiredSkills: string[];
  softSkills: string[];
  experience: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  benefits: string[];
  startDate: string;
  urgency: "alta" | "media" | "baja";
}

export interface CompanyChatbotState {
  phase: "intro" | "position_details" | "requirements" | "culture_fit" | "finalization" | "completed";
  currentQuestionIndex: number;
  messages: CompanyChatMessage[];
  requirements: Partial<CompanyRequirements>;
  isTyping: boolean;
}

const COMPANY_CONVERSATION_FLOW = [
  {
    phase: "intro",
    ai: "¡Hola! Soy AXES AI, tu asistente para encontrar el talento perfecto. Vamos a crear una vacante que atraiga exactamente al tipo de persona que necesitas. ¿Cómo te sientes con este proceso?",
    responses: ["¡Perfecto! Necesito encontrar talento de calidad", "Un poco ansioso, es difícil encontrar buenos candidatos", "Emocionado por probar algo nuevo"]
  },
  {
    phase: "position_details",
    ai: "Excelente actitud. Primero, hablemos del puesto. ¿Para qué posición específica estás contratando? Sé lo más específico posible, esto me ayudará a entender exactamente qué tipo de perfil necesitas.",
    responses: ["Desarrollador Frontend React", "Data Scientist", "Product Manager", "Otro..."]
  },
  {
    phase: "requirements",
    ai: "Perfecto. Ahora, ¿cuál es el nivel de experiencia que buscas? Esto me ayudará a ajustar las evaluaciones técnicas.",
    responses: ["Junior (0-2 años)", "Mid (2-5 años)", "Senior (5+ años)", "Lead/Arquitecto (8+ años)"]
  },
  {
    phase: "culture_fit",
    ai: "Entiendo. Una de las claves del éxito es el 'culture fit'. ¿Qué tipo de personalidad encaja mejor con tu equipo? ¿Alguien más independiente, colaborativo, innovador?",
    responses: ["Independiente y proactivo", "Colaborativo y comunicativo", "Innovador y creativo", "Analítico y metódico"]
  },
  {
    phase: "finalization",
    ai: "¡Genial! Con esta información ya puedo crear una vacante súper específica. AXES AI se encargará de hacer match con candidatos que no solo tengan las skills técnicas, sino también el perfil psicológico que necesitas. ¿Te parece bien?",
    responses: ["¡Perfecto, vamos a crear la vacante!", "Me gustaría ajustar algo más", "Quiero revisar los detalles"]
  }
];

export function useCompanyChatbot() {
  const [state, setState] = useState<CompanyChatbotState>({
    phase: "intro",
    currentQuestionIndex: 0,
    messages: [],
    requirements: {},
    isTyping: false
  });

  const addMessage = useCallback((content: string, sender: "ai" | "company") => {
    const message: CompanyChatMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  }, []);

  const setTyping = useCallback((isTyping: boolean) => {
    setState(prev => ({ ...prev, isTyping }));
  }, []);

  const handleResponse = useCallback((response: string) => {
    // Agregar respuesta de la empresa
    addMessage(response, "company");
    
    setTyping(true);
    
    // Simular delay de AI
    setTimeout(() => {
      const currentFlow = COMPANY_CONVERSATION_FLOW[state.currentQuestionIndex];
      
      // Procesar respuesta y actualizar requirements
      setState(prev => {
        const newRequirements = { ...prev.requirements };
        
        switch (currentFlow.phase) {
          case "position_details":
            newRequirements.position = response;
            break;
          case "requirements":
            if (response.includes("Junior")) newRequirements.level = "junior";
            else if (response.includes("Mid")) newRequirements.level = "mid";
            else if (response.includes("Senior")) newRequirements.level = "senior";
            else if (response.includes("Lead")) newRequirements.level = "lead";
            break;
          case "culture_fit":
            if (response.includes("independiente")) {
              newRequirements.softSkills = ["autonomía", "proactividad", "autodisciplina"];
            } else if (response.includes("colaborativo")) {
              newRequirements.softSkills = ["trabajo en equipo", "comunicación", "empatía"];
            } else if (response.includes("innovador")) {
              newRequirements.softSkills = ["creatividad", "pensamiento crítico", "adaptabilidad"];
            } else if (response.includes("analítico")) {
              newRequirements.softSkills = ["análisis", "atención al detalle", "resolución de problemas"];
            }
            break;
        }
        
        return {
          ...prev,
          requirements: newRequirements
        };
      });

      // Avanzar a la siguiente pregunta
      const nextIndex = state.currentQuestionIndex + 1;
      
      if (nextIndex < COMPANY_CONVERSATION_FLOW.length) {
        const nextFlow = COMPANY_CONVERSATION_FLOW[nextIndex];
        addMessage(nextFlow.ai, "ai");
        
        setState(prev => ({
          ...prev,
          currentQuestionIndex: nextIndex,
          phase: nextFlow.phase as any
        }));
      } else {
        // Conversación completada
        setState(prev => ({
          ...prev,
          phase: "completed"
        }));
      }
      
      setTyping(false);
    }, 2000);
  }, [state.currentQuestionIndex, addMessage, setTyping]);

  const getCurrentOptions = useCallback(() => {
    if (state.currentQuestionIndex < COMPANY_CONVERSATION_FLOW.length) {
      return COMPANY_CONVERSATION_FLOW[state.currentQuestionIndex].responses;
    }
    return [];
  }, [state.currentQuestionIndex]);

  const startConversation = useCallback(() => {
    if (state.messages.length === 0) {
      const firstMessage = COMPANY_CONVERSATION_FLOW[0];
      addMessage(firstMessage.ai, "ai");
    }
  }, [state.messages.length, addMessage]);

  const resetConversation = useCallback(() => {
    setState({
      phase: "intro",
      currentQuestionIndex: 0,
      messages: [],
      requirements: {},
      isTyping: false
    });
  }, []);

  return {
    state,
    addMessage,
    handleResponse,
    getCurrentOptions,
    startConversation,
    resetConversation,
    setTyping
  };
}
