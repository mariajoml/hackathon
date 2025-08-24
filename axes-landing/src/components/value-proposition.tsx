"use client";

import { Card } from "@/components/ui/card";
import { User, Eye, Brain, Users } from "lucide-react";

export function ValueProposition() {
  const features = [
    {
      icon: User,
      title: "Muestra tu trabajo",
      description: "Sube proyectos reales que hablen por ti.",
      bgColor: "bg-[#7C3AED]/20",
      iconColor: "text-[#7C3AED]",
      borderColor: "border-[#7C3AED]/30"
    },
    {
      icon: Eye,
      title: "Visibilidad auténtica",
      description: "Empresas y colegas ven tus skills en acción.",
      bgColor: "bg-blue-500/20",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/30"
    },
    {
      icon: Brain,
      title: "AI Insights",
      description: "La plataforma analiza y organiza tus habilidades en un fingerprint visual.",
      bgColor: "bg-green-500/20",
      iconColor: "text-green-400",
      borderColor: "border-green-500/30"
    },
    {
      icon: Users,
      title: "Conexiones reales",
      description: "Validación y reconocimiento entre pares y empresas, sin disfraces.",
      bgColor: "bg-orange-500/20",
      iconColor: "text-orange-400",
      borderColor: "border-orange-500/30"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Tu trabajo, tu{" "}
            <span className="bg-gradient-to-r from-[#7C3AED] to-white bg-clip-text text-transparent">
              reputación real
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            En AXES no necesitas disfrazarte para encajar. Aquí tu trabajo habla por ti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className={`
                  bg-black/50 border ${feature.borderColor} p-8 rounded-2xl backdrop-blur-sm
                  hover:scale-105 transition-all duration-300 hover:shadow-2xl
                  hover:shadow-[#7C3AED]/20
                `}
              >
                <div className="space-y-4">
                  <div
                    className={`
                      w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center
                      border ${feature.borderColor}
                    `}
                  >
                    <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
