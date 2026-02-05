import { GoogleGenerativeAI } from "@google/generative-ai";


import dotenv from "dotenv";
dotenv.config();
const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

// Helper function to pause execution
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function executeStep(step) {
  console.log(`\n🤖 Gemini 3 Executing Day ${step.day}: ${step.topic} [${step.difficulty || "standard"}]`);

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const prompt = `
        You are an expert tutor.
        Task: Create a concise, high-quality lesson for the topic: "${step.topic}".
        Difficulty Level: ${step.difficulty || "Beginner"}.
        
        Requirements:
        - Explain the concept clearly in under 200 words.
        - Provide 1 short code example or practical analogy.
        - Focus on actionable learning.
      `;

      // STREAMING ENABLED
      const result = await model.generateContentStream(prompt);
      
      let fullText = "";
      process.stdout.write("📝 Streaming Output: "); 
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        process.stdout.write(chunkText); 
      }
      
      console.log("\n"); 
      return fullText; // Success! Exit the function.

    } catch (error) {
      attempts++;
      console.error(`\n⚠️ Attempt ${attempts} failed: ${error.message}`);
      
      if (error.message.includes("503") || error.message.includes("overloaded")) {
        console.log("⏳ Server busy. Waiting 5 seconds before retrying...");
        await sleep(5000); // Wait 5 seconds
      } else {
        return `FAILED_GENERATION: ${error.message}`; // Fatal error (e.g., bad key), stop retrying
      }
    }
  }
  
  return "FAILED: Server was too busy after 3 attempts.";
}