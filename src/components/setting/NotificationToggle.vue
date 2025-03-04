<!-- src/components/settings/NotificationToggle.vue -->
<template>
  <div>
    <div class="flex items-center justify-between">
      <label for="notification-toggle" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Activer les notifications
      </label>
      <Switch
        v-model="isEnabled"
        :class="isEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'"
        class="relative inline-flex h-6 w-11 items-center rounded-full"
        :disabled="!isSupported || isLoading"
        @click="toggleNotifications"
      >
        <span class="sr-only">Activer les notifications</span>
        <span
          :class="isEnabled ? 'translate-x-6' : 'translate-x-1'"
          class="inline-block h-4 w-4 transform rounded-full bg-white transition"
        />
      </Switch>
    </div>

    <!-- Message d'information selon l'état -->
    <p v-if="isLoading" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Chargement des préférences de notification...
    </p>
    <p v-else-if="!isSupported" class="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
      Les notifications ne sont pas prises en charge par votre navigateur.
    </p>
    <p v-else-if="!isEnabled" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Activez les notifications pour être alerté même lorsque l'application est fermée.
    </p>
    <p v-else class="mt-1 text-sm text-green-600 dark:text-green-400">
      Vous recevrez des notifications même lorsque l'application est fermée.
    </p>

    <!-- Indicateur de mode développement -->
    <p v-if="isLocalDev" class="mt-1 text-xs text-orange-500 dark:text-orange-400">
      Mode développement local: les notifications sont simulées
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Switch } from '@headlessui/vue';
import { useToast } from 'vue-toastification';

// État
const isSupported = ref(true); // Considère toujours comme supporté en développement
const isEnabled = ref(false);
const isLoading = ref(true);
const isLocalDev = ref(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const toast = useToast();

// Clé de stockage local
const STORAGE_KEY = 'push_notifications_enabled';

// Fonction pour vérifier l'état actuel
const checkNotificationStatus = () => {
  // En développement local, simplement lire depuis localStorage
  const status = localStorage.getItem(STORAGE_KEY) === 'true';
  isEnabled.value = status;
  return status;
};

// Fonction pour activer/désactiver les notifications
const toggleNotifications = async () => {
  if (isLoading.value) return;

  isLoading.value = true;

  try {
    // Inverser l'état actuel
    const newState = !isEnabled.value;

    if (newState) {
      // En mode dev local, simule juste la permission
      if (isLocalDev.value) {
        localStorage.setItem(STORAGE_KEY, 'true');
        localStorage.setItem('fcm_token', 'local-dev-token');
        toast.success('Notifications activées (mode développement)');
      } else {
        // Demander la permission Notification (pas utilisé en dev)
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          localStorage.setItem(STORAGE_KEY, 'true');
        } else {
          toast.warning('Permission de notification refusée');
          localStorage.setItem(STORAGE_KEY, 'false');
        }
      }
    } else {
      // Désactiver
      localStorage.setItem(STORAGE_KEY, 'false');
      localStorage.removeItem('fcm_token');

      if (isLocalDev.value) {
        toast.info('Notifications désactivées (mode développement)');
      }
    }

    // Mettre à jour l'état
    isEnabled.value = localStorage.getItem(STORAGE_KEY) === 'true';

  } catch (error) {
    console.error('Erreur lors de la modification des notifications:', error);
    toast.error('Une erreur est survenue lors de la configuration des notifications');
  } finally {
    isLoading.value = false;
  }
};

// Initialisation au montage
onMounted(() => {
  setTimeout(() => {
    checkNotificationStatus();
    isLoading.value = false;

    if (isLocalDev.value) {
      console.log('Mode développement local activé pour les notifications');
    }
  }, 500); // Petit délai pour éviter les problèmes de chargement
});
</script>
