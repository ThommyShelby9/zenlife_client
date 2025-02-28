import apiClient from './index';
import type { WaterReminderSetting, WaterIntake } from '@/types/waterReminder';

export const waterReminderApi = {
  // Paramètres de rappel d'hydratation
  getUserSettings: () => {
    return apiClient.get<WaterReminderSetting>('/water/settings');
  },

  updateUserSettings: (settings: WaterReminderSetting) => {
    return apiClient.put<WaterReminderSetting>('/water/settings', settings);
  },

  // Enregistrement de l'hydratation
  logWaterIntake: (data: { quantityML: number }) => {
    return apiClient.post('/water/log', data);
  },

  // Historique d'hydratation
  getWaterIntakeHistory: () => {
    return apiClient.get<WaterIntake[]>('/water/history');
  },

  // Progression quotidienne
  getDailyProgress: () => {
    return apiClient.get('/water/progress');
  },

  // Réinitialisation de l'historique
  resetHistory: () => {
    return apiClient.post('/water/reset-history');
  },

  // Exportation des données
  exportData: () => {
    return apiClient.get('/water/export', {
      responseType: 'blob'
    });
  }
};
