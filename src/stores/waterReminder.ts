import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { WaterReminderSetting, WaterIntake, WaterProgressData } from '@/types/waterReminder';
import { waterReminderApi } from '@/api/waterReminder';
import { WaterIntakeUtil } from '@/utils/WaterIntakeUtil'; // Importez la classe utilitaire si vous l'avez créée

export const useWaterReminderStore = defineStore('waterReminder', () => {
  // State
  const settings = ref<WaterReminderSetting | null>(null);
  const intakeHistory = ref<WaterIntake[]>([]);
  const todayIntake = ref<number>(0);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

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
    error.value = null;
    try {
      const response = await waterReminderApi.getUserSettings();
      settings.value = response.data;
      console.log('Paramètres chargés:', settings.value);
      return settings.value;
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres:', err);
      error.value = 'Impossible de charger les paramètres';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateSettings = async (updatedSettings: WaterReminderSetting) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await waterReminderApi.updateUserSettings(updatedSettings);
      settings.value = response.data;
      console.log('Paramètres mis à jour:', settings.value);
      return settings.value;
    } catch (err) {
      console.error('Erreur lors de la mise à jour des paramètres:', err);
      error.value = 'Impossible de mettre à jour les paramètres';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchIntakeHistory = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await waterReminderApi.getWaterIntakeHistory();

      // Normaliser les données si vous avez une classe utilitaire
      if (typeof WaterIntakeUtil !== 'undefined') {
        intakeHistory.value = response.data.map(intake => WaterIntakeUtil.normalizeIntake(intake));
      } else {
        intakeHistory.value = response.data;
      }

      console.log('Historique chargé, nombre d\'entrées:', intakeHistory.value.length);
      if (intakeHistory.value.length > 0) {
        console.log('Premier élément:', intakeHistory.value[0]);
      }

      return intakeHistory.value;
    } catch (err) {
      console.error('Erreur lors du chargement de l\'historique:', err);
      error.value = 'Impossible de charger l\'historique';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logWaterIntake = async (quantityML: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await waterReminderApi.logWaterIntake({
        quantityML
      });

      // Normaliser l'entrée si vous avez une classe utilitaire
      let normalizedIntake;
      if (typeof WaterIntakeUtil !== 'undefined') {
        normalizedIntake = WaterIntakeUtil.normalizeIntake(response.data.intake);
      } else {
        normalizedIntake = response.data.intake;
      }

      // Update today's intake
      todayIntake.value += quantityML;

      // Add to history
      intakeHistory.value = [normalizedIntake, ...intakeHistory.value];
      console.log('Entrée d\'eau ajoutée:', normalizedIntake);

      return normalizedIntake;
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la consommation d\'eau:', err);
      error.value = 'Impossible d\'enregistrer la consommation d\'eau';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getDailyProgress = async (): Promise<WaterProgressData> => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await waterReminderApi.getDailyProgress();
      console.log('Progression quotidienne:', response.data);

      // Update local state with proper field mapping
      todayIntake.value = response.data.currentIntakeML || response.data.currentIntake || 0;

      if (!settings.value && (response.data.dailyGoalML || response.data.dailyGoal)) {
        settings.value = {
          dailyGoalML: response.data.dailyGoalML || response.data.dailyGoal || 2000,
          reminderEnabled: true, // Changé de 'enabled' à 'reminderEnabled'
          reminderInterval: 60,
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          customGlassSizes: [] // Ajout de la propriété manquante
        };
      }

      return {
        currentIntake: response.data.currentIntakeML || response.data.currentIntake || 0,
        dailyGoal: response.data.dailyGoalML || response.data.dailyGoal || 2000,
        current: response.data.currentIntakeML || response.data.currentIntake || 0,
        goal: response.data.dailyGoalML || response.data.dailyGoal || 2000,
        percentage: response.data.percentage || 0,
        intakes: response.data.intakes || []
      };
    } catch (err) {
      console.error('Erreur lors du chargement de la progression quotidienne:', err);
      error.value = 'Impossible de charger la progression quotidienne';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Reset water intake history
  const resetHistory = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await waterReminderApi.resetHistory();
      console.log('Historique réinitialisé:', response.data);

      // Clear local state
      intakeHistory.value = [];
      todayIntake.value = 0;

      return response.data;
    } catch (err) {
      console.error('Erreur lors de la réinitialisation de l\'historique:', err);
      error.value = 'Impossible de réinitialiser l\'historique';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Initialize
  const initialize = async () => {
    try {
      console.log('Initialisation du store WaterReminder...');

      // Load settings first
      await fetchSettings();

      // Load progress for today
      await getDailyProgress();

      // Load history
      await fetchIntakeHistory();

      console.log('Initialisation terminée avec succès');
    } catch (err) {
      console.error('Erreur lors de l\'initialisation du store WaterReminder:', err);
      error.value = 'Erreur lors de l\'initialisation';
      throw err;
    }
  };

  return {
    // State
    settings,
    intakeHistory,
    todayIntake,
    isLoading,
    error,

    // Computed
    progress,
    remainingToGoal,

    // Actions
    fetchSettings,
    updateSettings,
    fetchIntakeHistory,
    logWaterIntake,
    getDailyProgress,
    resetHistory,
    initialize
  };
});
