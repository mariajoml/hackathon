"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  label: string;
  currentImage?: string;
  onImageChange: (imageUrl: string | null) => void;
  aspectRatio?: "square" | "banner";
  placeholder?: string;
}

export function ImageUpload({ 
  label, 
  currentImage, 
  onImageChange, 
  aspectRatio = "square",
  placeholder 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    setIsUploading(true);
    
    // Convert to base64 for demo purposes
    // In production, you'd upload to a cloud service
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageChange(result);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const containerClasses = aspectRatio === "banner" 
    ? "w-full h-32 sm:h-40" 
    : "w-32 h-32 mx-auto";

  return (
    <div className="space-y-3">
      <label className="text-white/80 text-sm font-medium block">
        {label}
      </label>
      
      <Card 
        className={`
          ${containerClasses} relative overflow-hidden cursor-pointer transition-all
          ${isDragging 
            ? "border-[#7C3AED] border-2 bg-[#7C3AED]/10" 
            : "border-white/20 hover:border-white/40"
          }
          ${currentImage ? "bg-black/20" : "bg-white/5"}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        {currentImage ? (
          <div className="relative w-full h-full group">
            <img 
              src={currentImage} 
              alt={label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Camera className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/30 rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/60">
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-6 h-6 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Subiendo...</span>
              </div>
            ) : (
              <>
                <div className="mb-2">
                  {aspectRatio === "banner" ? (
                    <ImageIcon className="w-8 h-8" />
                  ) : (
                    <Upload className="w-8 h-8" />
                  )}
                </div>
                <div className="text-center px-2">
                  <p className="text-xs font-medium mb-1">
                    {placeholder || "Subir imagen"}
                  </p>
                  <p className="text-xs text-white/40">
                    Arrastra o haz clic
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <p className="text-white/50 text-xs">
        Formatos: JPG, PNG, GIF. Máximo 5MB
      </p>
    </div>
  );
}
