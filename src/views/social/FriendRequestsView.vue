<template>
  <DashboardLayout>
    <div class="mx-auto px-4 sm:px-6 md:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Demandes d'amis</h1>
        <RouterLink
          to="/social/friends"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <UserGroupIcon class="h-4 w-4 mr-2" />
          Mes amis
        </RouterLink>
      </div>

      <!-- Tabs -->
      <div class="mt-6 border-b border-gray-200 dark:border-gray-700">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'received'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center"
            :class="[
              activeTab === 'received'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
            ]"
          >
            Reçues
            <span v-if="receivedRequests.length > 0" class="ml-2 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              {{ receivedRequests.length }}
            </span>
          </button>
          <button
            @click="activeTab = 'sent'"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center"
            :class="[
              activeTab === 'sent'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
            ]"
          >
            Envoyées
            <span v-if="sentRequests.length > 0" class="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {{ sentRequests.length }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="mt-8 flex justify-center">
        <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Received requests tab -->
      <div v-else-if="activeTab === 'received'" class="mt-6">
        <div v-if="receivedRequests.length > 0" class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="request in receivedRequests" :key="request.id" class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <img
                      v-if="request.sender.profilePictureUrl"
                      :src="request.sender.profilePictureUrl"
                      alt="Profile"
                      class="h-12 w-12 rounded-full"
                    />
                    <div
                      v-else
                      class="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
                    >
                      <span class="text-primary-800 dark:text-primary-200 font-medium">
                        {{ getInitials(request.sender.fullName) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ request.sender.fullName }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ request.sender.username ? '@' + request.sender.username : '' }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Demande reçue {{ formatTimestamp(request.timestamp) }}
                    </p>
                  </div>
                </div>
                <div class="ml-4 flex-shrink-0 flex">
                  <button
                    @click="acceptFriendRequest(request)"
                    class="inline-flex items-center ml-3 px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    :disabled="actionInProgress[request.id]"
                  >
                    <CheckIcon v-if="!actionInProgress[request.id]" class="h-4 w-4 mr-1" />
                    <svg v-else class="animate-spin h-4 w-4 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ actionInProgress[request.id] ? 'En cours...' : 'Accepter' }}
                  </button>
                  <button
                    @click="rejectFriendRequest(request)"
                    class="inline-flex items-center ml-3 px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    :disabled="actionInProgress[request.id]"
                  >
                    <XIcon v-if="!actionInProgress[request.id]" class="h-4 w-4 mr-1" />
                    <svg v-else class="animate-spin h-4 w-4 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ actionInProgress[request.id] ? 'En cours...' : 'Refuser' }}
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Empty state for received requests -->
        <div v-else class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg py-8 px-4 text-center">
          <MailOpenIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune demande reçue</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Vous n'avez pas de demandes d'ami en attente.
          </p>
        </div>
      </div>

      <!-- Sent requests tab -->
      <div v-else-if="activeTab === 'sent'" class="mt-6">
        <div v-if="sentRequests.length > 0" class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="request in sentRequests" :key="request.id" class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <img
                      v-if="request.recipient.profilePictureUrl"
                      :src="request.recipient.profilePictureUrl"
                      alt="Profile"
                      class="h-12 w-12 rounded-full"
                    />
                    <div
                      v-else
                      class="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
                    >
                      <span class="text-primary-800 dark:text-primary-200 font-medium">
                        {{ getInitials(request.recipient.fullName) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ request.recipient.fullName }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ request.recipient.username ? '@' + request.recipient.username : '' }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Demande envoyée {{ formatTimestamp(request.timestamp) }}
                    </p>
                  </div>
                </div>
                <div class="ml-4 flex-shrink-0">
                  <button
                    @click="cancelFriendRequest(request)"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    :disabled="actionInProgress[request.id]"
                  >
                    <XIcon v-if="!actionInProgress[request.id]" class="h-4 w-4 mr-1" />
                    <svg v-else class="animate-spin h-4 w-4 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ actionInProgress[request.id] ? 'Annulation...' : 'Annuler' }}
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Empty state for sent requests -->
        <div v-else class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg py-8 px-4 text-center">
          <PaperAirplaneIcon class="mx-auto h-12 w-12 text-gray-400 transform rotate-90" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune demande envoyée</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Vous n'avez pas de demandes d'ami en attente.
          </p>
          <div class="mt-6">
            <RouterLink
              to="/social/friends"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <UserAddIcon class="h-4 w-4 mr-2" />
              Ajouter des amis
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  CheckIcon,
  MailOpenIcon,
  PaperAirplaneIcon,
  UserAddIcon,
  UserGroupIcon,
  XIcon,
} from '@heroicons/vue/outline';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useSocialStore } from '@/stores/social.ts';
import type { FriendRequest } from '@/types/social.ts';

// Store and composables
const socialStore = useSocialStore();
const toast = useToast();

// Component state
const isLoading = ref(true);
const activeTab = ref<'received' | 'sent'>('received');
const friendRequests = ref<FriendRequest[]>([]);
const actionInProgress = ref<Record<string, boolean>>({});

// Computed properties
const receivedRequests = computed(() => {
  return friendRequests.value.filter((request: { isOutgoing: any; status: string; }) => !request.isOutgoing && request.status === 'pending');
});

const sentRequests = computed(() => {
  return friendRequests.value.filter((request: { isOutgoing: any; status: string; }) => request.isOutgoing && request.status === 'pending');
});

// Methods
const loadFriendRequests = async () => {
  isLoading.value = true;
  try {
    friendRequests.value = await socialStore.getFriendRequests();
  } catch (error) {
    console.error('Error loading friend requests:', error);
    toast.error('Erreur lors du chargement des demandes d\'ami');
  } finally {
    isLoading.value = false;
  }
};

const getInitials = (name: string): string => {
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};

const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  } catch (error) {
    return '';
  }
};

const acceptFriendRequest = async (request: FriendRequest) => {
  if (actionInProgress.value[request.id]) return;

  actionInProgress.value[request.id] = true;
  try {
    await socialStore.respondToFriendRequest(request.id, 'accept');

    // Update request status
    const requestIndex = friendRequests.value.findIndex((req: { id: any; }) => req.id === request.id);
    if (requestIndex !== -1) {
      friendRequests.value.splice(requestIndex, 1);
    }

    toast.success(`Vous êtes maintenant ami avec ${request.sender.fullName}`);
  } catch (error) {
    console.error('Error accepting friend request:', error);
    toast.error('Erreur lors de l\'acceptation de la demande d\'ami');
  } finally {
    actionInProgress.value[request.id] = false;
  }
};

const rejectFriendRequest = async (request: FriendRequest) => {
  if (actionInProgress.value[request.id]) return;

  actionInProgress.value[request.id] = true;
  try {
    await socialStore.respondToFriendRequest(request.id, 'reject');

    // Update request status
    const requestIndex = friendRequests.value.findIndex((req: { id: any; }) => req.id === request.id);
    if (requestIndex !== -1) {
      friendRequests.value.splice(requestIndex, 1);
    }

    toast.success(`Demande d'ami rejetée`);
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    toast.error('Erreur lors du rejet de la demande d\'ami');
  } finally {
    actionInProgress.value[request.id] = false;
  }
};

const cancelFriendRequest = async (request: FriendRequest) => {
  if (actionInProgress.value[request.id]) return;

  actionInProgress.value[request.id] = true;
  try {
    await socialStore.cancelFriendRequest(request.id);

    // Update request status
    const requestIndex = friendRequests.value.findIndex((req: { id: any; }) => req.id === request.id);
    if (requestIndex !== -1) {
      friendRequests.value.splice(requestIndex, 1);
    }

    toast.success(`Demande d'ami annulée`);
  } catch (error) {
    console.error('Error canceling friend request:', error);
    toast.error('Erreur lors de l\'annulation de la demande d\'ami');
  } finally {
    actionInProgress.value[request.id] = false;
  }
};

// Initialize
onMounted(async () => {
  await loadFriendRequests();
});
</script>
