"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Toast } from "@/components/ui/toast";
import { ImageUpload } from "@/components/image-upload";
import { useOnboarding } from "@/hooks/use-onboarding";
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
  Camera,
  Link,
  Github,
  Linkedin
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
  skills: string[];
  
  // Objetivos
  careerGoals: string;
  
  // Perfil Visual
  profileImage?: string;
  bannerImage?: string;
  biography?: string;
  
  // Social Links
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

const STEPS = [
  { id: 1, title: "Información Personal", icon: User },
  { id: 2, title: "Experiencia Profesional", icon: Briefcase },
  { id: 3, title: "Habilidades Técnicas", icon: Code },
  { id: 4, title: "Perfil Visual", icon: Camera },
  { id: 5, title: "Objetivos Profesionales", icon: GraduationCap },
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
    skills: [],
    careerGoals: "",
    profileImage: "",
    bannerImage: "",
    biography: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
  });
  
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
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
    clearError();
  };

  const updateProfileData = (field: keyof ProfileData, value: string | string[]) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      updateProfileData("skills", [...profileData.skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateProfileData("skills", profileData.skills.filter(skill => skill !== skillToRemove));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profileData.fullName && profileData.age && profileData.location;
      case 2:
        return profileData.currentRole && profileData.experience && profileData.education;
      case 3:
        return profileData.skills.length > 0;
      case 4:
        return true; // Perfil visual es opcional
      case 5:
        return profileData.careerGoals.trim().length > 0;
      default:
        return false;
    }
  };

  const handleFinishProfile = async () => {
    try {
      const result = await saveProfile(profileData);
      if (result.success) {
        showToast("¡Perfil completado exitosamente!", "success");
        // Redirigir al chatbot después de un breve delay
        setTimeout(() => {
          window.location.href = "/chatbot";
        }, 2000);
      } else {
        showToast(result.message || "Error al guardar el perfil", "error");
      }
    } catch (err) {
      showToast("Error de conexión. Inténtalo nuevamente", "error");
    }
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
              <p className="text-white/70">Agrega las tecnologías que dominas</p>
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
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30 px-3 py-1 cursor-pointer hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-colors"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                  <p className="text-white/50 text-xs mt-2">
                    Haz clic en una habilidad para eliminarla
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
              <Camera className="w-16 h-16 text-[#7C3AED] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Perfil Visual</h2>
              <p className="text-white/70">Personaliza tu perfil con imágenes y biografía</p>
            </div>
            
            <div className="space-y-6">
              {/* Banner Image */}
              <div>
                <ImageUpload
                  label="Imagen de Banner"
                  currentImage={profileData.bannerImage}
                  onImageChange={(imageUrl) => updateProfileData("bannerImage", imageUrl || "")}
                  aspectRatio="banner"
                  placeholder="Agrega un banner profesional"
                />
              </div>

              {/* Profile Image */}
              <div>
                <ImageUpload
                  label="Foto de Perfil"
                  currentImage={profileData.profileImage}
                  onImageChange={(imageUrl) => updateProfileData("profileImage", imageUrl || "")}
                  aspectRatio="square"
                  placeholder="Agrega tu foto"
                />
              </div>

              {/* Biography */}
              <div>
                <label className="text-white/80 text-sm font-medium block mb-2">
                  Biografía Profesional
                </label>
                <textarea
                  value={profileData.biography}
                  onChange={(e) => updateProfileData("biography", e.target.value)}
                  placeholder="Cuéntanos sobre ti, tu experiencia y lo que te apasiona en el mundo tech..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-[#7C3AED] rounded-xl px-3 py-2 resize-none focus:outline-none"
                />
                <p className="text-white/50 text-xs mt-1">
                  Opcional - Máximo 500 caracteres ({profileData.biography?.length || 0}/500)
                </p>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-white/80 text-sm font-medium block mb-2">
                    <Linkedin className="w-4 h-4 inline mr-2" />
                    LinkedIn
                  </label>
                  <Input
                    value={profileData.linkedinUrl}
                    onChange={(e) => updateProfileData("linkedinUrl", e.target.value)}
                    placeholder="https://linkedin.com/in/tu-perfil"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#7C3AED] rounded-xl"
                  />
                </div>
                
                <div>
                  <label className="text-white/80 text-sm font-medium block mb-2">
                    <Github className="w-4 h-4 inline mr-2" />
                    GitHub
                  </label>
                  <Input
                    value={profileData.githubUrl}
                    onChange={(e) => updateProfileData("githubUrl", e.target.value)}
                    placeholder="https://github.com/tu-usuario"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#7C3AED] rounded-xl"
                  />
                </div>
                
                <div>
                  <label className="text-white/80 text-sm font-medium block mb-2">
                    <Link className="w-4 h-4 inline mr-2" />
                    Portfolio
                  </label>
                  <Input
                    value={profileData.portfolioUrl}
                    onChange={(e) => updateProfileData("portfolioUrl", e.target.value)}
                    placeholder="https://tu-portfolio.com"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[#7C3AED] rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
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
