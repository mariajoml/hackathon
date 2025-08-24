"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building2, ArrowRight } from "lucide-react";

interface UserTypeSelectorProps {
  onSelect: (type: "Empleado" | "Empresa") => void;
  onBack?: () => void;
}

export function UserTypeSelector({ onSelect, onBack }: UserTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<"Empleado" | "Empresa" | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      onSelect(selectedType);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-axes-bg-primary via-axes-bg-secondary to-axes-bg-tertiary">
      <Card className="w-full max-w-2xl axes-card p-8 shadow-xl rounded-2xl">
        <CardHeader className="text-center mb-8">
          <CardTitle className="text-4xl font-bold text-axes-primary mb-4">
            ¿Qué tipo de usuario eres?
          </CardTitle>
          <CardDescription className="text-xl text-axes-text-secondary">
            Selecciona tu tipo de cuenta para continuar con el registro
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Opción Empleado */}
          <div
            className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
              selectedType === "Empleado"
                ? "border-axes-primary bg-axes-primary/10"
                : "border-axes-border hover:border-axes-primary/50 hover:bg-axes-bg-hover"
            }`}
            onClick={() => setSelectedType("Empleado")}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-axes-primary/20 p-3 rounded-xl">
                <User className="w-8 h-8 text-axes-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-axes-text-primary mb-2">
                  Empleado
                </h3>
                <p className="text-axes-text-secondary">
                  Busco oportunidades laborales y quiero mostrar mis habilidades
                </p>
              </div>
              {selectedType === "Empleado" && (
                <div className="bg-axes-primary text-white p-2 rounded-full">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>

          {/* Opción Empresa */}
          <div
            className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
              selectedType === "Empresa"
                ? "border-axes-primary bg-axes-primary/10"
                : "border-axes-border hover:border-axes-primary/50 hover:bg-axes-bg-hover"
            }`}
            onClick={() => setSelectedType("Empresa")}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-axes-primary/20 p-3 rounded-xl">
                <Building2 className="w-8 h-8 text-axes-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-axes-text-primary mb-2">
                  Empresa
                </h3>
                <p className="text-axes-text-secondary">
                  Busco talento y quiero publicar vacantes
                </p>
              </div>
              {selectedType === "Empresa" && (
                <div className="bg-axes-primary text-white p-2 rounded-full">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-between pt-6">
            {onBack && (
              <Button
                variant="outline"
                onClick={onBack}
                className="axes-btn-secondary rounded-xl px-6"
              >
                Volver
              </Button>
            )}
            <Button
              onClick={handleContinue}
              disabled={!selectedType}
              className="axes-btn-primary rounded-xl px-8 ml-auto"
            >
              Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
