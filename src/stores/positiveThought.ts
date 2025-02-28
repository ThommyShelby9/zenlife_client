import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PositiveThought, UserPositiveThoughtSetting } from '@/types/positiveThought';
import { positiveThoughtApi } from '@/api/positiveThought';

export const usePositiveThoughtStore = defineStore('positiveThought', () => {
  // State
  const currentThought = ref<PositiveThought | null>(null);
  const userSettings = ref<UserPositiveThoughtSetting | null>(null);
  const allThoughts = ref<PositiveThought[]>([]);
  const categories = ref<string[]>([]);
  const isLoading = ref<boolean>(false);

  // Actions
  const getRandomPositiveThought = async (category?: string): Promise<PositiveThought> => {
    isLoading.value = true;
    try {
      const response = await positiveThoughtApi.getRandomThought(category);

      // Vérification et conversion explicite
      const thought: PositiveThought = {
        id: response.data?.id,
        content: response.data?.content || '',
        author: response.data?.author || 'Anonyme',
        category: response.data?.category || '',
        createdAt: response.data?.createdAt,
        updatedAt: response.data?.updatedAt
      };

      currentThought.value = thought;
      return thought;
    } catch (error) {
      // Fallback à une pensée par défaut
      const defaultThought: PositiveThought = {
        id: undefined,
        content: "Chaque jour est une nouvelle chance de changer votre vie.",
        author: "Anonyme",
        category: "",
        createdAt: new Date().toISOString(),
        updatedAt: undefined
      };

      currentThought.value = defaultThought;
      return defaultThought;
    } finally {
      isLoading.value = false;
    }
  };

  const getAllThoughts = async (): Promise<PositiveThought[]> => {
    isLoading.value = true;
    try {
      const response = await positiveThoughtApi.getAllThoughts();
      allThoughts.value = response.data;

      // Extract unique categories
      const uniqueCategories = new Set<string>();
      allThoughts.value.forEach(thought => {
        if (thought.category) {
          uniqueCategories.add(thought.category);
        }
      });
      categories.value = Array.from(uniqueCategories);

      return allThoughts.value;
    } finally {
      isLoading.value = false;
    }
  };

  const getThoughtsByCategory = async (category: string): Promise<PositiveThought[]> => {
    isLoading.value = true;
    try {
      const response = await positiveThoughtApi.getThoughtsByCategory(category);
      return response.data;
    } finally {
      isLoading.value = false;
    }
  };

  const createThought = async (thought: PositiveThought): Promise<PositiveThought> => {
    isLoading.value = true;
    try {
      const response = await positiveThoughtApi.createPositiveThought(thought);

      // Add to local collection if successful
      allThoughts.value = [response.data.thought, ...allThoughts.value];

      // Add category if new
      if (thought.category && !categories.value.includes(thought.category)) {
        categories.value.push(thought.category);
      }

      return response.data.thought;
    } finally {
      isLoading.value = false;
    }
  };

  const getUserSettings = async (): Promise<UserPositiveThoughtSetting> => {
    isLoading.value = true;
    try {
      const response = await positiveThoughtApi.getUserSettings();

      // Vérification et conversion explicite
      const settings: UserPositiveThoughtSetting = {
        id: response.data?.id,
        userId: response.data?.userId,
        enabled: response.data?.enabled ?? true, // Valeur par défaut true
        frequency: response.data?.frequency || 'daily', // Valeur par défaut 'daily'
        customInterval: response.data?.customInterval,
        preferredCategories: response.data?.preferredCategories || [],
        notificationEnabled: response.data?.notificationEnabled ?? true, // Valeur par défaut true
        displayOnLockScreen: response.data?.displayOnLockScreen ?? false, // Valeur par défaut false
        createdAt: response.data?.createdAt,
        updatedAt: response.data?.updatedAt
      };

      userSettings.value = settings;
      return settings;
    } catch (error) {
      // Fallback à des paramètres par défaut
      const defaultSettings: UserPositiveThoughtSetting = {
        id: undefined,
        userId: undefined,
        enabled: true,
        frequency: 'daily',
        customInterval: 60, // Intervalle par défaut de 60 minutes
        preferredCategories: [],
        notificationEnabled: true,
        displayOnLockScreen: false,
        createdAt: new Date().toISOString(),
        updatedAt: undefined
      };

      userSettings.value = defaultSettings;
      return defaultSettings;
    } finally {
      isLoading.value = false;
    }
  };

  const updateUserSettings = async (
    settings: UserPositiveThoughtSetting
  ): Promise<UserPositiveThoughtSetting> => {
    isLoading.value = true;
    try {
      const response = await positiveThoughtApi.updateUserSettings(settings);

      // Vérification et conversion explicite
      const updatedSettings: UserPositiveThoughtSetting = {
        id: response.data.settings?.id,
        userId: response.data.settings?.userId,
        enabled: response.data.settings?.enabled ?? true,
        frequency: response.data.settings?.frequency || 'daily',
        customInterval: response.data.settings?.customInterval,
        preferredCategories: response.data.settings?.preferredCategories || [],
        notificationEnabled: response.data.settings?.notificationEnabled ?? true,
        displayOnLockScreen: response.data.settings?.displayOnLockScreen ?? false,
        createdAt: response.data.settings?.createdAt,
        updatedAt: response.data.settings?.updatedAt
      };

      userSettings.value = updatedSettings;
      return updatedSettings;
    } catch (error) {
      // Fallback aux paramètres actuels ou aux paramètres par défaut
      const fallbackSettings: UserPositiveThoughtSetting = {
        ...settings,
        enabled: settings.enabled ?? true,
        frequency: settings.frequency || 'daily',
        preferredCategories: settings.preferredCategories || [],
        notificationEnabled: settings.notificationEnabled ?? true,
        displayOnLockScreen: settings.displayOnLockScreen ?? false,
        updatedAt: new Date().toISOString()
      };

      userSettings.value = fallbackSettings;
      return fallbackSettings;
    } finally {
      isLoading.value = false;
    }
  };

  // Initialize
  const initialize = async () => {
    try {
      await Promise.all([
        getRandomPositiveThought(),
        getUserSettings()
      ]);
    } catch (error) {
      console.error('Failed to initialize positive thought store:', error);
    }
  };

  return {
    // State
    currentThought,
    userSettings,
    allThoughts,
    categories,
    isLoading,

    // Actions
    getRandomPositiveThought,
    getAllThoughts,
    getThoughtsByCategory,
    createThought,
    getUserSettings,
    updateUserSettings,
    initialize
  };
});
