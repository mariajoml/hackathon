"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Code, Lightbulb } from "lucide-react";

interface SwipeCardProps {
  question: {
    id: string;
    skill: string;
    level: "junior" | "mid" | "senior";
    question: string;
    explanation?: string;
  };
  onSwipe: (direction: "left" | "right") => void;
  isAnimating?: boolean;
}

const LEVEL_COLORS = {
  junior: "bg-green-500/20 text-green-400 border-green-500/30",
  mid: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  senior: "bg-red-500/20 text-red-400 border-red-500/30"
};

const LEVEL_LABELS = {
  junior: "Junior",
  mid: "Mid-Level",
  senior: "Senior"
};

export function SwipeCard({ question, onSwipe, isAnimating = false }: SwipeCardProps) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
    
    // Determinar dirección de swipe
    if (Math.abs(deltaX) > 50) {
      setSwipeDirection(deltaX > 0 ? "right" : "left");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Si el swipe es suficientemente fuerte, ejecutar la acción
    if (Math.abs(dragOffset.x) > 100) {
      const direction = dragOffset.x > 0 ? "right" : "left";
      onSwipe(direction);
    }
    
    // Reset
    setDragOffset({ x: 0, y: 0 });
    setSwipeDirection(null);
  };

  const handleButtonClick = (direction: "left" | "right") => {
    onSwipe(direction);
  };

  const getCardStyle = () => {
    const rotation = dragOffset.x * 0.1; // Rotación sutil
    const opacity = Math.max(0.7, 1 - Math.abs(dragOffset.x) / 300);
    
    return {
      transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
      opacity,
      transition: isDragging ? "none" : "all 0.3s ease-out"
    };
  };

  const getSwipeIndicatorStyle = (side: "left" | "right") => {
    const isActive = swipeDirection === side;
    const intensity = Math.min(Math.abs(dragOffset.x) / 100, 1);
    
    return {
      opacity: isActive ? intensity : 0,
      transform: `scale(${isActive ? 0.8 + (intensity * 0.2) : 0.8})`,
      transition: isDragging ? "none" : "all 0.2s ease-out"
    };
  };

  return (
    <div className="relative w-full max-w-md mx-auto h-96">
      {/* Swipe Indicators */}
      <div 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-red-500 text-white rounded-full p-4 pointer-events-none"
        style={getSwipeIndicatorStyle("left")}
      >
        <ChevronLeft className="w-8 h-8" />
      </div>
      
      <div 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-green-500 text-white rounded-full p-4 pointer-events-none"
        style={getSwipeIndicatorStyle("right")}
      >
        <ChevronRight className="w-8 h-8" />
      </div>

      {/* Main Card */}
      <Card
        ref={cardRef}
        className={`
          relative w-full h-full bg-black/50 border border-white/10 rounded-2xl backdrop-blur-sm 
          cursor-grab active:cursor-grabbing select-none overflow-hidden
          ${isDragging ? "shadow-2xl" : "shadow-lg"}
          ${isAnimating ? "animate-pulse" : ""}
        `}
        style={getCardStyle()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-[#7C3AED]" />
              <span className="text-white font-semibold">{question.skill}</span>
            </div>
            <Badge className={`${LEVEL_COLORS[question.level]} font-medium`}>
              {LEVEL_LABELS[question.level]}
            </Badge>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6 flex-1 flex flex-col justify-center">
          <div className="text-center space-y-4">
            <Lightbulb className="w-12 h-12 text-[#7C3AED] mx-auto" />
            <h3 className="text-lg font-medium text-white leading-relaxed">
              {question.question}
            </h3>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-white/5 border-t border-white/10">
          <div className="flex items-center justify-between text-sm text-white/60">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Desliza ← para pasar</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Desliza → si sabes</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Swipe Overlay */}
        {swipeDirection && (
          <div className={`
            absolute inset-0 flex items-center justify-center pointer-events-none
            ${swipeDirection === "left" ? "bg-red-500/20" : "bg-green-500/20"}
          `}>
            <div className={`
              text-6xl font-bold
              ${swipeDirection === "left" ? "text-red-400" : "text-green-400"}
            `}>
              {swipeDirection === "left" ? "PASAR" : "SÉ LA RESPUESTA"}
            </div>
          </div>
        )}
      </Card>

      {/* Action Buttons (fallback for non-touch devices) */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          onClick={() => handleButtonClick("left")}
          className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-full p-3 transition-colors"
          disabled={isAnimating}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleButtonClick("right")}
          className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-full p-3 transition-colors"
          disabled={isAnimating}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
