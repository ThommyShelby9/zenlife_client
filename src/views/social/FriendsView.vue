<template>
  <DashboardLayout>
    <div class="mx-auto px-4 sm:px-6 md:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Mes amis</h1>
        <div class="flex space-x-3">
          <RouterLink
            to="/friend-requests"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <BellIcon class="h-4 w-4 mr-2" />
            <span>Demandes</span>
            <span v-if="friendRequestsCount > 0" class="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              {{ friendRequestsCount }}
            </span>
          </RouterLink>
          <button
            @click="openAddFriendModal"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <UserAddIcon class="h-4 w-4 mr-2" />
            Ajouter un ami
          </button>
        </div>
      </div>

      <!-- Search and filters -->
      <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon class="h-5 w-5 text-gray-400" />
          </div>
          <input
  type="text"
  v-model="search"
  class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-base dark:bg-gray-700 dark:text-white"
  placeholder="Rechercher un ami..."
/>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="mt-8 flex justify-center">
        <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Friends list -->
      <div v-else-if="filteredFriends.length > 0" class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="friend in filteredFriends"
          :key="friend.id"
          class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <img
                  v-if="friend.profilePictureUrl"
                  :src="friend.profilePictureUrl"
                  alt="Profile"
                  class="h-12 w-12 rounded-full"
                />
                <div
                  v-else
                  class="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
                >
                  <span class="text-primary-800 dark:text-primary-200 font-medium">
                    {{ getInitials(friend.fullName) }}
                  </span>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white truncate">
                  {{ friend.fullName }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ friend.username ? '@' + friend.username : '' }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span
                    class="inline-block h-2 w-2 rounded-full mr-1"
                    :class="friend.online ? 'bg-green-500' : 'bg-gray-400'"
                  ></span>
                  {{ friend.online ? 'En ligne' : 'Hors ligne' }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex items-center space-x-2">
                <button
                  @click="startChat(friend)"
                  class="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  title="Envoyer un message"
                >
                  <ChatAlt2Icon class="h-4 w-4" />
                </button>
                <button
                  @click="openFriendOptions(friend)"
                  class="inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  title="Options"
                >
                  <DotsVerticalIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg py-8 px-4 text-center">
        <UserIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun ami</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Commencez à ajouter des amis pour interagir avec eux sur ZenLife.
        </p>
        <div class="mt-6">
          <button
            @click="openAddFriendModal"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <UserAddIcon class="h-4 w-4 mr-2" />
            Ajouter un ami
          </button>
        </div>
      </div>
    </div>

    <!-- Add friend modal -->
    <TransitionRoot appear :show="showAddFriendModal" as="template">
      <Dialog as="div" @close="showAddFriendModal = false" class="relative z-10">
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
                  Ajouter un ami
                </DialogTitle>
                <div class="mt-4">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Ajoutez un ami en recherchant son nom d'utilisateur ou son adresse e-mail.
                  </p>
                  <div class="mt-4 space-y-4">
                    <div>
                      <label for="search-friend" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nom d'utilisateur ou e-mail
                      </label>
                      <div class="mt-1">
                        <input
  id="search-friend"
  v-model="friendSearch"
  type="text"
  class="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-base dark:bg-gray-700 dark:text-white py-3"
  placeholder="@username ou email@example.com"
/>
                      </div>
                    </div>

                    <div v-if="searchResults.length > 0" class="mt-4">
                      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Résultats de recherche</h4>
                      <ul class="divide-y divide-gray-200 dark:divide-gray-700 max-h-60 overflow-y-auto">
                        <li v-for="user in searchResults" :key="user.id" class="py-3 flex items-center">
                          <div class="flex-shrink-0">
                            <img
                              v-if="user.profilePictureUrl"
                              :src="user.profilePictureUrl"
                              alt="Profile"
                              class="h-10 w-10 rounded-full"
                            />
                            <div
                              v-else
                              class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
                            >
                              <span class="text-primary-800 dark:text-primary-200 font-medium">
                                {{ getInitials(user.fullName) }}
                              </span>
                            </div>
                          </div>
                          <div class="ml-3 flex-1">
                            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user.fullName }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">
                              {{ user.username ? '@' + user.username : user.email }}
                            </p>
                          </div>
                          <div class="ml-3">
                            <button
                              v-if="user.friendStatus === 'none'"
                              @click="sendFriendRequest(user)"
                              class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              :disabled="isSending"
                            >
                              <UserAddIcon v-if="!isSending" class="h-3 w-3 mr-1" />
                              <svg v-else class="animate-spin h-3 w-3 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {{ isSending ? 'Envoi...' : 'Ajouter' }}
                            </button>
                            <span
                              v-else-if="user.friendStatus === 'pending'"
                              class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded shadow-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700"
                            >
                              <ClockIcon class="h-3 w-3 mr-1" />
                              En attente
                            </span>
                            <span
                              v-else-if="user.friendStatus === 'friend'"
                              class="inline-flex items-center px-2.5 py-1.5 border border-green-300 dark:border-green-700 text-xs font-medium rounded shadow-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900"
                            >
                              <CheckIcon class="h-3 w-3 mr-1" />
                              Ami
                            </span>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div v-else-if="friendSearch && !isSearching" class="mt-4 text-center py-4">
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        Aucun utilisateur trouvé. Vérifiez le nom d'utilisateur ou l'e-mail saisi.
                      </p>
                    </div>

                    <div v-else-if="isSearching" class="mt-4 flex justify-center py-4">
                      <svg class="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex justify-end">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="showAddFriendModal = false"
                  >
                    Fermer
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Friend options modal -->
    <TransitionRoot appear :show="!!selectedFriend" as="template">
      <Dialog as="div" @close="selectedFriend = null" class="relative z-10">
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
                  Options pour {{ selectedFriend?.fullName }}
                </DialogTitle>
                <div class="mt-4">
                  <div class="flex items-center mb-6">
                    <div class="flex-shrink-0">
                      <img
                        v-if="selectedFriend?.profilePictureUrl"
                        :src="selectedFriend.profilePictureUrl"
                        alt="Profile"
                        class="h-16 w-16 rounded-full"
                      />
                      <div
                        v-else
                        class="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
                      >
                        <span class="text-primary-800 dark:text-primary-200 font-medium text-xl">
                          {{ getInitials(selectedFriend?.fullName || '') }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                        {{ selectedFriend?.fullName }}
                      </h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ selectedFriend?.username ? '@' + selectedFriend.username : '' }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span
                          class="inline-block h-2 w-2 rounded-full mr-1"
                          :class="selectedFriend?.online ? 'bg-green-500' : 'bg-gray-400'"
                        ></span>
                        {{ selectedFriend?.online ? 'En ligne' : 'Hors ligne' }}
                      </p>
                    </div>
                  </div>

                  <div class="space-y-3">
                    <button
                      @click="startChat(selectedFriend)"
                      class="w-full flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <ChatAlt2Icon class="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                      Envoyer un message
                    </button>
                    <button
                      @click="confirmRemoveFriend"
                      class="w-full flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <UserRemoveIcon class="h-4 w-4 mr-3 text-red-500 dark:text-red-400" />
                      Supprimer de mes amis
                    </button>
                  </div>
                </div>

                <div class="mt-6 flex justify-end">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="selectedFriend = null"
                  >
                    Fermer
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Confirm remove friend modal -->
    <TransitionRoot appear :show="showConfirmRemoveModal" as="template">
      <Dialog as="div" @close="showConfirmRemoveModal = false" class="relative z-10">
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
                  Supprimer cet ami ?
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Êtes-vous sûr de vouloir supprimer {{ selectedFriend?.fullName }} de vos amis ? Cette action ne peut pas être annulée.
                  </p>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="showConfirmRemoveModal = false"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    @click="removeFriend"
                    :disabled="isRemoving"
                  >
                    <span v-if="isRemoving" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Suppression...
                    </span>
                    <span v-else>Supprimer</span>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import {
  BellIcon,
  ChatAlt2Icon,
  CheckIcon,
  ClockIcon,
  DotsVerticalIcon,
  SearchIcon,
  UserAddIcon,
  UserIcon,
  UserRemoveIcon,
} from '@heroicons/vue/outline';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useSocialStore } from '@/stores/social.ts';
import type { Friend, User } from '@/types/social.ts';

// Store and composables
const socialStore = useSocialStore();
const router = useRouter();
const toast = useToast();

// Component state
const isLoading = ref(true);
const search = ref('');
const friends = ref<Friend[]>([]);
const friendRequestsCount = ref(0);
const selectedFriend = ref<Friend | null>(null);
const showAddFriendModal = ref(false);
const showConfirmRemoveModal = ref(false);
const isRemoving = ref(false);

// Add friend state
const friendSearch = ref('');
const searchResults = ref<User[]>([]);
const isSearching = ref(false);
const isSending = ref(false);

// Computed properties
const filteredFriends = computed(() => {
  if (!search.value) return friends.value || [];

  const query = search.value.toLowerCase();
  return (friends.value || []).filter(friend =>
    friend.fullName.toLowerCase().includes(query) ||
    (friend.username !== undefined && friend.username.toLowerCase().includes(query))
  );
});

// Methods
const loadFriends = async () => {
  isLoading.value = true;
  try {
    // Load friends
    friends.value = await socialStore.getFriends();

    // Load friend requests count
    const requests = await socialStore.getFriendRequests();
    friendRequestsCount.value = requests.filter((req: { status: string; isOutgoing: any; }) => req.status === 'pending' && !req.isOutgoing).length;
  } catch (error) {
    console.error('Error loading friends:', error);
    toast.error('Erreur lors du chargement des amis');
  } finally {
    isLoading.value = false;
  }
};

const getInitials = (name: string): string => {
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};

const startChat = (friend: Friend | null) => {
  if (!friend) return;

  // Close modals
  selectedFriend.value = null;

  // Navigate to chat view
  router.push(`/chat?userId=${friend.id}`);
};

const openFriendOptions = (friend: Friend) => {
  selectedFriend.value = friend;
};

const confirmRemoveFriend = () => {
  showConfirmRemoveModal.value = true;
};

const removeFriend = async () => {
  if (!selectedFriend.value || isRemoving.value) return;

  isRemoving.value = true;
  try {
    await socialStore.removeFriend(selectedFriend.value.id);

    // Update friends list
    friends.value = friends.value.filter((friend: { id: any; }) => friend.id !== selectedFriend.value?.id);

    // Close modals
    showConfirmRemoveModal.value = false;
    selectedFriend.value = null;

    toast.success('Ami supprimé avec succès');
  } catch (error) {
    console.error('Error removing friend:', error);
    toast.error('Erreur lors de la suppression de l\'ami');
  } finally {
    isRemoving.value = false;
  }
};

const openAddFriendModal = () => {
  showAddFriendModal.value = true;
  friendSearch.value = '';
  searchResults.value = [];
};

// Search for users
const searchUsers = async () => {
  if (!friendSearch.value || friendSearch.value.length < 3) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;
  try {
    // Assurez-vous que le terme de recherche est passé correctement
    const response = await socialStore.searchUsers(friendSearch.value);
    searchResults.value = response;

    console.log('Résultats de recherche:', searchResults.value);
  } catch (error) {
    console.error('Error searching users:', error);
    toast.error('Erreur lors de la recherche d\'utilisateurs');
  } finally {
    isSearching.value = false;
  }
};
const sendFriendRequest = async (user: User) => {
  if (isSending.value) return;

  isSending.value = true;
  try {
    await socialStore.sendFriendRequest(user.id);

    // Update user status in search results
    const userIndex = searchResults.value.findIndex((u: { id: any; }) => u.id === user.id);
    if (userIndex !== -1) {
      searchResults.value[userIndex].friendStatus = 'pending';
    }

    toast.success(`Demande d'ami envoyée à ${user.fullName}`);
  } catch (error) {
    console.error('Error sending friend request:', error);
    toast.error('Erreur lors de l\'envoi de la demande d\'ami');
  } finally {
    isSending.value = false;
  }
};

// Initialize
onMounted(async () => {
  await loadFriends();
});

// Watch for changes in search input
watch(friendSearch, () => {
  const debounce = setTimeout(() => {
    searchUsers();
  }, 500);

  return () => clearTimeout(debounce);
});
</script>
