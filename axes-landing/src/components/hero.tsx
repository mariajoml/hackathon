"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TypewriterText } from "./typewriter-text";
import { Code, Database, Zap, Globe, Star, Users } from "lucide-react";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <TypewriterText
                text="No digas lo que sabes hacer. Demuéstralo."
                delay={500}
                speed={50}
                className="bg-gradient-to-r from-[#7C3AED] via-[#5B21B6] to-axes-text-primary bg-clip-text text-transparent"
              />
            </h1>
            <p className="text-xl text-axes-text-secondary max-w-xl">
              Un espacio donde la confianza se construye con evidencias, no con palabras.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="axes-btn-primary rounded-2xl px-8 py-6 text-lg transition-all duration-200"
              onClick={() => window.location.href = '/auth'}
            >
              Crear mi perfil
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="axes-btn-secondary rounded-2xl px-8 py-6 text-lg"
              onClick={() => window.location.href = '#personas'}
            >
              Ver ejemplos
            </Button>
          </div>
        </div>

        {/* Right Content - Mockup */}
        <div className="space-y-6">
          {/* Portfolio Card */}
          <Card className="axes-glass p-6 rounded-2xl">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-xl flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-axes-text-primary font-semibold">Proyecto E-commerce</h3>
                  <p className="text-axes-text-muted text-sm">React • TypeScript • Next.js</p>
                </div>
              </div>
              <p className="text-axes-text-secondary text-sm">
                Plataforma completa de comercio electrónico con sistema de pagos,
                gestión de inventario y dashboard administrativo.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-axes-text-secondary text-sm">4.9</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-axes-text-muted" />
                  <span className="text-axes-text-muted text-sm">12 validaciones</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Skill Fingerprint */}
          <Card className="axes-glass p-6 rounded-2xl">
            <div className="space-y-4">
              <h3 className="text-axes-text-primary font-semibold flex items-center space-x-2">
                <Zap className="w-5 h-5 text-[#7C3AED]" />
                <span>Skill Fingerprint</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Badge variant="secondary" className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30">
                  React Expert
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-600 border-blue-500/30">
                  TypeScript
                </Badge>
                <Badge variant="secondary" className="bg-green-500/20 text-green-600 border-green-500/30">
                  Node.js
                </Badge>
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-600 border-orange-500/30">
                  MongoDB
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-axes-text-muted">Nivel de confianza:</span>
                <span className="text-[#7C3AED] font-semibold">96%</span>
              </div>
            </div>
          </Card>

          {/* Analytics Preview */}
          <Card className="axes-glass p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-axes-text-muted text-sm">Proyectos verificados</p>
                <p className="text-2xl font-bold text-axes-text-primary">24</p>
              </div>
              <div>
                <p className="text-axes-text-muted text-sm">Validaciones recibidas</p>
                <p className="text-2xl font-bold text-[#7C3AED]">156</p>
              </div>
              <div>
                <p className="text-axes-text-muted text-sm">Score de confianza</p>
                <p className="text-2xl font-bold text-green-600">A+</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
