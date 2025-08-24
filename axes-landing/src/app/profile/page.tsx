"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

import { 
  MapPin, 
  Briefcase, 
  Calendar,
  Github,
  Linkedin,
  Link,
  Mail,
  Phone,
  Edit,
  Share,
  Star,
  Users,
  Trophy,
  Target,
  ArrowLeft
} from "lucide-react";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Cargamos el perfil directamente desde localStorage para evitar dependencias
    const loadProfile = () => {
      try {
        const stored = localStorage.getItem('axes-onboarding-profile');
        console.log('Profile data from localStorage:', stored);
        
        if (stored) {
          const profile = JSON.parse(stored);
          console.log('Parsed profile:', profile);
          setUserProfile(profile);
        } else {
          // Si no hay perfil, crear uno de ejemplo
          console.log('No profile found, creating demo profile');
          const demoProfile = {
            fullName: "Usuario Demo",
            email: "demo@axes.com",
            currentRole: "Desarrollador Full Stack",
            experience: "3-5 años",
            skills: ["React", "JavaScript", "Node.js", "Python"],
            biography: "Desarrollador apasionado por crear soluciones innovadoras con tecnologías modernas.",
            linkedinUrl: "https://linkedin.com/in/demo",
            githubUrl: "https://github.com/demo",
            portfolioUrl: "https://demo-portfolio.com"
          };
          setUserProfile(demoProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // En caso de error, también usar perfil demo
        const demoProfile = {
          fullName: "Usuario Demo",
          email: "demo@axes.com",
          currentRole: "Desarrollador Full Stack",
          experience: "3-5 años",
          skills: ["React", "JavaScript", "Node.js", "Python"],
          biography: "Desarrollador apasionado por crear soluciones innovadoras con tecnologías modernas.",
          linkedinUrl: "https://linkedin.com/in/demo",
          githubUrl: "https://github.com/demo",
          portfolioUrl: "https://demo-portfolio.com"
        };
        setUserProfile(demoProfile);
      }
    };
    
    loadProfile();
  }, []);

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] to-[#000000] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const defaultBanner = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='200' viewBox='0 0 800 200'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%237C3AED;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%231F0A3A;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='200' fill='url(%23grad)' /%3E%3C/svg%3E";
  
  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%237C3AED'/%3E%3Ctext x='60' y='70' font-family='Arial' font-size='40' fill='white' text-anchor='middle'%3E" + (userProfile.fullName?.charAt(0) || 'U') + "%3C/text%3E%3C/svg%3E";

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="axes-nav">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button
              onClick={() => window.history.back()}
              className="axes-btn-outline rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button
                className="axes-btn-ghost rounded-xl"
              >
                <Share className="w-4 h-4 mr-2" />
                Compartir
              </Button>
              <Button
                className="axes-btn-primary rounded-xl"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="axes-card rounded-2xl overflow-hidden mb-8">
          {/* Banner */}
          <div className="relative h-48 sm:h-64">
            <img 
              src={userProfile.bannerImage || defaultBanner}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="absolute -top-16 left-6">
              <div className="w-32 h-32 rounded-2xl border-4 border-black/50 overflow-hidden bg-black/20">
                <img 
                  src={userProfile.profileImage || defaultAvatar}
                  alt={userProfile.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="pt-20">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {userProfile.fullName}
                  </h1>
                  <p className="text-xl text-white/80 mb-3">
                    {userProfile.currentRole} en {userProfile.company}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{userProfile.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{userProfile.experience} de experiencia</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{userProfile.education}</span>
                    </div>
                  </div>

                  {/* Biography */}
                  {userProfile.biography && (
                    <p className="text-white/80 leading-relaxed mb-4 max-w-2xl">
                      {userProfile.biography}
                    </p>
                  )}

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-3">
                    {userProfile.linkedinUrl && (
                      <Button
                        size="sm"
                        className="axes-btn-outline rounded-xl"
                        onClick={() => window.open(userProfile.linkedinUrl, '_blank')}
                      >
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </Button>
                    )}
                    {userProfile.githubUrl && (
                      <Button
                        size="sm"
                        className="axes-btn-outline rounded-xl"
                        onClick={() => window.open(userProfile.githubUrl, '_blank')}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                    )}
                    {userProfile.portfolioUrl && (
                      <Button
                        size="sm"
                        className="axes-btn-outline rounded-xl"
                        onClick={() => window.open(userProfile.portfolioUrl, '_blank')}
                      >
                        <Link className="w-4 h-4 mr-2" />
                        Portfolio
                      </Button>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 sm:mt-0 sm:ml-8">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-2xl font-bold text-white">85</div>
                      <div className="text-xs text-white/60">Puntuación</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-2xl font-bold text-white">12</div>
                      <div className="text-xs text-white/60">Conexiones</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-2xl font-bold text-white">3</div>
                      <div className="text-xs text-white/60">Proyectos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills */}
            <Card className="axes-card p-6 rounded-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <Target className="w-6 h-6 text-[#7C3AED]" />
                <h2 className="text-xl font-bold text-white">Habilidades Técnicas</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {userProfile.skills?.map((skill: string, index: number) => (
                  <Badge 
                    key={index}
                    className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30 px-4 py-2 text-sm"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Career Goals */}
            <Card className="axes-card p-6 rounded-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <Trophy className="w-6 h-6 text-[#7C3AED]" />
                <h2 className="text-xl font-bold text-white">Objetivos Profesionales</h2>
              </div>
              <p className="text-white/80 leading-relaxed">
                {userProfile.careerGoals}
              </p>
            </Card>

            {/* Recent Activity */}
            <Card className="axes-card p-6 rounded-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <Star className="w-6 h-6 text-[#7C3AED]" />
                <h2 className="text-xl font-bold text-white">Actividad Reciente</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Evaluación técnica completada</p>
                    <p className="text-white/60 text-xs">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">Perfil actualizado</p>
                    <p className="text-white/60 text-xs">Hace 1 día</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <Card className="axes-card p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Evaluaciones</span>
                  <span className="text-white font-semibold">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Skills Evaluados</span>
                  <span className="text-white font-semibold">{userProfile.skills?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Nivel Promedio</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    Mid-Level
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Contact */}
            <Card className="axes-card p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Contacto</h3>
              <div className="space-y-3">
                <Button 
                  className="w-full axes-btn-primary rounded-xl justify-start"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Mensaje
                </Button>
                <Button 
                  className="w-full axes-btn-secondary rounded-xl justify-start"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Conectar
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
