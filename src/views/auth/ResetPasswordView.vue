<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-24 w-auto" src="/img/logo.svg" alt="ZenLife" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Réinitialisation du mot de passe</h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Veuillez définir votre nouveau mot de passe
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div v-if="resetSuccess" class="rounded-md bg-green-50 dark:bg-green-900 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800 dark:text-green-200">Mot de passe réinitialisé</h3>
              <div class="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>
                  Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                </p>
              </div>
              <div class="mt-4">
                <RouterLink
                  to="/auth/login"
                  class="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300"
                >
                  Aller à la page de connexion
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <form v-else class="space-y-6" @submit.prevent="handleSubmit">
          <div v-if="invalidToken" class="rounded-md bg-red-50 dark:bg-red-900 p-4 mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Lien invalide ou expiré</h3>
                <div class="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>Ce lien de réinitialisation de mot de passe est invalide ou a expiré.</p>
                </div>
                <div class="mt-4">
                  <RouterLink
                    to="/auth/forgot-password"
                    class="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
                  >
                    Demander un nouveau lien
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nouveau mot de passe</label>
              <div class="mt-1 relative">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  name="password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.password" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.password }}</p>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmer le mot de passe</label>
              <div class="mt-1 relative">
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  name="confirmPassword"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.confirmPassword" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.confirmPassword }}</p>
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
                {{ isLoading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { authApi } from '@/api/auth';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/outline';

// Component state
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const invalidToken = ref(false);
const resetSuccess = ref(false);
const errors = reactive({
  password: '',
  confirmPassword: '',
});

// Composables
const route = useRoute();
const toast = useToast();

// Check token on mount
onMounted(async () => {
  const token = route.query.token as string;

  if (!token) {
    invalidToken.value = true;
    return;
  }

  try {
    isLoading.value = true;
    // Validate token
    await authApi.validateToken(token);
  } catch (error) {
    console.error('Invalid token:', error);
    invalidToken.value = true;
  } finally {
    isLoading.value = false;
  }
});

// Submit handler
const handleSubmit = async () => {
  try {
    // Reset errors
    errors.password = '';
    errors.confirmPassword = '';

    // Validate form
    let isValid = true;

    if (!password.value) {
      errors.password = 'Le mot de passe est requis';
      isValid = false;
    } else if (password.value.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
      isValid = false;
    }

    if (!confirmPassword.value) {
      errors.confirmPassword = 'Veuillez confirmer votre mot de passe';
      isValid = false;
    } else if (password.value !== confirmPassword.value) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }

    if (!isValid) return;

    // Start loading
    isLoading.value = true;

    // Get token from URL
    const token = route.query.token as string;

    // Submit request
    await authApi.resetPassword({
      token,
      newPassword: password.value,
    });

    // Show success
    resetSuccess.value = true;
    toast.success('Votre mot de passe a été réinitialisé avec succès');
  } catch (error: any) {
    console.error('Password reset error:', error);

    // Handle API errors
    if (error.response) {
      const { data } = error.response;
      if (data.message === 'Token invalide ou expiré') {
        invalidToken.value = true;
      } else {
        toast.error(data.message || 'Une erreur est survenue lors de la réinitialisation du mot de passe');
      }
    } else {
      toast.error('Une erreur est survenue lors de la réinitialisation du mot de passe');
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
