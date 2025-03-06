<template>
  <DashboardLayout>
    <div class="mx-auto px-4 sm:px-6 md:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Pensées positives</h1>
        <div class="flex space-x-4">
          <button
            @click="showSettingsModal = true"
            class="inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <CogIcon class="h-5 w-5 mr-2" />
            Paramètres
          </button>
          <button
            @click="showAddThoughtModal = true"
            class="inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
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
              class="inline-flex items-center px-3 py-1.5 text-base text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 focus:outline-none"
              :disabled="isRefreshing"
            >
              <RefreshIcon :class="['h-5 w-5 mr-1', isRefreshing ? 'animate-spin' : '']" />
              Nouvelle pensée
            </button>
          </div>
          <div class="mt-4 max-w-3xl mx-auto text-center">
            <blockquote class="relative">
              <svg class="absolute top-0 left-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-gray-100 dark:text-gray-700" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p class="relative text-xl font-medium text-gray-900 dark:text-white">
                {{ currentThoughtData.content }}
              </p>
              <footer class="mt-3">
                <div class="flex flex-col items-center justify-center">
                  <p class="text-base font-medium text-gray-700 dark:text-gray-300">
                    {{ currentThoughtData.author || 'Anonyme' }}
                  </p>
                  <p v-if="currentThoughtData.category" class="text-sm text-gray-500 dark:text-gray-400">
                    {{ currentThoughtData.category }}
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
            <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">({{ filteredThoughts.length }} pensées)</span>
          </h2>
          <div class="flex items-center space-x-2">
            <!-- Sélecteur de vue -->
            <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'p-2.5 rounded-l-md',
                  viewMode === 'grid'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400'
                ]"
              >
                <ViewGridIcon class="h-5 w-5" />
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'p-2.5 rounded-r-md',
                  viewMode === 'list'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400'
                ]"
              >
                <ViewListIcon class="h-5 w-5" />
              </button>
            </div>

            <!-- Barre de recherche -->
            <div class="relative">
              <SearchIcon class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher..."
                class="pl-10 pr-10 py-2.5 border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-base dark:bg-gray-700 dark:text-white w-64"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Message "Aucune pensée trouvée" -->
        <div v-if="filteredThoughts.length === 0" class="py-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow mt-4">
          <LightBulbIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune pensée trouvée</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Essayez de modifier votre recherche ou d'ajouter une nouvelle pensée.
          </p>
          <button
            @click="showAddThoughtModal = true"
            class="mt-4 inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            Ajouter une pensée
          </button>
        </div>

        <!-- Affichage en grille -->
        <div v-else-if="viewMode === 'grid'" class="mt-4 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div
            v-for="thought in paginatedThoughts"
            :key="thought.id"
            class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
          >
            <div class="relative px-4 py-5 sm:p-6">
              <!-- Badge de catégorie -->
              <span v-if="thought.category" class="absolute top-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                {{ thought.category }}
              </span>

              <blockquote class="relative mt-4">
                <p class="text-base font-medium text-gray-900 dark:text-white line-clamp-4">
                  {{ thought.content }}
                </p>
                <footer class="mt-3">
                  <div class="flex flex-col">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ thought.author || 'Anonyme' }}
                    </p>
                  </div>
                </footer>
              </blockquote>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-end">
              <button
                @click="setAsDailyThought(thought)"
                class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-base font-medium"
              >
                Définir comme pensée du jour
              </button>
            </div>
          </div>
        </div>

        <!-- Affichage en liste -->
        <div v-else class="mt-4 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
            <li
              v-for="thought in paginatedThoughts"
              :key="thought.id"
              class="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
            >
              <div class="flex items-start justify-between">
                <div class="min-w-0 flex-1">
                  <p class="text-base font-medium text-gray-900 dark:text-white truncate">
                    {{ thought.content }}
                  </p>
                  <div class="mt-2 flex items-center">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      <span class="font-medium text-gray-700 dark:text-gray-300">{{ thought.author || 'Anonyme' }}</span>
                      <span v-if="thought.category" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                        {{ thought.category }}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  @click="setAsDailyThought(thought)"
                  class="ml-4 flex-shrink-0 text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-base font-medium"
                >
                  Définir comme pensée du jour
                </button>
              </div>
            </li>
          </ul>
        </div>

        <!-- Pagination -->
        <div v-if="filteredThoughts.length > itemsPerPage" class="mt-6 flex justify-center">
          <nav class="inline-flex shadow-sm -space-x-px" aria-label="Pagination">
            <button
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-3 py-2.5 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <span class="sr-only">Précédent</span>
              <ChevronLeftIcon class="h-5 w-5" />
            </button>

            <template v-for="pageNumber in displayedPages" :key="pageNumber">
              <button
                v-if="pageNumber === '...'"
                class="relative inline-flex items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300"
              >
                ...
              </button>
              <button
                v-else
                @click="typeof pageNumber === 'number' && (currentPage = pageNumber)"
                :class="[
                  currentPage === pageNumber
                    ? 'bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-600 dark:text-primary-300'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700',
                  'relative inline-flex items-center px-4 py-2.5 border text-base font-medium'
                ]"
              >
                {{ pageNumber }}
              </button>
            </template>

            <button
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-3 py-2.5 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <span class="sr-only">Suivant</span>
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </nav>
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
                <div class="mt-4 space-y-6">
                  <!-- Section des notifications avec le composant ParametresNotificationPensees -->
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white mb-3">Notifications</h4>
                    <ParametresNotificationPensees v-model="settings" />
                  </div>

                  <!-- Section des catégories préférées -->
                  <div>
                    <label for="categories" class="block text-base font-medium text-gray-700 dark:text-gray-300">
                      Catégories préférées
                    </label>
                    <div class="mt-3 space-y-3">
                      <div v-for="category in allCategories" :key="category" class="flex items-center">
                        <input
                          :id="`category-${category}`"
                          v-model="selectedCategories"
                          :value="category"
                          type="checkbox"
                          class="h-5 w-5 rounded border-gray-300 dark:border-gray-700 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                        />
                        <label :for="`category-${category}`" class="ml-3 text-base text-gray-700 dark:text-gray-300">
                          {{ category }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="showSettingsModal = false"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2.5 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="saveSettings"
                    :disabled="isSaving"
                  >
                    <span v-if="isSaving" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                <div class="mt-4 space-y-5">
                  <div>
                    <label for="thought-content" class="block text-base font-medium text-gray-700 dark:text-gray-300">
                      Contenu
                    </label>
                    <textarea
                      id="thought-content"
                      v-model="newThought.content"
                      rows="4"
                      class="mt-2 block w-full rounded-md border-gray-300 dark:border-gray-700 py-3 px-4 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base dark:bg-gray-700 dark:text-white"
                      placeholder="Écrivez votre pensée positive ici..."
                    ></textarea>
                  </div>

                  <div>
                    <label for="thought-author" class="block text-base font-medium text-gray-700 dark:text-gray-300">
                      Auteur
                    </label>
                    <input
                      id="thought-author"
                      v-model="newThought.author"
                      type="text"
                      class="mt-2 block w-full rounded-md border-gray-300 dark:border-gray-700 py-3 px-4 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base dark:bg-gray-700 dark:text-white"
                      placeholder="Anonyme"
                    />
                  </div>

                  <div>
                    <label for="thought-category" class="block text-base font-medium text-gray-700 dark:text-gray-300">
                      Catégorie
                    </label>
                    <select
                      id="thought-category"
                      v-model="newThought.category"
                      class="mt-2 block w-full rounded-md border-gray-300 dark:border-gray-700 py-3 px-4 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option v-for="category in allCategories" :key="category" :value="category">
                        {{ category }}
                      </option>
                      <option value="new">Nouvelle catégorie...</option>
                    </select>
                  </div>

                  <div v-if="newThought.category === 'new'">
                    <label for="new-category" class="block text-base font-medium text-gray-700 dark:text-gray-300">
                      Nouvelle catégorie
                    </label>
                    <input
                      id="new-category"
                      v-model="newCategory"
                      type="text"
                      class="mt-2 block w-full rounded-md border-gray-300 dark:border-gray-700 py-3 px-4 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-base dark:bg-gray-700 dark:text-white"
                      placeholder="Nom de la nouvelle catégorie"
                    />
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="showAddThoughtModal = false"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2.5 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="addThought"
                    :disabled="!isValidThought || isAddingThought"
                  >
                    <span v-if="isAddingThought" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
  SearchIcon,
  ViewGridIcon,
  ViewListIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon
} from '@heroicons/vue/outline';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { usePositiveThoughtStore } from '@/stores/positiveThought';
import type { PositiveThought, UserPositiveThoughtSetting } from '@/types/positiveThought';
import ParametresNotificationPensees from '@/components/positive/ParametresNotificationPensees.vue';

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

// Nouvelles variables pour l'affichage amélioré
const viewMode = ref('grid'); // 'grid' ou 'list'
const currentPage = ref(1);
const itemsPerPage = ref(12);

// Données de la pensée actuelle (pour éviter les problèmes de typage avec le store)
const currentThoughtData = computed<PositiveThought>(() => {
  return positiveThoughtStore.currentThought || {
    content: "Chaque jour est une nouvelle chance de changer votre vie.",
    author: "Anonyme",
    category: ""
  };
});

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

// Liste des catégories disponibles
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
    (thought.author && String(thought.author).toLowerCase().includes(query)) ||
    (thought.category && thought.category.toLowerCase().includes(query))
  );
});

// Propriétés calculées pour la pagination
const totalPages = computed(() => Math.ceil(filteredThoughts.value.length / itemsPerPage.value));

const paginatedThoughts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredThoughts.value.slice(start, end);
});

// Calcul des pages à afficher dans la pagination (avec ellipses)
const displayedPages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    // Si moins de 7 pages, afficher toutes les pages
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Sinon, afficher une pagination avec ellipses
  if (current <= 3) {
    // Début de liste: 1 2 3 4 5 ... N
    return [1, 2, 3, 4, 5, '...', total] as const;
  } else if (current >= total - 2) {
    // Fin de liste: 1 ... N-4 N-3 N-2 N-1 N
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total] as const;
  } else {
    // Milieu de liste: 1 ... C-1 C C+1 ... N
    return [1, '...', current - 1, current, current + 1, '...', total] as const;
  }
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
    // Si des catégories sont sélectionnées, choisir une aléatoirement
    let categoryToFetch = null;

    if (selectedCategories.value.length > 0) {
      const randomIndex = Math.floor(Math.random() * selectedCategories.value.length);
      categoryToFetch = selectedCategories.value[randomIndex];
    }

    // Récupérer directement la pensée et la stocker dans une variable locale
    const thought = await positiveThoughtStore.getRandomPositiveThought(categoryToFetch);

    // Forcer une mise à jour explicite de l'état local si nécessaire
    if (thought) {
      // Cette ligne est importante pour assurer la réactivité
      positiveThoughtStore.currentThought = { ...thought };
    }

    toast.success('Nouvelle pensée positive chargée');
  } catch (error) {
    console.error('Erreur lors du rafraîchissement de la pensée:', error);
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
    currentPage.value = 1; // Réinitialiser la pagination
  } catch (error) {
    console.error('Erreur lors du chargement des pensées:', error);
    toast.error('Erreur lors du chargement des pensées');
  }
};

const fetchThoughtsByCategory = async (category: string) => {
  try {
    selectedCategory.value = category;
    const categoryThoughts = await positiveThoughtStore.getThoughtsByCategory(category);
    thoughts.value = categoryThoughts;
    currentPage.value = 1; // Réinitialiser la pagination
  } catch (error) {
    console.error(`Erreur lors du chargement des pensées de la catégorie ${category}:`, error);
    toast.error(`Erreur lors du chargement des pensées de la catégorie ${category}`);
  }
};

const setAsDailyThought = (thought: PositiveThought) => {
  try {
    // Utiliser la nouvelle méthode du store qui garantit la réactivité
    positiveThoughtStore.setCurrentThought(thought);
    toast.success('Pensée définie comme pensée du jour');
  } catch (error) {
    console.error('Erreur lors de la définition de la pensée du jour:', error);
    toast.error('Erreur lors de la définition de la pensée du jour');
  }
};

const saveSettings = async () => {
  if (isSaving.value) return;

  isSaving.value = true;
  try {
    // Mettre à jour les catégories préférées
    const updatedSettings = { ...settings.value };
    updatedSettings.preferredCategories = [...selectedCategories.value];

    // Sauvegarder les paramètres
    await positiveThoughtStore.updateUserSettings(updatedSettings);

    // Fermer le modal
    showSettingsModal.value = false;
    toast.success('Paramètres enregistrés avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des paramètres:', error);
    toast.error('Erreur lors de l\'enregistrement des paramètres');
  } finally {
    isSaving.value = false;
  }
};

const addThought = async () => {
  if (!isValidThought.value || isAddingThought.value) return;

  isAddingThought.value = true;
  try {
    // Gérer la nouvelle catégorie
    if (newThought.value.category === 'new' && newCategory.value) {
      newThought.value.category = newCategory.value;
      allCategories.value.push(newCategory.value);
    }

    // Créer la pensée
    const thought = await positiveThoughtStore.createThought(newThought.value);

    // Ajouter à la liste des pensées
    thoughts.value = [thought, ...thoughts.value];

    // Fermer le modal et réinitialiser le formulaire
    showAddThoughtModal.value = false;
    newThought.value = { content: '', author: '', category: '' };
    newCategory.value = '';

    toast.success('Pensée ajoutée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la pensée:', error);
    toast.error('Erreur lors de l\'ajout de la pensée');
  } finally {
    isAddingThought.value = false;
  }
};

const getCategoryIcon = (category: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// Initialisation
onMounted(async () => {
  try {
    // Initialiser le store
    await positiveThoughtStore.initialize();

    // Récupérer les paramètres utilisateur
    const userSettings = positiveThoughtStore.userSettings;
    if (userSettings) {
      // Copier les paramètres utilisateur dans l'état local
      settings.value = {
        enabled: userSettings.enabled,
        frequency: userSettings.frequency,
        customInterval: userSettings.customInterval,
        notificationEnabled: userSettings.notificationEnabled,
        displayOnLockScreen: userSettings.displayOnLockScreen,
        preferredCategories: userSettings.preferredCategories || []
      };

      // Définir les catégories sélectionnées
      if (userSettings.preferredCategories) {
        selectedCategories.value = [...userSettings.preferredCategories];
      }
    }

    // Récupérer toutes les pensées
    await fetchAllThoughts();
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la vue des pensées positives:', error);
  }
});

// Observer les changements de paramètres dans le store
watch(() => positiveThoughtStore.userSettings, (newSettings) => {
  if (newSettings) {
    // Mettre à jour les paramètres à partir du store
    settings.value = {
      enabled: newSettings.enabled,
      frequency: newSettings.frequency,
      customInterval: newSettings.customInterval,
      notificationEnabled: newSettings.notificationEnabled,
      displayOnLockScreen: newSettings.displayOnLockScreen,
      preferredCategories: newSettings.preferredCategories || []
    };

    // Mettre à jour les catégories sélectionnées
    if (newSettings.preferredCategories) {
      selectedCategories.value = [...newSettings.preferredCategories];
    }
  }
}, { deep: true });

// Réinitialiser la page courante quand la recherche change
watch(searchQuery, () => {
  currentPage.value = 1;
});
</script>

<style>
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
