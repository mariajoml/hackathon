"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCompanyChatbot } from "@/hooks/use-company-chatbot";
import { Bot, Building2, ArrowRight, Users, CheckCircle } from "lucide-react";

export default function CompanyChatbotPage() {
  const router = useRouter();
  const {
    state,
    handleResponse,
    getCurrentOptions,
    startConversation
  } = useCompanyChatbot();

  useEffect(() => {
    startConversation();
  }, [startConversation]);

  const handleOptionClick = (response: string) => {
    handleResponse(response);
  };

  const handleCreateVacancy = () => {
    // Guardar requirements en localStorage
    localStorage.setItem("company-vacancy-requirements", JSON.stringify(state.requirements));
    router.push("/company/dashboard?tab=create-vacancy");
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="axes-card">
              <div className="p-6">
                {/* Chat Header */}
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-axes-border">
                  <div className="w-12 h-12 bg-axes-primary rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-axes-text-primary font-semibold">AXES AI</h3>
                    <p className="text-axes-text-muted text-sm">Asistente de reclutamiento</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {state.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "company" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          message.sender === "company"
                            ? "bg-axes-primary text-white"
                            : "axes-card border"
                        }`}
                      >
                        {message.sender === "ai" && (
                          <div className="flex items-center space-x-2 mb-2">
                            <Bot className="w-4 h-4 text-axes-primary" />
                            <span className="text-xs font-medium text-axes-text-muted">AXES AI</span>
                          </div>
                        )}
                        <p className={`text-sm leading-relaxed ${
                          message.sender === "company" ? "text-white" : "text-axes-text-primary"
                        }`}>
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {state.isTyping && (
                    <div className="flex justify-start">
                      <div className="axes-card border p-4 rounded-2xl max-w-[80%]">
                        <div className="flex items-center space-x-2 mb-2">
                          <Bot className="w-4 h-4 text-axes-primary" />
                          <span className="text-xs font-medium text-axes-text-muted">AXES AI</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-axes-text-muted rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-axes-text-muted rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-axes-text-muted rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Response Options */}
                {!state.isTyping && state.phase !== "completed" && (
                  <div className="space-y-2">
                    <p className="text-axes-text-muted text-xs mb-3">Selecciona una respuesta:</p>
                    {getCurrentOptions().map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        className="w-full justify-start text-left axes-btn-secondary hover:axes-btn-primary transition-all duration-300"
                        variant="outline"
                      >
                        <ArrowRight className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">{option}</span>
                      </Button>
                    ))}
                  </div>
                )}

                {/* Completion Actions */}
                {state.phase === "completed" && (
                  <div className="text-center py-6">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-axes-text-primary mb-2">
                      ¡Perfil de vacante listo!
                    </h3>
                    <p className="text-axes-text-secondary mb-6">
                      AXES AI ha recopilado toda la información necesaria para crear tu vacante personalizada.
                    </p>
                    <Button
                      onClick={handleCreateVacancy}
                      className="axes-btn-primary px-8 py-3"
                    >
                      Crear Vacante
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <Card className="axes-card">
              <div className="p-6">
                <h3 className="text-axes-text-primary font-semibold text-sm mb-4">Progreso</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-axes-text-muted text-sm">Información inicial</span>
                    <span className="text-sm">
                      {state.phase !== "intro" ? "✅" : "⏳"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-axes-text-muted text-sm">Detalles del puesto</span>
                    <span className="text-sm">
                      {["requirements", "culture_fit", "finalization", "completed"].includes(state.phase) ? "✅" : "⏳"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-axes-text-muted text-sm">Culture fit</span>
                    <span className="text-sm">
                      {["finalization", "completed"].includes(state.phase) ? "✅" : "⏳"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-axes-text-muted text-sm">Finalización</span>
                    <span className="text-sm">
                      {state.phase === "completed" ? "✅" : "⏳"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Requirements Preview */}
            {Object.keys(state.requirements).length > 0 && (
              <Card className="axes-card">
                <div className="p-6">
                  <h3 className="text-axes-text-primary font-semibold text-sm mb-4">
                    <Users className="w-4 h-4 inline mr-2" />
                    Perfil recopilado
                  </h3>
                  <div className="space-y-2 text-sm">
                    {state.requirements.position && (
                      <div>
                        <span className="text-axes-text-muted">Posición:</span>
                        <span className="text-axes-text-primary ml-2 font-medium">
                          {state.requirements.position}
                        </span>
                      </div>
                    )}
                    {state.requirements.level && (
                      <div>
                        <span className="text-axes-text-muted">Nivel:</span>
                        <span className="text-axes-text-primary ml-2 font-medium capitalize">
                          {state.requirements.level}
                        </span>
                      </div>
                    )}
                    {state.requirements.softSkills && state.requirements.softSkills.length > 0 && (
                      <div>
                        <span className="text-axes-text-muted">Soft Skills:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {state.requirements.softSkills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-axes-primary/20 text-axes-primary px-2 py-1 rounded-md text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Info */}
            <Card className="axes-card">
              <div className="p-6">
                <h3 className="text-axes-text-primary font-semibold text-sm mb-3">
                  ¿Cómo funciona?
                </h3>
                <div className="space-y-3 text-xs text-axes-text-muted">
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 bg-axes-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                    <span>AXES AI analiza tus respuestas para entender el perfil ideal</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 bg-axes-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                    <span>Creamos una vacante personalizada con evaluaciones específicas</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 bg-axes-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                    <span>Hacemos match inteligente con candidatos que encajan perfectamente</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
