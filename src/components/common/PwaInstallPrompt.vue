<template>
  <div v-if="show" class="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-800 shadow-lg z-50 border-t border-gray-200 dark:border-gray-700">
    <div class="max-w-md mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <img src="@/assets/img/logo.png" alt="ZenLife" class="h-12 w-12" />
        </div>
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Installer ZenLife</h3>
          <p class="text-sm text-gray-500 dark:text-gray-300">Installez notre application pour un accès rapide et une utilisation hors ligne.</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="onClose"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          aria-label="Fermer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          @click="installApp"
          class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Installer
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

// Define component props and emits
const props = defineProps({
  timeout: {
    type: Number,
    default: 5000
  }
});

const emit = defineEmits(['close', 'install']);

// Component state
const show = ref(true);
let deferredPrompt: any = null;

// Close the prompt
const onClose = () => {
  show.value = false;
  emit('close');
};

// Install the app
const installApp = async () => {
  if (!deferredPrompt) {
    return;
  }

  // Show the installation prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;

  // Clear the saved prompt since it can't be used again
  deferredPrompt = null;

  // Hide the installation prompt
  show.value = false;

  // Emit install event with the outcome
  emit('install', outcome);
};

onMounted(() => {
  // Capture the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
  });

  // Hide the prompt after timeout
  if (props.timeout > 0) {
    setTimeout(() => {
      show.value = false;
    }, props.timeout);
  }
});
</script>
