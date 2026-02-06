import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function run() {
  const result = await model.generateContent(
    "Say hello and explain what an autonomous agent is in simple words."
  );
  console.log(result.response.text());
}

run();
