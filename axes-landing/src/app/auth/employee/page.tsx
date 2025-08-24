"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { User, Mail, Lock, Eye, EyeOff, ChevronLeft, Building2 } from "lucide-react";

export default function EmployeeAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { login, signup, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
        });
        // El hook ya maneja la navegación automáticamente
      } else {
                            await signup({
                      email: formData.email,
                      password: formData.password,
                      data: {
                        display_name: formData.name,
                        type: "Empleado"
                      }
                    });
        // El hook ya maneja la navegación automáticamente
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGoBack = () => {
    router.push('/auth');
  };

  const handleSwitchToCompany = () => {
    router.push('/auth/company');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <nav className="axes-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-[#7C3AED] rounded-lg w-8 h-8 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-axes-primary font-bold text-xl">AXES</span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                variant="ghost"
                onClick={handleGoBack}
                className="axes-btn-ghost rounded-xl"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md mx-auto w-full">
          <Card className="axes-card">
            <CardHeader className="space-y-1 text-center">
              <div className="w-16 h-16 mx-auto bg-[#7C3AED] rounded-2xl flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-axes-text-primary">
                {isLogin ? "Bienvenido de vuelta" : "Crea tu cuenta"}
              </CardTitle>
              <CardDescription className="text-axes-text-secondary">
                {isLogin 
                  ? "Accede a tu perfil profesional en AXES"
                  : "Únete a AXES y demuestra tu talento"
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-axes-text-secondary">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-axes-text-muted" />
                      <Input
                        name="name"
                        type="text"
                        placeholder="Tu nombre completo"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="axes-input pl-10"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-axes-text-secondary">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-axes-text-muted" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="axes-input pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-axes-text-secondary">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-axes-text-muted" />
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="axes-input pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-axes-text-muted hover:text-axes-text-secondary"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full axes-btn-primary rounded-xl py-3"
                >
                  {isLoading 
                    ? "Procesando..." 
                    : isLogin 
                      ? "Iniciar Sesión" 
                      : "Crear Cuenta"
                  }
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-axes-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-axes-bg-card px-2 text-axes-text-muted">O</span>
                </div>
              </div>

              <div className="text-center space-y-4">
                <Button
                  variant="ghost"
                  onClick={() => setIsLogin(!isLogin)}
                  className="axes-btn-ghost text-sm"
                >
                  {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                  <span className="text-[#7C3AED] hover:underline">
                    {isLogin ? "Regístrate" : "Inicia sesión"}
                  </span>
                </Button>

                <div className="pt-4 border-t border-axes-border">
                  <Button
                    variant="outline"
                    onClick={handleSwitchToCompany}
                    className="axes-btn-outline w-full rounded-xl"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Acceso para Empresas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
