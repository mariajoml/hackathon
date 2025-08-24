"use client";

import { Card } from "@/components/ui/card";
import { Upload, Zap, Share2, ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Sube tu trabajo real",
      description: "Repos, casos, artefactos verificables que demuestren tus habilidades.",
      bgColor: "bg-[#7C3AED]/20",
      iconColor: "text-[#7C3AED]",
      borderColor: "border-[#7C3AED]/30"
    },
    {
      number: "02",
      icon: Zap,
      title: "La AI analiza y certifica",
      description: "Nuestra inteligencia artificial evalúa y organiza tus habilidades automáticamente.",
      bgColor: "bg-blue-500/20",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/30"
    },
    {
      number: "03",
      icon: Share2,
      title: "Comparte y recibe validación auténtica",
      description: "Conecta con profesionales y empresas que valoran el trabajo real.",
      bgColor: "bg-green-500/20",
      iconColor: "text-green-400",
      borderColor: "border-green-500/30"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Cómo{" "}
            <span className="bg-gradient-to-r from-[#7C3AED] to-white bg-clip-text text-transparent">
              funciona
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Tres pasos simples para construir tu reputación profesional basada en evidencia real.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            
            return (
              <div key={index} className="relative">
                <Card
                  className={`
                    bg-black/50 border ${step.borderColor} p-8 rounded-2xl backdrop-blur-sm
                    hover:scale-105 transition-all duration-300 hover:shadow-2xl
                    hover:shadow-[#7C3AED]/20 relative z-10
                  `}
                >
                  <div className="space-y-6">
                    {/* Step Number */}
                    <div className="flex items-center justify-between">
                      <span className="text-6xl font-bold text-white/20">
                        {step.number}
                      </span>
                      <div
                        className={`
                          w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center
                          border ${step.borderColor}
                        `}
                      >
                        <Icon className={`w-8 h-8 ${step.iconColor}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold text-white">
                        {step.title}
                      </h3>
                      <p className="text-white/70 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Arrow connector */}
                {!isLast && (
                  <div className="hidden lg:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                    <div className="bg-black/80 rounded-full p-3 border border-white/10">
                      <ArrowRight className="w-6 h-6 text-[#7C3AED]" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#7C3AED]/20 to-[#1F0A3A]/20 border border-[#7C3AED]/30 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Listo para mostrar tu verdadero potencial?
            </h3>
            <p className="text-white/80 mb-6">
              Únete a una comunidad donde el talento real es valorado y reconocido.
            </p>
            <button className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white px-8 py-4 rounded-2xl font-semibold transition-colors duration-200">
              Comenzar ahora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
