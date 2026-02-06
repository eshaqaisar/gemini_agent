# 🧠 Marathon Agent (Powered by Gemini 3)

> **Hackathon Submission:** An autonomous, self-healing educational agent built with the latest `gemini-3-flash-preview` model.

---

## 🚀 Overview

Marathon Agent is not just a chatbot—it is an **Autonomous Learning System**. It actively plans, teaches, executes, and evaluates lessons in real time.

Unlike standard tutors, this agent features a **Self-Healing Architecture**. If the model gets overloaded (503 errors) or if the student fails a concept, the agent detects the issue and automatically restructures the curriculum or inserts remedial lessons without crashing.

---

## ✨ Key Features

### 🧠 The Brain (Node.js Backend)
- **Gemini 3 Powered:** Uses the ultra-low latency and fast reasoning of the `gemini-3-flash-preview` model.
- **Agentic Feedback Loop:**
  1. **Planner:** Generates a dynamic syllabus based on user goals.
  2. **Executor:** Streams lesson content in real time.
  3. **Evaluator:** A strict "Critic" agent that grades output (0–100) and triggers retries.
- **Self-Healing Mechanism:** Detects API instability or low performance and automatically inserts remedial lessons (e.g., Day 1.1) if the score drops below 70.

### 🎨 The Face (React Frontend)
- **Modern Dashboard:** Built with React, TypeScript, and Vite (via Google AI Studio).
- **Interactive UI:** Dark mode, streak tracking, and gamified task completion.
- **Visual Progress Tracking:** Clear daily goals and learning outcomes.

---

## 🛠️ System Architecture (Simple Flow)

The system operates in a continuous autonomous loop:

1. **Planner** creates a personalized learning plan based on user goals.
2. **Executor** delivers the lesson content using Gemini 3.
3. **Evaluator** scores the lesson output from 0 to 100.
4. If the score is **70 or higher**, the system advances to the next topic.
5. If the score is **below 70**, a **Remedial Lesson** is automatically inserted.
6. The cycle repeats until mastery is achieved.

---

## 📂 Repository Structure

This is a monorepo containing both the autonomous agent logic and the visual dashboard.

```plaintext
marathon-agent/
├── backend/             # The "Brain" (Node.js)
│   ├── controller.js    # Main autonomous loop
│   ├── executor.js      # Gemini 3 API interaction
│   ├── evaluator.js     # Grading logic
│   ├── planner.js       # Curriculum generation
│   └── list_models.js   # Utility to fetch available models
│
└── frontend/            # The "Face" (React/Vite)
    ├── src/             # Dashboard source code
    ├── index.html       # Entry point
    └── package.json     # Frontend dependencies
⚡ How to Run
Prerequisites
Node.js 18+

Google AI Studio API Key

1️⃣ Setup the Backend (The Agent)
cd backend
npm install
Create a .env file inside the backend folder:

GEMINI_API_KEY=your_key_here
Run the autonomous agent:

node controller.js
2️⃣ Setup the Frontend (The Dashboard)
cd frontend
npm install
npm run dev
Open your browser at:

http://localhost:5173
🤖 Prompts Used
Tutor (Executor)
You are an expert tutor using the advanced capabilities of Gemini 3.
Task: Create a concise, high-quality lesson for the topic: [Topic].
Requirements: Explain clearly, provide code examples, and focus on actionable learning.
Critic (Evaluator)
You are a strict academic evaluator.
Task: Score the output from 0 to 100 based on accuracy and clarity.
If the score is below 70, provide short feedback.
Return ONLY JSON.
🏆 Why Gemini 3?
We chose gemini-3-flash-preview for its exceptional reasoning speed.
In an autonomous, multi-agent feedback loop where agents continuously evaluate and adapt, latency matters.

Gemini 3 enabled us to build a Thinking Tutor that reacts almost instantly to student performance.

🚀 Created for the Google AI Hackathon
