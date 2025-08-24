"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCompanyAuth } from "@/hooks/use-company-auth";
import { Building2, Mail, Lock, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function CompanyLoginPage() {
  const router = useRouter();
  const { login, signup, isLoading } = useCompanyAuth();
  
  // Login form
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  // Signup form
  const [signupData, setSignupData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    const result = await login(loginData.email, loginData.password);
    
    if (result.success) {
      toast.success("¡Bienvenido de vuelta!");
      router.push("/company/dashboard");
    } else {
      toast.error(result.error || "Error al iniciar sesión");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupData.companyName || !signupData.email || !signupData.password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (signupData.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const result = await signup(signupData.email, signupData.password, signupData.companyName);
    
    if (result.success) {
      toast.success("¡Registro exitoso!");
      router.push("/company/onboarding");
    } else {
      toast.error(result.error || "Error al registrar empresa");
    }
  };

  return (
    <div className="min-h-screen axes-bg-primary">
      {/* Header */}
      <header className="axes-nav border-b border-axes-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Building2 className="w-6 h-6 text-axes-primary" />
              <h1 className="text-xl font-bold text-axes-text-primary">
                AXES
                <span className="text-axes-primary ml-1">Empresas</span>
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-axes-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-axes-text-primary mb-2">
              Encuentra talento excepcional
            </h1>
            <p className="text-axes-text-secondary">
              Únete a AXES y descubre desarrolladores validados por IA
            </p>
          </div>

          <Card className="axes-card">
            <CardContent className="p-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 axes-bg-secondary">
                  <TabsTrigger value="login" className="data-[state=active]:bg-axes-primary data-[state=active]:text-white">
                    Iniciar Sesión
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-axes-primary data-[state=active]:text-white">
                    Registrarse
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="text-axes-text-secondary text-sm font-medium block mb-2">
                        Email corporativo
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-axes-text-muted w-4 h-4" />
                        <Input
                          type="email"
                          placeholder="empresa@ejemplo.com"
                          value={loginData.email}
                          onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                          className="pl-10 axes-input"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-axes-text-secondary text-sm font-medium block mb-2">
                        Contraseña
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-axes-text-muted w-4 h-4" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          className="pl-10 axes-input"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full axes-btn-primary py-3"
                    >
                      {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-6">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <label className="text-axes-text-secondary text-sm font-medium block mb-2">
                        Nombre de la empresa
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-axes-text-muted w-4 h-4" />
                        <Input
                          type="text"
                          placeholder="TechCorp Solutions"
                          value={signupData.companyName}
                          onChange={(e) => setSignupData({...signupData, companyName: e.target.value})}
                          className="pl-10 axes-input"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-axes-text-secondary text-sm font-medium block mb-2">
                        Email corporativo
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-axes-text-muted w-4 h-4" />
                        <Input
                          type="email"
                          placeholder="rrhh@empresa.com"
                          value={signupData.email}
                          onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                          className="pl-10 axes-input"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-axes-text-secondary text-sm font-medium block mb-2">
                        Contraseña
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-axes-text-muted w-4 h-4" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={signupData.password}
                          onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                          className="pl-10 axes-input"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-axes-text-secondary text-sm font-medium block mb-2">
                        Confirmar contraseña
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-axes-text-muted w-4 h-4" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                          className="pl-10 axes-input"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full axes-btn-primary py-3"
                    >
                      {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="mt-8 space-y-4">
            <h3 className="text-center text-axes-text-primary font-semibold">
              ¿Por qué elegir AXES?
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-500 font-bold">✓</span>
                </div>
                <span className="text-axes-text-secondary">
                  Candidatos pre-validados con IA
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-500 font-bold">✓</span>
                </div>
                <span className="text-axes-text-secondary">
                  Matching inteligente por soft skills
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-500 font-bold">✓</span>
                </div>
                <span className="text-axes-text-secondary">
                  Evaluaciones técnicas personalizadas
                </span>
              </div>
            </div>
          </div>

          {/* Back to main site */}
          <div className="text-center mt-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="axes-btn-ghost text-sm"
            >
              ← Volver al sitio principal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
