import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-black border border-white/20 rounded-lg w-8 h-8 flex items-center justify-center">
                <span className="text-[#7C3AED] font-bold text-lg">A</span>
              </div>
              <span className="text-white text-xl font-bold">AXES</span>
            </div>
            <p className="text-white/70 max-w-md">
              La plataforma AI-first donde tu trabajo habla por ti. 
              Construye tu reputación profesional basada en evidencia real, no en palabras.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white/60 hover:text-[#7C3AED] transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-[#7C3AED] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-[#7C3AED] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-[#7C3AED] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Producto</h3>
            <ul className="space-y-2">
              <li>
                <a href="#personas" className="text-white/70 hover:text-white transition-colors">
                  Para Personas
                </a>
              </li>
              <li>
                <a href="#empresas" className="text-white/70 hover:text-white transition-colors">
                  Para Empresas
                </a>
              </li>
              <li>
                <a href="#demo" className="text-white/70 hover:text-white transition-colors">
                  Demo
                </a>
              </li>
              <li>
                <a href="#faq" className="text-white/70 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  Términos de Servicio
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  Cookies
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">
            © 2025 AXES · Autenticidad primero · AI-powered
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-white/40 text-sm">Hecho con ❤️ para developers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
