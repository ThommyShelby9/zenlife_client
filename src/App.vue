<template>
  <div class="min-h-screen" :class="{ 'dark': isDarkMode }">
    <RouterView />
    <!-- Utiliser un seul composant d'installation, pas les deux en même temps -->
    <InstallButton
      v-if="showInstallButton"
      :deferred-prompt="deferredInstallPrompt"
      @close="hideInstallPrompt"
    />
  </div>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useChatStore } from '@/stores/chat';
import { useNotificationStore } from '@/stores/notification';
import websocketService from '@/services/websocketService';
import InstallButton from './components/InstallButton.vue';

// Définir des interfaces pour les propriétés non-standard
interface ExtendedWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MSStream?: any;
}

interface SafariNavigator extends Navigator {
  standalone?: boolean;
}

const userStore = useUserStore();
const chatStore = useChatStore();
const notificationStore = useNotificationStore();
const isDarkMode = ref(false);

// Gestion PWA améliorée
const showInstallButton = ref(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deferredInstallPrompt = ref<any>(null);

const hideInstallPrompt = () => {
  showInstallButton.value = false;
};

// Fonction pour détecter iOS de manière sécurisée avec TypeScript
function detectIOS(): boolean {
  const userAgent = navigator.userAgent;
  const extWindow = window as ExtendedWindow;
  return /iPad|iPhone|iPod/.test(userAgent) && !extWindow.MSStream;
}

onMounted(() => {
  // Check user's theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  }

  // PWA installation event listener - avec logs de débogage
  console.log('Setting up beforeinstallprompt listener');
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt event captured!', e);
    e.preventDefault();
    deferredInstallPrompt.value = e;
    showInstallButton.value = true;
  });

  // Vérifier aussi si on est sur iOS
  const isIOS = detectIOS();
  const safariNavigator = navigator as SafariNavigator;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       safariNavigator.standalone;

  // Sur iOS, afficher le bouton d'installation sans attendre l'événement
  if (isIOS && !isStandalone) {
    console.log('iOS detected, showing install button');
    showInstallButton.value = true;
  }

  // Détecter si l'app est déjà installée
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('App already installed (standalone mode)');
  }

  // Load user if token exists
  const token = localStorage.getItem('token');
  if (token) {
    userStore.fetchCurrentUser().then(() => {
      // Initialize WebSocket connection
      initializeWebSockets();
    });
  }
});

// Watch for theme changes
watch(() => userStore.user?.themePreference, (newTheme) => {
  if (newTheme === 'dark') {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDarkMode.value = false;
    document.documentElement.classList.remove('dark');
  }
});

// Watch for auth state changes
watch(() => userStore.user, (newUser) => {
  if (newUser) {
    // User logged in, initialize WebSockets
    initializeWebSockets();
  } else {
    // User logged out, disconnect WebSockets
    websocketService.disconnect();
  }
});

// Initialize WebSocket connections
const initializeWebSockets = () => {
  if (userStore.user) {
    // Initialize the WebSocket connection using the service
    websocketService.init();

    // Initialize store listeners
    chatStore.initializeWebSocket();
    notificationStore.initializeNotificationWebSocket();
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: 'Inter', sans-serif;
}

.dark {
  color-scheme: dark;
}
</style>
