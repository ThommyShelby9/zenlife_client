import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { WaterReminderSetting, WaterIntake, WaterProgressData } from '@/types/waterReminder';
import { waterReminderApi } from '@/api/waterReminder';

export const useWaterReminderStore = defineStore('waterReminder', () => {
  // State
  const settings = ref<WaterReminderSetting | null>(null);
  const intakeHistory = ref<WaterIntake[]>([]);
  const todayIntake = ref<number>(0);
  const isLoading = ref<boolean>(false);

  // Computed
  const progress = computed<number>(() => {
    if (!settings.value || settings.value.dailyGoalML === 0) return 0;
    return (todayIntake.value / settings.value.dailyGoalML) * 100;
  });

  const remainingToGoal = computed<number>(() => {
    if (!settings.value) return 0;
    const remaining = settings.value.dailyGoalML - todayIntake.value;
    return remaining > 0 ? remaining : 0;
  });

  // Actions
  const fetchSettings = async () => {
    isLoading.value = true;
    try {
      const response = await waterReminderApi.getUserSettings();
      settings.value = response.data;
      return settings.value;
    } finally {
      isLoading.value = false;
    }
  };

  const updateSettings = async (updatedSettings: WaterReminderSetting) => {
    isLoading.value = true;
    try {
      const response = await waterReminderApi.updateUserSettings(updatedSettings);
      settings.value = response.data;
      return settings.value;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchIntakeHistory = async () => {
    isLoading.value = true;
    try {
      const response = await waterReminderApi.getWaterIntakeHistory();
      intakeHistory.value = response.data;
      return intakeHistory.value;
    } finally {
      isLoading.value = false;
    }
  };

  const logWaterIntake = async (quantityML: number) => {
    isLoading.value = true;
    try {
      const response = await waterReminderApi.logWaterIntake({
        quantityML
      });

      // Update today's intake
      todayIntake.value += quantityML;

      // Add to history
      intakeHistory.value = [response.data.intake, ...intakeHistory.value];

      return response.data.intake;
    } finally {
      isLoading.value = false;
    }
  };

  const getDailyProgress = async (): Promise<WaterProgressData> => {
    isLoading.value = true;
    try {
      const response = await waterReminderApi.getDailyProgress();

      // Update local state
      todayIntake.value = response.data.currentIntake || 0;

      if (!settings.value && response.data.dailyGoal) {
        settings.value = {
          dailyGoalML: response.data.dailyGoal,
          reminderEnabled: true,
          reminderInterval: 60,
          startTime: '08:00',
          endTime: '20:00'
        };
      }

      return {
        currentIntake: response.data.currentIntake || 0,
        dailyGoal: response.data.dailyGoal || 2000,
        current: response.data.currentIntake || 0,
        goal: response.data.dailyGoal || 2000,
        percentage: response.data.percentage || 0,
        intakes: response.data.intakes || []
      };
    } finally {
      isLoading.value = false;
    }
  };

  // Initialize
  const initialize = async () => {
    try {
      // Load settings first
      await fetchSettings();

      // Load progress for today
      await getDailyProgress();

      // Load history
      await fetchIntakeHistory();
    } catch (error) {
      console.error('Failed to initialize water reminder store:', error);
    }
  };

  return {
    // State
    settings,
    intakeHistory,
    todayIntake,
    isLoading,

    // Computed
    progress,
    remainingToGoal,

    // Actions
    fetchSettings,
    updateSettings,
    fetchIntakeHistory,
    logWaterIntake,
    getDailyProgress,
    initialize
  };
});
