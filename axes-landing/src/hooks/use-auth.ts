"use client";

import { useState } from "react";

interface SignupData {
  email: string;
  password: string;
  display_name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
}

const SIGNIN_URL = "https://techrea.app.n8n.cloud/webhook/signin";
const LOGIN_URL = "https://techrea.app.n8n.cloud/webhook/login";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (data: SignupData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Preparar JSON body
      const bodyData = {
        email: data.email,
        password: data.password,
        data: {
          display_name: data.display_name,
        },
      };

      console.log("🔄 Enviando signup request a:", SIGNIN_URL);
      console.log("📝 Datos enviados en body:", bodyData);

      const response = await fetch(SIGNIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; AXES-App/1.0)",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(bodyData),
      });

      console.log("📡 Headers de respuesta (signup):", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Intentar parsear JSON, si está vacío usar objeto vacío
      let result = {};
      const text = await response.text();
      console.log("📥 Respuesta del servidor (signup):", text);
      console.log("📊 Status de respuesta:", response.status);
      
      if (text) {
        try {
          result = JSON.parse(text);
        } catch {
          result = { message: text };
        }
      }

      setIsLoading(false);

      return {
        success: true,
        message: "Cuenta creada exitosamente",
        data: result,
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

  const login = async (data: LoginData): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Preparar JSON body
      const bodyData = {
        email: data.email,
        password: data.password,
      };

      console.log("🔄 Enviando login request a:", LOGIN_URL);
      console.log("📝 Datos enviados en body:", bodyData);

      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; AXES-App/1.0)",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(bodyData),
      });

      console.log("📡 Headers de respuesta (login):", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Intentar parsear JSON, si está vacío usar objeto vacío
      let result = {};
      const text = await response.text();
      console.log("📥 Respuesta del servidor (login):", text);
      console.log("📊 Status de respuesta:", response.status);
      
      if (text) {
        try {
          result = JSON.parse(text);
        } catch {
          result = { message: text };
        }
      }

      setIsLoading(false);

      return {
        success: true,
        message: "Inicio de sesión exitoso",
        data: result,
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

  const clearError = () => setError(null);

  return {
    signup,
    login,
    isLoading,
    error,
    clearError,
  };
}
