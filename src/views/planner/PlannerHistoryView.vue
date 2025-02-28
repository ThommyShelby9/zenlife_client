<template>
  <DashboardLayout>
    <div class="mx-auto px-4 sm:px-6 md:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Historique du planning</h1>
        <RouterLink
          to="/"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <CalendarIcon class="h-4 w-4 mr-2" />
          Planning du jour
        </RouterLink>
      </div>

      <!-- Filters -->
      <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <!-- Date range filter -->
          <div class="flex items-center space-x-4">
            <div>
              <label for="start-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Du</label>
              <input
                type="date"
                id="start-date"
                v-model="filters.startDate"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label for="end-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Au</label>
              <input
                type="date"
                id="end-date"
                v-model="filters.endDate"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <!-- Task status filter -->
          <div class="w-full md:w-48">
            <label for="completion" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Statut</label>
            <select
              id="completion"
              v-model="filters.completion"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="completed">Terminées</option>
              <option value="incomplete">Non terminées</option>
            </select>
          </div>

          <!-- Task priority filter -->
          <div class="w-full md:w-48">
            <label for="priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Priorité</label>
            <select
              id="priority"
              v-model="filters.priority"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Toutes les priorités</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
          </div>

          <!-- Search filter -->
          <div class="w-full md:w-64">
            <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Recherche</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                id="search"
                v-model="filters.search"
                class="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white pr-10"
                placeholder="Rechercher..."
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <SearchIcon class="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            @click="applyFilters"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FilterIcon class="h-4 w-4 mr-2" />
            Filtrer
          </button>
          <button
            @click="resetFilters"
            class="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <RefreshIcon class="h-4 w-4 mr-2" />
            Réinitialiser
          </button>
        </div>
      </div>

      <!-- Analytics -->
      <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Tasks completed -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
                <CheckCircleIcon class="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Tâches terminées
                  </dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ analytics.completedCount }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Tasks incomplete -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900 rounded-md p-3">
                <ClockIcon class="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Tâches non terminées
                  </dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ analytics.incompleteCount }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Completion rate -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-md p-3">
                <ChartBarIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Taux de complétion
                  </dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ analytics.completionRate }}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Average mood -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-pink-100 dark:bg-pink-900 rounded-md p-3">
                <EmojiHappyIcon class="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Humeur moyenne
                  </dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      {{ analytics.averageMood.toFixed(1) }}
                      <span class="ml-2 text-yellow-500">★</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="mt-8 flex justify-center">
        <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Daily tasks list -->
      <div v-else-if="days.length > 0" class="mt-8">
        <div v-for="day in days" :key="day.date" class="mb-8">
          <div class="flex items-center">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">{{ formatDayHeader(day.date) }}</h2>
            <div class="ml-4 flex items-center">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                Tâches terminées: {{ day.completedCount }}/{{ day.tasks.length }}
              </span>
              <div class="ml-4 flex items-center">
                <span class="text-sm text-gray-500 dark:text-gray-400 mr-2">Humeur:</span>
                <div class="flex">
                  <span v-for="i in 5" :key="i" :class="i <= (day.moodRating ?? 0) ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'">★</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <ul class="divide-y divide-gray-200 dark:divide-gray-700">
              <li v-for="task in day.tasks" :key="task.id" class="px-4 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div :class="[
                      'flex-shrink-0 h-4 w-4 rounded-full',
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    ]"></div>
                    <div class="ml-3">
                      <p :class="[
                        'text-sm font-medium',
                        task.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-white'
                      ]">
                        {{ task.title }}
                      </p>
                      <p v-if="task.dueTime" class="text-xs text-gray-500 dark:text-gray-400">
                        Échéance: {{ task.dueTime }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="[
                      task.completed
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    ]">
                      {{ task.completed ? 'Terminée' : 'En cours' }}
                    </span>
                  </div>
                </div>
                <div v-if="task.notes" class="mt-2 ml-7">
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ task.notes }}</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Daily reflection -->
          <div v-if="day.reflection" class="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-4">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Réflexion du jour</h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{{ day.reflection }}</p>
          </div>
        </div>

        <!-- Pagination -->
        <div class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6 mt-8 rounded-lg shadow">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="loadPrevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              @click="loadNextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Affichage de <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> à <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span> sur <span class="font-medium">{{ totalItems }}</span> jours
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="loadPrevPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Précédent</span>
                  <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    page === currentPage
                      ? 'z-10 bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-600 dark:text-primary-200'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="loadNextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Suivant</span>
                  <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg py-8 px-4 text-center">
        <ClipboardListIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun historique</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Vous n'avez pas encore d'historique de planning.
        </p>
        <div class="mt-6">
          <RouterLink
            to="/"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <CalendarIcon class="h-4 w-4 mr-2" />
            Aller au planning du jour
          </RouterLink>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { format, parseISO, isToday, isYesterday, addDays, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  SearchIcon,
  FilterIcon,
  RefreshIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardListIcon,
} from '@heroicons/vue/outline';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { usePlannerStore } from '@/stores/planner';
import type { DailyPlanner } from '@/types/planner';

// Store and composables
const plannerStore = usePlannerStore();
const toast = useToast();

// Component state
const isLoading = ref(true);
const days = ref<DailyPlanner[]>([]);

// Pagination state
const currentPage = ref(1);
const pageSize = ref(7); // One week at a time
const totalItems = ref(0);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));
const visiblePages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Filters state
const filters = reactive({
  search: '',
  startDate: format(addDays(new Date(), -30), 'yyyy-MM-dd'), // Default to last 30 days
  endDate: format(new Date(), 'yyyy-MM-dd'),
  completion: 'all',
  priority: 'all',
});

// Analytics state
const analytics = reactive({
  completedCount: 0,
  incompleteCount: 0,
  completionRate: 0,
  averageMood: 0,
});

// Methods
const loadHistory = async () => {
  isLoading.value = true;
  try {
    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);

    // Fetch history data with appropriate typing
    const historyData = await plannerStore.getPlannerHistory({
      startDate,
      endDate,
      page: currentPage.value,
      pageSize: pageSize.value,
      search: filters.search,
      completion: filters.completion,
      priority: filters.priority,
    });


    historyData.days.forEach(day => {
    day.completedCount = day.tasks.filter(task => task.completed).length;
  });

  days.value = historyData.days;

    totalItems.value = historyData.total;

    // Calculate analytics
    calculateAnalytics();
  } catch (error) {
    console.error('Error loading planner history:', error);
    toast.error('Erreur lors du chargement de l\'historique du planning');
  } finally {
    isLoading.value = false;
  }
};

const calculateAnalytics = () => {
  let completedCount = 0;
  let incompleteCount = 0;
  let totalMood = 0;
  let daysWithMood = 0;

  days.value.forEach(day => {
    // Count completed and incomplete tasks
    completedCount += day.tasks.filter(task => task.completed).length;
    incompleteCount += day.tasks.filter(task => !task.completed).length;

    // Sum mood ratings
    if (day.moodRating !== undefined && day.moodRating > 0) {
      totalMood += day.moodRating;
      daysWithMood++;
    }
  });

  const totalTasks = completedCount + incompleteCount;

  analytics.completedCount = completedCount;
  analytics.incompleteCount = incompleteCount;
  analytics.completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  analytics.averageMood = daysWithMood > 0 ? totalMood / daysWithMood : 0;
};

const formatDayHeader = (dateString: string): string => {
  try {
    const date = parseISO(dateString);

    if (isToday(date)) {
      return "Aujourd'hui";
    } else if (isYesterday(date)) {
      return 'Hier';
    } else {
      return format(date, 'EEEE d MMMM yyyy', { locale: fr });
    }
  } catch (error) {
    return dateString;
  }
};

const applyFilters = () => {
  currentPage.value = 1;
  loadHistory();
};

const resetFilters = () => {
  filters.search = '';
  filters.startDate = format(addDays(new Date(), -30), 'yyyy-MM-dd');
  filters.endDate = format(new Date(), 'yyyy-MM-dd');
  filters.completion = 'all';
  filters.priority = 'all';

  currentPage.value = 1;
  loadHistory();
};

const loadPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadHistory();
  }
};

const loadNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    loadHistory();
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
  loadHistory();
};

// Initialize
onMounted(async () => {
  await loadHistory();
});
</script>
