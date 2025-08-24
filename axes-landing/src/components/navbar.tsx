"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "axes-nav"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-[#7C3AED] rounded-lg w-8 h-8 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-axes-primary font-bold text-xl">AXES</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#personas"
              className="text-axes-text-secondary hover:text-axes-text-primary transition-colors duration-200"
            >
              Personas
            </a>
                                    <a
                          href="/auth/company"
                          className="text-axes-text-secondary hover:text-axes-text-primary transition-colors duration-200"
                        >
                          Empresas
                        </a>
            <a
              href="#faq"
              className="text-axes-text-secondary hover:text-axes-text-primary transition-colors duration-200"
            >
              FAQ
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
                                    <Button
                          variant="ghost"
                          className="axes-btn-secondary rounded-xl"
                          onClick={() => window.location.href = '/auth'}
                        >
                          Ingresar
                        </Button>
                        <Button
                          className="axes-btn-primary rounded-2xl px-6 transition-all duration-200"
                          onClick={() => window.location.href = '/auth'}
                        >
                          Comenzar
                        </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
