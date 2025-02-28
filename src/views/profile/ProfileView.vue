<template>
  <DashboardLayout>
    <div class="mx-auto px-4 sm:px-6 md:px-8">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Mon profil</h1>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="mt-8 flex justify-center">
        <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else class="mt-6">
        <!-- Profile overview -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div class="md:flex">
            <div class="md:w-1/3 p-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
              <div class="relative group">
                <img
                  v-if="user.profilePictureUrl"
                  :src="user.profilePictureUrl"
                  alt="Profile picture"
                  class="h-32 w-32 rounded-full object-cover"
                />
                <div
                  v-else
                  class="h-32 w-32 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
                >
                  <span class="text-3xl font-medium text-primary-800 dark:text-primary-200">
                    {{ userInitials }}
                  </span>
                </div>
                <div
                  class="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  @click="openProfilePictureUpload"
                >
                  <CameraIcon class="h-6 w-6 text-white" />
                </div>
              </div>
              <h2 class="mt-4 text-xl font-medium text-gray-900 dark:text-white">
                {{ user.fullName }}
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                @{{ user.username }}
              </p>
              <div class="mt-6 flex flex-col w-full space-y-2">
                <RouterLink
                  to="/settings"
                  class="inline-flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <CogIcon class="h-5 w-5 mr-2" />
                  Paramètres
                </RouterLink>
                <button
                  @click="showChangePasswordModal = true"
                  class="inline-flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <LockClosedIcon class="h-5 w-5 mr-2" />
                  Changer de mot de passe
                </button>
              </div>
            </div>
            <div class="md:w-2/3 p-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Informations personnelles</h3>
              <div class="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <dl class="divide-y divide-gray-200 dark:divide-gray-700">
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Nom complet</dt>
                    <dd class="text-sm text-gray-900 dark:text-white">{{ user.fullName }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Nom d'utilisateur</dt>
                    <dd class="text-sm text-gray-900 dark:text-white">{{ user.username }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                    <dd class="text-sm text-gray-900 dark:text-white">{{ user.email }}</dd>
                  </div>
                  <div class="py-3 flex justify-between">
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Membre depuis</dt>
                    <dd class="text-sm text-gray-900 dark:text-white">{{ formatDate(user.createdAt) }}</dd>
                  </div>
                </dl>
              </div>

              <div class="mt-6 flex justify-end">
                <button
                  @click="showEditProfileModal = true"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PencilIcon class="h-4 w-4 mr-2" />
                  Modifier le profil
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity & Stats -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Statistics cards -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-md p-3">
                <CheckCircleIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Tâches complétées
                  </dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ stats.completedTasks }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
                <CashIcon class="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Budgets respectés
                  </dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ stats.budgetsInRange }}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-md p-3">
                <UserGroupIcon class="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Amis
                  </dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ stats.friendsCount }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden file input for profile picture upload -->
    <input
      ref="profilePictureInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleProfilePictureUpload"
    />

    <!-- Edit Profile Modal -->
    <TransitionRoot appear :show="showEditProfileModal" as="template">
      <Dialog as="div" @close="showEditProfileModal = false" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Modifier le profil
                </DialogTitle>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="full-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nom complet
                    </label>
                    <input
                      id="full-name"
                      v-model="profileForm.fullName"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nom d'utilisateur
                    </label>
                    <div class="mt-1 flex rounded-md shadow-sm">
                      <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                        @
                      </span>
                      <input
                        id="username"
                        v-model="profileForm.username"
                        type="text"
                        class="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="showEditProfileModal = false"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="updateProfile"
                    :disabled="isUpdating"
                  >
                    <span v-if="isUpdating" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mise à jour...
                    </span>
                    <span v-else>Mettre à jour</span>
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Change Password Modal -->
    <TransitionRoot appear :show="showChangePasswordModal" as="template">
      <Dialog as="div" @close="showChangePasswordModal = false" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Changer le mot de passe
                </DialogTitle>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="current-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mot de passe actuel
                    </label>
                    <input
                      id="current-password"
                      v-model="passwordForm.currentPassword"
                      type="password"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label for="new-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nouveau mot de passe
                    </label>
                    <input
                      id="new-password"
                      v-model="passwordForm.newPassword"
                      type="password"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                      id="confirm-password"
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div v-if="passwordError" class="text-sm text-red-600 dark:text-red-400">
                    {{ passwordError }}
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="showChangePasswordModal = false"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="changePassword"
                    :disabled="isChangingPassword"
                  >
                    <span v-if="isChangingPassword" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Modification...
                    </span>
                    <span v-else>Changer le mot de passe</span>
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </DashboardLayout>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import {
  PencilIcon,
  CameraIcon,
  CogIcon,
  LockClosedIcon,
  CheckCircleIcon,
  CashIcon,
  UserGroupIcon,
} from '@heroicons/vue/outline';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { formatDate } from '@/utils/formatters';
import { fileApi } from '@/api/file';
import { authApi } from '@/api/auth';
import type { User } from '@/types/auth';

// Stores and composables
const userStore = useUserStore();
const authStore = useAuthStore();
const toast = useToast();

// Component state
const isLoading = ref(true);
const showEditProfileModal = ref(false);
const showChangePasswordModal = ref(false);
const isUpdating = ref(false);
const isChangingPassword = ref(false);
const profilePictureInput = ref<HTMLInputElement | null>(null);
const passwordError = ref('');

// Forms
const profileForm = ref({
  fullName: '',
  username: '',
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// Stats
const stats = ref({
  completedTasks: 0,
  budgetsInRange: 0,
  friendsCount: 0,
});

// Computed properties
const user = computed(() => userStore.user || {} as User);

const userInitials = computed(() => {
  const fullName = user.value.fullName || '';
  const nameParts = fullName.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
});

// Methods
const openProfilePictureUpload = () => {
  if (profilePictureInput.value) {
    profilePictureInput.value.click();
  }
};

const handleProfilePictureUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const response = await fileApi.uploadProfilePicture(file);

    // Mise à jour du store
    if (userStore.user) {
      userStore.user = {
        ...userStore.user,
        profilePictureUrl: response.data.url
      };
    }

    toast.success('Photo de profil mise à jour avec succès');
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    toast.error('Erreur lors de la mise à jour de la photo de profil');
  } finally {
    // Reset file input
    if (target) {
      target.value = '';
    }
  }
};

const updateProfile = async () => {
  if (isUpdating.value) return;

  isUpdating.value = true;
  try {
    // Utilisez la méthode du store si elle existe
    const updatedUser = await userStore.updateProfile({
      fullName: profileForm.value.fullName,
      username: profileForm.value.username,
    });

    // Close modal
    showEditProfileModal.value = false;

    toast.success('Profil mis à jour avec succès');
  } catch (error) {
    console.error('Error updating profile:', error);
    toast.error('Erreur lors de la mise à jour du profil');
  } finally {
    isUpdating.value = false;
  }
};

const changePassword = async () => {
  if (isChangingPassword.value) return;

  // Reset error
  passwordError.value = '';

  // Validate form
  if (!passwordForm.value.currentPassword) {
    passwordError.value = 'Le mot de passe actuel est requis';
    return;
  }

  if (!passwordForm.value.newPassword) {
    passwordError.value = 'Le nouveau mot de passe est requis';
    return;
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Les mots de passe ne correspondent pas';
    return;
  }

  if (passwordForm.value.newPassword.length < 8) {
    passwordError.value = 'Le nouveau mot de passe doit contenir au moins 8 caractères';
    return;
  }

  isChangingPassword.value = true;
  try {
    await authApi.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    });

    // Reset form and close modal
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    showChangePasswordModal.value = false;

    toast.success('Mot de passe modifié avec succès');
  } catch (error: unknown) {
    console.error('Error changing password:', error);

    if (error instanceof Error && 'response' in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      if (apiError.response?.data?.message) {
        passwordError.value = apiError.response.data.message;
      } else {
        toast.error('Erreur lors de la modification du mot de passe');
      }
    } else {
      toast.error('Erreur lors de la modification du mot de passe');
    }
  } finally {
    isChangingPassword.value = false;
  }
};

const fetchUserStats = async () => {
  try {
    // These would be API calls in a real application
    // For now, we'll use dummy data
    stats.value = {
      completedTasks: 42,
      budgetsInRange: 85,
      friendsCount: 12,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
  }
};

onMounted(async () => {
  try {
    // Fetch current user if not already loaded
    if (!userStore.user) {
      await userStore.fetchCurrentUser();
    }

    // Initialize profile form
    if (userStore.user) {
      profileForm.value = {
        fullName: userStore.user.fullName,
        username: userStore.user.username,
      };
    }

    // Fetch user stats
    await fetchUserStats();
  } catch (error) {
    console.error('Error initializing profile view:', error);
    toast.error('Erreur lors du chargement du profil');
  } finally {
    isLoading.value = false;
  }
});

</script>
