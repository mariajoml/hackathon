"use client";

import { useState, useCallback } from "react";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: "text" | "question" | "result";
}

export interface TechnicalQuestion {
  id: string;
  skill: string;
  level: "junior" | "mid" | "senior";
  question: string;
  explanation?: string;
  correctAnswer: boolean | null; // null = not answered yet
}

export interface SkillEvaluation {
  skill: string;
  currentLevel: "junior" | "mid" | "senior";
  questionsAnswered: number;
  correctAnswers: number;
  finalLevel?: "junior" | "mid" | "senior";
}

export interface ChatbotState {
  phase: "intro" | "casual_chat" | "technical_evaluation" | "results";
  currentSkillIndex: number;
  currentQuestion: TechnicalQuestion | null;
  skillEvaluations: SkillEvaluation[];
  messages: Message[];
}

const CASUAL_CONVERSATION_FLOW = [
  {
    ai: "¡Hola! 👋 Soy AXES AI, tu asistente personal. Me da mucho gusto conocerte. ¿Cómo te sientes hoy?",
    responses: ["¡Muy bien, gracias!", "Un poco nervioso/a", "Emocionado/a por empezar"]
  },
  {
    ai: "Me alegra escuchar eso. Antes de comenzar, quiero que sepas que esto no es una evaluación tradicional. Simplemente vamos a tener una conversación sobre tecnología, como si fuéramos colegas tomando un café ☕",
    responses: ["Perfecto, me gusta esa idea", "Suena relajante", "¡Genial!"]
  },
  {
    ai: "Cuéntame, ¿qué es lo que más te gusta de trabajar en tecnología? ¿Hay algo específico que te emocione del desarrollo?",
    responses: ["Resolver problemas complejos", "Crear cosas nuevas", "Aprender constantemente"]
  },
  {
    ai: "¡Excelente! Esa pasión se nota. Ahora, me gustaría conocer mejor tus habilidades técnicas de una forma divertida. ¿Te parece si jugamos un poco? 🎮",
    responses: ["¡Sí, me encanta!", "Suena interesante", "¿Cómo funciona?"]
  }
];

// Preguntas técnicas por skill y nivel
const TECHNICAL_QUESTIONS = {
  "React": {
    junior: [
      {
        question: "¿Cuál es la diferencia principal entre un componente funcional y uno de clase en React?",
        explanation: "Los componentes funcionales son más simples y usan hooks, mientras que los de clase tienen métodos de ciclo de vida."
      },
      {
        question: "¿Para qué sirve el hook useState en React?",
        explanation: "useState permite manejar estado local en componentes funcionales."
      }
    ],
    mid: [
      {
        question: "¿Cuándo usarías useEffect con un array de dependencias vacío []?",
        explanation: "Para ejecutar código solo una vez cuando el componente se monta, similar a componentDidMount."
      },
      {
        question: "¿Qué es el Virtual DOM y por qué React lo utiliza?",
        explanation: "Es una representación en memoria del DOM real que permite optimizar las actualizaciones."
      }
    ],
    senior: [
      {
        question: "¿Cómo implementarías un custom hook para manejar llamadas a APIs con loading, error y retry?",
        explanation: "Combinando useState, useEffect y useCallback para crear un hook reutilizable."
      },
      {
        question: "¿Cuáles son las mejores prácticas para optimizar el rendimiento en aplicaciones React grandes?",
        explanation: "Memo, useMemo, useCallback, lazy loading, code splitting, y profiling."
      }
    ]
  },
  "JavaScript": {
    junior: [
      {
        question: "¿Cuál es la diferencia entre let, const y var?",
        explanation: "var tiene function scope, let y const tienen block scope, const es inmutable."
      },
      {
        question: "¿Qué es el hoisting en JavaScript?",
        explanation: "Es el comportamiento donde las declaraciones se mueven al inicio de su scope."
      }
    ],
    mid: [
      {
        question: "¿Cómo funciona el event loop en JavaScript?",
        explanation: "Maneja la ejecución asíncrona usando call stack, callback queue y web APIs."
      },
      {
        question: "¿Cuál es la diferencia entre Promise.all() y Promise.allSettled()?",
        explanation: "Promise.all falla si una promesa falla, allSettled espera a todas sin importar el resultado."
      }
    ],
    senior: [
      {
        question: "¿Cómo implementarías un debounce function desde cero?",
        explanation: "Usando setTimeout y clearTimeout para retrasar la ejecución de una función."
      },
      {
        question: "¿Qué patrones de diseño conoces y cuándo los aplicarías en JavaScript?",
        explanation: "Singleton, Observer, Factory, Module pattern, etc. según el caso de uso."
      }
    ]
  },
  "Python": {
    junior: [
      {
        question: "¿Cuál es la diferencia entre una lista y una tupla en Python?",
        explanation: "Las listas son mutables, las tuplas son inmutables."
      },
      {
        question: "¿Para qué sirve el keyword 'self' en Python?",
        explanation: "Hace referencia a la instancia actual de la clase."
      }
    ],
    mid: [
      {
        question: "¿Qué son los decoradores en Python y cómo funcionan?",
        explanation: "Son funciones que modifican el comportamiento de otras funciones o clases."
      },
      {
        question: "¿Cuál es la diferencia entre __str__ y __repr__?",
        explanation: "__str__ es para usuarios finales, __repr__ es para desarrolladores y debugging."
      }
    ],
    senior: [
      {
        question: "¿Cómo implementarías un context manager personalizado?",
        explanation: "Usando __enter__ y __exit__ o el decorador @contextmanager."
      },
      {
        question: "¿Qué es el GIL y cómo afecta el multithreading en Python?",
        explanation: "Global Interpreter Lock limita la ejecución a un thread por vez en CPython."
      }
    ]
  }
};

export function useChatbot(userSkills: string[] = []) {
  const [state, setState] = useState<ChatbotState>({
    phase: "intro",
    currentSkillIndex: 0,
    currentQuestion: null,
    skillEvaluations: userSkills.map(skill => ({
      skill,
      currentLevel: "mid" as const, // Empezamos en nivel medio
      questionsAnswered: 0,
      correctAnswers: 0
    })),
    messages: []
  });

  const [casualChatStep, setCasualChatStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((content: string, sender: "user" | "ai", type: "text" | "question" | "result" = "text") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      type
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
  }, []);

  const startCasualChat = useCallback(() => {
    setState(prev => ({ ...prev, phase: "casual_chat" }));
    // Agregar primer mensaje del AI
    setTimeout(() => {
      addMessage(CASUAL_CONVERSATION_FLOW[0].ai, "ai");
    }, 1000);
  }, [addMessage]);

  const handleCasualResponse = useCallback((response: string) => {
    console.log("handleCasualResponse called:", { response, casualChatStep, totalSteps: CASUAL_CONVERSATION_FLOW.length });
    addMessage(response, "user");
    
    setIsLoading(true);
    setTimeout(() => {
      const nextStep = casualChatStep + 1;
      console.log("Next step:", nextStep, "Total steps:", CASUAL_CONVERSATION_FLOW.length);
      
      if (nextStep < CASUAL_CONVERSATION_FLOW.length) {
        addMessage(CASUAL_CONVERSATION_FLOW[nextStep].ai, "ai");
        setCasualChatStep(nextStep);
        setIsLoading(false);
      } else {
        // Terminar conversación casual e iniciar evaluación técnica
        console.log("Terminando chat casual, iniciando evaluación técnica...");
        addMessage("¡Perfecto! Ahora vamos a explorar tus habilidades técnicas de una forma divertida. Te haré preguntas y tú simplemente desliza a la derecha si crees que sabes la respuesta, o a la izquierda si prefieres pasar. ¡Empecemos! 🚀", "ai");
        
        // Cambiar a fase técnica y generar primera pregunta
        setTimeout(() => {
          console.log("Cambiando a fase técnica...");
          setState(prev => {
            const newState = { ...prev, phase: "technical_evaluation" as const };
            
            // Generar primera pregunta inmediatamente
            const currentEval = newState.skillEvaluations[newState.currentSkillIndex];
            if (currentEval) {
              const skill = currentEval.skill;
              const level = currentEval.currentLevel;
              
              // Obtener preguntas para este skill y nivel
              const questionsForSkill = TECHNICAL_QUESTIONS[skill as keyof typeof TECHNICAL_QUESTIONS];
              let randomQuestion;
              
              if (questionsForSkill) {
                const questionsForLevel = questionsForSkill[level];
                if (questionsForLevel && questionsForLevel.length > 0) {
                  randomQuestion = questionsForLevel[Math.floor(Math.random() * questionsForLevel.length)];
                }
              }
              
              // Si no hay preguntas específicas, usar preguntas genéricas
              if (!randomQuestion) {
                const genericQuestions = [
                  {
                    question: `¿Cuál es tu experiencia con ${skill}?`,
                    explanation: `Pregunta general sobre experiencia en ${skill}`
                  },
                  {
                    question: `¿Qué proyectos has hecho con ${skill}?`,
                    explanation: `Pregunta sobre proyectos prácticos con ${skill}`
                  },
                  {
                    question: `¿Cuáles son las mejores prácticas que conoces en ${skill}?`,
                    explanation: `Pregunta sobre conocimientos avanzados en ${skill}`
                  }
                ];
                randomQuestion = genericQuestions[Math.floor(Math.random() * genericQuestions.length)];
              }
              
              const question: TechnicalQuestion = {
                id: Date.now().toString(),
                skill,
                level,
                question: randomQuestion.question,
                explanation: randomQuestion.explanation,
                correctAnswer: null
              };

              newState.currentQuestion = question;
            }
            
            return newState;
          });
          setIsLoading(false);
        }, 1000);
      }
    }, 1500);
  }, [casualChatStep, addMessage]);

  const generateNextQuestion = useCallback(() => {
    setState(prev => {
      const currentEval = prev.skillEvaluations[prev.currentSkillIndex];
      if (!currentEval) {
        // No hay más skills, ir a resultados
        return { ...prev, phase: "results" };
      }

      const skill = currentEval.skill;
      const level = currentEval.currentLevel;
      
      // Obtener preguntas para este skill y nivel
      const questionsForSkill = TECHNICAL_QUESTIONS[skill as keyof typeof TECHNICAL_QUESTIONS];
      let randomQuestion;
      
      if (questionsForSkill) {
        const questionsForLevel = questionsForSkill[level];
        if (questionsForLevel && questionsForLevel.length > 0) {
          randomQuestion = questionsForLevel[Math.floor(Math.random() * questionsForLevel.length)];
        }
      }
      
      // Si no hay preguntas específicas, usar preguntas genéricas
      if (!randomQuestion) {
        const genericQuestions = [
          {
            question: `¿Cuál es tu experiencia con ${skill}?`,
            explanation: `Pregunta general sobre experiencia en ${skill}`
          },
          {
            question: `¿Qué proyectos has hecho con ${skill}?`,
            explanation: `Pregunta sobre proyectos prácticos con ${skill}`
          },
          {
            question: `¿Cuáles son las mejores prácticas que conoces en ${skill}?`,
            explanation: `Pregunta sobre conocimientos avanzados en ${skill}`
          }
        ];
        randomQuestion = genericQuestions[Math.floor(Math.random() * genericQuestions.length)];
      }
      
      const question: TechnicalQuestion = {
        id: Date.now().toString(),
        skill,
        level,
        question: randomQuestion.question,
        explanation: randomQuestion.explanation,
        correctAnswer: null
      };

      return {
        ...prev,
        currentQuestion: question
      };
    });
  }, []);

  const handleSwipe = useCallback((direction: "left" | "right") => {
    if (!state.currentQuestion) return;

    const isCorrect = direction === "right";
    
    setState(prev => {
      const updatedEvaluations = [...prev.skillEvaluations];
      const currentEval = updatedEvaluations[prev.currentSkillIndex];
      
      if (currentEval) {
        currentEval.questionsAnswered += 1;
        if (isCorrect) {
          currentEval.correctAnswers += 1;
          // Subir nivel si es correcto
          if (currentEval.currentLevel === "junior") {
            currentEval.currentLevel = "mid";
          } else if (currentEval.currentLevel === "mid") {
            currentEval.currentLevel = "senior";
          }
        } else {
          // Bajar nivel si es incorrecto
          if (currentEval.currentLevel === "senior") {
            currentEval.currentLevel = "mid";
          } else if (currentEval.currentLevel === "mid") {
            currentEval.currentLevel = "junior";
          }
        }

        // Si ya respondió 3 preguntas de este skill, pasar al siguiente
        if (currentEval.questionsAnswered >= 3) {
          currentEval.finalLevel = currentEval.currentLevel;
          
          // Verificar si hay más skills
          const nextSkillIndex = prev.currentSkillIndex + 1;
          if (nextSkillIndex >= prev.skillEvaluations.length) {
            // No hay más skills, ir a resultados
            return {
              ...prev,
              skillEvaluations: updatedEvaluations,
              phase: "results",
              currentQuestion: null
            };
          } else {
            // Hay más skills, generar pregunta para el siguiente
            const nextEval = prev.skillEvaluations[nextSkillIndex];
            const skill = nextEval.skill;
            const level = nextEval.currentLevel;
            
            // Generar pregunta para el siguiente skill
            const questionsForSkill = TECHNICAL_QUESTIONS[skill as keyof typeof TECHNICAL_QUESTIONS];
            let randomQuestion;
            
            if (questionsForSkill) {
              const questionsForLevel = questionsForSkill[level];
              if (questionsForLevel && questionsForLevel.length > 0) {
                randomQuestion = questionsForLevel[Math.floor(Math.random() * questionsForLevel.length)];
              }
            }
            
            // Si no hay preguntas específicas, usar preguntas genéricas
            if (!randomQuestion) {
              const genericQuestions = [
                {
                  question: `¿Cuál es tu experiencia con ${skill}?`,
                  explanation: `Pregunta general sobre experiencia en ${skill}`
                },
                {
                  question: `¿Qué proyectos has hecho con ${skill}?`,
                  explanation: `Pregunta sobre proyectos prácticos con ${skill}`
                },
                {
                  question: `¿Cuáles son las mejores prácticas que conoces en ${skill}?`,
                  explanation: `Pregunta sobre conocimientos avanzados en ${skill}`
                }
              ];
              randomQuestion = genericQuestions[Math.floor(Math.random() * genericQuestions.length)];
            }
            
            const nextQuestion: TechnicalQuestion = {
              id: Date.now().toString(),
              skill,
              level,
              question: randomQuestion.question,
              explanation: randomQuestion.explanation,
              correctAnswer: null
            };

            return {
              ...prev,
              skillEvaluations: updatedEvaluations,
              currentSkillIndex: nextSkillIndex,
              currentQuestion: nextQuestion
            };
          }
        } else {
          // Generar siguiente pregunta para el mismo skill
          const skill = currentEval.skill;
          const level = currentEval.currentLevel;
          
          const questionsForSkill = TECHNICAL_QUESTIONS[skill as keyof typeof TECHNICAL_QUESTIONS];
          let randomQuestion;
          
          if (questionsForSkill) {
            const questionsForLevel = questionsForSkill[level];
            if (questionsForLevel && questionsForLevel.length > 0) {
              randomQuestion = questionsForLevel[Math.floor(Math.random() * questionsForLevel.length)];
            }
          }
          
          // Si no hay preguntas específicas, usar preguntas genéricas
          if (!randomQuestion) {
            const genericQuestions = [
              {
                question: `¿Cuál es tu experiencia con ${skill}?`,
                explanation: `Pregunta general sobre experiencia en ${skill}`
              },
              {
                question: `¿Qué proyectos has hecho con ${skill}?`,
                explanation: `Pregunta sobre proyectos prácticos con ${skill}`
              },
              {
                question: `¿Cuáles son las mejores prácticas que conoces en ${skill}?`,
                explanation: `Pregunta sobre conocimientos avanzados en ${skill}`
              }
            ];
            randomQuestion = genericQuestions[Math.floor(Math.random() * genericQuestions.length)];
          }
          
          const nextQuestion: TechnicalQuestion = {
            id: Date.now().toString(),
            skill,
            level,
            question: randomQuestion.question,
            explanation: randomQuestion.explanation,
            correctAnswer: null
          };

          return {
            ...prev,
            skillEvaluations: updatedEvaluations,
            currentQuestion: nextQuestion
          };
        }
      }

      return prev;
    });
  }, [state.currentQuestion]);

  const getCurrentCasualOptions = useCallback(() => {
    if (casualChatStep < CASUAL_CONVERSATION_FLOW.length) {
      return CASUAL_CONVERSATION_FLOW[casualChatStep].responses;
    }
    return [];
  }, [casualChatStep]);

  const getResults = useCallback(() => {
    return state.skillEvaluations.filter(skillEvaluation => skillEvaluation.finalLevel);
  }, [state.skillEvaluations]);

  return {
    state,
    isLoading,
    addMessage,
    startCasualChat,
    handleCasualResponse,
    handleSwipe,
    getCurrentCasualOptions,
    generateNextQuestion,
    getResults
  };
}
