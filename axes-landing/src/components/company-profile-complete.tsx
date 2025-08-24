"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { ThemeToggle } from "@/components/theme-toggle";
import { Building2, Upload, CheckCircle, ArrowRight } from "lucide-react";

interface CompanyProfileCompleteProps {
  companyData: any;
  onComplete: () => void;
}

export function CompanyProfileComplete({ companyData, onComplete }: CompanyProfileCompleteProps) {
  const [profileData, setProfileData] = useState({
    logo: companyData.logo || "",
    banner: companyData.banner || "",
    bio: companyData.bio || "",
    socialLinks: {
      linkedin: companyData.socialLinks?.linkedin || "",
      twitter: companyData.socialLinks?.twitter || "",
      website: companyData.socialLinks?.website || ""
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (type: "logo" | "banner", imageData: string) => {
    setProfileData(prev => ({
      ...prev,
      [type]: imageData
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Guardar en localStorage
      const updatedProfile = { ...companyData, ...profileData };
      localStorage.setItem("company-profile", JSON.stringify(updatedProfile));
      
      // Marcar como completado
      setTimeout(() => {
        onComplete();
      }, 1000);
      
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = profileData.logo && profileData.bio;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-axes-bg-primary via-axes-bg-secondary to-axes-bg-tertiary">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-4xl axes-card p-8 shadow-xl rounded-2xl">
        <CardHeader className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-axes-primary/20 p-3 rounded-xl">
              <Building2 className="w-8 h-8 text-axes-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-axes-primary mb-2">
            Completa tu Perfil Empresarial
          </CardTitle>
          <CardDescription className="text-axes-text-secondary text-lg">
            Añade los toques finales para que tu empresa destaque en AXES
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Logo y Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-axes-text-secondary">
                Logo de la Empresa
              </label>
                              <ImageUpload
                  label="Logo de la Empresa"
                  currentImage={profileData.logo}
                  onImageChange={(imageData) => handleImageUpload("logo", imageData || "")}
                  placeholder="Sube el logo de tu empresa"
                />
            </div>

            {/* Banner */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-axes-text-secondary">
                Banner de la Empresa
              </label>
                              <ImageUpload
                  label="Banner de la Empresa"
                  currentImage={profileData.banner}
                  onImageChange={(imageData) => handleImageUpload("banner", imageData || "")}
                  placeholder="Sube un banner atractivo"
                  aspectRatio="banner"
                />
            </div>
          </div>

          {/* Biografía */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-axes-text-secondary">
              Biografía de la Empresa
            </label>
            <Textarea
              value={profileData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Cuéntanos la historia de tu empresa, su misión, visión y lo que la hace especial..."
              className="axes-input min-h-[120px]"
              rows={5}
            />
            <p className="text-xs text-axes-text-muted">
              Esta información aparecerá en tu perfil público y ayudará a los candidatos a conocer mejor tu empresa.
            </p>
          </div>

          {/* Enlaces Sociales */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-axes-text-secondary">
              Enlaces Sociales y Web
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-axes-text-muted mb-1">LinkedIn</label>
                <Input
                  value={profileData.socialLinks.linkedin}
                  onChange={(e) => handleInputChange("socialLinks.linkedin", e.target.value)}
                  placeholder="https://linkedin.com/company/..."
                  className="axes-input"
                />
              </div>
              <div>
                <label className="block text-xs text-axes-text-muted mb-1">Twitter/X</label>
                <Input
                  value={profileData.socialLinks.twitter}
                  onChange={(e) => handleInputChange("socialLinks.twitter", e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="axes-input"
                />
              </div>
              <div>
                <label className="block text-xs text-axes-text-muted mb-1">Portfolio/Sitio Web</label>
                <Input
                  value={profileData.socialLinks.website}
                  onChange={(e) => handleInputChange("socialLinks.website", e.target.value)}
                  placeholder="https://tuempresa.com"
                  className="axes-input"
                />
              </div>
            </div>
          </div>

          {/* Botón de Envío */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="axes-btn-primary rounded-xl px-8 py-3 text-lg"
            >
              {isSubmitting ? (
                "Guardando..."
              ) : (
                <>
                  Completar Perfil
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Indicador de Progreso */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-axes-text-secondary">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">Perfil casi completo</span>
            </div>
            <p className="text-xs text-axes-text-muted mt-1">
              Después de esto podrás crear ofertas de trabajo
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
