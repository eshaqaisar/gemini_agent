import fs from "fs";

export function createPlan(memory) {
  // Example: 3-day plan
  if (memory.plan.length === 0) {
    memory.plan = [
      { day: 1, topic: "Vectors", status: "pending" },
      { day: 2, topic: "Matrices", status: "pending" },
      { day: 3, topic: "Eigenvalues", status: "pending" }
    ];
    fs.writeFileSync("memory.json", JSON.stringify(memory, null, 2));
  }
  return memory.plan;
}
