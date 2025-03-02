<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img class="mx-auto h-24 w-auto" src="@/assets/img/logo.png" alt="ZenLife" />
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Connexion à votre compte</h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Ou
        <router-link to="/auth/register" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
          créez un nouveau compte
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
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
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mot de passe</label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                autocomplete="current-password"
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

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-700 dark:bg-gray-700"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Se souvenir de moi</label>
            </div>

            <div class="text-sm">
              <router-link to="/auth/forgot-password" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Mot de passe oublié ?
              </router-link>
            </div>
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
              {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Ou continuer avec</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <!-- Social login buttons could go here -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/auth';

// Component state
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const errors = reactive({
  email: '',
  password: '',
});

// Composables
const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

// Login handler
const handleLogin = async () => {
  try {
    // Reset errors
    errors.email = '';
    errors.password = '';

    // Validate form
    let isValid = true;
    if (!email.value) {
      errors.email = 'L\'email est requis';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      errors.email = 'L\'email est invalide';
      isValid = false;
    }

    if (!password.value) {
      errors.password = 'Le mot de passe est requis';
      isValid = false;
    }

    if (!isValid) return;

    // Start loading
    isLoading.value = true;

    // Submit login
    const response = await authApi.login({
      email: email.value,
      password: password.value
    });

    // Handle successful login
    const { token, user } = response.data;

    // Save token in localStorage or sessionStorage
    if (rememberMe.value) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }

    // Update auth store
    authStore.setUser(user);
    authStore.setToken(token);
    authStore.setLoggedIn(true);

    // Show success message
    toast.success('Connexion réussie! Redirection en cours...');

    // Redirect to dashboard
    router.push('/dashboard');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Login error:', error);

    // Handle API errors
    if (error.response) {
      const { data } = error.response;
      if (data.message === 'Email ou mot de passe incorrect') {
        toast.error('Email ou mot de passe incorrect');
      } else {
        toast.error(data.message || 'Une erreur est survenue lors de la connexion');
      }
    } else {
      toast.error('Une erreur est survenue lors de la connexion');
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
