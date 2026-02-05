import { GoogleGenAI, Type } from "@google/genai";
import { DayPlan } from "../types";

const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const askGeminiTutor = async (question: string, context: string): Promise<string> => {
  if (!ai) {
    return "I am currently offline (API Key missing). Please check your configuration.";
  }

  try {
    const model = "gemini-3-flash-preview";
    const systemInstruction = `You are a helpful Tutor for a student taking an intensive course. 
    The student is currently working on: ${context}.
    Keep answers concise, encouraging, and focused on best practices. 
    If the user provides code, debug it gently.`;
    
    const response = await ai.models.generateContent({
      model,
      contents: question,
      config: {
        systemInstruction,
      }
    });

    return response.text || "I couldn't generate a response right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I encountered an error while thinking.";
  }
};

export const generateCurriculum = async (topic: string, days: number): Promise<DayPlan[]> => {
  if (!ai) throw new Error("API Key is missing. Cannot generate curriculum.");

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Create a comprehensive, hands-on ${days}-day learning curriculum for "${topic}".
    
    Requirements:
    1. **Daily Plan**: 5 concrete tasks per day.
    2. **Learning Outcomes**: Clear goal for each task.
    3. **Evaluation**: A specific way for the user to verify they did it (e.g., "Run this command", "Check this output").
    4. **Resources**: Real or realistic search terms/URLs for tutorials/docs.
    5. **Quiz**: 3 multiple choice questions per day to test understanding.
    6. Ensure Task IDs are unique (e.g., d1-t1) and Quiz IDs are unique (e.g., q1-1).
    7. Progressive difficulty: Day 1 fundamentals, Day ${days} advanced/project.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.INTEGER },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  learningOutcome: { type: Type.STRING },
                  evaluationMethod: { type: Type.STRING },
                  resources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        url: { type: Type.STRING },
                        type: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.INTEGER }
                }
              }
            }
          }
        }
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as DayPlan[];
  }
  throw new Error("Failed to generate curriculum data.");
};