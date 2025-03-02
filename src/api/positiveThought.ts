/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './index';

// Conversion du format des paramètres frontend vers backend
const convertirParametresVersBackend = (parametres: { frequency: string; customInterval: number; preferredCategories: any[]; id: any; enabled: any; notificationEnabled: any; displayOnLockScreen: any; }) => {
  // Conversion de frequency vers frequencyPerDay
  let frequencyPerDay = 1; // Par défaut
  if (parametres.frequency === 'hourly') {
    frequencyPerDay = 24;
  } else if (parametres.frequency === 'daily') {
    frequencyPerDay = 1;
  } else if (parametres.frequency === 'custom' && parametres.customInterval) {
    // Convertir les minutes en fractions de jour
    const minutesParJour = 24 * 60;
    frequencyPerDay = Math.round(minutesParJour / parametres.customInterval);
  }

  // Conversion du tableau preferredCategories en chaîne séparée par des virgules
  const preferredCategories = parametres.preferredCategories && parametres.preferredCategories.length > 0
    ? parametres.preferredCategories.join(',')
    : 'all';

  return {
    id: parametres.id,
    enabled: parametres.enabled,
    frequencyPerDay,
    preferredCategories,
    notificationEnabled: parametres.notificationEnabled,
    displayOnLockScreen: parametres.displayOnLockScreen
  };
};

// Conversion du format des paramètres backend vers frontend
const convertirParametresVersFrontend = (parametresBackend: { frequencyPerDay: number; preferredCategories: string; id: any; userId: any; enabled: any; notificationEnabled: any; displayOnLockScreen: any; createdAt: any; updatedAt: any; }) => {
  if (!parametresBackend) return null;

  // Conversion de frequencyPerDay vers frequency et customInterval
  let frequency = 'daily';
  let customInterval = undefined;

  if (parametresBackend.frequencyPerDay >= 24) {
    frequency = 'hourly';
  } else if (parametresBackend.frequencyPerDay > 1) {
    frequency = 'custom';
    // Conversion en minutes
    const minutesParJour = 24 * 60;
    customInterval = Math.round(minutesParJour / parametresBackend.frequencyPerDay);
  }

  // Conversion de la chaîne preferredCategories en tableau
  const preferredCategories = parametresBackend.preferredCategories === 'all'
    ? []
    : parametresBackend.preferredCategories.split(',');

  return {
    id: parametresBackend.id,
    userId: parametresBackend.userId,
    enabled: parametresBackend.enabled,
    frequency,
    customInterval,
    preferredCategories,
    notificationEnabled: parametresBackend.notificationEnabled ?? true,
    displayOnLockScreen: parametresBackend.displayOnLockScreen ?? false,
    createdAt: parametresBackend.createdAt,
    updatedAt: parametresBackend.updatedAt
  };
};

export const positiveThoughtApi = {
  /**
   * Récupérer une pensée aléatoire
   */
  getRandomThought: (category: any) => {
    return apiClient.get(`/positive-thoughts/random${category ? `?category=${category}` : ''}`);
  },

  /**
   * Récupérer toutes les pensées
   */
  getAllThoughts: () => {
    return apiClient.get('/positive-thoughts');
  },

  /**
   * Récupérer les pensées par catégorie
   */
  getThoughtsByCategory: (category: any) => {
    return apiClient.get(`/positive-thoughts/category/${category}`);
  },

  /**
   * Créer une nouvelle pensée
   */
  createPositiveThought: (thought: any) => {
    return apiClient.post('/positive-thoughts', thought);
  },

  /**
   * Récupérer les paramètres utilisateur
   */
  getUserSettings: async () => {
    const response = await apiClient.get('/positive-thoughts/settings');
    // Conversion du format backend vers frontend
    response.data = convertirParametresVersFrontend(response.data);
    return response;
  },

  /**
   * Mettre à jour les paramètres utilisateur
   */
  updateUserSettings: async (settings: any) => {
    // Conversion du format frontend vers backend
    const parametresBackend = convertirParametresVersBackend(settings);
    const response = await apiClient.put('/positive-thoughts/settings', parametresBackend);
    // Conversion de la réponse vers le format frontend
    if (response.data && response.data.settings) {
      response.data.settings = convertirParametresVersFrontend(response.data.settings);
    }
    return response;
  },

  /**
   * S'abonner aux notifications push de pensées positives
   */
  subscribeToPositiveThoughtNotifications: (settings: { notificationEnabled: any; frequency: any; customInterval: any; displayOnLockScreen: any; preferredCategories: any[]; }) => {
    // Envoi des paramètres de notification au backend
    return apiClient.post('/notifications/subscribe/positive-thoughts', {
      enabled: settings.notificationEnabled,
      frequency: settings.frequency,
      customInterval: settings.customInterval,
      displayOnLockScreen: settings.displayOnLockScreen,
      preferredCategories: settings.preferredCategories && settings.preferredCategories.length > 0
        ? settings.preferredCategories.join(',')
        : 'all'
    });
  }
};
