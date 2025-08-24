"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, Heart, ExternalLink } from "lucide-react";

export function RealConnections() {
  const projects = [
    {
      title: "Sistema de Gestión Hospitalaria",
      author: "María González",
      description: "Plataforma completa para la gestión de pacientes, citas y historiales médicos.",
      image: "🏥",
      skills: ["React", "Node.js", "PostgreSQL", "Docker"],
      rating: 4.9,
      validations: 23,
      comments: 8,
      likes: 45
    },
    {
      title: "E-commerce con IA",
      author: "Carlos Rodríguez",
      description: "Tienda online con recomendaciones personalizadas y chatbot inteligente.",
      image: "🛍️",
      skills: ["Next.js", "Python", "TensorFlow", "AWS"],
      rating: 4.8,
      validations: 18,
      comments: 12,
      likes: 32
    },
    {
      title: "Dashboard Analytics",
      author: "Ana Martínez",
      description: "Panel de control en tiempo real para análisis de datos empresariales.",
      image: "📊",
      skills: ["Vue.js", "D3.js", "MongoDB", "Express"],
      rating: 4.7,
      validations: 15,
      comments: 6,
      likes: 28
    }
  ];

  const testimonials = [
    {
      text: "En AXES encontré desarrolladores con proyectos reales. No más CVs inflados.",
      author: "Laura Tech",
      role: "CTO en StartupXYZ",
      company: "🚀"
    },
    {
      text: "Finalmente una plataforma donde puedo mostrar mi trabajo real y ser valorado por ello.",
      author: "Diego Code",
      role: "Full Stack Developer",
      company: "👨‍💻"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Conexiones{" "}
            <span className="bg-gradient-to-r from-[#7C3AED] to-white bg-clip-text text-transparent">
              Reales
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            En AXES, conectar significa mostrar quién eres de verdad. 
            Cada interacción es evidencia real.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="bg-black/50 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-[#7C3AED]/20"
            >
              <div className="space-y-4">
                {/* Project Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{project.image}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {project.title}
                      </h3>
                      <p className="text-sm text-white/60">por {project.author}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/40 hover:text-[#7C3AED] cursor-pointer transition-colors" />
                </div>

                {/* Description */}
                <p className="text-white/80 text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="secondary"
                      className="bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/30 text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-white/80 text-sm">{project.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-white/60 text-sm">{project.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-white/60 text-sm">{project.likes}</span>
                    </div>
                  </div>
                  <span className="text-[#7C3AED] text-sm font-semibold">
                    {project.validations} validaciones
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-[#7C3AED]/20 to-[#1F0A3A]/20 border border-[#7C3AED]/30 p-8 rounded-2xl backdrop-blur-sm"
            >
              <div className="space-y-4">
                <p className="text-white/90 text-lg italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{testimonial.company}</div>
                  <div>
                    <p className="text-white font-semibold">{testimonial.author}</p>
                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
