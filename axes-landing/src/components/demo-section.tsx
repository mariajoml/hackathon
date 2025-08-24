"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Building2, 
  Users, 
  Zap, 
  Star, 
  MessageCircle, 
  CheckCircle, 
  TrendingUp,
  Target,
  Award
} from "lucide-react";

export function DemoSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Experimenta{" "}
            <span className="bg-gradient-to-r from-[#7C3AED] to-white bg-clip-text text-transparent">
              AXES
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Descubre cómo personas y empresas utilizan AXES para construir confianza auténtica.
          </p>
        </div>

        <Tabs defaultValue="persona" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-white/10 rounded-2xl p-2">
            <TabsTrigger 
              value="persona" 
              className="data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white text-white/60 rounded-xl"
            >
              <User className="w-4 h-4 mr-2" />
              Persona
            </TabsTrigger>
            <TabsTrigger 
              value="empresa" 
              className="data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white text-white/60 rounded-xl"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Empresa
            </TabsTrigger>
            <TabsTrigger 
              value="conexiones" 
              className="data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white text-white/60 rounded-xl"
            >
              <Users className="w-4 h-4 mr-2" />
              Conexiones
            </TabsTrigger>
          </TabsList>

          {/* Persona Tab */}
          <TabsContent value="persona" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile Card */}
              <Card className="bg-black/50 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-2xl flex items-center justify-center">
                      <span className="text-white text-xl font-bold">MG</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">María González</h3>
                      <p className="text-white/60">Full Stack Developer</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2 flex items-center">
                        <Zap className="w-4 h-4 text-[#7C3AED] mr-2" />
                        Skill Fingerprint
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Badge className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30">
                          React Expert
                        </Badge>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          TypeScript
                        </Badge>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Node.js
                        </Badge>
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                          MongoDB
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#7C3AED]">24</p>
                        <p className="text-white/60 text-sm">Proyectos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">156</p>
                        <p className="text-white/60 text-sm">Validaciones</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-400">A+</p>
                        <p className="text-white/60 text-sm">Score</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recent Project */}
              <Card className="bg-black/50 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Proyecto Destacado</h4>
                  <div className="space-y-3">
                    <h5 className="text-lg text-white">Sistema de Gestión Hospitalaria</h5>
                    <p className="text-white/70 text-sm">
                      Plataforma completa para la gestión de pacientes, citas y historiales médicos.
                      Implementada con React, Node.js y PostgreSQL.
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/80 text-sm">4.9</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-white/60 text-sm">12 comentarios</span>
                      </div>
                      <span className="text-[#7C3AED] text-sm font-semibold">
                        23 validaciones
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Empresa Tab */}
          <TabsContent value="empresa" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Company Dashboard */}
              <Card className="bg-black/50 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">TechCorp</h3>
                      <p className="text-white/60">Software Company</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-semibold flex items-center">
                      <Target className="w-4 h-4 text-blue-400 mr-2" />
                      Retos Activos
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                        <h5 className="text-white font-medium">Desarrollador React Senior</h5>
                        <p className="text-white/70 text-sm">
                          Buscamos experto en React con experiencia demostrable en proyectos escalables.
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-blue-400 text-sm">12 aplicaciones</span>
                          <span className="text-white/60 text-sm">3 días restantes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Talent Analytics */}
              <Card className="bg-black/50 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <div className="space-y-4">
                  <h4 className="text-white font-semibold flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                    Análisis de Talento
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Candidatos verificados</span>
                      <span className="text-green-400 font-semibold">98%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Tiempo de contratación</span>
                      <span className="text-[#7C3AED] font-semibold">-60%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Satisfacción de contratación</span>
                      <span className="text-yellow-400 font-semibold">4.8/5</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Conexiones Tab */}
          <TabsContent value="conexiones" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Validation Feed */}
              <Card className="bg-black/50 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <div className="space-y-6">
                  <h4 className="text-white font-semibold flex items-center">
                    <Award className="w-4 h-4 text-[#7C3AED] mr-2" />
                    Feed de Validaciones
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          <span className="font-semibold">Carlos Tech</span> validó tu proyecto 
                          <span className="text-[#7C3AED]"> "E-commerce con IA"</span>
                        </p>
                        <p className="text-white/60 text-xs mt-1">hace 2 horas</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <MessageCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          <span className="font-semibold">Ana Development</span> comentó en tu 
                          <span className="text-[#7C3AED]"> "Dashboard Analytics"</span>
                        </p>
                        <p className="text-white/60 text-xs mt-1">hace 4 horas</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-xl">
                      <Star className="w-5 h-5 text-[#7C3AED] mt-0.5" />
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          Tu proyecto recibió una calificación de 
                          <span className="text-yellow-400 font-semibold"> 4.9 estrellas</span>
                        </p>
                        <p className="text-white/60 text-xs mt-1">hace 1 día</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Network Stats */}
              <Card className="bg-black/50 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <div className="space-y-6">
                  <h4 className="text-white font-semibold flex items-center">
                    <Users className="w-4 h-4 text-orange-400 mr-2" />
                    Tu Red Profesional
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-xl">
                      <p className="text-3xl font-bold text-[#7C3AED]">127</p>
                      <p className="text-white/60 text-sm">Conexiones</p>
                    </div>
                    <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <p className="text-3xl font-bold text-green-400">89</p>
                      <p className="text-white/60 text-sm">Validaciones</p>
                    </div>
                    <div className="text-center p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                      <p className="text-3xl font-bold text-blue-400">34</p>
                      <p className="text-white/60 text-sm">Colaboraciones</p>
                    </div>
                    <div className="text-center p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                      <p className="text-3xl font-bold text-orange-400">12</p>
                      <p className="text-white/60 text-sm">Mentorías</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
