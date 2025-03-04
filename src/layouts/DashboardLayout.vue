<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Mobile menu -->
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog as="div" class="relative z-40 md:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </TransitionChild>

        <div class="fixed inset-0 flex z-40">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                <div class="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    @click="sidebarOpen = false"
                  >
                    <span class="sr-only">Fermer le menu</span>
                    <XIcon class="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>
              <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div class="flex justify-center items-center px-4">
                  <img class="h-12 w-auto" src="@/assets/img/logo.png" alt="ZenLife" />

                </div>
                <div class="text-center py-3 border-t border-gray-200 dark:border-gray-700">
  <span class="font-fancy text-xl text-primary-600 dark:text-primary-400">ZenLife</span>
</div>
                <nav class="mt-5 px-2 space-y-1">
                  <RouterLink
                    v-for="item in navigation"
                    :key="item.name"
                    :to="item.href"
                    :class="[
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-900 dark:bg-gray-900 dark:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                      'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                    ]"
                  >
                    <component
                      :is="item.icon"
                      :class="[
                        isActive(item.href)
                          ? 'text-primary-500 dark:text-white'
                          : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300',
                        'mr-4 flex-shrink-0 h-6 w-6'
                      ]"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </RouterLink>
                </nav>
              </div>
              <div class="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
                <RouterLink to="/profile" class="flex-shrink-0 group block">
                  <div class="flex items-center">
                    <div>
                      <img
      v-if="user?.profilePictureUrl"
      :src="getFullImageUrl(user.profilePictureUrl)"
      alt="Photo de profil"
      class="inline-block h-9 w-9 rounded-full"
      @error="handleImageError"
    />
                      <div
                        v-else
                        class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 dark:bg-gray-700"
                      >
                        <span class="font-medium text-primary-800 dark:text-white">
                          {{ userInitials }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-3">
                      <p class="text-base font-medium text-gray-700 dark:text-white">
                        {{ user?.fullName }}
                      </p>
                      <p class="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                        Voir le profil
                      </p>
                    </div>
                  </div>
                </RouterLink>
              </div>
            </DialogPanel>
          </TransitionChild>
          <div class="flex-shrink-0 w-14">
            <!-- Force sidebar to shrink to fit close icon -->
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <!-- Sidebar component -->
      <div class="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div class="flex justify-center items-center px-4">
            <a href="/" class="flex justify-center">
    <img class="h-16 w-auto" src="@/assets/img/logo.png" alt="ZenLife" />
  </a>
  </div>
  <div class="text-center py-3 border-t border-gray-200 dark:border-gray-700">
  <span class="font-fancy text-xl text-primary-600 dark:text-primary-400">ZenLife</span>
</div>
          <nav class="mt-5 flex-1 px-2 space-y-1">
            <RouterLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              :class="[
                isActive(item.href)
                  ? 'bg-primary-100 text-primary-900 dark:bg-gray-900 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
              ]"
            >
              <component
                :is="item.icon"
                :class="[
                  isActive(item.href)
                    ? 'text-primary-500 dark:text-white'
                    : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300',
                  'mr-3 flex-shrink-0 h-6 w-6'
                ]"
                aria-hidden="true"
              />
              {{ item.name }}
            </RouterLink>
          </nav>
        </div>
        <div class="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <RouterLink to="/profile" class="flex-shrink-0 w-full group block">
            <div class="flex items-center">
              <div>
                <img
      v-if="user?.profilePictureUrl"
      :src="getFullImageUrl(user.profilePictureUrl)"
      alt="Photo de profil"
      class="inline-block h-9 w-9 rounded-full"
      @error="handleImageError"
    />
    <div
      v-else
      class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700"
    >
      <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
        {{ getInitials(user?.fullName || user?.username || '') }}
      </span>
    </div>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-700 dark:text-white">
                  {{ user?.fullName }}
                </p>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                  Voir le profil
                </p>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="md:pl-64 flex flex-col flex-1">
      <div class="sticky top-0 z-10 flex-shrink-0 h-16 bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 flex">
        <button
          type="button"
          class="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 md:hidden"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Ouvrir le menu</span>
          <MenuIcon class="h-6 w-6" aria-hidden="true" />
        </button>
        <div class="flex-1 px-4 flex justify-between">
          <div class="flex-1 flex">
<!--             <form class="w-full flex md:ml-0" action="#" method="GET">
              <label for="search-field" class="sr-only">Rechercher</label>
              <div class="relative w-full text-gray-400 focus-within:text-gray-600 dark:focus-within:text-gray-300">
                <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                  <SearchIcon class="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                  id="search-field"
                  class="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm bg-white dark:bg-gray-800"
                  placeholder="Rechercher"
                  type="search"
                  name="search"
                />
              </div>
            </form> -->
          </div>
          <div class="ml-4 flex items-center md:ml-6">
            <!-- Theme toggle -->
            <button
              type="button"
              @click="toggleTheme"
              class="bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span class="sr-only">Changer de thème</span>
              <SunIcon v-if="isDarkMode" class="h-6 w-6" aria-hidden="true" />
              <MoonIcon v-else class="h-6 w-6" aria-hidden="true" />
            </button>

            <!-- Notification dropdown -->
            <Menu as="div" class="ml-3 relative">
              <div>
                <MenuButton class="bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <span class="sr-only">Voir les notifications</span>
                  <BellIcon class="h-6 w-6" aria-hidden="true" />
                  <!-- Notification badge -->
                  <span v-if="unreadNotificationsCount > 0" class="absolute top-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white dark:ring-gray-800 bg-red-400 text-xs text-white text-center">
                    {{ unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount }}
                  </span>
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems class="origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
                    <button
                      v-if="notifications.length > 0"
                      @click="markAllNotificationsAsRead"
                      class="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
                    >
                      Tout marquer comme lu
                    </button>
                  </div>
                  <div class="max-h-96 overflow-y-auto">
                    <div v-if="notifications.length === 0" class="py-6 text-center">
                      <BellIcon class="mx-auto h-10 w-10 text-gray-400" />
                      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Aucune notification pour le moment</p>
                    </div>
                    <MenuItem v-for="notification in notifications" :key="notification.id" v-slot="{ active }">
                      <RouterLink
                        :to="notification.link || '#'"
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-700' : '',
                          notification.read
        ? 'bg-white dark:bg-gray-800'
        : 'bg-primary-50 dark:bg-gray-700 dark:border-l-4 dark:border-l-primary-400',
      'block px-4 py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0'
    ]"
                        @click="markNotificationAsRead(notification.id)"
                      >
                        <div class="flex items-start">
                          <div class="flex-shrink-0">
                            <component
                              :is="getNotificationIcon(notification.type)"
                              :class="[
                                getNotificationColor(notification.type),
                                'h-5 w-5'
                              ]"
                              aria-hidden="true"
                            />
                          </div>
                          <div class="ml-3 w-0 flex-1">
                            <p class="text-sm font-medium text-gray-900 dark:text-white">
          {{ notification.content }}
        </p>
                            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {{ formatNotificationDate(notification.createdAt) }}
                            </p>
                          </div>
                        </div>
                      </RouterLink>
                    </MenuItem>
                  </div>
                  <div v-if="notifications.length > 5" class="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center">
                    <RouterLink to="/notifications" class="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
                      Voir toutes les notifications
                    </RouterLink>
                  </div>
                </MenuItems>
              </transition>
            </Menu>

            <!-- Profile dropdown -->
            <Menu as="div" class="ml-3 relative">
              <div>
                <MenuButton class="max-w-xs bg-white dark:bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <span class="sr-only">Ouvrir le menu utilisateur</span>
                              <img
                  v-if="user?.profilePictureUrl"
                  :src="getFullImageUrl(user.profilePictureUrl)"
                  alt="Photo de profil"
                  class="inline-block h-9 w-9 rounded-full"
                  @error="handleImageError"
                />
                  <div
                    v-else
                    class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-gray-700"
                  >
                    <span class="text-sm font-medium text-primary-800 dark:text-white">
                      {{ userInitials }}
                    </span>
                  </div>
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <MenuItem v-slot="{ active }">
                    <RouterLink to="/profile" :class="[active ? 'bg-gray-100 dark:bg-gray-700' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300']">
                      Votre profil
                    </RouterLink>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <RouterLink to="/settings" :class="[active ? 'bg-gray-100 dark:bg-gray-700' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300']">
                      Paramètres
                    </RouterLink>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a href="#" @click.prevent="logout" :class="[active ? 'bg-gray-100 dark:bg-gray-700' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300']">
                      Se déconnecter
                    </a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main class="flex-1 pb-16">
        <div class="py-6">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue';
import {
  BellIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  HomeIcon,
  MenuIcon,
  UsersIcon,
  XIcon,
  MoonIcon,
  SunIcon,
  ChatAlt2Icon,
  HeartIcon,
  CloudIcon,
  LightBulbIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  UserAddIcon,
} from '@heroicons/vue/outline';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { useNotificationStore } from '@/stores/notification';
import type { Notification } from '@/types/notification';
import { fileApi } from '@/api/file';




// Navigation items
const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: HomeIcon },
  { name: 'Planning', href: '/planner/today', icon: CalendarIcon },
  { name: 'Finances', href: '/finance/summary', icon: CurrencyDollarIcon },
  { name: 'Eau & Santé', href: '/water', icon: CloudIcon },
  { name: 'Pensées positives', href: '/positive-thoughts', icon: LightBulbIcon },
  { name: 'Amis', href: '/friends', icon: UsersIcon },
  { name: 'Messages', href: '/chat', icon: ChatAlt2Icon },
];

// Composables
const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const toast = useToast();

// State
const sidebarOpen = ref(false);
const user = computed(() => userStore.user);
const notifications = ref<Notification[]>([]);
const unreadNotificationsCount = ref(0);
const isDarkMode = ref(document.documentElement.classList.contains('dark'));
const imageError = ref(false); // Ajoutez cette ligne pour déclarer la variable manquante


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const profilePictureUrl = userStore.user?.profilePictureUrl
  ? fileApi.getFileViewUrl(userStore.user.profilePictureUrl)
  : undefined;

// User initials computed
const userInitials = computed(() => {
  if (!user.value || !user.value.fullName) return '';

  const nameParts = user.value.fullName.split(' ');
  if (nameParts.length === 1) return nameParts[0][0]?.toUpperCase() || '';

  return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
});

// Check if route is active
const isActive = (href: string): boolean => {
  const currentPath = router.currentRoute.value.path;
  if (href === '/dashboard') {
    return currentPath === href;
  }
  return currentPath.startsWith(href);
};

// Toggle dark/light theme
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark');

  // Save to local storage
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');

  // Update user preference if logged in
  if (user.value) {
    userStore.updateThemePreference(isDarkMode.value ? 'dark' : 'light');
  }
};

// Cette fonction construit l'URL complète de l'image
const getFullImageUrl = (url: string): string => {
  // Si l'URL commence déjà par http, la retourner telle quelle
  if (url.startsWith('http')) {
    return url;
  }

  // Sinon, préfixer avec l'URL de l'API
  return `${import.meta.env.VITE_APP_API_URL.replace(/\/api$/, '')}${url}`;
};

// Gérer l'erreur de chargement d'image
const handleImageError = () => {
  imageError.value = true;
  console.error("Erreur de chargement de l'image de profil");
};

// Obtenir les initiales pour l'avatar par défaut
const getInitials = (name: string): string => {
  if (!name) return '?';

  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Format notification date
// Fonction améliorée pour formater les dates de notification
const formatNotificationDate = (dateString: string | number | Date) => {
  if (!dateString) {
    console.warn('Date de notification manquante');
    return 'Date inconnue';
  }

  try {
    // Tenter de créer un objet Date
    const date = new Date(dateString);

    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      console.warn('Date de notification invalide:', dateString);
      return 'Date invalide';
    }

    // Vérifier si la date est proche de l'époque Unix (problème potentiel)
    if (date.getFullYear() < 2000) {
      console.warn('Date de notification suspecte (avant 2000):', dateString);
      // Utiliser la date actuelle comme fallback
      return formatRelativeTime(new Date());
    }

    // Formater la date en fonction de son ancienneté
    return formatRelativeTime(date);
  } catch (error) {
    console.error('Erreur lors du formatage de la date de notification:', error);
    return 'Date invalide';
  }
};
// Formater la date en temps relatif ou absolu selon l'ancienneté
const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Moins d'une minute
  if (diffMinutes < 1) {
    return 'À l\'instant';
  }

  // Moins d'une heure
  if (diffMinutes < 60) {
    return `Il y a ${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'}`;
  }

  // Moins d'un jour
  if (diffHours < 24) {
    return `Il y a ${diffHours} ${diffHours === 1 ? 'heure' : 'heures'}`;
  }

  // Moins d'une semaine
  if (diffDays < 7) {
    return `Il y a ${diffDays} ${diffDays === 1 ? 'jour' : 'jours'}`;
  }

  // Plus d'une semaine : afficher la date complète
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  return date.toLocaleDateString('fr-FR', options);
};

// Get notification icon based on type
const getNotificationIcon = (type: string) => {
  const iconMap: { [key: string]: unknown } = {
    'info': InformationCircleIcon,
    'success': CheckCircleIcon,
    'warning': ExclamationCircleIcon,
    'error': ExclamationCircleIcon,
    'friend_request': UserAddIcon,
    'message': ChatAlt2Icon,
    'reminder': BellIcon,
    'water': CloudIcon,
    'health': HeartIcon,
  };

  return iconMap[type] || BellIcon;
};

// Get notification color based on type
const getNotificationColor = (type: string) => {
  const colorMap: { [key: string]: string } = {
    'info': 'text-blue-500 dark:text-blue-400',
    'success': 'text-green-500 dark:text-green-400',
    'warning': 'text-yellow-500 dark:text-yellow-400',
    'error': 'text-red-500 dark:text-red-400',
    'friend_request': 'text-primary-500 dark:text-primary-400',
    'message': 'text-indigo-500 dark:text-indigo-400',
    'reminder': 'text-gray-500 dark:text-gray-400',
    'water': 'text-blue-500 dark:text-blue-400',
    'health': 'text-pink-500 dark:text-pink-400',
  };

  return colorMap[type] || 'text-gray-500 dark:text-gray-400';
};

// Mark notification as read
const markNotificationAsRead = async (id: string) => {
  try {
    await notificationStore.markAsRead(id);

    // Update local notifications list
    const index = notifications.value.findIndex(notification => notification.id === id);
    if (index !== -1) {
      notifications.value[index].read = true;
      // Decrease unread count if this was unread
      if (unreadNotificationsCount.value > 0) {
        unreadNotificationsCount.value--;
      }
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async () => {
  try {
    await notificationStore.markAllAsRead();

    // Update local notifications list
    notifications.value = notifications.value.map(notification => ({
      ...notification,
      read: true
    }));

    // Reset unread count
    unreadNotificationsCount.value = 0;

    toast.success('Toutes les notifications ont été marquées comme lues');
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    toast.error('Erreur lors du marquage des notifications');
  }
};

// Logout
const logout = async () => {
  try {
    await authStore.logout();
    toast.success('Déconnexion réussie');
    router.push('/auth/login');
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Erreur lors de la déconnexion');
  }
};

// Fetch notifications
const fetchNotifications = async () => {
  try {
    // Get all notifications
    const allNotifications = await notificationStore.getNotifications();
    notifications.value = allNotifications;

    // Count unread
    unreadNotificationsCount.value = notifications.value.filter(notification => !notification.read).length;
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};

onMounted(async () => {
  // Fetch user data if not already loaded
  if (!userStore.user) {
    await userStore.fetchCurrentUser();
  }

  // Get initial notifications
  await fetchNotifications();

  // Set up automatic refresh for notifications
  setInterval(fetchNotifications, 60000); // Refresh every minute

  // Set theme based on user preference
  if (user.value?.themePreference) {
    isDarkMode.value = user.value.themePreference === 'dark';
    document.documentElement.classList.toggle('dark', isDarkMode.value);
  }
});
</script>

<style>
.font-fancy {
  font-family: 'Pacifico', cursive, sans-serif;
  letter-spacing: 1px;
}
</style>
