<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-24 w-auto" src="/img/logo.svg" alt="ZenLife" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Mot de passe oublié</h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="emailSent" class="rounded-md bg-green-50 dark:bg-green-900 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800 dark:text-green-200">E-mail envoyé</h3>
              <div class="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>
                  Un e-mail a été envoyé à {{ email }}. Veuillez suivre les instructions pour réinitialiser votre mot de passe.
                </p>
              </div>
              <div class="mt-4">
                <RouterLink
                  to="/auth/login"
                  class="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300"
                >
                  Retour à la page de connexion
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <form v-else class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Adresse e-mail</label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
            <p v-if="errors.email" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.email }}</p>
          </div>

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation' }}
            </button>
          </div>

          <div class="text-sm text-center">
            <RouterLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              Retour à la connexion
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import { authApi } from '@/api/auth';
import { CheckCircleIcon } from '@heroicons/vue/outline';

// Component state
const email = ref('');
const isLoading = ref(false);
const emailSent = ref(false);
const errors = reactive({
  email: '',
});

// Composables
const toast = useToast();

// Submit handler
const handleSubmit = async () => {
  try {
    // Reset errors
    errors.email = '';

    // Validate form
    if (!email.value) {
      errors.email = 'L\'email est requis';
      return;
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      errors.email = 'L\'email est invalide';
      return;
    }

    // Start loading
    isLoading.value = true;

    // Submit request
    await authApi.forgotPassword({ email: email.value });

    // Show success
    emailSent.value = true;
  } catch (error: any) {
    console.error('Password reset request error:', error);

    // Handle API errors
    if (error.response) {
      const { data } = error.response;
      if (data.message === 'Utilisateur non trouvé') {
        errors.email = 'Aucun compte associé à cette adresse e-mail';
      } else {
        toast.error(data.message || 'Une erreur est survenue lors de l\'envoi du lien de réinitialisation');
      }
    } else {
      toast.error('Une erreur est survenue lors de l\'envoi du lien de réinitialisation');
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
