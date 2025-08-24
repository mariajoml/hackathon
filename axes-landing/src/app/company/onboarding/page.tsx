"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCompanyOnboarding } from "@/hooks/use-company-onboarding";
import { Building2, Users, Globe, Heart, ArrowLeft, ArrowRight, Check, Plus, X, MapPin, Mail, User, Briefcase } from "lucide-react";
import { CompanyChatbot } from "@/components/company-chatbot";
import { CompanyProfileComplete } from "@/components/company-profile-complete";

const INDUSTRIES = [
  "Tecnología", "Fintech", "E-commerce", "Salud", "Educación", 
  "Marketing", "Consultoría", "Manufactura", "Retail", "Otros"
];

const COMPANY_SIZES = [
  "1-10 empleados", "11-50 empleados", "51-200 empleados", 
  "201-500 empleados", "501-1000 empleados", "1000+ empleados"
];

const STEPS = [
  { id: 1, title: "Información Básica", icon: Building2 },
  { id: 2, title: "Contacto", icon: Users },
  { id: 3, title: "Perfil Empresarial", icon: Globe },
  { id: 4, title: "Cultura y Beneficios", icon: Heart },
  { id: 5, title: "Validación con IA", icon: Building2 },
  { id: 6, title: "Perfil Completo", icon: Building2 }
];

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const {
    data,
    isLoading,
    canProceed,
    updateData,
    nextStep,
    prevStep,
    addBenefit,
    removeBenefit,
    addCultureValue,
    removeCultureValue,
    completeOnboarding
  } = useCompanyOnboarding();

  const [newBenefit, setNewBenefit] = useState("");
  const [newCultureValue, setNewCultureValue] = useState("");

  const progress = (data.currentStep / STEPS.length) * 100;

  const handleNext = () => {
    if (data.currentStep < STEPS.length) {
      nextStep();
    }
  };

  const handleChatbotComplete = () => {
    nextStep();
  };

  const handleProfileComplete = () => {
    router.push("/company/dashboard");
  };

  const handleComplete = async () => {
    const result = await completeOnboarding();
    if (result.success) {
      router.push("/company/dashboard");
    }
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      addBenefit(newBenefit);
      setNewBenefit("");
    }
  };

  const handleAddCultureValue = () => {
    if (newCultureValue.trim()) {
      addCultureValue(newCultureValue);
      setNewCultureValue("");
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Building2 className="w-16 h-16 text-axes-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-axes-text-primary mb-2">Información Básica</h2>
        <p className="text-axes-text-secondary">Cuéntanos sobre tu empresa</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-2">
            Nombre de la empresa *
          </label>
          <Input
            type="text"
            placeholder="Ej: TechCorp Solutions"
            value={data.companyName}
            onChange={(e) => updateData({ companyName: e.target.value })}
            className="axes-input"
          />
        </div>

        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-2">
            Industria *
          </label>
          <select
            value={data.industry}
            onChange={(e) => updateData({ industry: e.target.value })}
            className="w-full axes-input"
          >
            <option value="">Selecciona una industria</option>
            {INDUSTRIES.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-2">
            Tamaño de la empresa *
          </label>
          <select
            value={data.companySize}
            onChange={(e) => updateData({ companySize: e.target.value })}
            className="w-full axes-input"
          >
            <option value="">Selecciona el tamaño</option>
            {COMPANY_SIZES.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Users className="w-16 h-16 text-axes-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-axes-text-primary mb-2">Información de Contacto</h2>
        <p className="text-axes-text-secondary">Datos del responsable de recursos humanos</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Nombre del contacto *
          </label>
          <Input
            type="text"
            placeholder="Ej: María García"
            value={data.contactName}
            onChange={(e) => updateData({ contactName: e.target.value })}
            className="axes-input"
          />
        </div>

        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email corporativo *
          </label>
          <Input
            type="email"
            placeholder="Ej: rrhh@empresa.com"
            value={data.contactEmail}
            onChange={(e) => updateData({ contactEmail: e.target.value })}
            className="axes-input"
          />
        </div>

        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-2">
            <Briefcase className="w-4 h-4 inline mr-2" />
            Cargo *
          </label>
          <Input
            type="text"
            placeholder="Ej: Gerente de Recursos Humanos"
            value={data.contactPosition}
            onChange={(e) => updateData({ contactPosition: e.target.value })}
            className="axes-input"
          />
        </div>

        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Ubicación *
          </label>
          <Input
            type="text"
            placeholder="Ej: Ciudad de México, México"
            value={data.location}
            onChange={(e) => updateData({ location: e.target.value })}
            className="axes-input"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Globe className="w-16 h-16 text-axes-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-axes-text-primary mb-2">Perfil Empresarial</h2>
        <p className="text-axes-text-secondary">Presenta tu empresa a los candidatos</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-2">
            Sitio web *
          </label>
          <Input
            type="url"
            placeholder="https://www.tuempresa.com"
            value={data.website}
            onChange={(e) => updateData({ website: e.target.value })}
            className="axes-input"
          />
        </div>

        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-2">
            Descripción de la empresa *
          </label>
          <Textarea
            placeholder="Describe tu empresa, su misión, visión y lo que la hace especial..."
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            className="axes-input resize-none h-32"
          />
          <p className="text-axes-text-muted text-xs mt-1">
            Mínimo 100 caracteres. Sé específico sobre lo que hace tu empresa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-axes-text-secondary text-sm font-medium block mb-2">
              LinkedIn
            </label>
            <Input
              type="url"
              placeholder="https://linkedin.com/company/..."
              value={data.socialLinks?.linkedin || ""}
              onChange={(e) => updateData({ 
                socialLinks: { ...data.socialLinks, linkedin: e.target.value }
              })}
              className="axes-input"
            />
          </div>
          <div>
            <label className="text-axes-text-secondary text-sm font-medium block mb-2">
              Twitter
            </label>
            <Input
              type="url"
              placeholder="https://twitter.com/..."
              value={data.socialLinks?.twitter || ""}
              onChange={(e) => updateData({ 
                socialLinks: { ...data.socialLinks, twitter: e.target.value }
              })}
              className="axes-input"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Heart className="w-16 h-16 text-axes-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-axes-text-primary mb-2">Cultura y Beneficios</h2>
        <p className="text-axes-text-secondary">¿Qué hace especial trabajar en tu empresa?</p>
      </div>

      <div className="space-y-6">
        {/* Beneficios */}
        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-3">
            Beneficios que ofreces *
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              placeholder="Ej: Seguro médico privado"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddBenefit()}
              className="axes-input flex-1"
            />
            <Button
              type="button"
              onClick={handleAddBenefit}
              className="axes-btn-primary px-6"
              disabled={!newBenefit.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.benefits.map((benefit, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30 pr-2"
              >
                {benefit}
                <button
                  onClick={() => removeBenefit(index)}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <p className="text-axes-text-muted text-xs mt-2">
            Agrega al menos 3 beneficios que ofreces a tus empleados
          </p>
        </div>

        {/* Valores de cultura */}
        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-3">
            Valores y cultura empresarial *
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              placeholder="Ej: Innovación constante"
              value={newCultureValue}
              onChange={(e) => setNewCultureValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddCultureValue()}
              className="axes-input flex-1"
            />
            <Button
              type="button"
              onClick={handleAddCultureValue}
              className="axes-btn-primary px-6"
              disabled={!newCultureValue.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.culture.map((value, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-green-500/20 text-green-600 border-green-500/30 pr-2"
              >
                {value}
                <button
                  onClick={() => removeCultureValue(index)}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <p className="text-axes-text-muted text-xs mt-2">
            Define los valores fundamentales de tu empresa
          </p>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (data.currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return <CompanyChatbot onComplete={handleChatbotComplete} companyData={data} />;
      case 6: return <CompanyProfileComplete onComplete={handleProfileComplete} companyData={data} />;
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen axes-bg-primary">
      {/* Header */}
      <header className="axes-nav border-b border-axes-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
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
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-axes-text-primary">
              Configura tu perfil empresarial
            </h1>
            <span className="text-axes-text-secondary">
              {data.currentStep} de {STEPS.length}
            </span>
          </div>
          <div className="h-2 mb-6 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#7C3AED] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Step indicators */}
          <div className="flex justify-between">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = data.currentStep === step.id;
              const isCompleted = data.currentStep > step.id;
              
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center text-center ${
                    isActive 
                      ? "text-axes-primary" 
                      : isCompleted 
                        ? "text-green-500" 
                        : "text-axes-text-muted"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 ${
                      isActive
                        ? "bg-axes-primary border-axes-primary text-white"
                        : isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-axes-bg-card border-axes-border"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs font-medium max-w-20">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <Card className="axes-card mb-8">
          <CardContent className="p-8">
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClick={prevStep}
            disabled={data.currentStep === 1}
            className="axes-btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          {data.currentStep < STEPS.length ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="axes-btn-primary"
            >
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!canProceed || isLoading}
              className="axes-btn-primary"
            >
              {isLoading ? "Finalizando..." : "Completar"}
              <Check className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
