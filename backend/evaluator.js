import { GoogleGenerativeAI } from "@google/generative-ai";


import dotenv from "dotenv";
dotenv.config();
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Helper function to pause execution
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const model = genAI.getGenerativeModel({ 
    model: "gemini-3-flash-preview",
    generationConfig: { responseMimeType: "application/json" } 
});

export async function evaluateStep(step, executionResult) {
  console.log(`🧐 Gemini 3 Evaluating Day ${step.day}...`);

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const prompt = `
        You are a strict academic evaluator.
        
        ORIGINAL GOAL: Learn about "${step.topic}" (Difficulty: ${step.difficulty || "standard"}).
        ACTUAL OUTPUT: "${executionResult}"
        
        Task:
        1. Score the output from 0 to 100 based on accuracy and clarity.
        2. If the score is below 70, provide short feedback.
        3. Decide if the user passed or needs to retry.

        Return ONLY JSON:
        {
          "score": number,
          "feedback": "string",
          "passed": boolean
        }
      `;

      const result = await model.generateContent(prompt);
      const evaluation = JSON.parse(result.response.text());

      console.log(`📊 Score: ${evaluation.score}/100 | Passed: ${evaluation.passed}`);

      return {
        ...step,
        status: evaluation.passed ? "completed" : "failed",
        score: evaluation.score,
        feedback: evaluation.feedback,
        result: executionResult 
      };

    } catch (error) {
      attempts++;
      console.error(`⚠️ Evaluator Attempt ${attempts} failed: ${error.message}`);

      if (error.message.includes("503") || error.message.includes("overloaded")) {
        console.log("⏳ Evaluator waiting 5 seconds...");
        await sleep(5000);
      } else {
        // Fatal error (e.g. JSON parse error), stop retrying
        return { ...step, status: "completed", score: 50, feedback: "Evaluation Error" };
      }
    }
  }

  // If all 3 attempts fail
  return { ...step, status: "completed", score: 50, feedback: "Server too busy to evaluate." };
}