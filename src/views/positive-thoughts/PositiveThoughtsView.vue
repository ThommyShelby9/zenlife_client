<template>
  <DashboardLayout>
    <div class="mx-auto px-4 sm:px-6 md:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Pensées positives</h1>
        <div class="flex space-x-4">
          <button
            @click="showSettingsModal = true"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <CogIcon class="h-4 w-4 mr-2" />
            Paramètres
          </button>
          <button
            @click="showAddThoughtModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Ajouter une pensée
          </button>
        </div>
      </div>

      <!-- Daily quote card -->
      <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Votre pensée du jour</h2>
            <button
              @click="refreshThought"
              class="inline-flex items-center px-2 py-1 text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 focus:outline-none"
              :disabled="isRefreshing"
            >
              <RefreshIcon :class="['h-4 w-4 mr-1', isRefreshing ? 'animate-spin' : '']" />
              Nouvelle pensée
            </button>
          </div>
          <div class="mt-4 max-w-3xl mx-auto text-center">
            <blockquote class="relative">
              <svg class="absolute top-0 left-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-gray-100 dark:text-gray-700" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p class="relative text-xl font-medium text-gray-900 dark:text-white">
                {{ currentThought.content }}
              </p>
              <footer class="mt-3">
                <div class="flex flex-col items-center justify-center">
                  <p class="text-base font-medium text-gray-700 dark:text-gray-300">
                    {{ currentThought.author || 'Anonyme' }}
                  </p>
                  <p v-if="currentThought.category" class="text-sm text-gray-500 dark:text-gray-400">
                    {{ currentThought.category }}
                  </p>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      <!-- Categories section -->
      <div class="mt-8">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Catégories</h2>
        <div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          <button
            class="flex flex-col items-center justify-center p-4 border-2 rounded-lg border-primary-500 bg-primary-50 dark:bg-primary-900 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            @click="fetchAllThoughts"
          >
            <CollectionIcon class="h-8 w-8" />
            <span class="mt-2 text-sm font-medium">Toutes</span>
          </button>
          <button
            v-for="category in categories"
            :key="category"
            class="flex flex-col items-center justify-center p-4 border-2 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            @click="fetchThoughtsByCategory(category)"
          >
            <component :is="getCategoryIcon(category)" class="h-8 w-8" />
            <span class="mt-2 text-sm font-medium">{{ category }}</span>
          </button>
        </div>
      </div>

      <!-- Thoughts list -->
      <div class="mt-8">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ selectedCategory ? `Pensées - ${selectedCategory}` : 'Toutes les pensées' }}
          </h2>
          <div class="flex items-center">
            <SearchIcon class="h-5 w-5 text-gray-400 mr-2" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher..."
              class="border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div class="mt-4 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div v-if="filteredThoughts.length === 0" class="sm:col-span-2 lg:col-span-3 xl:col-span-4 py-8 text-center">
            <LightBulbIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune pensée trouvée</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Essayez de modifier votre recherche ou d'ajouter une nouvelle pensée.
            </p>
          </div>
          <div
            v-for="thought in filteredThoughts"
            :key="thought.id"
            class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
          >
            <div class="px-4 py-5 sm:p-6">
              <blockquote class="relative">
                <p class="text-base font-medium text-gray-900 dark:text-white line-clamp-4">
                  {{ thought.content }}
                </p>
                <footer class="mt-3">
                  <div class="flex flex-col">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ thought.author || 'Anonyme' }}
                    </p>
                    <p v-if="thought.category" class="text-xs text-gray-500 dark:text-gray-400">
                      {{ thought.category }}
                    </p>
                  </div>
                </footer>
              </blockquote>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-end">
              <button
                @click="setAsDailyThought(thought)"
                class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
              >
                Définir comme pensée du jour
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <TransitionRoot appear :show="showSettingsModal" as="template">
      <Dialog as="div" @close="showSettingsModal = false" class="relative z-10">
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
                  Paramètres des pensées positives
                </DialogTitle>
                <div class="mt-4 space-y-4">
                  <div>
                    <div class="flex items-center justify-between">
                      <label for="notif-enabled" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Activer les notifications
                      </label>
                      <Switch
                        v-model="settings.notificationEnabled"
                        :class="settings.notificationEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'"
                        class="relative inline-flex h-6 w-11 items-center rounded-full"
                      >
                        <span class="sr-only">Activer les notifications</span>
                        <span
                          :class="settings.notificationEnabled ? 'translate-x-6' : 'translate-x-1'"
                          class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                        />
                      </Switch>
                    </div>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Recevez des notifications avec des pensées positives
                    </p>
                  </div>

                  <div>
                    <label for="frequency" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Fréquence des pensées
                    </label>
                    <select
                      id="frequency"
                      v-model="settings.frequency"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    >
                      <option value="hourly">Toutes les heures</option>
                      <option value="daily">Une fois par jour</option>
                      <option value="custom">Personnalisée</option>
                    </select>
                  </div>

                  <div v-if="settings.frequency === 'custom'">
                    <label for="custom-interval" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Intervalle personnalisé (minutes)
                    </label>
                    <input
                      id="custom-interval"
                      v-model="settings.customInterval"
                      type="number"
                      min="15"
                      max="1440"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label for="categories" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Catégories préférées
                    </label>
                    <div class="mt-2 space-y-2">
                      <div v-for="category in allCategories" :key="category" class="flex items-center">
                        <input
                          :id="`category-${category}`"
                          v-model="selectedCategories"
                          :value="category"
                          type="checkbox"
                          class="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                        />
                        <label :for="`category-${category}`" class="ml-3 text-sm text-gray-700 dark:text-gray-300">
                          {{ category }}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div class="flex items-center justify-between">
                      <label for="display-on-lock" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Afficher sur écran verrouillé
                      </label>
                      <Switch
                        v-model="settings.displayOnLockScreen"
                        :class="settings.displayOnLockScreen ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'"
                        class="relative inline-flex h-6 w-11 items-center rounded-full"
                      >
                        <span class="sr-only">Afficher sur écran verrouillé</span>
                        <span
                          :class="settings.displayOnLockScreen ? 'translate-x-6' : 'translate-x-1'"
                          class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                        />
                      </Switch>
                    </div>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Afficher les pensées positives sur l'écran de verrouillage
                    </p>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="showSettingsModal = false"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="saveSettings"
                    :disabled="isSaving"
                  >
                    <span v-if="isSaving" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enregistrement...
                    </span>
                    <span v-else>Enregistrer</span>
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Add Thought Modal -->
    <TransitionRoot appear :show="showAddThoughtModal" as="template">
      <Dialog as="div" @close="showAddThoughtModal = false" class="relative z-10">
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
                  Ajouter une pensée positive
                </DialogTitle>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="thought-content" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Contenu
                    </label>
                    <textarea
                      id="thought-content"
                      v-model="newThought.content"
                      rows="4"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="Écrivez votre pensée positive ici..."
                    ></textarea>
                  </div>

                  <div>
                    <label for="thought-author" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Auteur
                    </label>
                    <input
                      id="thought-author"
                      v-model="newThought.author"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="Anonyme"
                    />
                  </div>

                  <div>
                    <label for="thought-category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Catégorie
                    </label>
                    <select
                      id="thought-category"
                      v-model="newThought.category"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option v-for="category in allCategories" :key="category" :value="category">
                        {{ category }}
                      </option>
                      <option value="new">Nouvelle catégorie...</option>
                    </select>
                  </div>

                  <div v-if="newThought.category === 'new'">
                    <label for="new-category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nouvelle catégorie
                    </label>
                    <input
                      id="new-category"
                      v-model="newCategory"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="Nom de la nouvelle catégorie"
                    />
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="showAddThoughtModal = false"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="addThought"
                    :disabled="!isValidThought || isAddingThought"
                  >
                    <span v-if="isAddingThought" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Ajout en cours...
                    </span>
                    <span v-else>Ajouter</span>
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
import { useToast } from 'vue-toastification';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
  Switch
} from '@headlessui/vue';
import {
  CogIcon,
  PlusIcon,
  RefreshIcon,
  LightBulbIcon,
  HeartIcon,
  AcademicCapIcon,
  StarIcon,
  SunIcon,
  MoonIcon,
  PhotographIcon,
  UserGroupIcon,
  GlobeIcon,
  CollectionIcon,
  SearchIcon
} from '@heroicons/vue/outline';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { usePositiveThoughtStore } from '@/stores/positiveThought';
import type { PositiveThought, UserPositiveThoughtSetting } from '@/types/positiveThought';

// Store and composables
const positiveThoughtStore = usePositiveThoughtStore();
const toast = useToast();

// Component state
const isRefreshing = ref(false);
const showSettingsModal = ref(false);
const showAddThoughtModal = ref(false);
const isSaving = ref(false);
const isAddingThought = ref(false);
const searchQuery = ref('');
const selectedCategory = ref('');
const thoughts = ref<PositiveThought[]>([]);
const newCategory = ref('');

// Settings
const settings = ref<UserPositiveThoughtSetting>({
  enabled: true,
  frequency: 'daily',
  customInterval: 60,
  notificationEnabled: true,
  displayOnLockScreen: false,
  preferredCategories: []
});

// Selected categories for settings
const selectedCategories = ref<string[]>([]);

// New thought
const newThought = ref<PositiveThought>({
  content: '',
  author: '',
  category: ''
});

// Changez cette ligne
const allCategories = ref<string[]>([
  'Motivation',
  'Bonheur',
  'Succès',
  'Amour',
  'Amitié',
  'Santé',
  'Sagesse',
  'Méditation',
  'Gratitude'
]);

// Current thought
const currentThought = computed(() => positiveThoughtStore.currentThought || {
  content: "Chaque jour est une nouvelle chance de changer votre vie.",
  author: "Anonyme"
});

// Categories
const categories = computed(() => {
  const storeCategories = positiveThoughtStore.categories || [];
  return [...new Set([...storeCategories, ...allCategories.value])];
});

// Filtered thoughts
const filteredThoughts = computed(() => {
  if (!searchQuery.value) return thoughts.value;

  const query = searchQuery.value.toLowerCase();
  return thoughts.value.filter(thought =>
    thought.content.toLowerCase().includes(query) ||
    (thought.author && thought.author.toLowerCase().includes(query)) ||
    (thought.category && thought.category.toLowerCase().includes(query))
  );
});

// Validity check for new thought
const isValidThought = computed(() => {
  if (!newThought.value.content.trim()) return false;
  if (newThought.value.category === 'new' && !newCategory.value.trim()) return false;
  return true;
});

// Methods
const refreshThought = async () => {
  if (isRefreshing.value) return;

  isRefreshing.value = true;
  try {
    const category = selectedCategories.value.length > 0
      ? selectedCategories.value[Math.floor(Math.random() * selectedCategories.value.length)]
      : undefined;

    await positiveThoughtStore.getRandomPositiveThought(category);
    toast.success('Nouvelle pensée positive chargée');
  } catch (error) {
    console.error('Error refreshing thought:', error);
    toast.error('Erreur lors du rafraîchissement de la pensée');
  } finally {
    isRefreshing.value = false;
  }
};

const fetchAllThoughts = async () => {
  try {
    const allThoughts = await positiveThoughtStore.getAllThoughts();
    thoughts.value = allThoughts;
    selectedCategory.value = '';
  } catch (error) {
    console.error('Error fetching all thoughts:', error);
    toast.error('Erreur lors du chargement des pensées');
  }
};

const fetchThoughtsByCategory = async (category: string) => {
  try {
    selectedCategory.value = category;
    const categoryThoughts = await positiveThoughtStore.getThoughtsByCategory(category);
    thoughts.value = categoryThoughts;
  } catch (error) {
    console.error(`Error fetching thoughts for category ${category}:`, error);
    toast.error(`Erreur lors du chargement des pensées de la catégorie ${category}`);
  }
};

const setAsDailyThought = (thought: PositiveThought) => {
  positiveThoughtStore.currentThought = thought;
  toast.success('Pensée définie comme pensée du jour');
};

const saveSettings = async () => {
  if (isSaving.value) return;

  isSaving.value = true;
  try {
    // Update preferred categories
    settings.value.preferredCategories = selectedCategories.value;

    // Save settings
    await positiveThoughtStore.updateUserSettings(settings.value);

    // Close modal
    showSettingsModal.value = false;
    toast.success('Paramètres enregistrés avec succès');
  } catch (error) {
    console.error('Error saving settings:', error);
    toast.error('Erreur lors de l\'enregistrement des paramètres');
  } finally {
    isSaving.value = false;
  }
};

const addThought = async () => {
  if (!isValidThought.value || isAddingThought.value) return;

  isAddingThought.value = true;
  try {
    // Handle new category
// Dans la méthode addThought
if (newThought.value.category === 'new' && newCategory.value) {
  newThought.value.category = newCategory.value;
  allCategories.value.push(newCategory.value);
}

// Autres modifications similaires où vous utilisez allCategories

    // Create thought
    const thought = await positiveThoughtStore.createThought(newThought.value);

    // Add to thoughts list
    thoughts.value = [thought, ...thoughts.value];

    // Close modal and reset form
    showAddThoughtModal.value = false;
    newThought.value = { content: '', author: '', category: '' };
    newCategory.value = '';

    toast.success('Pensée ajoutée avec succès');
  } catch (error) {
    console.error('Error adding thought:', error);
    toast.error('Erreur lors de l\'ajout de la pensée');
  } finally {
    isAddingThought.value = false;
  }
};

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    'Motivation': StarIcon,
    'Bonheur': SunIcon,
    'Succès': AcademicCapIcon,
    'Amour': HeartIcon,
    'Amitié': UserGroupIcon,
    'Santé': HeartIcon,
    'Sagesse': LightBulbIcon,
    'Méditation': MoonIcon,
    'Gratitude': PhotographIcon,
  };

  return iconMap[category] || GlobeIcon;
};

// Initialize
onMounted(async () => {
  try {
    // Initialize store
    await positiveThoughtStore.initialize();

    // Get user settings
    if (positiveThoughtStore.userSettings) {
      settings.value = { ...positiveThoughtStore.userSettings };

      // Set selected categories
      if (settings.value.preferredCategories) {
        selectedCategories.value = [...settings.value.preferredCategories];
      }
    }

    // Fetch all thoughts
    await fetchAllThoughts();
  } catch (error) {
    console.error('Error initializing positive thoughts view:', error);
  }
});

// Watch for settings changes in store
watch(() => positiveThoughtStore.userSettings, (newSettings) => {
  if (newSettings) {
    settings.value = { ...newSettings };

    // Update selected categories
    if (settings.value.preferredCategories) {
      selectedCategories.value = [...settings.value.preferredCategories];
    }
  }
}, { deep: true });
</script>

<style>
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
