<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-24 w-auto" src="@/assets/img/logo.png" alt="ZenLife" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        Vérification de votre email
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="isLoading" class="text-center">
          <svg class="animate-spin h-10 w-10 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Vérification de votre email en cours...
          </p>
        </div>

        <div v-else-if="error" class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
            <svg class="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div class="mt-3 text-center">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Erreur de vérification</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ error }}
              </p>
            </div>
            <div class="mt-6">
              <button @click="verifyEmail" class="mr-4 text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Réessayer
              </button>
              <router-link to="/auth/login" class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Retour à la page de connexion
              </router-link>
            </div>
          </div>
        </div>

        <div v-else class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
            <svg class="h-6 w-6 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="mt-3 text-center">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Email vérifié avec succès</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter à votre compte.
              </p>
            </div>
            <div class="mt-6">
              <router-link
                to="/auth/login"
                class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Se connecter
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authApi } from '@/api/auth';
import { useToast } from 'vue-toastification';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const isLoading = ref(true);
const error = ref<string | null>(null);
const token = ref<string | null>(null);

const verifyEmail = async () => {
  isLoading.value = true;
  error.value = null;

  // Extraire le token de l'URL
  token.value = route.params.token as string;
  console.log('Token de vérification:', token.value);

  if (!token.value) {
    error.value = "Token de vérification manquant";
    isLoading.value = false;
    return;
  }

  try {
    // Traitement manuel de l'URL si nécessaire
    // Cette partie est cruciale si le routeur a des problèmes pour extraire le token
    if (!token.value && window.location.pathname.includes('/verify-email/')) {
      const parts = window.location.pathname.split('/');
      const tokenIndex = parts.findIndex(part => part === 'verify-email') + 1;
      if (tokenIndex > 0 && tokenIndex < parts.length) {
        token.value = parts[tokenIndex];
        console.log('Token extrait manuellement:', token.value);
      }
    }

    // S'assurer d'avoir un token
    if (!token.value) {
      throw new Error('Impossible d\'extraire le token de vérification de l\'URL');
    }

    // Appel explicite avec try/catch distinct pour isoler les problèmes
    try {
      console.log('Appel API avec token:', token.value);
      const response = await authApi.verifyEmail(token.value);
      console.log('Réponse du serveur:', response.data);

      // Vérifier que la réponse indique un succès
      if (response.data && response.data.status === 'success') {
        toast.success(response.data.message || "Votre email a été vérifié avec succès !");
        isLoading.value = false;

        // Attendre un peu avant de rediriger
        setTimeout(() => {
          router.push('/auth/login?verified=true');
        }, 2000);
      } else {
        throw new Error('Réponse inattendue du serveur');
      }
    } catch (apiError: any) {
      console.error('Erreur spécifique à l\'appel API:', apiError);
      throw apiError; // Propager l'erreur au bloc catch principal
    }
  } catch (err: any) {
    console.error('Erreur de vérification:', err);

    if (err.response && err.response.data && err.response.data.message) {
      error.value = err.response.data.message;
      toast.error(error.value);
    } else if (err.message) {
      error.value = err.message;
      toast.error(error.value);
    } else {
      error.value = "Une erreur est survenue lors de la vérification de votre email.";
      toast.error(error.value);
    }

    isLoading.value = false;
  }
};

onMounted(() => {
  // Déboguer l'URL pour identifier le problème
  console.log('URL complète:', window.location.href);
  console.log('Pathname:', window.location.pathname);
  console.log('Route params:', route.params);

  // Lancer la vérification après un court délai pour s'assurer que tout est chargé
  setTimeout(() => {
    verifyEmail();
  }, 500);
});
</script>
