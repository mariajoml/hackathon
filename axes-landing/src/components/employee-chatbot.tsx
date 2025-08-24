"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  CheckCircle,
  ArrowRight,
  Loader2
} from "lucide-react";

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

interface EmployeeChatbotProps {
  onComplete: () => void;
  userProfile: any;
}

export function EmployeeChatbot({ onComplete, userProfile }: EmployeeChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [conversationComplete, setConversationComplete] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [allQuestions, setAllQuestions] = useState<string[]>([]);

  // Cargar preguntas de ambos endpoints
  useEffect(() => {
    const technicalQuestions = localStorage.getItem("chatbot-questions");
    const softSkillsResponse = localStorage.getItem("soft-skills-response");
    
    let questions: string[] = [];
    
    // Agregar preguntas técnicas si existen
    if (technicalQuestions) {
      try {
        const techQuestions = JSON.parse(technicalQuestions);
        if (Array.isArray(techQuestions)) {
          questions.push(...techQuestions);
        }
      } catch (error) {
        console.error("Error parsing technical questions:", error);
      }
    }
    
    // Agregar preguntas de habilidades blandas si existen
    if (softSkillsResponse) {
      try {
        const softResponse = JSON.parse(softSkillsResponse);
        if (softResponse.questions && Array.isArray(softResponse.questions)) {
          questions.push(...softResponse.questions);
        }
      } catch (error) {
        console.error("Error parsing soft skills response:", error);
      }
    }
    
    // Si no hay preguntas, usar preguntas por defecto
    if (questions.length === 0) {
      questions = [
        "¿Cuál es tu experiencia más desafiante en desarrollo?",
        "¿Cómo manejas los plazos ajustados en proyectos?",
        "¿Qué haces cuando te encuentras con un problema técnico difícil?",
        "¿Cómo te mantienes actualizado con las nuevas tecnologías?",
        "¿Cuál es tu enfoque para trabajar en equipo?"
      ];
    }
    
    setAllQuestions(questions);
    
    // Mensaje de bienvenida
    const welcomeMessage: Message = {
      id: "welcome",
      type: "bot",
      content: `¡Hola ${userProfile?.fullName || 'empleado'}! Soy AXES AI, tu asistente personal. Vamos a hacer una breve conversación para conocerte mejor. ¿Listo para empezar?`,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  }, [userProfile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!currentInput.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: currentInput.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput("");
    setIsTyping(true);

    // Simular respuesta del bot
    setTimeout(() => {
      const botResponse = generateBotResponse();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
      // Avanzar a la siguiente pregunta
      if (currentQuestionIndex < allQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Conversación completada
        setTimeout(() => {
          setConversationComplete(true);
        }, 1000);
      }
    }, 1500);
  };

  const generateBotResponse = (): string => {
    if (currentQuestionIndex >= allQuestions.length) {
      return "Gracias por compartir esa información. Ha sido muy útil conocerte mejor.";
    }

    const currentQuestion = allQuestions[currentQuestionIndex];
    
    // Respuestas contextuales basadas en la pregunta
    if (currentQuestion.includes("experiencia") || currentQuestion.includes("desafiante")) {
      return "Interesante. ¿Podrías contarme más sobre cómo superaste ese desafío?";
    } else if (currentQuestion.includes("plazos") || currentQuestion.includes("tiempo")) {
      return "Entiendo. ¿Qué estrategias usas para manejar la presión del tiempo?";
    } else if (currentQuestion.includes("problema") || currentQuestion.includes("técnico")) {
      return "Eso suena desafiante. ¿Cuál fue tu proceso de resolución?";
    } else if (currentQuestion.includes("actualizado") || currentQuestion.includes("tecnologías")) {
      return "Excelente. ¿Qué recursos prefieres para mantenerte al día?";
    } else if (currentQuestion.includes("equipo") || currentQuestion.includes("trabajo")) {
      return "Muy bien. ¿Cómo manejas los conflictos en el equipo?";
    } else {
      return "Gracias por esa respuesta. ¿Podrías elaborar un poco más?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const completeConversation = () => {
    // Guardar la conversación completa en localStorage
    const conversationData = {
      messages,
      questions: allQuestions,
      userProfile,
      completedAt: new Date().toISOString()
    };
    
    localStorage.setItem("chatbot-conversation", JSON.stringify(conversationData));
    console.log("💾 Conversación del chatbot guardada:", conversationData);
    
    // Marcar como completado y redirigir
    onComplete();
  };

  if (conversationComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-axes-bg-primary via-axes-bg-secondary to-axes-bg-tertiary">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <Card className="w-full max-w-2xl axes-card p-8 shadow-xl rounded-2xl text-center">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-axes-primary mb-2">
              ¡Conversación Completada!
            </CardTitle>
            <p className="text-axes-text-secondary">
              Has respondido todas las preguntas. Tu perfil está completo.
            </p>
          </CardHeader>
          
          <CardContent>
            <Button 
              onClick={completeConversation}
              className="axes-btn-primary px-8 py-3 text-lg"
            >
              Continuar al Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-axes-bg-primary via-axes-bg-secondary to-axes-bg-tertiary">
      {/* Header */}
      <header className="axes-nav border-b border-axes-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-axes-text-primary">
                AXES
                <span className="text-axes-primary ml-1">AI Chatbot</span>
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        {/* Chat Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-axes-primary/20 p-3 rounded-xl">
              <Bot className="w-8 h-8 text-axes-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-axes-text-primary mb-2">
            Entrevista con AXES AI
          </h2>
          <p className="text-axes-text-secondary">
            Pregunta {currentQuestionIndex + 1} de {allQuestions.length}
          </p>
          <div className="mt-3">
            <Badge variant="secondary" className="bg-axes-primary/20 text-axes-primary">
              {allQuestions[currentQuestionIndex] || "Cargando pregunta..."}
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.type === "user"
                    ? "bg-axes-primary text-white"
                    : "bg-white/10 text-axes-text-primary border border-white/20"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-axes-text-primary border border-white/20 px-4 py-2 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AXES AI está escribiendo...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu respuesta..."
            className="flex-1 axes-input"
            disabled={isTyping}
          />
          <Button
            onClick={sendMessage}
            disabled={!currentInput.trim() || isTyping}
            className="axes-btn-primary px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
