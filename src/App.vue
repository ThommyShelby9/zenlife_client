<template>
  <div class="min-h-screen" :class="{ 'dark': isDarkMode }">
    <RouterView />
    <!-- Install PWA prompt component -->
    <PwaInstallPrompt v-if="showInstallPrompt" @close="hideInstallPrompt" />
  </div>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import PwaInstallPrompt from '@/components/common/PwaInstallPrompt.vue';
import { useUserStore } from '@/stores/user';
import { useChatStore } from '@/stores/chat';
import { useNotificationStore } from '@/stores/notification';
import websocketService from '@/services/websocketService';

const userStore = useUserStore();
const chatStore = useChatStore();
const notificationStore = useNotificationStore();
const isDarkMode = ref(false);
const showInstallPrompt = ref(false);

// PWA installation logic
let deferredPrompt: any = null;
const hideInstallPrompt = () => {
  showInstallPrompt.value = false;
};

onMounted(() => {
  // Check user's theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  }

  // PWA installation event listener
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallPrompt.value = true;
  });

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
