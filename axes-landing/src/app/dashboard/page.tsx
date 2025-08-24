"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

import { 
  User, 
  Trophy, 
  Target, 
  Briefcase, 
  Star,
  TrendingUp,
  Users,
  MessageSquare,
  Settings,
  LogOut
} from "lucide-react";

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Cargamos el perfil directamente desde localStorage para evitar dependencias
    const loadProfile = () => {
      try {
        const stored = localStorage.getItem('axes-onboarding-profile');
        console.log('Dashboard - Profile data from localStorage:', stored);
        
        if (stored) {
          const profile = JSON.parse(stored);
          console.log('Dashboard - Parsed profile:', profile);
          setUserProfile(profile);
        } else {
          // Si no hay perfil, crear uno de ejemplo
          console.log('Dashboard - No profile found, creating demo profile');
          const demoProfile = {
            fullName: "Usuario Demo",
            email: "demo@axes.com",
            currentRole: "Desarrollador Full Stack",
            experience: "3-5 años",
            skills: ["React", "JavaScript", "Node.js", "Python"],
            biography: "Desarrollador apasionado por crear soluciones innovadoras con tecnologías modernas."
          };
          setUserProfile(demoProfile);
        }
      } catch (error) {
        console.error('Dashboard - Error loading profile:', error);
        // En caso de error, también usar perfil demo
        const demoProfile = {
          fullName: "Usuario Demo",
          email: "demo@axes.com",
          currentRole: "Desarrollador Full Stack",
          experience: "3-5 años",
          skills: ["React", "JavaScript", "Node.js", "Python"],
          biography: "Desarrollador apasionado por crear soluciones innovadoras con tecnologías modernas."
        };
        setUserProfile(demoProfile);
      }
    };
    
    loadProfile();
  }, []);

  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%237C3AED'/%3E%3Ctext x='20' y='25' font-family='Arial' font-size='16' fill='white' text-anchor='middle'%3E" + (userProfile?.fullName?.charAt(0) || 'U') + "%3C/text%3E%3C/svg%3E";

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="axes-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-[#7C3AED] text-white rounded-lg px-3 py-1 font-bold">A</div>
              <span className="text-axes-text-primary text-xl font-bold">AXES</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button 
                onClick={() => window.location.href = "/profile"}
                className="axes-btn-outline rounded-xl"
              >
                <User className="w-4 h-4 mr-2" />
                Ver Perfil
              </Button>
              <Button 
                onClick={() => window.location.href = "/onboarding"}
                className="axes-btn-secondary rounded-xl"
              >
                <Settings className="w-4 h-4 mr-2" />
                Completar Perfil
              </Button>
              <div className="flex items-center space-x-3">
                <img 
                  src={userProfile?.profileImage || defaultAvatar}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-axes-text-primary text-sm font-medium">
                  {userProfile?.fullName?.split(' ')[0] || 'Usuario'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-axes-text-primary mb-2">
            Dashboard
          </h1>
          <p className="text-axes-text-secondary">
            Bienvenido a tu espacio personal en AXES
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="axes-card p-6 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="bg-[#7C3AED]/20 p-3 rounded-xl">
                <Trophy className="w-6 h-6 text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-axes-text-muted text-sm">Evaluaciones</p>
                <p className="text-axes-text-primary text-2xl font-bold">1</p>
              </div>
            </div>
          </Card>

          <Card className="axes-card p-6 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-axes-text-muted text-sm">Skills Evaluados</p>
                <p className="text-axes-text-primary text-2xl font-bold">3</p>
              </div>
            </div>
          </Card>

          <Card className="axes-card p-6 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-axes-text-muted text-sm">Conexiones</p>
                <p className="text-axes-text-primary text-2xl font-bold">0</p>
              </div>
            </div>
          </Card>

          <Card className="axes-card p-6 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-500/20 p-3 rounded-xl">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-axes-text-muted text-sm">Puntuación</p>
                <p className="text-axes-text-primary text-2xl font-bold">85</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="axes-card p-6 rounded-2xl">
              <div className="flex items-center space-x-4 mb-6">
                <User className="w-6 h-6 text-[#7C3AED]" />
                <h2 className="text-xl font-bold text-axes-text-primary">Perfil Profesional</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 axes-bg-pure-white rounded-xl">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={userProfile?.profileImage || defaultAvatar}
                      alt="Avatar"
                      className="w-12 h-12 rounded-xl"
                    />
                    <div>
                      <h3 className="text-axes-text-primary font-semibold">
                        {userProfile?.currentRole || "Desarrollador Full Stack"}
                      </h3>
                      <p className="text-axes-text-muted text-sm">
                        {userProfile?.company || "Empresa"} • Perfil completado
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                    Activo
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 axes-bg-pure-white rounded-xl">
                    <h4 className="text-axes-text-primary font-medium mb-2">Habilidades Técnicas</h4>
                    <div className="flex flex-wrap gap-2">
                      {userProfile?.skills?.slice(0, 3).map((skill: string, index: number) => (
                        <Badge key={index} className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30">
                          {skill}
                        </Badge>
                      )) || (
                        <>
                          <Badge className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30">React</Badge>
                          <Badge className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30">JavaScript</Badge>
                          <Badge className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30">Python</Badge>
                        </>
                      )}
                      {userProfile?.skills?.length > 3 && (
                        <Badge className="bg-axes-bg-hover text-axes-text-muted border-axes-border">
                          +{userProfile.skills.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-4 axes-bg-pure-white rounded-xl">
                    <h4 className="text-axes-text-primary font-medium mb-2">Experiencia</h4>
                    <p className="text-axes-text-secondary text-sm">
                      {userProfile?.experience || "3-5 años"}
                    </p>
                    <p className="text-axes-text-secondary text-sm">
                      {userProfile?.education || "Nivel Universitario"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="axes-card p-6 rounded-2xl">
              <div className="flex items-center space-x-4 mb-6">
                <TrendingUp className="w-6 h-6 text-[#7C3AED]" />
                <h2 className="text-xl font-bold text-axes-text-primary">Actividad Reciente</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 axes-bg-pure-white rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-axes-text-primary text-sm">Evaluación técnica completada</p>
                    <p className="text-axes-text-muted text-xs">Hace 5 minutos</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 axes-bg-pure-white rounded-xl">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-axes-text-primary text-sm">Perfil profesional actualizado</p>
                    <p className="text-axes-text-muted text-xs">Hace 10 minutos</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 axes-bg-pure-white rounded-xl">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-axes-text-primary text-sm">Cuenta creada en AXES</p>
                    <p className="text-axes-text-muted text-xs">Hace 15 minutos</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="axes-card p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-axes-text-primary mb-4">Acciones Rápidas</h3>
              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.href = "/profile"}
                  className="w-full axes-btn-primary rounded-xl justify-start"
                >
                  <User className="w-4 h-4 mr-2" />
                  Ver Perfil Completo
                </Button>
                <Button 
                  onClick={() => window.location.href = "/chatbot"}
                  className="w-full axes-btn-secondary rounded-xl justify-start"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Nueva Evaluación
                </Button>
                <Button className="w-full axes-btn-ghost rounded-xl justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Explorar Conexiones
                </Button>
              </div>
            </Card>

            {/* Coming Soon */}
            <Card className="axes-card p-6 rounded-2xl">
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-[#7C3AED]/20 to-[#A855F7]/10 border border-[#7C3AED]/30 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-axes-text-primary mb-2">
                    🚀 Próximamente
                  </h3>
                  <div className="space-y-2 text-sm text-axes-text-secondary">
                    <div>• Conexiones con empresas</div>
                    <div>• Portfolio interactivo</div>
                    <div>• Validaciones de pares</div>
                    <div>• Análisis de mercado</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
