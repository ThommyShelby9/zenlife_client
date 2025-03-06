<template>
  <div class="notification-settings">
    <div v-if="!isNotificationSupported" class="text-yellow-600 dark:text-yellow-400 mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
      <ExclamationIcon class="h-5 w-5 inline-block mr-2" />
      Les notifications ne sont pas prises en charge par votre navigateur.
    </div>

    <div v-else-if="notificationPermission === 'denied'" class="text-yellow-600 dark:text-yellow-400 mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
      <ExclamationIcon class="h-5 w-5 inline-block mr-2" />
      Les notifications sont bloquées. Veuillez modifier les paramètres de votre navigateur pour les autoriser.
    </div>

    <div class="flex items-center justify-between">
      <label for="notif-enabled" class="block text-base font-medium text-gray-700 dark:text-gray-300">
        Activer les notifications
      </label>
      <Switch
        v-model="isNotificationsEnabled"
        :class="isNotificationsEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'"
        class="relative inline-flex h-7 w-14 items-center rounded-full"
        :disabled="!isNotificationSupported || notificationPermission === 'denied'"
      >
        <span class="sr-only">Activer les notifications</span>
        <span
          :class="isNotificationsEnabled ? 'translate-x-8' : 'translate-x-1'"
          class="inline-block h-5 w-5 transform rounded-full bg-white transition"
        />
      </Switch>
    </div>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Recevez des notifications avec des pensées positives
    </p>

    <div v-if="isNotificationsEnabled" class="mt-5">
      <label for="frequency" class="block text-base font-medium text-gray-700 dark:text-gray-300">
        Fréquence des notifications
      </label>
      <select
        id="frequency"
        v-model="frequency"
        class="mt-2 block w-full rounded-md border-gray-300 dark:border-gray-700 py-3 pl-4 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-base dark:bg-gray-700 dark:text-white"
      >
        <option value="hourly">Toutes les heures</option>
        <option value="daily">Une fois par jour</option>
        <option value="custom">Personnalisée</option>
      </select>
    </div>

    <div v-if="isNotificationsEnabled && frequency === 'custom'" class="mt-5">
      <label for="custom-interval" class="block text-base font-medium text-gray-700 dark:text-gray-300">
        Intervalle personnalisé (minutes)
      </label>
      <input
        id="custom-interval"
        v-model="customInterval"
        type="number"
        min="15"
        max="1440"
        class="mt-2 block w-full rounded-md border-gray-300 dark:border-gray-700 py-3 px-4 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-base dark:bg-gray-700 dark:text-white"
      />
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Minimum 15 minutes, maximum 24 heures (1440 minutes)
      </p>
    </div>

    <div v-if="isNotificationsEnabled && isPwaInstalled" class="mt-5">
      <div class="flex items-center justify-between">
        <label for="display-on-lock" class="block text-base font-medium text-gray-700 dark:text-gray-300">
          Afficher sur écran verrouillé
        </label>
        <Switch
          v-model="displayOnLockScreen"
          :class="displayOnLockScreen ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'"
          class="relative inline-flex h-7 w-14 items-center rounded-full"
        >
          <span class="sr-only">Afficher sur écran verrouillé</span>
          <span
            :class="displayOnLockScreen ? 'translate-x-8' : 'translate-x-1'"
            class="inline-block h-5 w-5 transform rounded-full bg-white transition"
          />
        </Switch>
      </div>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Afficher les pensées positives sur l'écran de verrouillage (fonctionne uniquement avec l'application installée)
      </p>
    </div>

    <!-- Nouveau composant pour les notifications push -->
    <div class="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
      <PushNotificationToggle v-model="pushNotificationsEnabled" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Switch } from '@headlessui/vue';
import { ExclamationIcon } from '@heroicons/vue/solid';
import PushNotificationToggle from '@/components/notification/PushNotificationToggle.vue';

// Définir une interface qui étend Navigator pour inclure la propriété standalone
interface SafariNavigator extends Navigator {
  standalone?: boolean;
}

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

// État
const isNotificationSupported = ref(false);
const notificationPermission = ref('default');
const isPwaInstalled = ref(false);

// Propriétés calculées pour synchroniser avec v-model
const isNotificationsEnabled = computed({
  get: () => props.modelValue.notificationEnabled ?? false,
  set: (value) => {
    emit('update:modelValue', { ...props.modelValue, notificationEnabled: value });

    // Si on active les notifications, demander la permission
    if (value && notificationPermission.value === 'default') {
      demanderPermissionNotification();
    }
  }
});

const frequency = computed({
  get: () => props.modelValue.frequency ?? 'daily',
  set: (value) => emit('update:modelValue', { ...props.modelValue, frequency: value })
});

const customInterval = computed({
  get: () => props.modelValue.customInterval ?? 30,
  set: (value) => emit('update:modelValue', { ...props.modelValue, customInterval: value })
});

const displayOnLockScreen = computed({
  get: () => props.modelValue.displayOnLockScreen ?? false,
  set: (value) => emit('update:modelValue', { ...props.modelValue, displayOnLockScreen: value })
});

// Nouvelle propriété pour les notifications push
const pushNotificationsEnabled = computed({
  get: () => props.modelValue.pushNotificationsEnabled ?? false,
  set: (value) => emit('update:modelValue', { ...props.modelValue, pushNotificationsEnabled: value })
});

// Vérifier si les notifications sont supportées
const verifierSupportNotifications = () => {
  isNotificationSupported.value = 'Notification' in window;
  if (isNotificationSupported.value) {
    notificationPermission.value = Notification.permission;
  }
};

// Demander la permission pour les notifications
const demanderPermissionNotification = async () => {
  if (!isNotificationSupported.value) return;

  try {
    const permission = await Notification.requestPermission();
    notificationPermission.value = permission;
  } catch (error) {
    console.error('Erreur lors de la demande de permission pour les notifications:', error);
  }
};

// Vérifier si la PWA est installée
const verifierInstallationPwa = () => {
  // Méthode 1: Vérifier le mode d'affichage
  if (window.matchMedia('(display-mode: standalone)').matches) {
    isPwaInstalled.value = true;
    return;
  }

  // Méthode 2: Vérifier pour iOS "Ajouter à l'écran d'accueil"
  // Cast navigator en SafariNavigator pour accéder à la propriété standalone
  const safariNavigator = window.navigator as SafariNavigator;
  if (safariNavigator.standalone === true) {
    isPwaInstalled.value = true;
    return;
  }

  isPwaInstalled.value = false;
};

// Observer les changements de permission
watch(notificationPermission, (nouvellePermission) => {
  if (nouvellePermission !== 'granted' && isNotificationsEnabled.value) {
    emit('update:modelValue', { ...props.modelValue, notificationEnabled: false });
  }
});

// Initialiser
onMounted(() => {
  verifierSupportNotifications();
  verifierInstallationPwa();

  // Si les notifications sont activées mais pas de permission, la demander
  if (isNotificationsEnabled.value && notificationPermission.value === 'default') {
    demanderPermissionNotification();
  }

  // Écouter les événements d'installation de PWA
  window.addEventListener('appinstalled', () => {
    isPwaInstalled.value = true;
  });
});
</script>
