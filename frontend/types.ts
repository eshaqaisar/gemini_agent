export interface Resource {
  title: string;
  url: string;
  type: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  learningOutcome: string;
  resources: Resource[];
  evaluationMethod: string; // e.g., "Build a script that..."
}

export interface DayPlan {
  day: number;
  title: string;
  description: string;
  tasks: Task[];
  quiz: QuizQuestion[];
}

export interface UserState {
  topic?: string;
  curriculum?: DayPlan[];
  currentDay: number;
  completedTaskIds: string[];
  quizScores: Record<number, number>; // day number -> score
  attachments: Record<string, string>; // task id -> file name
  streak: number;
  darkMode: boolean;
  weakAreas: string[];
}