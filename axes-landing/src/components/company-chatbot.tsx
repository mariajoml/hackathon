"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, CheckCircle } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface CompanyChatbotProps {
  onComplete: () => void;
  companyData: any;
}

const COMPANY_QUESTIONS = [
  "¿Cuál es tu principal objetivo al buscar talento en AXES?",
  "¿Qué tipo de cultura empresarial quieres promover?",
  "¿Cuáles son los valores más importantes para tu empresa?",
  "¿Qué esperas de los candidatos en términos de soft skills?",
  "¿Cómo te gustaría que sea el proceso de selección?",
  "¿Qué te hace única como empresa?"
];

export function CompanyChatbot({ onComplete, companyData }: CompanyChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `¡Hola! Soy el asistente de AXES. Veo que ${companyData.companyName} quiere unirse a nuestra plataforma. Vamos a hacer algunas preguntas para entender mejor tu empresa y cómo podemos ayudarte a encontrar el mejor talento.`,
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: "user" | "bot") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    addMessage(userMessage, "user");
    setInputValue("");
    setIsTyping(true);

    // Simular respuesta del bot
    setTimeout(() => {
      if (currentQuestionIndex < COMPANY_QUESTIONS.length - 1) {
        const nextQuestion = COMPANY_QUESTIONS[currentQuestionIndex + 1];
        addMessage(nextQuestion, "bot");
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Última pregunta respondida
        addMessage("¡Excelente! Hemos terminado la validación. Tu empresa está lista para crear ofertas de trabajo en AXES.", "bot");
        
        // Mensaje de confirmación
        setTimeout(() => {
          addMessage("✅ Validación completada exitosamente", "bot");
          setTimeout(() => {
            onComplete();
          }, 2000);
        }, 2000);
      }
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-axes-bg-primary via-axes-bg-secondary to-axes-bg-tertiary">
      <Card className="w-full max-w-4xl axes-card shadow-xl rounded-2xl">
        <CardHeader className="text-center border-b border-axes-border">
          <CardTitle className="text-2xl font-bold text-axes-primary flex items-center justify-center gap-2">
            <Bot className="w-6 h-6" />
            Asistente AXES para Empresas
          </CardTitle>
          <p className="text-axes-text-secondary">
            Vamos a validar tu empresa para asegurar la mejor experiencia
          </p>
        </CardHeader>

        <CardContent className="p-0">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-axes-primary text-white ml-4"
                      : "bg-axes-bg-hover text-axes-text-primary mr-4"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === "bot" && (
                      <Bot className="w-4 h-4 mt-1 text-axes-primary flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm">{message.text}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    {message.sender === "user" && (
                      <User className="w-4 h-4 mt-1 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-axes-bg-hover text-axes-text-primary p-3 rounded-2xl mr-4">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-axes-primary" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-axes-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-axes-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-axes-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-axes-border p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu respuesta..."
                className="flex-1 axes-input"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="axes-btn-primary rounded-xl px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Progress Indicator */}
            <div className="mt-3 text-center">
              <div className="text-sm text-axes-text-secondary mb-2">
                Pregunta {currentQuestionIndex + 1} de {COMPANY_QUESTIONS.length}
              </div>
              <div className="w-full bg-axes-bg-hover rounded-full h-2">
                <div
                  className="bg-axes-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / COMPANY_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
