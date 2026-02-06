import fs from "fs";
import { createPlan } from "./planner.js";
import { executeStep } from "./executor.js"; // or executeStepStream if using streaming
import { evaluateStep } from "./evaluator.js";

async function runAgent() {
  console.log("🚀 Agent Starting...");

  // 1. Load Memory
  const memory = JSON.parse(fs.readFileSync("memory.json"));

  // 2. Ensure Plan Exists
  if (!memory.plan || memory.plan.length === 0) {
    createPlan(memory);
    console.log("📝 New Plan Created.");
  }

  // 3. THE SMART LOOP (While there is work to do...)
  // We look for the first step that is NOT 'completed'
  let currentStepIndex = memory.plan.findIndex(s => s.status !== "completed");

  while (currentStepIndex !== -1) {
    const step = memory.plan[currentStepIndex];
    
    // --- EXECUTE ---
    // (If you are using the streaming version, pass the callback here)
    const resultText = await executeStep(step); 

    // --- EVALUATE ---
    const evaluation = await evaluateStep(step, resultText);

    // --- DECIDE (The "Brain" Logic) ---
    if (evaluation.status === "completed" && evaluation.score >= 70) {
      // SUCCESS CASE
      console.log(`✅ Day ${step.day} Passed! (Score: ${evaluation.score})`);
      memory.plan[currentStepIndex] = evaluation; // Update the step with results
    
    } else {
      // FAILURE CASE - AGENT ADAPTS
      console.log(`⚠️ Day ${step.day} Failed (Score: ${evaluation.score}). Adapting plan...`);
      
      // 1. Mark current step as 'failed' (so we don't loop forever on it)
      memory.plan[currentStepIndex] = { ...evaluation, status: "failed" };

      // 2. Insert a "Remedial Step" immediately after this one
      const remedialStep = {
        day: step.day + 0.1, // e.g., Day 1.1
        topic: `Review of ${step.topic} (Simpler Explanation)`,
        status: "pending",
        difficulty: "easy" // Drop difficulty
      };

      memory.plan.splice(currentStepIndex + 1, 0, remedialStep);
      console.log(`➕ Added remedial lesson: ${remedialStep.topic}`);
    }

    // --- SAVE STATE ---
    fs.writeFileSync("memory.json", JSON.stringify(memory, null, 2));

    // Find the next pending step for the next loop iteration
    currentStepIndex = memory.plan.findIndex(s => s.status === "pending");
  }

  console.log("🎉 All learning goals completed!");
}

runAgent();