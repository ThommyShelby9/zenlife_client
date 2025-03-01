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

  // Exportation des données en CSV
  exportCSV: () => {
    return apiClient.get('/water/export/csv', {
      responseType: 'blob'
    });
  },

  // Exportation des données en Excel
  exportExcel: () => {
    return apiClient.get('/water/export/excel', {
      responseType: 'blob'
    });
  },

  // Exportation des données en PDF
  exportPDF: () => {
    return apiClient.get('/water/export/pdf', {
      responseType: 'blob'
    });
  }
};
