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
  const [isSendingResponses, setIsSendingResponses] = useState(false);
  const [softSkillsSent, setSoftSkillsSent] = useState(false);
  const [technicalSent, setTechnicalSent] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [allQuestions, setAllQuestions] = useState<string[]>([]);

  // Cargar preguntas de ambos endpoints
  useEffect(() => {
    const technicalQuestions = localStorage.getItem("chatbot-questions");
    const softSkillsResponse = localStorage.getItem("soft-skills-response");
    
    console.log("🔍 Debug - Cargando preguntas desde localStorage:");
    console.log("📋 Technical questions raw:", technicalQuestions);
    console.log("📋 Soft skills response raw:", softSkillsResponse);
    
    let questions: string[] = [];
    let technicalQuestionIndices: number[] = []; // Para rastrear qué preguntas son técnicas
    
    // Agregar preguntas técnicas si existen
    if (technicalQuestions) {
      try {
        const techQuestions = JSON.parse(technicalQuestions);
        console.log("🔍 Debug - Technical questions parsed:", techQuestions);
        if (Array.isArray(techQuestions)) {
          questions.push(...techQuestions);
          // Marcar estas preguntas como técnicas
          for (let i = 0; i < techQuestions.length; i++) {
            technicalQuestionIndices.push(i);
          }
          console.log("🤖 Preguntas técnicas cargadas:", techQuestions.length);
          console.log("🤖 Índices de preguntas técnicas:", technicalQuestionIndices);
        }
      } catch (error) {
        console.error("Error parsing technical questions:", error);
      }
    } else {
      console.log("⚠️ No se encontraron preguntas técnicas en localStorage");
    }
    
    // Agregar preguntas de habilidades blandas si existen
    if (softSkillsResponse) {
      try {
        const softResponse = JSON.parse(softSkillsResponse);
        console.log("📋 Respuesta completa de habilidades blandas:", softResponse);
        
        // Manejar el formato específico del webhook de habilidades blandas
        if (softResponse.message && typeof softResponse.message === 'object') {
          // Extraer todas las preguntas del objeto message
          const softQuestions = Object.values(softResponse.message).filter(
            (value): value is string => typeof value === 'string'
          );
          questions.push(...softQuestions);
          console.log("🤖 Preguntas de habilidades blandas cargadas:", softQuestions.length);
        } else if (softResponse.questions && Array.isArray(softResponse.questions)) {
          // Formato alternativo
          questions.push(...softResponse.questions);
          console.log("🤖 Preguntas de habilidades blandas (formato alternativo) cargadas:", softResponse.questions.length);
        }
      } catch (error) {
        console.error("Error parsing soft skills response:", error);
      }
    }
    
    // Si no hay preguntas, usar preguntas por defecto más extensas
    if (questions.length === 0) {
      questions = [
        "¿Cuál es tu experiencia más desafiante en desarrollo?",
        "¿Cómo manejas los plazos ajustados en proyectos?",
        "¿Qué haces cuando te encuentras con un problema técnico difícil?",
        "¿Cómo te mantienes actualizado con las nuevas tecnologías?",
        "¿Cuál es tu enfoque para trabajar en equipo?",
        "¿Cómo manejas la comunicación en equipos multidisciplinarios?",
        "¿Cuál ha sido tu mayor logro profesional hasta ahora?",
        "¿Cómo te adaptas a cambios repentinos en los proyectos?",
        "¿Qué estrategias usas para resolver conflictos en el equipo?",
        "¿Cómo priorizas las tareas cuando tienes múltiples proyectos?"
      ];
      console.log("🤖 Usando preguntas por defecto:", questions.length);
    }
    
    console.log("🤖 Total de preguntas cargadas:", questions.length);
    console.log("🤖 Preguntas completas:", questions);
    console.log("🤖 Índices de preguntas técnicas:", technicalQuestionIndices);
    
    setAllQuestions(questions);
    
    // Guardar los índices de preguntas técnicas en localStorage para usarlos después
    localStorage.setItem("technical-question-indices", JSON.stringify(technicalQuestionIndices));
    
    // Mensaje de bienvenida
    const welcomeMessage: Message = {
      id: "welcome",
      type: "bot",
      content: `¡Hola ${userProfile?.fullName || 'empleado'}! Soy AXES AI, tu asistente personal. Vamos a hacer una conversación para conocerte mejor. Tienes ${questions.length} preguntas por responder.

📝 **Instrucciones importantes:**
• Para preguntas técnicas: Responde con "true", "false", "verdadero" o "falso"
• Para preguntas de habilidades blandas: Responde libremente con tu experiencia

¿Listo para empezar?`,
      timestamp: new Date()
    };
    
    // Primera pregunta del chatbot
    const firstQuestion = questions.length > 0 ? questions[0] : "¿Cuál es tu experiencia más desafiante en desarrollo?";
    const isFirstQuestionTechnical = technicalQuestionIndices.includes(0);
    
    const firstQuestionMessage: Message = {
      id: "first-question",
      type: "bot",
      content: isFirstQuestionTechnical 
        ? `${firstQuestion}\n\n💡 **Responde con:** true, false, verdadero o falso`
        : firstQuestion,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage, firstQuestionMessage]);
  }, [userProfile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Debug: Mostrar información de las preguntas cargadas
  useEffect(() => {
    console.log("🔍 Debug - Estado actual del chatbot:");
    console.log("📊 Total de preguntas:", allQuestions.length);
    console.log("📝 Pregunta actual:", currentQuestionIndex + 1);
    console.log("📋 Preguntas restantes:", allQuestions.length - currentQuestionIndex - 1);
    console.log("💬 Mensajes en la conversación:", messages.length);
    
    if (allQuestions.length > 0) {
      console.log("🎯 Próximas 3 preguntas:");
      for (let i = currentQuestionIndex; i < Math.min(currentQuestionIndex + 3, allQuestions.length); i++) {
        console.log(`   ${i + 1}. ${allQuestions[i]}`);
      }
    }
  }, [allQuestions, currentQuestionIndex, messages.length]);

  const sendMessage = async () => {
    if (!currentInput.trim() || isTyping) return;

    // Validar respuesta para preguntas técnicas
    const technicalIndices = JSON.parse(localStorage.getItem("technical-question-indices") || "[]");
    const isCurrentQuestionTechnical = technicalIndices.includes(currentQuestionIndex);
    
    if (isCurrentQuestionTechnical) {
      const validResponses = ['true', 'false', 'verdadero', 'falso'];
      const userResponse = currentInput.trim().toLowerCase();
      
      if (!validResponses.includes(userResponse)) {
        // Mostrar mensaje de error y no continuar
        const errorMessage: Message = {
          id: (Date.now() + 0.5).toString(),
          type: "bot",
          content: "❌ Por favor, responde solo con: **true**, **false**, **verdadero** o **falso**",
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setCurrentInput("");
        return;
      }
    }

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
      // Avanzar a la siguiente pregunta
      if (currentQuestionIndex < allQuestions.length - 1) {
        const nextQuestionIndex = currentQuestionIndex + 1;
        const nextQuestion = allQuestions[nextQuestionIndex];
        const questionsRemaining = allQuestions.length - nextQuestionIndex - 1;
        
        // Verificar si la siguiente pregunta es técnica
        const isNextQuestionTechnical = technicalIndices.includes(nextQuestionIndex);
        
        let botMessageContent = nextQuestion;
        
        // Agregar instrucciones para preguntas técnicas
        if (isNextQuestionTechnical) {
          botMessageContent = `${nextQuestion}\n\n💡 **Responde con:** true, false, verdadero o falso`;
        }
        
        // Agregar contexto sobre preguntas restantes si quedan pocas
        if (questionsRemaining <= 3 && questionsRemaining > 0) {
          botMessageContent = `${botMessageContent}\n\n(Quedan ${questionsRemaining} preguntas más)`;
        }
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: botMessageContent,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
        setCurrentQuestionIndex(nextQuestionIndex);
        setIsTyping(false);
      } else {
        // Conversación completada
        const finalMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: "Gracias por responder todas las preguntas. Ha sido muy útil conocerte mejor.",
          timestamp: new Date()
        };

        setMessages(prev => [...prev, finalMessage]);
        setIsTyping(false);
        
        setTimeout(() => {
          setConversationComplete(true);
        }, 2000);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendSoftSkillsResponses = async () => {
    setIsSendingResponses(true);
    
    try {
      // Extraer respuestas del usuario
      const userResponses = messages
        .filter(msg => msg.type === 'user')
        .map((msg, index) => ({
          questionIndex: index,
          question: allQuestions[index] || `Pregunta ${index + 1}`,
          response: msg.content
        }));
      
      // Separar respuestas técnicas y de habilidades blandas
      const technicalIndices = JSON.parse(localStorage.getItem("technical-question-indices") || "[]");
      const softSkillsResponses = userResponses.filter((_, index) => !technicalIndices.includes(index));
      
      console.log("💬 Respuestas de habilidades blandas a enviar:", softSkillsResponses);
      
      if (softSkillsResponses.length > 0) {
        const softSkillsData: Record<string, string> = {
          sessionId: localStorage.getItem("user-email") || "usuario@axes.com"
        };
        
        // Agregar preguntas y respuestas
        softSkillsResponses.forEach((item, index) => {
          softSkillsData[`pregunta${index + 1}`] = item.question;
          softSkillsData[`respuesta${index + 1}`] = item.response;
        });
        
        console.log("🔄 Enviando respuestas de habilidades blandas:", softSkillsData);
        
        const softSkillsResponse = await fetch("https://techrea.app.n8n.cloud/webhook/respuestas_formulario_habilidades_blandas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(softSkillsData),
        });
        
                 if (softSkillsResponse.ok) {
           try {
             const responseText = await softSkillsResponse.text();
             console.log("📄 Respuesta del servidor (texto):", responseText);
             
             let result;
             if (responseText.trim()) {
               result = JSON.parse(responseText);
               console.log("✅ Respuestas de habilidades blandas enviadas:", result);
             } else {
               console.log("✅ Respuestas de habilidades blandas enviadas (respuesta vacía)");
               result = { success: true, message: "Respuesta enviada exitosamente" };
             }
             setSoftSkillsSent(true);
           } catch (parseError) {
             console.error("❌ Error parseando respuesta JSON:", parseError);
             console.log("✅ Respuestas de habilidades blandas enviadas (sin parsear respuesta)");
             setSoftSkillsSent(true);
           }
         } else {
           console.error("❌ Error enviando respuestas de habilidades blandas:", softSkillsResponse.status, softSkillsResponse.statusText);
           const errorText = await softSkillsResponse.text();
           console.error("❌ Respuesta del servidor:", errorText);
           // Mostrar error al usuario
           alert(`Error enviando respuestas de habilidades blandas: ${softSkillsResponse.status} ${softSkillsResponse.statusText}`);
         }
      } else {
        console.log("⚠️ No hay respuestas de habilidades blandas para enviar");
        setSoftSkillsSent(true); // Marcar como enviado si no hay respuestas
      }
         } catch (error) {
       console.error("❌ Error enviando respuestas de habilidades blandas:", error);
       
       // Mostrar error específico al usuario
       if (error instanceof TypeError && error.message === 'Failed to fetch') {
         alert("Error de conectividad: No se pudo conectar con el servidor. Verifica tu conexión a internet.");
       } else {
         alert(`Error enviando respuestas de habilidades blandas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
       }
     } finally {
      setIsSendingResponses(false);
    }
  };

  const sendTechnicalResponses = async () => {
    setIsSendingResponses(true);
    
    try {
      // Extraer respuestas del usuario
      const userResponses = messages
        .filter(msg => msg.type === 'user')
        .map((msg, index) => ({
          questionIndex: index,
          question: allQuestions[index] || `Pregunta ${index + 1}`,
          response: msg.content
        }));
      
      // Separar respuestas técnicas y de habilidades blandas
      const technicalIndices = JSON.parse(localStorage.getItem("technical-question-indices") || "[]");
      const technicalResponses = userResponses.filter((_, index) => technicalIndices.includes(index));
      
      console.log("🔧 Respuestas técnicas a enviar:", technicalResponses);
      
      if (technicalResponses.length > 0) {
        // Obtener información original de las preguntas técnicas para mapear correctamente
        let originalTechnicalData: any = null;
        try {
          const originalResponse = localStorage.getItem("original-technical-webhook-response");
          if (originalResponse) {
            originalTechnicalData = JSON.parse(originalResponse);
          }
        } catch (error) {
          console.error("Error parsing original technical data:", error);
        }
        
        let technicalData: Record<string, string | boolean> = {
          sessionId: localStorage.getItem("user-email") || "usuario@axes.com"
        };
        
        // Procesar respuestas técnicas
        technicalResponses.forEach((item, index) => {
          const questionIndex = item.questionIndex;
          const response = item.response.toLowerCase();
          
          // Convertir respuesta a boolean
          const isTrue = response === 'true' || response === 'verdadero';
          
          technicalData[`pregunta${index + 1}`] = item.question;
          technicalData[`respuesta${index + 1}`] = isTrue;
          
          // Determinar habilidad basada en la información original si está disponible
          let skill = "Desarrollo_de_Aplicaciones"; // Por defecto
          let percentage = "70%"; // Por defecto
          
          if (originalTechnicalData && originalTechnicalData.message) {
            // Buscar la pregunta en las categorías originales
            const categories = Object.keys(originalTechnicalData.message);
            for (const category of categories) {
              const questions = originalTechnicalData.message[category];
              if (Array.isArray(questions)) {
                const foundQuestion = questions.find((q: any) => q.afirmacion === item.question);
                if (foundQuestion) {
                  skill = category;
                  // Obtener porcentaje si está disponible
                  if (originalTechnicalData.porcentajes) {
                    const percentages = originalTechnicalData.porcentajes.split(',');
                    const categoryIndex = categories.indexOf(category);
                    if (percentages[categoryIndex]) {
                      percentage = percentages[categoryIndex];
                    }
                  }
                  break;
                }
              }
            }
          } else {
            // Fallback: usar mapeo basado en índice
            const skillCategories = ["Desarrollo_de_Aplicaciones", "Python", "IA"];
            const skillIndex = Math.floor(questionIndex / 6); // Aproximadamente 6 preguntas por habilidad
            skill = skillCategories[skillIndex] || "Desarrollo_de_Aplicaciones";
          }
          
          technicalData[`habilidad${index + 1}`] = skill;
          technicalData[`porcentajeHabilidad${index + 1}`] = percentage;
          technicalData[`respuestaCorrecta${index + 1}`] = true; // Por defecto, asumimos correcta
        });
        
        console.log("🔄 Enviando respuestas técnicas:", technicalData);
        console.log("🌐 URL del endpoint técnico:", "https://techrea.app.n8n.cloud/webhook/respuestas_formulario_habilidades_tecnicas");
        console.log("📦 Datos a enviar (JSON):", JSON.stringify(technicalData, null, 2));
        
        try {
          const technicalResponse = await fetch("https://techrea.app.n8n.cloud/webhook/respuestas_formulario_habilidades_tecnicas", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(technicalData),
          });
        
                 if (technicalResponse.ok) {
           try {
             const responseText = await technicalResponse.text();
             console.log("📄 Respuesta del servidor (texto):", responseText);
             
             let result;
             if (responseText.trim()) {
               result = JSON.parse(responseText);
               console.log("✅ Respuestas técnicas enviadas:", result);
             } else {
               console.log("✅ Respuestas técnicas enviadas (respuesta vacía)");
               result = { success: true, message: "Respuesta enviada exitosamente" };
             }
             setTechnicalSent(true);
           } catch (parseError) {
             console.error("❌ Error parseando respuesta JSON:", parseError);
             console.log("✅ Respuestas técnicas enviadas (sin parsear respuesta)");
             setTechnicalSent(true);
           }
         } else {
           console.error("❌ Error enviando respuestas técnicas:", technicalResponse.status, technicalResponse.statusText);
           const errorText = await technicalResponse.text();
           console.error("❌ Respuesta del servidor:", errorText);
           // Mostrar error al usuario
           alert(`Error enviando respuestas técnicas: ${technicalResponse.status} ${technicalResponse.statusText}`);
         }
        } catch (fetchError) {
          console.error("❌ Error en fetch de respuestas técnicas:", fetchError);
          throw fetchError; // Re-lanzar para que sea capturado por el catch externo
        }
      } else {
        console.log("⚠️ No hay respuestas técnicas para enviar");
        setTechnicalSent(true); // Marcar como enviado si no hay respuestas
      }
         } catch (error) {
       console.error("❌ Error enviando respuestas técnicas:", error);
       
       // Mostrar error específico al usuario
       if (error instanceof TypeError && error.message === 'Failed to fetch') {
         alert("Error de conectividad: No se pudo conectar con el servidor. Verifica tu conexión a internet.");
       } else {
         alert(`Error enviando respuestas técnicas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
       }
     } finally {
      setIsSendingResponses(false);
    }
  };

  const completeConversation = async () => {
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
              Has respondido todas las preguntas. Ahora necesitamos enviar tus respuestas a nuestros sistemas.
            </p>
          </CardHeader>
          
          <CardContent>
            {isSendingResponses ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin text-axes-primary" />
                  <span className="text-axes-text-primary">Enviando respuestas...</span>
                </div>
                <p className="text-axes-text-secondary text-sm">
                  Procesando tus respuestas y enviándolas a nuestros sistemas.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                                 {/* Mensaje informativo */}
                 <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                   <p className="text-axes-text-primary text-sm">
                     <strong>Instrucciones:</strong> Haz clic en cada botón para enviar tus respuestas. 
                     Una vez que ambos envíos estén completados, podrás continuar al dashboard.
                   </p>
                 </div>
                 
                                   {/* Botón de prueba de conectividad */}
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-axes-text-primary text-sm mb-2">
                      <strong>¿Problemas de conexión?</strong> Prueba la conectividad con los servidores:
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={async () => {
                          try {
                            console.log("🔍 Probando conectividad con habilidades blandas...");
                            const response = await fetch("https://techrea.app.n8n.cloud/webhook/respuestas_formulario_habilidades_blandas", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ test: true })
                            });
                            const responseText = await response.text();
                            console.log("📄 Respuesta de prueba habilidades blandas:", responseText);
                            alert(`Habilidades blandas: ${response.status} ${response.statusText}\nRespuesta: ${responseText || 'Vacía'}`);
                          } catch (error) {
                            console.error("❌ Error en prueba de habilidades blandas:", error);
                            alert(`Error habilidades blandas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        Probar Blandas
                      </Button>
                      <Button 
                        onClick={async () => {
                                                     try {
                             console.log("🔍 Probando conectividad con habilidades técnicas...");
                             console.log("🌐 URL de prueba:", "https://techrea.app.n8n.cloud/webhook/respuestas_formulario_habilidades_tecnicas");
                             const response = await fetch("https://techrea.app.n8n.cloud/webhook/respuestas_formulario_habilidades_tecnicas", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ test: true })
                            });
                            const responseText = await response.text();
                            console.log("📄 Respuesta de prueba habilidades técnicas:", responseText);
                            alert(`Habilidades técnicas: ${response.status} ${response.statusText}\nRespuesta: ${responseText || 'Vacía'}`);
                          } catch (error) {
                            console.error("❌ Error en prueba de habilidades técnicas:", error);
                            alert(`Error habilidades técnicas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        Probar Técnicas
                      </Button>
                    </div>
                  </div>
                 
                 {/* Estado de envíos */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-axes-text-primary">Habilidades Blandas</span>
                    {softSkillsSent ? (
                      <div className="flex items-center space-x-2 text-green-500">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm">Enviado</span>
                      </div>
                    ) : (
                      <Button 
                        onClick={sendSoftSkillsResponses}
                        className="axes-btn-primary px-4 py-2 text-sm"
                        disabled={isSendingResponses}
                      >
                        Enviar
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-axes-text-primary">Habilidades Técnicas</span>
                    {technicalSent ? (
                      <div className="flex items-center space-x-2 text-green-500">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm">Enviado</span>
                      </div>
                    ) : (
                      <Button 
                        onClick={sendTechnicalResponses}
                        className="axes-btn-primary px-4 py-2 text-sm"
                        disabled={isSendingResponses}
                      >
                        Enviar
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Botón para continuar al dashboard */}
                {softSkillsSent && technicalSent && (
                  <div className="pt-4 border-t border-white/10">
                    <div className="mb-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-green-500 text-sm text-center">
                        ✅ Todos los datos han sido enviados exitosamente
                      </p>
                    </div>
                    <Button 
                      onClick={completeConversation}
                      className="axes-btn-primary px-8 py-3 text-lg w-full"
                    >
                      Continuar al Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            )}
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
          
          {/* Debug Button - Temporal */}
          <div className="mb-2">
            <Button
              onClick={() => {
                console.log("🔍 Debug - Verificando localStorage:");
                console.log("📋 Technical questions:", localStorage.getItem("chatbot-questions"));
                console.log("📋 Soft skills response:", localStorage.getItem("soft-skills-response"));
                console.log("📋 Original technical response:", localStorage.getItem("original-technical-webhook-response"));
                console.log("📋 Technical question indices:", localStorage.getItem("technical-question-indices"));
                console.log("📊 Current questions array:", allQuestions);
                console.log("📝 Current question index:", currentQuestionIndex);
                console.log("📊 Total questions loaded:", allQuestions.length);
                console.log("🔍 Technical indices:", JSON.parse(localStorage.getItem("technical-question-indices") || "[]"));
                
                // Verificar si las preguntas técnicas están en el array
                const techIndices = JSON.parse(localStorage.getItem("technical-question-indices") || "[]");
                console.log("🔍 Preguntas técnicas en el array:");
                techIndices.forEach((index: number) => {
                  console.log(`  ${index}: ${allQuestions[index]}`);
                });
              }}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Debug Info
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-axes-text-secondary text-sm">
                Progreso: {currentQuestionIndex + 1} de {allQuestions.length}
              </span>
              <span className="text-axes-text-secondary text-sm">
                {Math.round(((currentQuestionIndex + 1) / allQuestions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-axes-primary h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>
          
          <p className="text-axes-text-secondary mb-3">
            {allQuestions.length - currentQuestionIndex - 1 > 0 
              ? `${allQuestions.length - currentQuestionIndex - 1} preguntas restantes`
              : "Última pregunta"
            }
          </p>
          
          <div className="mt-3">
            <Badge variant="secondary" className="bg-axes-primary/20 text-axes-primary max-w-md">
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
            placeholder={
              (() => {
                const technicalIndices = JSON.parse(localStorage.getItem("technical-question-indices") || "[]");
                const isCurrentQuestionTechnical = technicalIndices.includes(currentQuestionIndex);
                
                if (isCurrentQuestionTechnical) {
                  return "Escribe: true, false, verdadero o falso...";
                } else {
                  return "Escribe tu respuesta...";
                }
              })()
            }
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
