"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

export function AuthSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  // Form data states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  
  // Toast states
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });
  
  // Auth hook
  const { signup, login, isLoading, error, clearError } = useAuth();
  
  // Form validation
  const validateForm = () => {
    if (!email || !password) {
      showToast("Por favor completa todos los campos", "error");
      return false;
    }
    
    if (!isLogin) {
      if (!displayName) {
        showToast("Por favor ingresa tu nombre completo", "error");
        return false;
      }
      if (password !== confirmPassword) {
        showToast("Las contraseñas no coinciden", "error");
        return false;
      }
      if (password.length < 6) {
        showToast("La contraseña debe tener al menos 6 caracteres", "error");
        return false;
      }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Por favor ingresa un email válido", "error");
      return false;
    }
    
    return true;
  };
  
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, isVisible: true });
  };
  
  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
    clearError();
  };
  
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setDisplayName("");
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (isLogin) {
        const result = await login({ email, password });
        if (result.success) {
          showToast("¡Inicio de sesión exitoso! Redirigiendo...", "success");
          resetForm();
          // Redirigir al onboarding después de un breve delay
          setTimeout(() => {
            window.location.href = "/onboarding";
          }, 1500);
        } else {
          showToast(result.message || "Error al iniciar sesión", "error");
        }
      } else {
        const result = await signup({ email, password, display_name: displayName });
        if (result.success) {
          showToast("¡Cuenta creada exitosamente! Ya puedes iniciar sesión", "success");
          resetForm();
          setIsLogin(true);
        } else {
          showToast(result.message || "Error al crear la cuenta", "error");
        }
      }
    } catch (err) {
      showToast("Error de conexión. Inténtalo nuevamente", "error");
    }
  };
  
  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
    clearError();
    hideToast();
  };

  return (
    <section id="auth" className="py-20 px-4">
      <div className="max-w-md mx-auto">
        <Card className="bg-black/50 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">
                {isLogin ? "Bienvenido de vuelta" : "Únete a AXES"}
              </h2>
              <p className="text-white/70">
                {isLogin 
                  ? "Ingresa a tu cuenta para continuar" 
                  : "Crea tu cuenta y comienza a mostrar tu trabajo real"
                }
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Display Name (only for register) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="displayName" className="text-white/80 text-sm font-medium">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#7C3AED] rounded-xl"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-white/80 text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#7C3AED] rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-white/80 text-sm font-medium">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#7C3AED] rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password (only for register) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-white/80 text-sm font-medium">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#7C3AED] rounded-xl"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}
            </form>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7C3AED] hover:bg-[#5B21B6] text-white rounded-xl py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{isLogin ? "Ingresando..." : "Creando cuenta..."}</span>
                </div>
              ) : (
                isLogin ? "Ingresar" : "Crear cuenta"
              )}
            </Button>

            {/* Forgot Password (only for login) */}
            {isLogin && (
              <div className="text-center">
                <a
                  href="#"
                  className="text-[#7C3AED] hover:text-[#5B21B6] text-sm transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}

            {/* Toggle Mode */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-white/70 text-sm">
                {isLogin ? "¿Nuevo aquí?" : "¿Ya tienes cuenta?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  disabled={isLoading}
                  className="text-[#7C3AED] hover:text-[#5B21B6] font-semibold transition-colors disabled:opacity-50"
                >
                  {isLogin ? "Regístrate gratis" : "Inicia sesión"}
                </button>
              </p>
            </div>

            {/* Debug Section (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-white/60 text-xs mb-2">🔧 Debug Mode</p>
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={async () => {
                      const testData = {
                        email: "test@axes.com",
                        password: "test123",
                        display_name: "Usuario Test"
                      };
                      console.log("🧪 Testing signup endpoint...");
                      const result = await signup(testData);
                      console.log("📋 Resultado del test:", result);
                    }}
                    className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded"
                  >
                    Test Signup
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const testData = {
                        email: "test@axes.com",
                        password: "test123"
                      };
                      console.log("🧪 Testing login endpoint...");
                      const result = await login(testData);
                      console.log("📋 Resultado del test:", result);
                    }}
                    className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded"
                  >
                    Test Login
                  </button>
                </div>
              </div>
            )}

            {/* Social Login Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/50 text-white/60">O continúa con</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="border-white/20 text-white/80 hover:bg-white/10 rounded-xl"
              >
                GitHub
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white/80 hover:bg-white/10 rounded-xl"
              >
                Google
              </Button>
            </div>

            {/* Terms */}
            {!isLogin && (
              <p className="text-white/60 text-xs text-center">
                Al crear una cuenta, aceptas nuestros{" "}
                <a href="#" className="text-[#7C3AED] hover:underline">
                  Términos de Servicio
                </a>{" "}
                y{" "}
                <a href="#" className="text-[#7C3AED] hover:underline">
                  Política de Privacidad
                </a>
              </p>
            )}
          </div>
        </Card>
      </div>
      
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </section>
  );
}
