/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WaterReminderSetting {
  enabled?: any; // Gardez cette ligne pour la compatibilité
  id?: string;
  userId?: string;
  dailyGoalML: number;
  reminderEnabled: boolean; // Conservez cette ligne
  reminderInterval: number;
  startTime: string;
  endTime: string;
  customGlassSizes?: number[];
  createdAt?: string;
  updatedAt?: string;
}

export interface WaterIntake {
  id?: string;
  userId?: string;
  quantityML: number;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WeeklyWaterData {
  day: string;
  date: string;
  intake: number;
  goal: number;
  percentage: number;
}

export interface WaterProgressData {
  currentIntake: number;
  dailyGoal: number;
  current: number;  // Alias pour currentIntake (pour rétrocompatibilité)
  goal: number;     // Alias pour dailyGoal (pour rétrocompatibilité)
  percentage: number;
  intakes: WaterIntake[];
}
