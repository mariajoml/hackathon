"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/theme-toggle";
import { AssessmentBuilder } from "@/components/assessment-builder";
import { 
  Building2, Plus, X, ArrowLeft, ArrowRight, Check, DollarSign,
  MapPin, Calendar, Users, Briefcase, Target, Zap, Settings,
  FileText, Code, MessageSquare, Brain
} from "lucide-react";

interface VacancyData {
  // Basic Info
  title: string;
  department: string;
  level: "junior" | "mid" | "senior" | "lead";
  workMode: "remoto" | "presencial" | "hibrido";
  contractType: "tiempo-completo" | "tiempo-parcial" | "contrato" | "freelance";
  location: string;
  
  // Details
  description: string;
  responsibilities: string[];
  requirements: string[];
  
  // Skills
  technicalSkills: string[];
  softSkills: string[];
  
  // Compensation
  salaryMin: number;
  salaryMax: number;
  currency: string;
  benefits: string[];
  
  // Assessment
  assessmentType: "automatic" | "custom";
  customAssessment: any;
  
  // Urgency
  urgency: "alta" | "media" | "baja";
  startDate: string;
}

const INITIAL_DATA: VacancyData = {
  title: "",
  department: "",
  level: "mid",
  workMode: "hibrido",
  contractType: "tiempo-completo",
  location: "",
  description: "",
  responsibilities: [],
  requirements: [],
  technicalSkills: [],
  softSkills: [],
  salaryMin: 0,
  salaryMax: 0,
  currency: "USD",
  benefits: [],
  assessmentType: "automatic",
  customAssessment: null,
  urgency: "media",
  startDate: ""
};

const STEPS = [
  { id: 1, title: "Información Básica", icon: Briefcase },
  { id: 2, title: "Descripción", icon: FileText },
  { id: 3, title: "Skills Requeridas", icon: Code },
  { id: 4, title: "Compensación", icon: DollarSign },
  { id: 5, title: "Assessment", icon: Brain },
  { id: 6, title: "Publicar", icon: Target }
];

const DEPARTMENTS = [
  "Tecnología", "Producto", "Diseño", "Marketing", "Ventas", 
  "Recursos Humanos", "Finanzas", "Operaciones", "Otros"
];

const TECHNICAL_SKILLS_SUGGESTIONS = [
  "React", "TypeScript", "Node.js", "Python", "JavaScript", "Vue.js", "Angular",
  "Next.js", "Express", "PostgreSQL", "MongoDB", "AWS", "Docker", "Kubernetes",
  "Java", "C#", ".NET", "Spring", "Django", "Flask", "Ruby on Rails",
  "Go", "Rust", "Swift", "Kotlin", "Flutter", "React Native",
  "HTML", "CSS", "Sass", "Tailwind", "Bootstrap", "Figma", "Adobe XD"
];

const SOFT_SKILLS_SUGGESTIONS = [
  "Comunicación efectiva", "Trabajo en equipo", "Liderazgo", "Proactividad",
  "Autonomía", "Creatividad", "Pensamiento crítico", "Adaptabilidad",
  "Resolución de problemas", "Gestión del tiempo", "Empatía", "Negociación",
  "Mentoring", "Planificación", "Atención al detalle", "Innovación"
];

export default function CreateVacancyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<VacancyData>(INITIAL_DATA);
  const [newResponsibility, setNewResponsibility] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newTechSkill, setNewTechSkill] = useState("");
  const [newSoftSkill, setNewSoftSkill] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  // Cargar datos del chatbot si existen
  useEffect(() => {
    const chatbotRequirements = localStorage.getItem("company-vacancy-requirements");
    if (chatbotRequirements) {
      try {
        const requirements = JSON.parse(chatbotRequirements);
        setData(prev => ({
          ...prev,
          title: requirements.position || "",
          level: requirements.level || "mid",
          softSkills: requirements.softSkills || []
        }));
        // Limpiar datos del chatbot
        localStorage.removeItem("company-vacancy-requirements");
      } catch (error) {
        console.error("Error loading chatbot requirements:", error);
      }
    }
  }, []);

  const progress = (currentStep / STEPS.length) * 100;

  const updateData = (updates: Partial<VacancyData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const addItem = (field: keyof VacancyData, value: string) => {
    if (value.trim()) {
      updateData({
        [field]: [...(data[field] as string[]), value.trim()]
      });
    }
  };

  const removeItem = (field: keyof VacancyData, index: number) => {
    updateData({
      [field]: (data[field] as string[]).filter((_, i) => i !== index)
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!(data.title && data.department && data.location);
      case 2:
        return !!(data.description && data.responsibilities.length > 0);
      case 3:
        return data.technicalSkills.length > 0;
      case 4:
        return !!(data.salaryMin && data.salaryMax && data.benefits.length > 0);
      case 5:
        return true; // Assessment is optional
      case 6:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = async () => {
    // Aquí iría la lógica para publicar la vacante
    console.log("Publishing vacancy:", data);
    
    // Simular guardado
    setTimeout(() => {
      router.push("/company/dashboard?tab=vacancies");
    }, 1000);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Briefcase className="w-16 h-16 text-axes-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-axes-text-primary mb-2">Información Básica</h2>
        <p className="text-axes-text-secondary">Define los aspectos fundamentales del puesto</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="text-axes-text-secondary text-sm font-medium block mb-2">
            Título del puesto *
          </label>
          <Input
            type="text"
            placeholder="Ej: Senior Frontend Developer"
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
            className="axes-input"
          />
        </div>

        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-2">
            Departamento *
          </label>
          <select
            value={data.department}
            onChange={(e) => updateData({ department: e.target.value })}
            className="w-full axes-input"
          >
            <option value="">Selecciona departamento</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-2">
            Nivel de experiencia
          </label>
          <select
            value={data.level}
            onChange={(e) => updateData({ level: e.target.value as any })}
            className="w-full axes-input"
          >
            <option value="junior">Junior (0-2 años)</option>
            <option value="mid">Mid (2-5 años)</option>
            <option value="senior">Senior (5+ años)</option>
            <option value="lead">Lead/Arquitecto (8+ años)</option>
          </select>
        </div>

        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-2">
            Modalidad de trabajo
          </label>
          <select
            value={data.workMode}
            onChange={(e) => updateData({ workMode: e.target.value as any })}
            className="w-full axes-input"
          >
            <option value="remoto">100% Remoto</option>
            <option value="presencial">Presencial</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>

        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-2">
            Tipo de contrato
          </label>
          <select
            value={data.contractType}
            onChange={(e) => updateData({ contractType: e.target.value as any })}
            className="w-full axes-input"
          >
            <option value="tiempo-completo">Tiempo completo</option>
            <option value="tiempo-parcial">Tiempo parcial</option>
            <option value="contrato">Por contrato</option>
            <option value="freelance">Freelance</option>
          </select>
        </div>

        <div className="md:col-span-2">
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

        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-2">
            Urgencia
          </label>
          <select
            value={data.urgency}
            onChange={(e) => updateData({ urgency: e.target.value as any })}
            className="w-full axes-input"
          >
            <option value="baja">Baja - Proceso estándar</option>
            <option value="media">Media - Llenar en 2-4 semanas</option>
            <option value="alta">Alta - Urgente, ASAP</option>
          </select>
        </div>

        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Fecha de inicio
          </label>
          <Input
            type="date"
            value={data.startDate}
            onChange={(e) => updateData({ startDate: e.target.value })}
            className="axes-input"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <FileText className="w-16 h-16 text-axes-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-axes-text-primary mb-2">Descripción del Puesto</h2>
        <p className="text-axes-text-secondary">Detalla las responsabilidades y requisitos</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-2">
            Descripción general *
          </label>
          <Textarea
            placeholder="Describe el puesto, el equipo, los objetivos principales..."
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            className="axes-input resize-none h-32"
          />
        </div>

        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-3">
            Responsabilidades principales *
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              placeholder="Ej: Desarrollar features frontend con React"
              value={newResponsibility}
              onChange={(e) => setNewResponsibility(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addItem("responsibilities", newResponsibility) && setNewResponsibility("")}
              className="axes-input flex-1"
            />
            <Button
              type="button"
              onClick={() => {
                addItem("responsibilities", newResponsibility);
                setNewResponsibility("");
              }}
              className="axes-btn-primary px-6"
              disabled={!newResponsibility.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {data.responsibilities.map((resp, index) => (
              <div key={index} className="flex items-center justify-between p-3 axes-bg-hover rounded-lg">
                <span className="text-axes-text-primary text-sm">{resp}</span>
                <button
                  onClick={() => removeItem("responsibilities", index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-3">
            Requisitos mínimos
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              placeholder="Ej: 3+ años de experiencia con React"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addItem("requirements", newRequirement) && setNewRequirement("")}
              className="axes-input flex-1"
            />
            <Button
              type="button"
              onClick={() => {
                addItem("requirements", newRequirement);
                setNewRequirement("");
              }}
              className="axes-btn-primary px-6"
              disabled={!newRequirement.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {data.requirements.map((req, index) => (
              <div key={index} className="flex items-center justify-between p-3 axes-bg-hover rounded-lg">
                <span className="text-axes-text-primary text-sm">{req}</span>
                <button
                  onClick={() => removeItem("requirements", index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Code className="w-16 h-16 text-axes-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-axes-text-primary mb-2">Skills Requeridas</h2>
        <p className="text-axes-text-secondary">Define las habilidades técnicas y blandas necesarias</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Technical Skills */}
        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-3">
            Habilidades Técnicas *
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              placeholder="Ej: React, TypeScript..."
              value={newTechSkill}
              onChange={(e) => setNewTechSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addItem("technicalSkills", newTechSkill) && setNewTechSkill("")}
              className="axes-input flex-1"
            />
            <Button
              type="button"
              onClick={() => {
                addItem("technicalSkills", newTechSkill);
                setNewTechSkill("");
              }}
              className="axes-btn-primary px-6"
              disabled={!newTechSkill.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Suggestions */}
          <div className="mb-4">
            <p className="text-axes-text-muted text-xs mb-2">Sugerencias populares:</p>
            <div className="flex flex-wrap gap-1">
              {TECHNICAL_SKILLS_SUGGESTIONS.slice(0, 8).map((skill) => (
                <Button
                  key={skill}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!data.technicalSkills.includes(skill)) {
                      addItem("technicalSkills", skill);
                    }
                  }}
                  className="text-xs axes-btn-ghost"
                >
                  {skill}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.technicalSkills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-blue-500/20 text-blue-600 border-blue-500/30 pr-2"
              >
                {skill}
                <button
                  onClick={() => removeItem("technicalSkills", index)}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-3">
            Soft Skills
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              placeholder="Ej: Liderazgo, Comunicación..."
              value={newSoftSkill}
              onChange={(e) => setNewSoftSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addItem("softSkills", newSoftSkill) && setNewSoftSkill("")}
              className="axes-input flex-1"
            />
            <Button
              type="button"
              onClick={() => {
                addItem("softSkills", newSoftSkill);
                setNewSoftSkill("");
              }}
              className="axes-btn-primary px-6"
              disabled={!newSoftSkill.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Suggestions */}
          <div className="mb-4">
            <p className="text-axes-text-muted text-xs mb-2">Sugerencias populares:</p>
            <div className="flex flex-wrap gap-1">
              {SOFT_SKILLS_SUGGESTIONS.slice(0, 6).map((skill) => (
                <Button
                  key={skill}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!data.softSkills.includes(skill)) {
                      addItem("softSkills", skill);
                    }
                  }}
                  className="text-xs axes-btn-ghost"
                >
                  {skill}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.softSkills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-green-500/20 text-green-600 border-green-500/30 pr-2"
              >
                {skill}
                <button
                  onClick={() => removeItem("softSkills", index)}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <DollarSign className="w-16 h-16 text-axes-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-axes-text-primary mb-2">Compensación y Beneficios</h2>
        <p className="text-axes-text-secondary">Define el paquete de compensación</p>
      </div>

      <div className="space-y-6">
        {/* Salary Range */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-axes-text-secondary text-sm font-medium block mb-2">
              Salario mínimo *
            </label>
            <Input
              type="number"
              placeholder="50000"
              value={data.salaryMin || ""}
              onChange={(e) => updateData({ salaryMin: parseInt(e.target.value) || 0 })}
              className="axes-input"
            />
          </div>
          <div>
            <label className="text-axes-text-secondary text-sm font-medium block mb-2">
              Salario máximo *
            </label>
            <Input
              type="number"
              placeholder="80000"
              value={data.salaryMax || ""}
              onChange={(e) => updateData({ salaryMax: parseInt(e.target.value) || 0 })}
              className="axes-input"
            />
          </div>
          <div>
            <label className="text-axes-text-secondary text-sm font-medium block mb-2">
              Moneda
            </label>
            <select
              value={data.currency}
              onChange={(e) => updateData({ currency: e.target.value })}
              className="w-full axes-input"
            >
              <option value="USD">USD</option>
              <option value="MXN">MXN</option>
              <option value="EUR">EUR</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
        </div>

        {/* Benefits */}
        <div>
          <label className="text-axes-text-secondary text-sm font-medium block mb-3">
            Beneficios *
          </label>
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              placeholder="Ej: Seguro médico privado"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addItem("benefits", newBenefit) && setNewBenefit("")}
              className="axes-input flex-1"
            />
            <Button
              type="button"
              onClick={() => {
                addItem("benefits", newBenefit);
                setNewBenefit("");
              }}
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
                className="bg-purple-500/20 text-purple-600 border-purple-500/30 pr-2"
              >
                {benefit}
                <button
                  onClick={() => removeItem("benefits", index)}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <p className="text-axes-text-muted text-xs mt-2">
            Los beneficios competitivos atraen mejores candidatos
          </p>
        </div>

        {/* Salary Preview */}
        {data.salaryMin > 0 && data.salaryMax > 0 && (
          <div className="axes-bg-hover p-4 rounded-lg">
            <h3 className="text-axes-text-primary font-semibold mb-2">Vista previa de compensación</h3>
            <p className="text-2xl font-bold text-axes-primary">
              ${data.salaryMin.toLocaleString()} - ${data.salaryMax.toLocaleString()} {data.currency}
            </p>
            <p className="text-axes-text-muted text-sm">
              + {data.benefits.length} beneficios adicionales
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Brain className="w-16 h-16 text-axes-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-axes-text-primary mb-2">Assessment Personalizado</h2>
        <p className="text-axes-text-secondary">Configura las evaluaciones para los candidatos</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className={`axes-card cursor-pointer transition-all ${
              data.assessmentType === "automatic" ? "ring-2 ring-axes-primary" : ""
            }`}
            onClick={() => updateData({ assessmentType: "automatic" })}
          >
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-axes-primary mx-auto mb-4" />
              <h3 className="text-axes-text-primary font-semibold mb-2">Assessment Automático</h3>
              <p className="text-axes-text-muted text-sm">
                AXES AI genera automáticamente las evaluaciones basadas en las skills requeridas
              </p>
            </CardContent>
          </Card>

          <Card 
            className={`axes-card cursor-pointer transition-all ${
              data.assessmentType === "custom" ? "ring-2 ring-axes-primary" : ""
            }`}
            onClick={() => updateData({ assessmentType: "custom" })}
          >
            <CardContent className="p-6 text-center">
              <Settings className="w-12 h-12 text-axes-primary mx-auto mb-4" />
              <h3 className="text-axes-text-primary font-semibold mb-2">Assessment Personalizado</h3>
              <p className="text-axes-text-muted text-sm">
                Crea evaluaciones específicas con preguntas y ejercicios personalizados
              </p>
            </CardContent>
          </Card>
        </div>

        {data.assessmentType === "automatic" && (
          <Card className="axes-card">
            <CardContent className="p-6">
              <h3 className="text-axes-text-primary font-semibold mb-4">
                <Zap className="w-5 h-5 inline mr-2" />
                Assessment Automático Configurado
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 axes-bg-hover rounded-lg">
                  <span className="text-axes-text-secondary">Evaluación técnica</span>
                  <Badge className="bg-blue-500/20 text-blue-600">
                    {data.technicalSkills.length} skills
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 axes-bg-hover rounded-lg">
                  <span className="text-axes-text-secondary">Evaluación de soft skills</span>
                  <Badge className="bg-green-500/20 text-green-600">
                    {data.softSkills.length} skills
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 axes-bg-hover rounded-lg">
                  <span className="text-axes-text-secondary">Entrevista con chatbot</span>
                  <Badge className="bg-purple-500/20 text-purple-600">
                    Nivel {data.level}
                  </Badge>
                </div>
              </div>
              <p className="text-axes-text-muted text-xs mt-4">
                AXES AI creará automáticamente preguntas relevantes basadas en tus requisitos
              </p>
            </CardContent>
          </Card>
        )}

        {data.assessmentType === "custom" && (
          <Card className="axes-card">
            <CardContent className="p-6">
              <AssessmentBuilder
                onAssessmentChange={(assessment) => updateData({ customAssessment: assessment })}
                technicalSkills={data.technicalSkills}
                softSkills={data.softSkills}
                level={data.level}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Target className="w-16 h-16 text-axes-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-axes-text-primary mb-2">Publicar Vacante</h2>
        <p className="text-axes-text-secondary">Revisa y publica tu vacante</p>
      </div>

      {/* Vacancy Preview */}
      <Card className="axes-card">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-axes-text-primary text-xl">{data.title}</CardTitle>
              <CardDescription className="text-axes-text-secondary">
                {data.department} • {data.level} • {data.workMode}
              </CardDescription>
            </div>
            <Badge className={
              data.urgency === "alta" ? "bg-red-500/20 text-red-600" :
              data.urgency === "media" ? "bg-yellow-500/20 text-yellow-600" :
              "bg-green-500/20 text-green-600"
            }>
              Urgencia {data.urgency}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-axes-text-primary font-semibold mb-2">Información básica</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-axes-text-muted">Ubicación:</span> {data.location}</div>
                <div><span className="text-axes-text-muted">Contrato:</span> {data.contractType}</div>
                <div><span className="text-axes-text-muted">Inicio:</span> {data.startDate || "A convenir"}</div>
              </div>
            </div>
            <div>
              <h4 className="text-axes-text-primary font-semibold mb-2">Compensación</h4>
              <div className="text-lg font-bold text-axes-primary">
                ${data.salaryMin.toLocaleString()} - ${data.salaryMax.toLocaleString()} {data.currency}
              </div>
              <div className="text-sm text-axes-text-muted">
                + {data.benefits.length} beneficios
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h4 className="text-axes-text-primary font-semibold mb-2">Skills Técnicas ({data.technicalSkills.length})</h4>
              <div className="flex flex-wrap gap-1">
                {data.technicalSkills.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {data.technicalSkills.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{data.technicalSkills.length - 5} más
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-axes-text-primary font-semibold mb-2">Assessment</h4>
              <Badge className="bg-axes-primary/20 text-axes-primary">
                {data.assessmentType === "automatic" ? "Automático con AXES AI" : "Personalizado"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publish Actions */}
      <Card className="axes-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-axes-text-primary font-semibold">Todo listo para publicar</h3>
              <p className="text-axes-text-muted text-sm">
                Tu vacante será visible para candidatos compatibles y AXES AI comenzará el matching automático
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
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
              <Building2 className="w-6 h-6 text-axes-primary" />
              <h1 className="text-xl font-bold text-axes-text-primary">
                AXES
                <span className="text-axes-primary ml-1">Crear Vacante</span>
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
              Nueva Vacante
            </h1>
            <span className="text-axes-text-secondary">
              {currentStep} de {STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 mb-6" />
          
          {/* Step indicators */}
          <div className="flex justify-between">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
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
                  <span className="text-xs font-medium max-w-16">{step.title}</span>
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
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="axes-btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          {currentStep < STEPS.length ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="axes-btn-primary"
            >
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handlePublish}
              disabled={!canProceed()}
              className="axes-btn-primary"
            >
              Publicar Vacante
              <Target className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
