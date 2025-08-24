"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Toast } from "@/components/ui/toast";
// ImageUpload removed - using colors instead
import { useOnboarding } from "@/hooks/use-onboarding";
import { EmployeeChatbot } from "@/components/employee-chatbot";
import { 
  User, 
  Briefcase, 
  MapPin, 
  Calendar, 
  GraduationCap,
  Code,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Camera
} from "lucide-react";

interface ProfileData {
  // Información Personal
  fullName: string;
  age: string;
  location: string;
  
  // Información Profesional
  currentRole: string;
  company: string;
  experience: string;
  education: string;
  
  // Habilidades Técnicas
  skills: Array<{name: string, percentage: number}>;
  
  // Descripción Personal
  personalDescription: string;
  
  // Objetivos
  careerGoals: string;
  
  // Perfil Visual
  profileImage?: string;
  bannerImage?: string;
  biography?: string;
  
  // Social Links removed
}

const STEPS = [
  { id: 1, title: "Información Personal", icon: User },
  { id: 2, title: "Experiencia Profesional", icon: Briefcase },
  { id: 3, title: "Habilidades Técnicas", icon: Code },
  { id: 4, title: "Descripción Personal", icon: MessageCircle },
  { id: 5, title: "Perfil Visual", icon: Camera },
  { id: 6, title: "Objetivos Profesionales", icon: GraduationCap },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    age: "",
    location: "",
    currentRole: "",
    company: "",
    experience: "",
    education: "",
    skills: [] as Array<{name: string, percentage: number}>,
    personalDescription: "",
    careerGoals: "",
    profileImage: "",
    bannerImage: "",
    biography: "",
    // Social links removed
  });

  // Estado para las preguntas del chatbot que vienen del webhook
  const [chatbotQuestions, setChatbotQuestions] = useState<string[]>([]);
  
  // Estado para mostrar el chatbot
  const [showChatbot, setShowChatbot] = useState(false);
  
  const [newSkill, setNewSkill] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const { saveProfile, getProfile, isLoading, error, clearError } = useOnboarding();

  // Cargar perfil existente si existe
  useEffect(() => {
    const existingProfile = getProfile();
    if (existingProfile) {
      setProfileData(existingProfile);
    }

    // Cargar preguntas del chatbot si existen en localStorage
    const savedQuestions = localStorage.getItem("chatbot-questions");
    if (savedQuestions) {
      try {
        const questions = JSON.parse(savedQuestions);
        setChatbotQuestions(questions);
        console.log("🤖 Preguntas del chatbot cargadas desde localStorage:", questions);
      } catch (error) {
        console.error("❌ Error cargando preguntas del chatbot:", error);
      }
    }
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
    clearError();
  };

  const updateProfileData = (field: keyof ProfileData, value: string | string[] | Array<{name: string, percentage: number}>) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill && newSkill.trim() && !profileData.skills.some(skill => skill.name === newSkill.trim())) {
      const newSkillObj = { 
        name: newSkill.trim(), 
        percentage: 50 // Porcentaje por defecto
      };
      updateProfileData("skills", [...profileData.skills, newSkillObj]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateProfileData("skills", profileData.skills.filter(skill => skill.name !== skillToRemove));
  };

  const updateSkillPercentage = (skillName: string, newPercentage: number) => {
    if (skillName && typeof newPercentage === 'number' && newPercentage >= 0 && newPercentage <= 100) {
      updateProfileData("skills", profileData.skills.map(skill => 
        skill.name === skillName ? { ...skill, percentage: newPercentage } : skill
      ));
    }
  };

  const nextStep = async () => {
    if (currentStep < STEPS.length) {
      // Si estamos en el paso 2 (Experiencia Profesional), enviar datos al webhook
      if (currentStep === 2) {
        try {
          // Preparar datos para el webhook - Formato exacto de la tabla users_info
          const webhookData = {
            email: localStorage.getItem("user-email") || "usuario@axes.com",
            nombre_completo: profileData.fullName || "",
            edad: parseInt(profileData.age) || 0,
            ciudad: profileData.location.includes(",") ? profileData.location.split(",")[0]?.trim() : profileData.location || "",
            pais: profileData.location.includes(",") ? profileData.location.split(",")[1]?.trim() : "Colombia",
            cargo_actual: profileData.currentRole || "",
            empresa_actual: profileData.company || "",
            anos_experiencia: profileData.experience || "",
            nivel_educacion: profileData.education || ""
          };

          // Validar que todos los campos obligatorios estén presentes
          const requiredFields = ['nombre_completo', 'edad', 'ciudad', 'pais', 'cargo_actual', 'empresa_actual', 'anos_experiencia', 'nivel_educacion'];
          const missingFields = requiredFields.filter(field => !webhookData[field as keyof typeof webhookData]);
          
          if (missingFields.length > 0) {
            console.error("❌ Campos faltantes:", missingFields);
            showToast(`Campos faltantes: ${missingFields.join(", ")}`, "error");
            return; // No continuar si faltan campos
          }

          console.log("🔄 Enviando datos al webhook:", webhookData);
          console.log("📋 Formato JSON:", JSON.stringify(webhookData, null, 2));
          console.log("📏 Tamaño de datos:", JSON.stringify(webhookData).length, "caracteres");
          console.log("🔍 Validación de campos:", {
            nombre_completo: webhookData.nombre_completo.length > 0,
            edad: webhookData.edad > 0,
            ciudad: webhookData.ciudad.length > 0,
            pais: webhookData.pais.length > 0,
            cargo_actual: webhookData.cargo_actual.length > 0,
            empresa_actual: webhookData.empresa_actual.length > 0,
            anos_experiencia: webhookData.anos_experiencia.length > 0,
            nivel_educacion: webhookData.nivel_educacion.length > 0
          });

          // Enviar datos al webhook
          const response = await fetch("https://techrea.app.n8n.cloud/webhook/datos_usuarios", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(webhookData),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Error del webhook:", response.status);
            console.error("❌ Respuesta del servidor:", errorText);
            console.error("❌ Datos enviados:", webhookData);
            
            // Mostrar error más específico
            if (response.status === 500) {
              showToast("Error del servidor - Verifica el formato de datos", "error");
            } else {
              showToast(`Error ${response.status}: ${response.statusText}`, "error");
            }
          } else {
            const webhookResult = await response.json();
            console.log("✅ Datos enviados exitosamente al webhook:", webhookResult);
            showToast("Datos profesionales enviados", "success");
          }
        } catch (err) {
          console.error("❌ Error enviando datos:", err);
          showToast("Error enviando datos, pero continuando...", "error");
        }
      }

      // Si estamos en el paso 3 (Habilidades Técnicas), enviar habilidades al webhook
      if (currentStep === 3) {
        try {
          // Validar que haya al menos una habilidad
          if (profileData.skills.length === 0) {
            showToast("Debes agregar al menos una habilidad técnica", "error");
            return; // No continuar si no hay habilidades
          }

          // Preparar datos para el webhook de habilidades técnicas
          const skillsText = profileData.skills
            .map(skill => `${skill.name} (${skill.percentage || 0}%)`)
            .join(", ");

          const webhookData = {
            sessionId: localStorage.getItem("user-email") || "usuario@axes.com",
            tecnologies: skillsText
          };

          console.log("🔄 Enviando habilidades técnicas al webhook:", webhookData);
          console.log("📋 Formato JSON:", JSON.stringify(webhookData, null, 2));
          console.log("📏 Tamaño de datos:", JSON.stringify(webhookData).length, "caracteres");
          console.log("🔍 Validación de campos:", {
            nombre_completo: webhookData.sessionId.length > 0,
            edad: webhookData.tecnologies.length > 0
          });

          // Enviar habilidades al webhook
          const response = await fetch("https://techrea.app.n8n.cloud/webhook/formulario_habilidades_tecnicas", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(webhookData),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Error del webhook de habilidades:", response.status);
            console.error("❌ Respuesta del servidor:", errorText);
            console.error("❌ Datos enviados:", webhookData);
            
            if (response.status === 500) {
              showToast("Error enviando habilidades - Verifica el formato", "error");
            } else {
              showToast(`Error ${response.status}: ${response.statusText}`, "error");
            }
            return; // No continuar si hay error
          } else {
            const webhookResult = await response.json();
            console.log("✅ Habilidades técnicas enviadas exitosamente:", webhookResult);
            console.log("🔍 Debug - Estructura del webhook result:", {
              hasMessage: !!webhookResult.message,
              messageType: typeof webhookResult.message,
              messageKeys: webhookResult.message ? Object.keys(webhookResult.message) : [],
              hasQuestions: !!webhookResult.questions,
              questionsType: typeof webhookResult.questions
            });
            
            // Guardar la respuesta original del webhook para mapeo posterior
            localStorage.setItem("original-technical-webhook-response", JSON.stringify(webhookResult));
            console.log("💾 Respuesta original del webhook de habilidades técnicas guardada");
            
            // Guardar las preguntas del chatbot si vienen en la respuesta
            if (webhookResult.message && typeof webhookResult.message === 'object') {
              // Extraer todas las preguntas del objeto message
              const allTechnicalQuestions: string[] = [];
              
              console.log("🔍 Debug - Procesando categorías técnicas:", Object.keys(webhookResult.message));
              
              Object.values(webhookResult.message).forEach((category: any, index: number) => {
                console.log(`🔍 Debug - Categoría ${index}:`, {
                  isArray: Array.isArray(category),
                  length: Array.isArray(category) ? category.length : 'N/A',
                  sample: Array.isArray(category) ? category[0] : category
                });
                
                if (Array.isArray(category)) {
                  category.forEach((item: any, itemIndex: number) => {
                    console.log(`🔍 Debug - Item ${itemIndex}:`, item);
                    if (item.afirmacion && typeof item.afirmacion === 'string') {
                      allTechnicalQuestions.push(item.afirmacion);
                      console.log(`✅ Pregunta técnica agregada: ${item.afirmacion}`);
                    }
                  });
                }
              });
              
              console.log("🔍 Debug - Total de preguntas técnicas extraídas:", allTechnicalQuestions.length);
              console.log("🔍 Debug - Preguntas técnicas:", allTechnicalQuestions);
              
              if (allTechnicalQuestions.length > 0) {
                setChatbotQuestions(allTechnicalQuestions);
                // Guardar en localStorage para que estén disponibles en el chatbot
                localStorage.setItem("chatbot-questions", JSON.stringify(allTechnicalQuestions));
                console.log("🤖 Preguntas técnicas del chatbot guardadas:", allTechnicalQuestions);
                showToast(`Habilidades enviadas y ${allTechnicalQuestions.length} preguntas técnicas recibidas`, "success");
              } else {
                // Si no se pudieron extraer preguntas, usar preguntas por defecto
                const defaultQuestions = [
                  "¿Cuál es tu experiencia más desafiante en desarrollo?",
                  "¿Cómo manejas los plazos ajustados en proyectos?",
                  "¿Qué haces cuando te encuentras con un problema técnico difícil?",
                  "¿Cómo te mantienes actualizado con las nuevas tecnologías?",
                  "¿Cuál es tu enfoque para trabajar en equipo?"
                ];
                setChatbotQuestions(defaultQuestions);
                localStorage.setItem("chatbot-questions", JSON.stringify(defaultQuestions));
                console.log("🤖 Usando preguntas por defecto del chatbot:", defaultQuestions);
                showToast("Habilidades técnicas enviadas", "success");
              }
            } else if (webhookResult.questions && Array.isArray(webhookResult.questions)) {
              // Formato alternativo (por si acaso)
              setChatbotQuestions(webhookResult.questions);
              localStorage.setItem("chatbot-questions", JSON.stringify(webhookResult.questions));
              console.log("🤖 Preguntas del chatbot guardadas (formato alternativo):", webhookResult.questions);
              showToast(`Habilidades enviadas y ${webhookResult.questions.length} preguntas recibidas`, "success");
            } else {
              // Si no vienen preguntas, usar preguntas por defecto
              const defaultQuestions = [
                "¿Cuál es tu experiencia más desafiante en desarrollo?",
                "¿Cómo manejas los plazos ajustados en proyectos?",
                "¿Qué haces cuando te encuentras con un problema técnico difícil?",
                "¿Cómo te mantienes actualizado con las nuevas tecnologías?",
                "¿Cuál es tu enfoque para trabajar en equipo?"
              ];
              setChatbotQuestions(defaultQuestions);
              // Guardar preguntas por defecto en localStorage
              localStorage.setItem("chatbot-questions", JSON.stringify(defaultQuestions));
              console.log("🤖 Usando preguntas por defecto del chatbot:", defaultQuestions);
              showToast("Habilidades técnicas enviadas", "success");
            }
          }
        } catch (err) {
          console.error("❌ Error enviando habilidades:", err);
          showToast("Error enviando habilidades, pero continuando...", "error");
          return; // No continuar si hay error
        }
      }

      // Si estamos en el paso 4 (Descripción Personal), enviar al webhook de habilidades blandas
      if (currentStep === 4) {
        try {
          // Validar que haya descripción personal
          if (!profileData.personalDescription.trim() || profileData.personalDescription.trim().length < 50) {
            showToast("La descripción personal debe tener al menos 50 caracteres", "error");
            return; // No continuar si no hay descripción válida
          }

          // Preparar datos para el webhook de habilidades blandas
          const message = profileData.personalDescription.trim();
          const sessionId = localStorage.getItem("user-email") || "usuario@axes.com";

          console.log("🔄 Enviando descripción personal al webhook:", { message, sessionId });

          // Enviar descripción al webhook (como query parameters)
          const url = `https://techrea.app.n8n.cloud/webhook/formulario_habilidades_blandas?message=${encodeURIComponent(message)}&sessionId=${encodeURIComponent(sessionId)}`;
          
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Error del webhook de habilidades blandas:", response.status);
            console.error("❌ Respuesta del servidor:", errorText);
            console.error("❌ Datos enviados:", { message, sessionId });
            
            if (response.status === 500) {
              showToast("Error enviando descripción - Verifica el formato", "error");
            } else {
              showToast(`Error ${response.status}: ${response.statusText}`, "error");
            }
            return; // No continuar si hay error
          } else {
            const webhookResult = await response.json();
            console.log("✅ Descripción personal enviada exitosamente:", webhookResult);
            
            // Guardar la respuesta del webhook
            localStorage.setItem("soft-skills-response", JSON.stringify(webhookResult));
            console.log("💾 Respuesta de habilidades blandas guardada:", webhookResult);
            
            showToast("Descripción personal enviada", "success");
          }
        } catch (err) {
          console.error("❌ Error enviando descripción:", err);
          showToast("Error enviando descripción, pero continuando...", "error");
          return; // No continuar si hay error
        }
      }

      // Continuar al siguiente paso
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinishProfile = async () => {
    try {
      const result = await saveProfile(profileData);
      if (result.success) {
        showToast("¡Perfil completado exitosamente!", "success");
        // Mostrar el chatbot después de un breve delay
        setTimeout(() => {
          setShowChatbot(true);
        }, 2000);
      } else {
        showToast(result.message || "Error al guardar el perfil", "error");
      }
    } catch (err) {
      showToast("Error de conexión. Inténtalo nuevamente", "error");
    }
  };

  const handleChatbotComplete = () => {
    // Redirigir al dashboard después de completar el chatbot
    window.location.href = "/dashboard";
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <User className="w-16 h-16 text-[#7C3AED] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Información Personal</h2>
              <p className="text-white/70">Cuéntanos un poco sobre ti</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm font-medium block mb-2">
                  Nombre Completo
                </label>
                <Input
                  value={profileData.fullName}
                  onChange={(e) => updateProfileData("fullName", e.target.value)}
                  placeholder="Tu nombre completo"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#7C3AED] rounded-xl"
                />
              </div>
              
              <div>
                <label className="text-white/80 text-sm font-medium block mb-2">
                  Edad
                </label>
                <Input
                  type="number"
                  value={profileData.age}
                  onChange={(e) => updateProfileData("age", e.target.value)}
                  placeholder="Tu edad"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#7C3AED] rounded-xl"
                />
              </div>
              
              <div>
                <label className="text-white/80 text-sm font-medium block mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Ubicación
                </label>
                <Input
                  value={profileData.location}
                  onChange={(e) => updateProfileData("location", e.target.value)}
                  placeholder="Ciudad, País"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#7C3AED] rounded-xl"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Briefcase className="w-16 h-16 text-[#7C3AED] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Experiencia Profesional</h2>
              <p className="text-white/70">Cuéntanos sobre tu trayectoria laboral</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm font-medium block mb-2">
                  Cargo Actual
                </label>
                <Input
                  value={profileData.currentRole}
                  onChange={(e) => updateProfileData("currentRole", e.target.value)}
                  placeholder="ej. Desarrollador Full Stack"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#7C3AED] rounded-xl"
                />
              </div>
              
              <div>
                <label className="text-white/80 text-sm font-medium block mb-2">
                  Empresa Actual
                </label>
                <Input
                  value={profileData.company}
                  onChange={(e) => updateProfileData("company", e.target.value)}
                  placeholder="Nombre de la empresa"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#7C3AED] rounded-xl"
                />
              </div>
              
              <div>
                <label className="text-white/80 text-sm font-medium block mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Años de Experiencia
                </label>
                <select
                  value={profileData.experience}
                  onChange={(e) => updateProfileData("experience", e.target.value)}
                  className="w-full bg-white/5 border border-white/20 text-white rounded-xl px-3 py-2 focus:border-[#7C3AED] focus:outline-none"
                >
                  <option value="" className="bg-gray-800">Selecciona tu experiencia</option>
                  <option value="0-1" className="bg-gray-800">0-1 años</option>
                  <option value="1-3" className="bg-gray-800">1-3 años</option>
                  <option value="3-5" className="bg-gray-800">3-5 años</option>
                  <option value="5-10" className="bg-gray-800">5-10 años</option>
                  <option value="10+" className="bg-gray-800">Más de 10 años</option>
                </select>
              </div>
              
              <div>
                <label className="text-white/80 text-sm font-medium block mb-2">
                  <GraduationCap className="w-4 h-4 inline mr-2" />
                  Nivel de Educación
                </label>
                <select
                  value={profileData.education}
                  onChange={(e) => updateProfileData("education", e.target.value)}
                  className="w-full bg-white/5 border border-white/20 text-white rounded-xl px-3 py-2 focus:border-[#7C3AED] focus:outline-none"
                >
                  <option value="" className="bg-gray-800">Selecciona tu nivel educativo</option>
                  <option value="secondary" className="bg-gray-800">Educación Secundaria</option>
                  <option value="technical" className="bg-gray-800">Técnico/Tecnólogo</option>
                  <option value="bachelor" className="bg-gray-800">Universitario</option>
                  <option value="master" className="bg-gray-800">Maestría</option>
                  <option value="phd" className="bg-gray-800">Doctorado</option>
                  <option value="bootcamp" className="bg-gray-800">Bootcamp/Autodidacta</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Code className="w-16 h-16 text-[#7C3AED] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Habilidades Técnicas</h2>
              <p className="text-white/70">Agrega las tecnologías que dominas y su nivel</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm font-medium block mb-2">
                  Agregar Habilidad
                </label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="ej. React, Python, Node.js"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#7C3AED] rounded-xl"
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button
                    onClick={addSkill}
                    className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white rounded-xl px-6"
                  >
                    Agregar
                  </Button>
                </div>
              </div>
              
              {profileData.skills.length > 0 && (
                <div>
                  <label className="text-white/80 text-sm font-medium block mb-2">
                    Tus Habilidades ({profileData.skills.length})
                  </label>
                  <div className="space-y-3">
                    {profileData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex-1">
                          <span className="text-white font-medium">{skill.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.percentage || 0}
                            onChange={(e) => updateSkillPercentage(skill.name, parseInt(e.target.value))}
                            className="w-24 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <span className="text-white/80 text-sm w-12 text-right">
                            {skill.percentage || 0}%
                          </span>
                        </div>
                        <Button
                          onClick={() => removeSkill(skill.name)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30 px-2 py-1 h-8"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/50 text-xs mt-2">
                    Ajusta el porcentaje según tu nivel de dominio
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MessageCircle className="w-16 h-16 text-[#7C3AED] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Descripción Personal</h2>
              <p className="text-white/70">Cuéntanos sobre ti en un párrafo corto</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm font-medium block mb-2">
                  Descripción Personal
                </label>
                <textarea
                  value={profileData.personalDescription}
                  onChange={(e) => updateProfileData("personalDescription", e.target.value)}
                  placeholder="Ej: Hola. Soy Jose Rincon Ingeniero mecatrónico con experiencia de 5 años en desarrollo fullstack. Tengo 23 años."
                  rows={4}
                  className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-[#7C3AED] rounded-xl px-3 py-2 resize-none focus:outline-none"
                />
                <p className="text-white/50 text-xs mt-1">
                  Mínimo 50 caracteres. Describe tu experiencia y perfil profesional.
                </p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Camera className="w-16 h-16 text-[#7C3AED] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Perfil Visual</h2>
              <p className="text-white/70">Personaliza tu perfil con imágenes y biografía</p>
            </div>
            
            <div className="space-y-6">
              {/* Banner Color */}
              <div>
                <label className="text-white/80 text-sm font-medium block mb-2">
                  Color del Banner
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {[
                    "#7C3AED", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
                    "#06B6D4", "#84CC16", "#F97316", "#EC4899", "#6366F1", "#14B8A6"
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateProfileData("bannerImage", color)}
                      className={`w-12 h-12 rounded-xl border-2 transition-all ${
                        profileData.bannerImage === color 
                          ? "border-white scale-110" 
                          : "border-white/20 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="text-white/50 text-xs mt-2">
                  Selecciona un color para tu banner personal
                </p>
              </div>

              {/* Profile Avatar */}
              <div>
                <label className="text-white/80 text-sm font-medium block mb-2">
                  Avatar de Perfil
                </label>
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white border-4 border-white/20"
                    style={{ backgroundColor: profileData.profileImage || "#7C3AED" }}
                  >
                    {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      "#7C3AED", "#3B82F6", "#10B981", "#F59E0B", 
                      "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16"
                    ].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => updateProfileData("profileImage", color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          profileData.profileImage === color 
                            ? "border-white scale-110" 
                            : "border-white/20 hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-white/50 text-xs mt-2">
                  Elige un color para tu avatar
                </p>
              </div>

              {/* Social Links removed */}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <GraduationCap className="w-16 h-16 text-[#7C3AED] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Objetivos Profesionales</h2>
              <p className="text-white/70">¿Hacia dónde quieres dirigir tu carrera?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-white/80 text-sm font-medium block mb-2">
                  Describe tus objetivos profesionales
                </label>
                <textarea
                  value={profileData.careerGoals}
                  onChange={(e) => updateProfileData("careerGoals", e.target.value)}
                  placeholder="Cuéntanos sobre tus metas profesionales, qué tipo de proyectos te interesan, hacia dónde quieres crecer en tu carrera..."
                  rows={6}
                  className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-[#7C3AED] rounded-xl px-3 py-2 resize-none focus:outline-none"
                />
                <p className="text-white/50 text-xs mt-1">
                  Mínimo 50 caracteres ({profileData.careerGoals.length}/50)
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profileData.fullName && profileData.age && profileData.location;
      case 2:
        return profileData.currentRole && profileData.experience && profileData.education;
      case 3:
        return profileData.skills.length > 0 && profileData.skills.every(skill => skill.name && skill.name.trim() && skill.percentage >= 0);
      case 4:
        return profileData.personalDescription && typeof profileData.personalDescription === 'string' && profileData.personalDescription.trim().length >= 50;
      case 5:
        return true; // Perfil visual es opcional
      case 6:
        return profileData.careerGoals && typeof profileData.careerGoals === 'string' && profileData.careerGoals.trim().length >= 50;
      default:
        return false;
    }
  };

  // Si debe mostrar el chatbot, renderizarlo
  if (showChatbot) {
    return (
      <EmployeeChatbot 
        onComplete={handleChatbotComplete}
        userProfile={profileData}
      />
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Completa tu Perfil
          </h1>
          <p className="text-white/70">
            Ayúdanos a conocerte mejor para personalizar tu experiencia en AXES
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`
                      flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all
                      ${isActive 
                        ? "bg-[#7C3AED] border-[#7C3AED] text-white" 
                        : isCompleted 
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-transparent border-white/30 text-white/50"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  
                  {index < STEPS.length - 1 && (
                    <div 
                      className={`
                        w-16 h-0.5 mx-2 transition-colors
                        ${currentStep > step.id ? "bg-green-500" : "bg-white/20"}
                      `} 
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <Card className="axes-card p-8 rounded-2xl max-w-2xl mx-auto">
          {renderStepContent()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <Button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="axes-btn-outline rounded-xl disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            
            {currentStep < STEPS.length ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="axes-btn-primary rounded-xl disabled:opacity-50"
              >
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleFinishProfile}
                disabled={!isStepValid() || isLoading}
                className="bg-green-500 hover:bg-green-600 text-white rounded-xl disabled:opacity-50 font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Guardando...</span>
                  </div>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Continuar al Chatbot
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        {/* Toast Notification */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </div>
    </div>
  );
}
