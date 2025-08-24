"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "¿Qué pasa si no busco empleo?",
      answer: "AXES no es una bolsa de empleo tradicional. Es una plataforma para construir tu reputación profesional basada en evidencia real. Puedes usar AXES para mostrar tu trabajo, recibir validaciones de pares, y construir una red de contactos profesionales auténticos, independientemente de si buscas empleo o no."
    },
    {
      question: "¿Por qué es diferente a LinkedIn?",
      answer: "Mientras LinkedIn se enfoca en conexiones y currículums, AXES se centra en evidencia real de trabajo. No puedes inflar tu perfil con habilidades que no tienes - todo debe estar respaldado por proyectos verificables. Nuestra IA analiza tu trabajo real y genera un 'skill fingerprint' basado en evidencia, no en autodeclaraciones."
    },
    {
      question: "¿Quién puede validar mi trabajo?",
      answer: "Cualquier miembro de la comunidad AXES puede validar tu trabajo, pero las validaciones de personas con mayor reputación en la plataforma tienen más peso. También priorizamos validaciones de personas que trabajaron contigo, colegas de la industria, y expertos reconocidos en el campo relevante."
    },
    {
      question: "¿Cómo funciona el análisis de IA?",
      answer: "Nuestra IA analiza tu código, documentación, arquitectura de proyectos, y otros artefactos para determinar tus habilidades reales. No se basa en palabras clave o autodeclaraciones, sino en evidencia concreta de tu trabajo. El sistema genera un 'skill fingerprint' que refleja tu experiencia real y nivel de expertise."
    },
    {
      question: "¿Mis proyectos privados están seguros?",
      answer: "Absolutamente. Puedes compartir solo las partes de tus proyectos que desees hacer públicas. Para proyectos privados o confidenciales, puedes subir documentación, arquitecturas, casos de estudio o demos sin exponer código sensible. Nuestra IA puede analizar estos artefactos para validar tus habilidades."
    },
    {
      question: "¿Cuánto cuesta usar AXES?",
      answer: "AXES es gratuito para uso individual. Los desarrolladores pueden crear perfiles, subir proyectos, recibir validaciones y conectar con otros profesionales sin costo. Las empresas que quieran acceso a funciones avanzadas de búsqueda y análisis de talento pueden optar por planes premium."
    }
  ];

  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Preguntas{" "}
            <span className="bg-gradient-to-r from-[#7C3AED] to-white bg-clip-text text-transparent">
              Frecuentes
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Resolvemos las dudas más comunes sobre AXES y cómo funciona nuestra plataforma.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-black/50 border border-white/10 rounded-2xl backdrop-blur-sm"
            >
              <AccordionTrigger className="px-6 py-4 text-left text-white hover:text-[#7C3AED] transition-colors [&[data-state=open]>svg]:rotate-180">
                <span className="text-lg font-semibold">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-white/80 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact Support */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#7C3AED]/20 to-[#1F0A3A]/20 border border-[#7C3AED]/30 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Tienes más preguntas?
            </h3>
            <p className="text-white/80 mb-6">
              Nuestro equipo está aquí para ayudarte. Contacta con nosotros y te responderemos lo antes posible.
            </p>
            <button className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white px-8 py-4 rounded-2xl font-semibold transition-colors duration-200">
              Contactar Soporte
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
