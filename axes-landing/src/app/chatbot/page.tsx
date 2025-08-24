"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SwipeCard } from "@/components/swipe-card";
import { useChatbot, Message } from "@/hooks/use-chatbot";

import { 
  MessageCircle, 
  ArrowLeft, 
  Bot,
  User,
  Trophy,
  Target,
  Zap,
  Send
} from "lucide-react";

export default function ChatbotPage() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [messageInput, setMessageInput] = useState("");
  
  useEffect(() => {
    // Cargamos el perfil directamente desde localStorage para evitar dependencias
    const loadProfile = () => {
      try {
        const stored = localStorage.getItem('axes-onboarding-profile');
        console.log('Chatbot - Profile data from localStorage:', stored);
        
        if (stored) {
          const profile = JSON.parse(stored);
          console.log('Chatbot - Parsed profile:', profile);
          setUserProfile(profile);
        } else {
          // Si no hay perfil, crear uno de ejemplo
          console.log('Chatbot - No profile found, creating demo profile');
          const demoProfile = {
            fullName: "Usuario Demo",
            email: "demo@axes.com",
            currentRole: "Desarrollador Full Stack",
            experience: "3-5 años",
            skills: ["React", "JavaScript", "Node.js", "Python"]
          };
          setUserProfile(demoProfile);
        }
      } catch (error) {
        console.error('Chatbot - Error loading profile:', error);
        // En caso de error, también usar perfil demo
        const demoProfile = {
          fullName: "Usuario Demo",
          email: "demo@axes.com",
          currentRole: "Desarrollador Full Stack",
          experience: "3-5 años",
          skills: ["React", "JavaScript", "Node.js", "Python"]
        };
        setUserProfile(demoProfile);
      }
    };
    
    loadProfile();
  }, []);

  const {
    state,
    isLoading,
    startCasualChat,
    handleCasualResponse,
    handleSwipe,
    getCurrentCasualOptions,
    getResults
  } = useChatbot(userProfile?.skills || ["React", "JavaScript", "Node.js"]); // Fallback skills para testing

  const renderMessage = (message: Message) => (
    <div key={message.id} className={`flex items-start space-x-3 ${message.sender === "user" ? "justify-end" : ""}`}>
      {message.sender === "ai" && (
        <div className="w-8 h-8 bg-[#7C3AED] rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={`
        max-w-xs lg:max-w-sm xl:max-w-md rounded-2xl p-3 
        ${message.sender === "ai" 
          ? "bg-[#7C3AED]/20 border border-[#7C3AED]/30" 
          : "bg-white/10 border border-white/20"
        }
      `}>
        <p className="text-white text-sm leading-relaxed">{message.content}</p>
      </div>
      
      {message.sender === "user" && (
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );

  const renderCasualChatOptions = () => {
    const options = getCurrentCasualOptions();
    if (options.length === 0) return null;

    return (
      <div className="space-y-2">
        <p className="text-white/60 text-xs mb-3">Selecciona una respuesta:</p>
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleCasualResponse(option)}
            variant="outline"
            className="w-full text-left justify-start axes-btn-secondary rounded-xl text-sm"
            disabled={isLoading}
          >
            {option}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="axes-btn-outline rounded-xl mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Chat con AXES AI
            </h1>
            <p className="text-white/70">
              {state.phase === "intro" && "Prepárate para conocer a tu asistente personal"}
              {state.phase === "casual_chat" && "Conversación casual - sin presión"}
              {state.phase === "technical_evaluation" && "Evaluación técnica interactiva"}
              {state.phase === "results" && "Resultados de tu evaluación"}
            </p>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chat */}
          <div className="lg:col-span-2">
            <Card className="axes-card rounded-2xl overflow-hidden h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 bg-gradient-to-r from-[#7C3AED]/10 to-transparent">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#7C3AED] rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">AXES AI</h3>
                    <p className="text-white/60 text-sm">Tu asistente personal</p>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">En línea</span>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {/* Debug Info */}
                <div className="text-xs text-white/40 p-2 bg-black/20 rounded">
                  Debug: Phase = {state.phase}, Messages = {state.messages.length}, Skills = {userProfile?.skills?.length || 0}
                </div>
                
                {state.messages.length === 0 && state.phase === "intro" && (
                  <div className="text-center py-8">
                    <Bot className="w-16 h-16 text-[#7C3AED] mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">
                      ¡Hola {userProfile?.fullName?.split(' ')[0] || 'Desarrollador'}! 👋
                    </h3>
                    <p className="text-white/70 mb-4">
                      Soy AXES AI. Vamos a tener una conversación sobre tu experiencia en tecnología.
                    </p>
                    <Button
                      onClick={() => {
                        console.log("Iniciando chat casual...");
                        startCasualChat();
                      }}
                      className="axes-btn-primary rounded-xl px-6"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Comenzar Chat
                    </Button>
                  </div>
                )}

                {state.messages.map(renderMessage)}
                
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#7C3AED] rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-[#7C3AED]/20 border border-[#7C3AED]/30 rounded-2xl p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10">
                {state.phase === "casual_chat" && renderCasualChatOptions()}
                
                {/* Botón de prueba para ir directo a cards */}
                {state.phase === "casual_chat" && (
                  <div className="text-center mt-4">
                    <Button
                      onClick={() => {
                        console.log("Forzando transición a evaluación técnica...");
                        // Simular el final del chat casual
                        handleCasualResponse("Listo para la evaluación");
                      }}
                      className="axes-btn-secondary rounded-xl px-4 py-2 text-xs"
                    >
                      🚀 Ir a Cards (Debug)
                    </Button>
                  </div>
                )}
                
                {state.phase === "technical_evaluation" && !state.currentQuestion && (
                  <div className="text-center space-y-3">
                    <div className="bg-gradient-to-r from-[#7C3AED]/20 to-transparent p-3 rounded-xl">
                      <p className="text-white/80 text-sm">
                        🎮 Preparando evaluación técnica...
                      </p>
                    </div>
                    <div className="flex space-x-1 justify-center">
                      <div className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                )}

                {state.phase === "results" && (
                  <div className="text-center space-y-3">
                    <Trophy className="w-8 h-8 text-[#7C3AED] mx-auto" />
                    <p className="text-white font-semibold">¡Evaluación Completada!</p>
                    <Button
                      onClick={() => window.location.href = "/dashboard"}
                      className="axes-btn-primary rounded-xl px-6"
                    >
                      Ver Resultados Completos
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Info */}
            <Card className="axes-card p-4 rounded-2xl">
              <div className="text-center space-y-3">
                <img 
                  src={userProfile?.profileImage || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='30' fill='%237C3AED'/%3E%3Ctext x='30' y='35' font-family='Arial' font-size='20' fill='white' text-anchor='middle'%3E" + (userProfile?.fullName?.charAt(0) || 'U') + "%3C/text%3E%3C/svg%3E"}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full mx-auto"
                />
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    {userProfile?.fullName || "Usuario"}
                  </h3>
                  <p className="text-white/60 text-xs">
                    {userProfile?.currentRole || "Desarrollador"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Skills to Evaluate */}
            {userProfile?.skills && (
              <Card className="axes-card p-4 rounded-2xl">
                <h3 className="text-white font-semibold text-sm mb-3">Skills a Evaluar</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.slice(0, 4).map((skill: string, index: number) => (
                    <Badge key={index} className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30 text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {userProfile.skills.length > 4 && (
                    <Badge className="bg-white/10 text-white/60 border-white/20 text-xs">
                      +{userProfile.skills.length - 4}
                    </Badge>
                  )}
                </div>
              </Card>
            )}

            {/* Progress */}
            <Card className="axes-card p-4 rounded-2xl">
              <h3 className="text-white font-semibold text-sm mb-3">Progreso</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Chat Casual</span>
                  <span className="text-white/60">
                    {state.phase === "intro" ? "0%" : 
                     state.phase === "casual_chat" ? "25%" : 
                     state.phase === "technical_evaluation" ? "50%" : "100%"}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-[#7C3AED] h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: state.phase === "intro" ? "0%" : 
                             state.phase === "casual_chat" ? "25%" : 
                             state.phase === "technical_evaluation" ? "50%" : "100%"
                    }}
                  ></div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Swipe Cards Area - Solo visible durante evaluación técnica */}
        {state.phase === "technical_evaluation" && (
          <div className="mt-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Evaluación Técnica 🎮
              </h2>
              <p className="text-white/70">
                Desliza → si sabes la respuesta, ← para pasar
              </p>
              {/* Debug Info */}
              <div className="text-xs text-white/40 p-2 bg-black/20 rounded mt-2">
                Debug Cards: Current Question = {state.currentQuestion ? "YES" : "NO"}, 
                Skill Index = {state.currentSkillIndex}, 
                Total Skills = {state.skillEvaluations.length}
              </div>
            </div>

            {/* Swipe Cards */}
            <div className="max-w-md mx-auto">
              {state.currentQuestion ? (
                // Mostrar pregunta actual
                <Card className="axes-glass rounded-2xl p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-[#7C3AED]/20 rounded-full flex items-center justify-center mx-auto">
                      <Target className="w-8 h-8 text-[#7C3AED]" />
                    </div>
                    <div className="space-y-2">
                      <Badge className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30 text-xs">
                        {state.currentQuestion.skill} - {state.currentQuestion.level}
                      </Badge>
                      <h3 className="text-white font-semibold text-lg">
                        {state.currentQuestion.question}
                      </h3>
                    </div>
                    <div className="flex justify-center space-x-4 mt-6">
                      <button 
                        onClick={() => handleSwipe("left")}
                        className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        ←
                      </button>
                      <button 
                        onClick={() => handleSwipe("right")}
                        className="w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 hover:bg-green-500/30 transition-colors"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </Card>
              ) : (
                // Placeholder mientras se cargan preguntas
                <Card className="axes-glass rounded-2xl p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-[#7C3AED]/20 rounded-full flex items-center justify-center mx-auto">
                      <Target className="w-8 h-8 text-[#7C3AED]" />
                    </div>
                    <h3 className="text-white font-semibold">Preparando preguntas...</h3>
                    <p className="text-white/60 text-sm">
                      Evaluando tus skills: {userProfile?.skills?.join(", ") || "React, JavaScript, Python"}
                    </p>
                    <div className="flex space-x-1 justify-center">
                      <div className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-[#7C3AED] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Progress Indicator */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/60 text-sm">Progreso Técnico</span>
                  <span className="text-white/60 text-sm">
                    {state.currentSkillIndex} / {userProfile?.skills?.length || 3}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-[#7C3AED] h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${userProfile?.skills?.length ? (state.currentSkillIndex / userProfile.skills.length) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}