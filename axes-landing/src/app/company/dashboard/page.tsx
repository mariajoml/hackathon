"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCompanyAuth } from "@/hooks/use-company-auth";
import { 
  Building2, Users, Briefcase, MessageSquare, Plus, Settings, 
  Eye, Calendar, Clock, CheckCircle, XCircle, Search,
  TrendingUp, UserCheck, MessageCircle, Star
} from "lucide-react";

// Mock data para vacantes
const MOCK_VACANCIES = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "Tecnología",
    level: "Senior",
    status: "active",
    applicants: 12,
    matches: 3,
    postedDate: "2024-01-15",
    requiredSkills: ["React", "TypeScript", "Next.js"],
    softSkills: ["autonomía", "proactividad", "comunicación"]
  },
  {
    id: "2", 
    title: "Product Manager",
    department: "Producto",
    level: "Mid",
    status: "draft",
    applicants: 0,
    matches: 0,
    postedDate: "2024-01-20",
    requiredSkills: ["Product Strategy", "Analytics", "UX"],
    softSkills: ["liderazgo", "analítico", "comunicación"]
  }
];

// Mock data para candidatos
const MOCK_CANDIDATES = [
  {
    id: "1",
    name: "María González",
    position: "Frontend Developer",
    experience: "4 años",
    matchScore: 92,
    skills: ["React", "TypeScript", "Node.js"],
    softSkillsScore: 88,
    status: "pending",
    vacancyId: "1",
    appliedDate: "2024-01-18"
  },
  {
    id: "2",
    name: "Carlos Ruiz",
    position: "Frontend Developer", 
    experience: "6 años",
    matchScore: 85,
    skills: ["React", "Vue.js", "JavaScript"],
    softSkillsScore: 90,
    status: "interview_pending",
    vacancyId: "1",
    appliedDate: "2024-01-19"
  }
];

export default function CompanyDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile, isLoggedIn, checkAuth } = useCompanyAuth();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");

  useEffect(() => {
    checkAuth();
    if (!isLoggedIn) {
      router.push("/company/login");
    }
  }, [isLoggedIn, checkAuth, router]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (!isLoggedIn || !profile) {
    return (
      <div className="min-h-screen axes-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-axes-primary mx-auto mb-4"></div>
          <p className="text-axes-text-secondary">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleCreateVacancy = () => {
    router.push("/company/chatbot");
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="axes-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-axes-text-primary">2</p>
                <p className="text-axes-text-muted text-sm">Vacantes Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="axes-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-axes-text-primary">12</p>
                <p className="text-axes-text-muted text-sm">Candidatos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="axes-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-axes-text-primary">3</p>
                <p className="text-axes-text-muted text-sm">Matches</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="axes-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-axes-text-primary">1</p>
                <p className="text-axes-text-muted text-sm">Entrevistas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="axes-card">
          <CardHeader>
            <CardTitle className="text-axes-text-primary">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 axes-bg-hover rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-axes-text-primary text-sm font-medium">Nuevo match encontrado</p>
                  <p className="text-axes-text-muted text-xs">María González - 92% de compatibilidad</p>
                </div>
                <span className="text-axes-text-muted text-xs">Hace 2h</span>
              </div>

              <div className="flex items-center space-x-3 p-3 axes-bg-hover rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-axes-text-primary text-sm font-medium">Nueva aplicación</p>
                  <p className="text-axes-text-muted text-xs">Carlos Ruiz aplicó a Frontend Developer</p>
                </div>
                <span className="text-axes-text-muted text-xs">Hace 5h</span>
              </div>

              <div className="flex items-center space-x-3 p-3 axes-bg-hover rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-axes-text-primary text-sm font-medium">Vacante publicada</p>
                  <p className="text-axes-text-muted text-xs">Senior Frontend Developer está activa</p>
                </div>
                <span className="text-axes-text-muted text-xs">Hace 1d</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="axes-card">
          <CardHeader>
            <CardTitle className="text-axes-text-primary">Top Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_CANDIDATES.slice(0, 3).map((candidate) => (
                <div key={candidate.id} className="flex items-center space-x-3 p-3 axes-bg-hover rounded-lg">
                  <div className="w-10 h-10 bg-axes-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {candidate.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-axes-text-primary text-sm font-medium">{candidate.name}</p>
                    <p className="text-axes-text-muted text-xs">{candidate.position}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-axes-text-primary text-sm font-semibold">
                        {candidate.matchScore}%
                      </span>
                    </div>
                    <p className="text-axes-text-muted text-xs">{candidate.experience}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderVacancies = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-axes-text-primary">Mis Vacantes</h2>
        <Button onClick={handleCreateVacancy} className="axes-btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Vacante
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {MOCK_VACANCIES.map((vacancy) => (
          <Card key={vacancy.id} className="axes-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-axes-text-primary mb-2">
                    {vacancy.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-axes-text-muted">
                    <span>{vacancy.department}</span>
                    <span>•</span>
                    <span>{vacancy.level}</span>
                    <span>•</span>
                    <span>Publicado {new Date(vacancy.postedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={vacancy.status === "active" ? "default" : "secondary"}
                    className={
                      vacancy.status === "active" 
                        ? "bg-green-500/20 text-green-600 border-green-500/30" 
                        : "bg-gray-500/20 text-gray-600 border-gray-500/30"
                    }
                  >
                    {vacancy.status === "active" ? "Activa" : "Borrador"}
                  </Badge>
                  <Button variant="ghost" size="sm" className="axes-btn-ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="axes-btn-ghost">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="axes-bg-hover p-3 rounded-lg">
                  <div className="text-2xl font-bold text-axes-text-primary">{vacancy.applicants}</div>
                  <div className="text-xs text-axes-text-muted">Candidatos</div>
                </div>
                <div className="axes-bg-hover p-3 rounded-lg">
                  <div className="text-2xl font-bold text-axes-text-primary">{vacancy.matches}</div>
                  <div className="text-xs text-axes-text-muted">Matches</div>
                </div>
                <div className="axes-bg-hover p-3 rounded-lg">
                  <div className="text-2xl font-bold text-axes-text-primary">
                    {vacancy.matches > 0 ? Math.round((vacancy.matches / vacancy.applicants) * 100) : 0}%
                  </div>
                  <div className="text-xs text-axes-text-muted">Tasa de Match</div>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-axes-text-muted text-sm">Skills Técnicas: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {vacancy.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-axes-text-muted text-sm">Soft Skills: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {vacancy.softSkills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-green-500/10 text-green-600">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCandidates = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-axes-text-primary">Candidatos</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="axes-btn-secondary">
            <Search className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MOCK_CANDIDATES.map((candidate) => (
          <Card key={candidate.id} className="axes-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-axes-primary rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {candidate.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-axes-text-primary">
                      {candidate.name}
                    </h3>
                    <p className="text-axes-text-muted">{candidate.position}</p>
                    <p className="text-axes-text-muted text-sm">{candidate.experience} de experiencia</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-xl font-bold text-axes-text-primary">
                      {candidate.matchScore}%
                    </span>
                  </div>
                  <Badge 
                    variant={candidate.status === "pending" ? "secondary" : "default"}
                    className={
                      candidate.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
                        : "bg-blue-500/20 text-blue-600 border-blue-500/30"
                    }
                  >
                    {candidate.status === "pending" ? "Pendiente" : "Entrevista"}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-axes-text-muted text-sm">Skills: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-axes-text-muted text-sm">Soft Skills Score: </span>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-axes-bg-secondary rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${candidate.softSkillsScore}%` }}
                      ></div>
                    </div>
                    <span className="text-axes-text-primary text-sm font-medium">
                      {candidate.softSkillsScore}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-axes-text-muted text-sm">
                  Aplicó el {new Date(candidate.appliedDate).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="axes-btn-secondary">
                    Ver Perfil
                  </Button>
                  <Button size="sm" className="axes-btn-primary">
                    Enviar Entrevista
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen axes-bg-primary">
      {/* Header */}
      <header className="axes-nav border-b border-axes-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Building2 className="w-6 h-6 text-axes-primary" />
              <h1 className="text-xl font-bold text-axes-text-primary">
                {profile.companyName}
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 axes-bg-card">
            <TabsTrigger value="overview" className="data-[state=active]:bg-axes-primary data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="vacancies" className="data-[state=active]:bg-axes-primary data-[state=active]:text-white">
              <Briefcase className="w-4 h-4 mr-2" />
              Vacantes
            </TabsTrigger>
            <TabsTrigger value="candidates" className="data-[state=active]:bg-axes-primary data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Candidatos
            </TabsTrigger>
            <TabsTrigger value="interviews" className="data-[state=active]:bg-axes-primary data-[state=active]:text-white">
              <MessageCircle className="w-4 h-4 mr-2" />
              Entrevistas
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="overview">
              {renderOverview()}
            </TabsContent>

            <TabsContent value="vacancies">
              {renderVacancies()}
            </TabsContent>

            <TabsContent value="candidates">
              {renderCandidates()}
            </TabsContent>

            <TabsContent value="interviews">
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-axes-text-muted mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-axes-text-primary mb-2">
                  Gestión de Entrevistas
                </h3>
                <p className="text-axes-text-muted">
                  Aquí podrás gestionar todas las entrevistas programadas con tus candidatos.
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
