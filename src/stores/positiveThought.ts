import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { PositiveThought, UserPositiveThoughtSetting } from '@/types/positiveThought';
import { positiveThoughtApi } from '@/api/positiveThought';
import { useNotificationStore } from '@/stores/notification';
import { useToast } from 'vue-toastification';

export const usePositiveThoughtStore = defineStore('positiveThought', () => {
  // State avec typage correct
  const currentThought = ref<PositiveThought | null>(null);
  const userSettings = ref<UserPositiveThoughtSetting | null>(null);
  const allThoughts = ref<PositiveThought[]>([]);
  const categories = ref<string[]>([]);
  const isLoading = ref<boolean>(false);

  // Services
  const notificationStore = useNotificationStore();
  const toast = useToast();

  // Actions
  const getRandomPositiveThought = async (category?: string | null) => {
    isLoading.value = true;
    try {
      const response = await positiveThoughtApi.getRandomThought(category || undefined);

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
      console.error('Erreur lors de la récupération d\'une pensée aléatoire:', error);

      // Pensée par défaut en cas d'erreur
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

  const getAllThoughts = async () => {
    isLoading.value = true;
    try {
      const response = await positiveThoughtApi.getAllThoughts();
      allThoughts.value = response.data;

      // Extraction des catégories uniques
      const categoriesUniques = new Set<string>();
      allThoughts.value.forEach(thought => {
        if (thought.category) {
          categoriesUniques.add(thought.category);
        }
      });
      categories.value = Array.from(categoriesUniques);

      return allThoughts.value;
    } catch (error) {
      console.error('Erreur lors de la récupération de toutes les pensées:', error);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const getThoughtsByCategory = async (category: string) => {
    isLoading.value = true;
    try {
      const response = await positiveThoughtApi.getThoughtsByCategory(category);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des pensées pour la catégorie ${category}:`, error);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const createThought = async (thought: PositiveThought) => {
    isLoading.value = true;
    try {
      const response = await positiveThoughtApi.createPositiveThought(thought);

      // Ajouter à la collection locale si succès
      const newThought = response.data.thought;
      if (newThought) {
        allThoughts.value = [newThought, ...allThoughts.value];

        // Ajouter la catégorie si nouvelle
        if (newThought.category && !categories.value.includes(newThought.category)) {
          categories.value.push(newThought.category);
        }
      }

      return newThought;
    } catch (error) {
      console.error('Erreur lors de la création d\'une pensée:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const getUserSettings = async () => {
    isLoading.value = true;
    try {
      const response = await positiveThoughtApi.getUserSettings();
      userSettings.value = response.data;
      return userSettings.value;
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres utilisateur:', error);

      // Paramètres par défaut en cas d'erreur
      const defaultSettings: UserPositiveThoughtSetting = {
        id: undefined,
        userId: undefined,
        enabled: true,
        frequency: 'daily',
        customInterval: 30, // 30 minutes par défaut
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

  const updateUserSettings = async (settings: UserPositiveThoughtSetting) => {
    isLoading.value = true;
    try {
      // Mettre à jour les paramètres
      const response = await positiveThoughtApi.updateUserSettings(settings);

      // Mettre à jour l'état local
      if (response.data && response.data.settings) {
        userSettings.value = response.data.settings;
      }

      // Mettre à jour les abonnements aux notifications
      if (settings.notificationEnabled) {
        await updateNotificationSubscription(settings);
      }

      return userSettings.value;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres utilisateur:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Mettre à jour l'abonnement aux notifications
  const updateNotificationSubscription = async (settings: UserPositiveThoughtSetting) => {
    try {
      // Créer un objet qui correspond au format attendu par l'API
      const notificationSettings = {
        notificationEnabled: settings.notificationEnabled,
        frequency: settings.frequency,
        customInterval: settings.customInterval || 30, // Valeur par défaut si manquante
        displayOnLockScreen: settings.displayOnLockScreen || false,
        preferredCategories: settings.preferredCategories || []
      };

      await positiveThoughtApi.subscribeToPositiveThoughtNotifications(notificationSettings);

      // Afficher un message de succès

      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des abonnements de notification:', error);

      // Afficher un message d'erreur
      toast.error('Impossible de mettre à jour les notifications');

      throw error;
    }
  };

  // Gérer une notification entrante de pensée positive
  const handlePositiveThoughtNotification = (notification: {
    type: string;
    data?: {
      thought?: PositiveThought
    };
    content: string;
  }) => {
    // Vérifier si c'est une notification de pensée positive
    if (notification.type === 'POSITIVE_THOUGHT') {
      // Mettre à jour la pensée actuelle si nécessaire
      if (notification.data?.thought) {
        currentThought.value = notification.data.thought;
      }

      // Afficher une notification visuelle
      toast.info(notification.content, {
        timeout: 10000, // 10 secondes
        closeOnClick: true,
        icon: '✨'
      });
    }
  };

  // Initialisation
  const initialize = async () => {
    try {
      await Promise.all([
        getRandomPositiveThought(null),
        getUserSettings()
      ]);

      // S'abonner aux notifications si activées
      if (userSettings.value?.notificationEnabled) {
        await updateNotificationSubscription(userSettings.value);
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du store des pensées positives:', error);
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
    updateNotificationSubscription,
    handlePositiveThoughtNotification,
    initialize
  };
});
