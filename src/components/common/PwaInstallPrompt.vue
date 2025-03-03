<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-lg rounded-t-lg z-50 transform transition-transform" :class="{ 'translate-y-0': show, 'translate-y-full': !show }">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <img src="/public/img/logo.png" alt="ZenLife" class="w-12 h-12 mr-3">
        <div>
          <h3 class="font-semibold text-lg dark:text-white">Installer ZenLife</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">Accès rapide et expérience optimisée</p>
        </div>
      </div>
      <div class="flex">
        <button @click="close" class="mr-2 px-4 py-2 text-gray-500 dark:text-gray-400">
          Plus tard
        </button>
        <button @click="install" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">
          Installer
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Définir une interface qui étend Navigator pour inclure la propriété standalone
interface SafariNavigator extends Navigator {
  standalone?: boolean;
}

const props = defineProps({
  deferredPrompt: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'installed']);

const show = ref(false);

onMounted(() => {
  // Cast navigator avec notre interface étendue
  const safariNavigator = window.navigator as SafariNavigator;

  // Utiliser la propriété typée
  const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                      safariNavigator.standalone === true;

  // Le reste reste inchangé
  if (!isInstalled && props.deferredPrompt) {
    setTimeout(() => {
      show.value = true;
    }, 3000);
  }

  window.addEventListener('appinstalled', () => {
    show.value = false;
    emit('installed');
    console.log('PWA was installed');
  });
});

const install = async () => {
  if (!props.deferredPrompt) return;

  props.deferredPrompt.prompt();

  const choiceResult = await props.deferredPrompt.userChoice;

  if (choiceResult.outcome === 'accepted') {
    console.log('User accepted the install prompt');
  } else {
    console.log('User dismissed the install prompt');
  }

  close();
};

const close = () => {
  show.value = false;
  emit('close');
};
</script>
