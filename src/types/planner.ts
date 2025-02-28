// Planner-related types
export interface PlannerTask {
  id?: string;
  title: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueTime?: string; // ISO time format (HH:mm)
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyPlanner {
  id?: string;
  userId?: string;
  date: string;
  tasks: PlannerTask[];
  reflection?: string;
  moodRating?: number; // 1-5 rating
  completedCount?: number; // Ajouter cette propriété
  createdAt?: string;
  updatedAt?: string;
}

export interface PlannerStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  highPriorityCompletion: number;
  averageMood?: number;
  weeklyCompletion: { day: string; rate: number }[];
}

export interface PlannerHistoryResponse {
  days: DailyPlanner[];
  total: number;
}
