"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { User, Building2, ArrowRight, ChevronLeft } from "lucide-react";

export default function AuthPage() {
  const [selectedType, setSelectedType] = useState<'employee' | 'company' | null>(null);
  const router = useRouter();

  const handleTypeSelection = (type: 'employee' | 'company') => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType === 'employee') {
      router.push('/auth/employee');
    } else if (selectedType === 'company') {
      router.push('/auth/company');
    }
  };

  const handleGoBack = () => {
    router.push('/');
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
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Text */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-axes-text-primary mb-6">
              ¿Cómo quieres usar{" "}
              <span className="bg-gradient-to-r from-[#7C3AED] via-[#5B21B6] to-axes-text-primary bg-clip-text text-transparent">
                AXES
              </span>
              ?
            </h1>
            <p className="text-xl text-axes-text-secondary max-w-2xl mx-auto">
              Selecciona tu perfil para acceder a las herramientas adecuadas para ti
            </p>
          </div>

          {/* User Type Selection */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Empleado Option */}
            <Card
              className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedType === 'employee'
                  ? 'ring-4 ring-[#7C3AED] border-[#7C3AED] axes-card'
                  : 'axes-card hover:shadow-xl'
              }`}
              onClick={() => handleTypeSelection('employee')}
            >
              <CardContent className="p-8 text-center">
                <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                  selectedType === 'employee'
                    ? 'bg-[#7C3AED] text-white shadow-lg'
                    : 'bg-axes-bg-hover text-axes-text-secondary'
                }`}>
                  <User className="w-10 h-10" />
                </div>
                
                <h3 className="text-2xl font-bold text-axes-text-primary mb-4">
                  Soy Empleado
                </h3>
                
                <p className="text-axes-text-secondary mb-6">
                  Busco oportunidades de trabajo, quiero demostrar mis habilidades y conectar con empresas
                </p>
                
                <div className="space-y-2 text-sm text-axes-text-muted">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                    <span>Crear perfil profesional</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                    <span>Validar habilidades con IA</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                    <span>Conectar con empresas</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Empresa Option */}
            <Card
              className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedType === 'company'
                  ? 'ring-4 ring-[#7C3AED] border-[#7C3AED] axes-card'
                  : 'axes-card hover:shadow-xl'
              }`}
              onClick={() => handleTypeSelection('company')}
            >
              <CardContent className="p-8 text-center">
                <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                  selectedType === 'company'
                    ? 'bg-[#7C3AED] text-white shadow-lg'
                    : 'bg-axes-bg-hover text-axes-text-secondary'
                }`}>
                  <Building2 className="w-10 h-10" />
                </div>
                
                <h3 className="text-2xl font-bold text-axes-text-primary mb-4">
                  Soy Empresa
                </h3>
                
                <p className="text-axes-text-secondary mb-6">
                  Busco talento, quiero crear vacantes y encontrar candidatos ideales para mi equipo
                </p>
                
                <div className="space-y-2 text-sm text-axes-text-muted">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                    <span>Crear perfil empresarial</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                    <span>Publicar vacantes inteligentes</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-[#7C3AED] rounded-full"></div>
                    <span>Evaluar candidatos con IA</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Continue Button */}
          {selectedType && (
            <div className="animate-in slide-in-from-bottom duration-500">
              <Button
                onClick={handleContinue}
                className="axes-btn-primary rounded-2xl px-8 py-3 text-lg font-semibold group"
              >
                Continuar como {selectedType === 'employee' ? 'Empleado' : 'Empresa'}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-12 p-6 axes-glass rounded-2xl">
            <p className="text-axes-text-muted text-sm">
              ¿No estás seguro? Puedes cambiar tu tipo de cuenta más tarde o crear múltiples perfiles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
