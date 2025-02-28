import apiClient from './index';
import type { DailyPlanner } from '@/types/planner';
import { format } from 'date-fns';

export const dailyPlannerApi = {
  /**
   * Get today's planner
   */
  getTodayPlanner: () => {
    return apiClient.get('/planner/today');
  },

  /**
   * Get planner for a specific date
   */
  getPlannerForDate: (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return apiClient.get(`/planner/date/${formattedDate}`);
  },

  /**
   * Get planner history for the user
   */
  getPlannerHistory: () => {
    return apiClient.get('/planner/history');
  },

  /**
   * Get planners within a date range
   */
  getPlannersByDateRange: (startDate: Date, endDate: Date) => {
    const start = format(startDate, 'yyyy-MM-dd');
    const end = format(endDate, 'yyyy-MM-dd');
    return apiClient.get(`/planner/range?start=${start}&end=${end}`);
  },

  /**
   * Save or update a planner
   */
  savePlanner: (planner: DailyPlanner) => {
    return apiClient.post('/planner/save', planner);
  },

  getPlannerHistoryWithFilters: (url: string) => {
    return apiClient.get(url);
  },
};
