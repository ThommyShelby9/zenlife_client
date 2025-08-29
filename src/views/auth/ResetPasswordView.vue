<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- ResetPassword.vue - Version améliorée avec indicateur d'étapes -->
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <a href="/" class="flex justify-center">
        <img class="h-16 w-auto" src="@/assets/img/logo.png" alt="ZenLife" />
      </a>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        Réinitialisation du mot de passe
      </h2>

      <!-- Indicateur d'étapes -->
      <div class="mt-6 flex justify-center">
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-medium">
              1
            </div>
            <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Code</span>
          </div>
          <div class="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
          <div class="flex items-center">
            <div :class="[
              'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
              codeValidated
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            ]">
              2
            </div>
            <span :class="[
              'ml-2 text-sm',
              codeValidated
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400'
            ]">
              Nouveau mot de passe
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Success Message -->
        <div v-if="resetSuccess" class="rounded-md bg-green-50 dark:bg-green-900 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <CheckCircleIcon class="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                Mot de passe réinitialisé
              </h3>
              <div class="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>
                  Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.
                </p>
              </div>
              <div class="mt-4">
                <RouterLink
                  to="/auth/login"
                  class="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300"
                >
                  Aller à la page de connexion →
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Form -->
        <form v-else class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Étape 1: Code de vérification -->
          <div>
            <label for="code" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Code de vérification
            </label>
            <div class="mt-1 relative">
              <input
                id="code"
                v-model="verificationCode"
                name="code"
                type="text"
                maxlength="8"
                placeholder="Ex: A1B2C3D4"
                :disabled="codeValidated"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white text-center font-mono text-lg tracking-widest uppercase disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:text-gray-500"
                @input="formatCode"
              />
              <!-- Checkmark icon when validated -->
              <div v-if="codeValidated" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <CheckCircleIcon class="h-5 w-5 text-green-500" />
              </div>
            </div>
            <p v-if="errors.code" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.code }}</p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Saisissez le code à 8 caractères reçu par email
            </p>
          </div>

          <!-- Étape 2: Nouveaux mots de passe (visible seulement si code validé) -->
          <div v-if="codeValidated" class="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nouveau mot de passe
              </label>
              <div class="mt-1 relative">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  name="password"
                  placeholder="Au moins 8 caractères"
                  required
                  class="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  <EyeOffIcon v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              <p v-if="errors.password" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.password }}</p>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmer le mot de passe
              </label>
              <div class="mt-1 relative">
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  name="confirmPassword"
                  placeholder="Confirmez votre mot de passe"
                  required
                  class="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  <EyeOffIcon v-else class="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              <p v-if="errors.confirmPassword" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.confirmPassword }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-3">
            <!-- Bouton de validation du code -->
            <button
              v-if="!codeValidated"
              type="button"
              @click="validateCode"
              :disabled="isLoading || !verificationCode || verificationCode.length !== 8"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Validation en cours...' : 'Valider le code' }}
            </button>

            <!-- Bouton de réinitialisation -->
            <button
              v-else
              type="submit"
              :disabled="isLoading || !password || !confirmPassword"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isLoading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe' }}
            </button>
          </div>

          <!-- Navigation -->
          <div class="text-sm text-center space-y-2 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div>
              <RouterLink
                to="/auth/login"
                class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                ← Retour à la connexion
              </RouterLink>
            </div>
            <div v-if="!codeValidated">
              <RouterLink
                to="/auth/forgot-password"
                class="font-medium text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                Renvoyer un nouveau code
              </RouterLink>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Info supplémentaire -->
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <InformationCircleIcon class="h-5 w-5 text-blue-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm text-blue-700 dark:text-blue-300">
              Votre code de vérification expire dans <strong>1 heure</strong>.
              Si vous ne l'avez pas reçu, vérifiez vos spams.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { authApi } from '@/api/auth';
import {
  CheckCircleIcon,
  InformationCircleIcon,
  EyeIcon,
  EyeOffIcon
} from '@heroicons/vue/outline';

// Router
const router = useRouter();

// Component state
const verificationCode = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const resetSuccess = ref(false);
const codeValidated = ref(false);
const errors = reactive({
  code: '',
  password: '',
  confirmPassword: '',
});

// Composables
const toast = useToast();

// Computed
const isCodeComplete = computed(() => {
  return verificationCode.value.length === 8;
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isPasswordValid = computed(() => {
  return password.value.length >= 8 &&
         confirmPassword.value.length >= 8 &&
         password.value === confirmPassword.value;
});

// Format code input (uppercase and alphanumeric only)
const formatCode = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value = target.value.toUpperCase();

  // Remove non-alphanumeric characters
  value = value.replace(/[^A-Z0-9]/g, '');

  // Limit to 8 characters
  if (value.length > 8) {
    value = value.substring(0, 8);
  }

  verificationCode.value = value;
  target.value = value;

  // Clear code error when typing
  if (errors.code) {
    errors.code = '';
  }
};

// Validate verification code
const validateCode = async () => {
  try {
    errors.code = '';

    if (!verificationCode.value || verificationCode.value.length !== 8) {
      errors.code = 'Le code doit contenir exactement 8 caractères';
      return;
    }

    isLoading.value = true;

    await authApi.validateResetCode({ code: verificationCode.value });

    codeValidated.value = true;
    toast.success('✓ Code validé avec succès');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Code validation error:', error);

    if (error.response) {
      const { data } = error.response;

      switch (data.message) {
        case 'Code invalide ou expiré':
          errors.code = 'Ce code est invalide ou a expiré';
          break;
        case 'Utilisateur non trouvé':
          errors.code = 'Code introuvable';
          break;
        default:
          errors.code = data.message || 'Code invalide';
      }
    } else {
      errors.code = 'Erreur de connexion. Vérifiez votre connexion internet.';
    }
  } finally {
    isLoading.value = false;
  }
};

// Submit password reset
const handleSubmit = async () => {
  if (!codeValidated.value) {
    await validateCode();
    return;
  }

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

    // Submit request
    await authApi.resetPassword({
      code: verificationCode.value,
      password: password.value,
    });

    // Show success
    resetSuccess.value = true;
    toast.success('🎉 Mot de passe réinitialisé avec succès !');

    // Redirect after 3 seconds
    setTimeout(() => {
      router.push('/auth/login');
    }, 3000);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Password reset error:', error);

    // Handle API errors
    if (error.response) {
      const { data } = error.response;

      if (data.message?.includes('Code invalide') || data.message?.includes('expiré')) {
        errors.code = 'Code invalide ou expiré. Veuillez demander un nouveau code.';
        codeValidated.value = false;
      } else {
        toast.error(data.message || 'Une erreur est survenue lors de la réinitialisation');
      }
    } else {
      toast.error('Erreur de connexion. Vérifiez votre connexion internet.');
    }
  } finally {
    isLoading.value = false;
  }
};

// Reset code validation when code changes
const resetCodeValidation = () => {
  codeValidated.value = false;
  password.value = '';
  confirmPassword.value = '';
  errors.code = '';
  errors.password = '';
  errors.confirmPassword = '';
};

// Watch for code changes to reset validation
watch(verificationCode, (newValue, oldValue) => {
  if (codeValidated.value && newValue !== oldValue) {
    resetCodeValidation();
  }
});

// Clear password errors when typing
watch(password, () => {
  if (errors.password) {
    errors.password = '';
  }
  if (errors.confirmPassword && confirmPassword.value) {
    errors.confirmPassword = '';
  }
});

watch(confirmPassword, () => {
  if (errors.confirmPassword) {
    errors.confirmPassword = '';
  }
});

// Auto-submit when code is complete and validated
watch([isCodeComplete, codeValidated], ([complete, validated]) => {
  if (complete && !validated && !isLoading.value) {
    validateCode();
  }
});
</script>

<style scoped>
/* Animations pour les transitions */
.v-enter-active, .v-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.v-enter-from, .v-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Style pour le champ de code */
input[type="text"]:disabled {
  cursor: not-allowed;
}

/* Animation du spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
