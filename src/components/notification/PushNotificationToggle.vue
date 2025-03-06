<!-- src/components/notifications/PushNotificationToggle.vue -->
<template>
  <div class="push-notification-toggle">
    <div class="flex items-center justify-between">
      <label for="push-notification-toggle" class="block text-base font-medium text-gray-700 dark:text-gray-300">
        Notifications Push
      </label>
      <Switch
        v-model="isPushEnabled"
        :class="isPushEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'"
        class="relative inline-flex h-7 w-14 items-center rounded-full"
        :disabled="!isSupported || isLoading"
      >
        <span class="sr-only">Activer les notifications Push</span>
        <span
          :class="isPushEnabled ? 'translate-x-8' : 'translate-x-1'"
          class="inline-block h-5 w-5 transform rounded-full bg-white transition"
        />
      </Switch>
    </div>

    <!-- Informations sur l'état des notifications -->
    <p v-if="isLoading" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      <span class="inline-block mr-1 animate-spin">⟳</span> Configuration des notifications...
    </p>
    <p v-else-if="!isSupported" class="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
      <ExclamationIcon class="h-4 w-4 inline-block mr-1" />
      Les notifications push ne sont pas prises en charge par votre navigateur.
    </p>
    <p v-else-if="permissionDenied" class="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
      <ExclamationIcon class="h-4 w-4 inline-block mr-1" />
      Veuillez autoriser les notifications dans les paramètres de votre navigateur.
    </p>
    <p v-else-if="isPushEnabled" class="mt-1 text-sm text-green-600 dark:text-green-400">
      Vous recevrez des notifications même lorsque l'application est fermée.
    </p>
    <p v-else class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Activez pour recevoir des pensées positives même lorsque l'application est fermée.
    </p>

    <!-- Bouton de test -->
    <button
      v-if="isPushEnabled && !isLoading && !isLocalDev"
      @click="testPushNotification"
      class="mt-3 inline-flex items-center px-3 py-1.5 text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 focus:outline-none border border-primary-300 dark:border-primary-700 rounded-md"
    >
      <BellIcon class="h-4 w-4 mr-1" />
      Tester la notification
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Switch } from '@headlessui/vue';
import { ExclamationIcon, BellIcon } from '@heroicons/vue/solid';
import { useToast } from 'vue-toastification';
import { pushNotificationService } from '@/services/pushNotificationService';
import apiClient from '@/api/index';

const toast = useToast();

// Props et emits
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

// État
const isLoading = ref(true);
const isSupported = ref(false);
const permissionDenied = ref(false);
const isLocalDev = ref(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Computed
const isPushEnabled = computed({
  get: () => props.modelValue,
  set: async (value) => {
    if (value === props.modelValue) return;

    isLoading.value = true;
    try {
      if (value) {
        // Activation des notifications
        const success = await pushNotificationService.requestPermissionAndSubscribe();
        if (success) {
          emit('update:modelValue', true);
          toast.success('Notifications activées avec succès');
        } else {
          // Si l'activation échoue, on remet l'état à false
          emit('update:modelValue', false);
          // Vérifier pourquoi l'activation a échoué
          checkPermissionStatus();
        }
      } else {
        // Désactivation des notifications
        await pushNotificationService.unsubscribe();
        emit('update:modelValue', false);
        toast.info('Notifications désactivées');
      }
    } catch (error) {
      console.error('Erreur lors de la modification des notifications:', error);
      toast.error('Une erreur est survenue lors de la configuration des notifications');
      emit('update:modelValue', false);
    } finally {
      isLoading.value = false;
    }
  }
});

// Méthodes
const checkPermissionStatus = () => {
  if (!('Notification' in window)) {
    isSupported.value = false;
    return;
  }

  isSupported.value = true;
  permissionDenied.value = Notification.permission === 'denied';
};

const testPushNotification = async () => {
  try {
    await apiClient.post('/notifications/test');
    toast.info('Notification de test envoyée. Vérifiez votre appareil.');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification de test:', error);
    toast.error('Erreur lors de l\'envoi de la notification de test');
  }
};

// Initialisation
onMounted(async () => {
  // Vérifier le support des notifications
  checkPermissionStatus();

  // Initialiser le service de notification
  if (isSupported.value) {
    try {
      // Vérifier l'état actuel de l'abonnement
      const status = await pushNotificationService.initialize();
      emit('update:modelValue', status);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des notifications:', error);
    }
  }

  isLoading.value = false;
});
</script>
