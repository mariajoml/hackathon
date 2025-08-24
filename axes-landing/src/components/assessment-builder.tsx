"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, X, Move, Code, MessageSquare, Brain, Timer, 
  CheckCircle, XCircle, ArrowUp, ArrowDown, Settings
} from "lucide-react";

interface AssessmentQuestion {
  id: string;
  type: "multiple-choice" | "coding" | "text" | "behavioral";
  title: string;
  description: string;
  timeLimit?: number;
  options?: string[];
  correctAnswer?: string | number;
  difficulty: "easy" | "medium" | "hard";
  skill: string;
}

interface AssessmentBlock {
  id: string;
  title: string;
  description: string;
  type: "technical" | "soft-skills" | "culture-fit";
  questions: AssessmentQuestion[];
  timeLimit: number;
  passingScore: number;
}

interface AssessmentBuilderProps {
  onAssessmentChange: (assessment: AssessmentBlock[]) => void;
  technicalSkills: string[];
  softSkills: string[];
  level: "junior" | "mid" | "senior" | "lead";
}

const QUESTION_TYPES = [
  { id: "multiple-choice", label: "Opción múltiple", icon: CheckCircle, description: "Pregunta con opciones predefinidas" },
  { id: "coding", label: "Ejercicio de código", icon: Code, description: "Problema de programación" },
  { id: "text", label: "Respuesta abierta", icon: MessageSquare, description: "Pregunta de texto libre" },
  { id: "behavioral", label: "Situacional", icon: Brain, description: "Pregunta sobre comportamiento" }
];

const BLOCK_TYPES = [
  { id: "technical", label: "Evaluación Técnica", icon: Code, description: "Preguntas técnicas específicas" },
  { id: "soft-skills", label: "Soft Skills", icon: Brain, description: "Evaluación de habilidades blandas" },
  { id: "culture-fit", label: "Culture Fit", icon: MessageSquare, description: "Compatibilidad cultural" }
];

export function AssessmentBuilder({ onAssessmentChange, technicalSkills, softSkills, level }: AssessmentBuilderProps) {
  const [blocks, setBlocks] = useState<AssessmentBlock[]>([]);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<AssessmentQuestion>>({
    type: "multiple-choice",
    difficulty: "medium",
    timeLimit: 5
  });

  const addBlock = (type: AssessmentBlock["type"]) => {
    const newBlock: AssessmentBlock = {
      id: Date.now().toString(),
      title: `${BLOCK_TYPES.find(t => t.id === type)?.label || "Nuevo Bloque"}`,
      description: "",
      type,
      questions: [],
      timeLimit: 30,
      passingScore: 70
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setActiveBlock(newBlock.id);
    onAssessmentChange([...blocks, newBlock]);
  };

  const updateBlock = (blockId: string, updates: Partial<AssessmentBlock>) => {
    const updatedBlocks = blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    );
    setBlocks(updatedBlocks);
    onAssessmentChange(updatedBlocks);
  };

  const removeBlock = (blockId: string) => {
    const updatedBlocks = blocks.filter(block => block.id !== blockId);
    setBlocks(updatedBlocks);
    onAssessmentChange(updatedBlocks);
    if (activeBlock === blockId) {
      setActiveBlock(null);
    }
  };

  const addQuestion = (blockId: string) => {
    if (!newQuestion.title || !newQuestion.skill) return;

    const question: AssessmentQuestion = {
      id: Date.now().toString(),
      type: newQuestion.type as any,
      title: newQuestion.title,
      description: newQuestion.description || "",
      timeLimit: newQuestion.timeLimit || 5,
      difficulty: newQuestion.difficulty || "medium",
      skill: newQuestion.skill,
      ...(newQuestion.type === "multiple-choice" && {
        options: newQuestion.options || ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
        correctAnswer: 0
      })
    };

    const updatedBlocks = blocks.map(block =>
      block.id === blockId
        ? { ...block, questions: [...block.questions, question] }
        : block
    );

    setBlocks(updatedBlocks);
    onAssessmentChange(updatedBlocks);
    
    // Reset form
    setNewQuestion({
      type: "multiple-choice",
      difficulty: "medium",
      timeLimit: 5
    });
  };

  const removeQuestion = (blockId: string, questionId: string) => {
    const updatedBlocks = blocks.map(block =>
      block.id === blockId
        ? { ...block, questions: block.questions.filter(q => q.id !== questionId) }
        : block
    );
    setBlocks(updatedBlocks);
    onAssessmentChange(updatedBlocks);
  };

  const moveBlock = (blockId: string, direction: "up" | "down") => {
    const currentIndex = blocks.findIndex(b => b.id === blockId);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === blocks.length - 1)
    ) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    
    [newBlocks[currentIndex], newBlocks[targetIndex]] = 
    [newBlocks[targetIndex], newBlocks[currentIndex]];
    
    setBlocks(newBlocks);
    onAssessmentChange(newBlocks);
  };

  const getAvailableSkills = (blockType: AssessmentBlock["type"]) => {
    switch (blockType) {
      case "technical":
        return technicalSkills;
      case "soft-skills":
      case "culture-fit":
        return softSkills;
      default:
        return [];
    }
  };

  const activeBlockData = blocks.find(b => b.id === activeBlock);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-axes-text-primary mb-2">
          Constructor de Assessment Personalizado
        </h3>
        <p className="text-axes-text-muted text-sm">
          Crea bloques de evaluación dinámicos para tu proceso de selección
        </p>
      </div>

      {/* Add Block Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BLOCK_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <Card
              key={type.id}
              className="axes-card cursor-pointer hover:ring-2 hover:ring-axes-primary transition-all"
              onClick={() => addBlock(type.id as any)}
            >
              <CardContent className="p-4 text-center">
                <Icon className="w-8 h-8 text-axes-primary mx-auto mb-2" />
                <h4 className="text-axes-text-primary font-medium mb-1">{type.label}</h4>
                <p className="text-axes-text-muted text-xs">{type.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Blocks List */}
      {blocks.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-axes-text-primary font-semibold">Bloques de Evaluación</h4>
          
          {blocks.map((block, index) => (
            <Card key={block.id} className="axes-card">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-axes-text-primary text-base">{block.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {block.questions.length} preguntas
                      </Badge>
                    </div>
                    {block.description && (
                      <CardDescription className="text-axes-text-muted text-sm mt-1">
                        {block.description}
                      </CardDescription>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveBlock(block.id, "up")}
                      disabled={index === 0}
                      className="axes-btn-ghost p-1"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveBlock(block.id, "down")}
                      disabled={index === blocks.length - 1}
                      className="axes-btn-ghost p-1"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveBlock(activeBlock === block.id ? null : block.id)}
                      className="axes-btn-ghost p-1"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBlock(block.id)}
                      className="axes-btn-ghost p-1 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Block Settings */}
                {activeBlock === block.id && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-axes-border">
                    <div>
                      <label className="text-axes-text-muted text-xs block mb-1">Tiempo límite (min)</label>
                      <Input
                        type="number"
                        value={block.timeLimit}
                        onChange={(e) => updateBlock(block.id, { timeLimit: parseInt(e.target.value) || 30 })}
                        className="axes-input h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-axes-text-muted text-xs block mb-1">Puntaje mínimo (%)</label>
                      <Input
                        type="number"
                        value={block.passingScore}
                        onChange={(e) => updateBlock(block.id, { passingScore: parseInt(e.target.value) || 70 })}
                        className="axes-input h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-axes-text-muted text-xs block mb-1">Descripción</label>
                      <Input
                        type="text"
                        value={block.description}
                        onChange={(e) => updateBlock(block.id, { description: e.target.value })}
                        placeholder="Descripción del bloque"
                        className="axes-input h-8 text-xs"
                      />
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                {/* Questions List */}
                {block.questions.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {block.questions.map((question, qIndex) => (
                      <div key={question.id} className="flex items-center justify-between p-3 axes-bg-hover rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-axes-text-primary text-sm font-medium">
                              {qIndex + 1}. {question.title}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {question.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {question.difficulty}
                            </Badge>
                          </div>
                          <p className="text-axes-text-muted text-xs mt-1">
                            {question.skill} • {question.timeLimit}min
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(block.id, question.id)}
                          className="axes-btn-ghost p-1 text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Question Form */}
                {activeBlock === block.id && (
                  <div className="space-y-4 p-4 axes-bg-secondary rounded-lg">
                    <h5 className="text-axes-text-primary font-medium text-sm">Agregar Pregunta</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-axes-text-muted text-xs block mb-1">Tipo de pregunta</label>
                        <select
                          value={newQuestion.type}
                          onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as any })}
                          className="w-full axes-input h-8 text-xs"
                        >
                          {QUESTION_TYPES.map(type => (
                            <option key={type.id} value={type.id}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-axes-text-muted text-xs block mb-1">Skill evaluada</label>
                        <select
                          value={newQuestion.skill}
                          onChange={(e) => setNewQuestion({ ...newQuestion, skill: e.target.value })}
                          className="w-full axes-input h-8 text-xs"
                        >
                          <option value="">Seleccionar skill</option>
                          {getAvailableSkills(block.type).map(skill => (
                            <option key={skill} value={skill}>{skill}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-axes-text-muted text-xs block mb-1">Título de la pregunta</label>
                      <Input
                        type="text"
                        value={newQuestion.title || ""}
                        onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                        placeholder="¿Cuál es la diferencia entre let y const?"
                        className="axes-input h-8 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-axes-text-muted text-xs block mb-1">Dificultad</label>
                        <select
                          value={newQuestion.difficulty}
                          onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as any })}
                          className="w-full axes-input h-8 text-xs"
                        >
                          <option value="easy">Fácil</option>
                          <option value="medium">Medio</option>
                          <option value="hard">Difícil</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-axes-text-muted text-xs block mb-1">Tiempo (min)</label>
                        <Input
                          type="number"
                          value={newQuestion.timeLimit || 5}
                          onChange={(e) => setNewQuestion({ ...newQuestion, timeLimit: parseInt(e.target.value) || 5 })}
                          className="axes-input h-8 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => addQuestion(block.id)}
                        disabled={!newQuestion.title || !newQuestion.skill}
                        className="axes-btn-primary h-8 text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Agregar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {blocks.length > 0 && (
        <Card className="axes-card">
          <CardContent className="p-4">
            <h4 className="text-axes-text-primary font-semibold mb-3">Resumen del Assessment</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-axes-primary">{blocks.length}</div>
                <div className="text-xs text-axes-text-muted">Bloques</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-axes-primary">
                  {blocks.reduce((sum, block) => sum + block.questions.length, 0)}
                </div>
                <div className="text-xs text-axes-text-muted">Preguntas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-axes-primary">
                  {blocks.reduce((sum, block) => sum + block.timeLimit, 0)}
                </div>
                <div className="text-xs text-axes-text-muted">Minutos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-axes-primary">
                  {Math.round(blocks.reduce((sum, block) => sum + block.passingScore, 0) / blocks.length) || 0}%
                </div>
                <div className="text-xs text-axes-text-muted">Promedio mínimo</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
