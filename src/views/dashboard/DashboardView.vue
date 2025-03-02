<template>
  <DashboardLayout>
    <div class="mx-auto px-4 sm:px-6 md:px-8">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Tableau de bord</h1>

      <!-- Welcome section -->
      <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Bienvenue, {{ user?.fullName }}
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              {{ getTodayDate() }}
            </p>
          </div>
          <div class="flex space-x-3">
            <RouterLink
              to="/planner/today"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <CalendarIcon class="h-4 w-4 mr-2" />
              Mon planning
            </RouterLink>
          </div>
        </div>
        <div class="px-4 py-5 sm:p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Water tracker card -->
            <div class="bg-blue-50 dark:bg-gray-700 rounded-lg px-4 py-5 border border-blue-100 dark:border-gray-600">
              <div class="flex items-center">
                <CloudIcon class="h-8 w-8 text-blue-500 dark:text-blue-400" />
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-blue-900 dark:text-blue-100">Consommation d'eau</h4>
                  <div class="mt-1 flex items-baseline">
                    <p class="text-2xl font-semibold text-blue-700 dark:text-blue-200">
                      {{ waterProgress.current }}ml
                    </p>
                    <p class="ml-2 text-sm text-blue-500 dark:text-blue-300">
                      / {{ waterProgress.goal }}ml
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-3">
                <div class="relative pt-1">
                  <div class="overflow-hidden h-2 text-xs flex rounded bg-blue-200 dark:bg-gray-600">
                    <div
                      :style="`width: ${(waterProgress.current / waterProgress.goal) * 100}%`"
                      class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>
                <div class="mt-3 text-right">
                  <button
                    @click="logWater()"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon class="h-3.5 w-3.5 mr-1" />
                    Ajouter un verre
                  </button>
                </div>
              </div>
            </div>

            <!-- Budget tracker card -->
            <div class="bg-green-50 dark:bg-gray-700 rounded-lg px-4 py-5 border border-green-100 dark:border-gray-600">
              <div class="flex items-center">
                <CurrencyDollarIcon class="h-8 w-8 text-green-500 dark:text-green-400" />
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-green-900 dark:text-green-100">Budget du mois</h4>
                  <div class="mt-1 flex items-baseline">
                    <p class="text-2xl font-semibold text-green-700 dark:text-green-200">
                      {{ formatCurrency(budgetProgress.spent) }}
                    </p>
                    <p class="ml-2 text-sm text-green-500 dark:text-green-300">
                      / {{ formatCurrency(budgetProgress.total) }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-3">
                <div class="relative pt-1">
                  <div class="overflow-hidden h-2 text-xs flex rounded bg-green-200 dark:bg-gray-600">
                    <div
                      :style="`width: ${(budgetProgress.spent / budgetProgress.total) * 100}%`"
                      :class="[
                        'shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center',
                        (budgetProgress.spent / budgetProgress.total) > 0.8 ? 'bg-red-500' : 'bg-green-500'
                      ]"
                    ></div>
                  </div>
                </div>
                <div class="mt-3 text-right">
                  <button
                    @click="router.push('/finance/expense')"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <CurrencyDollarIcon class="h-3.5 w-3.5 mr-1" />
                    Ajouter une dépense
                  </button>
                </div>
              </div>
            </div>

            <!-- Positive thought card -->
            <div class="bg-purple-50 dark:bg-gray-700 rounded-lg px-4 py-5 border border-purple-100 dark:border-gray-600">
              <div class="flex items-center">
                <LightBulbIcon class="h-8 w-8 text-purple-500 dark:text-purple-400" />
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-purple-900 dark:text-purple-100">Pensée positive</h4>
                </div>
              </div>
              <div class="mt-3">
                <blockquote class="text-sm italic text-gray-700 dark:text-gray-300">
                  "{{ positiveThought.content }}"
                </blockquote>
                <div class="mt-2 text-xs text-right text-gray-500 dark:text-gray-400">
                  {{ positiveThought.author || 'Anonyme' }}
                </div>
              </div>
              <div class="mt-3 text-right">
                <button
                  @click="refreshPositiveThought"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <RefreshIcon class="h-3.5 w-3.5 mr-1" />
                  Nouvelle pensée
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Daily planner preview -->
      <div class="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Votre planning d'aujourd'hui</h3>
        </div>
        <div class="px-4 py-5 sm:p-6">
          <div v-if="dailyPlanner && dailyPlanner.tasks && dailyPlanner.tasks.length > 0">
            <ul class="divide-y divide-gray-200 dark:divide-gray-700">
              <li v-for="(task, index) in dailyPlanner.tasks.slice(0, 3)" :key="index" class="py-4">
                <div class="flex items-center">
                  <input
                    :id="`task-${index}`"
                    type="checkbox"
                    :checked="task.completed"
                    @change="toggleTaskStatus(task)"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-700 dark:bg-gray-700"
                  />
                  <label :for="`task-${index}`" class="ml-3 block" :class="task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'">
                    {{ task.title }}
                  </label>
                </div>
                <p v-if="task.notes" class="mt-1 text-sm text-gray-500 dark:text-gray-400 ml-7">
                  {{ task.notes }}
                </p>
              </li>
            </ul>
            <div v-if="dailyPlanner.tasks.length > 3" class="mt-4 text-center">
              <RouterLink to="/planner/today" class="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                Voir toutes les tâches
                <ArrowRightIcon class="ml-1 h-4 w-4" />
              </RouterLink>
            </div>
          </div>
          <div v-else class="text-center py-6">
            <CalendarIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune tâche pour aujourd'hui</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Commencez à planifier votre journée en ajoutant des tâches.
            </p>
            <div class="mt-6">
              <RouterLink
                to="/planner/today"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon class="h-4 w-4 mr-2" />
                Ajouter des tâches
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent expenses -->
      <div class="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Dépenses récentes</h3>
          <RouterLink
            to="/finance/expense"
            class="text-sm font-medium text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Voir tout
          </RouterLink>
        </div>
        <div class="px-4 py-5 sm:p-6">
          <div v-if="recentExpenses.length > 0">
            <ul class="divide-y divide-gray-200 dark:divide-gray-700">
              <li v-for="expense in recentExpenses" :key="expense.id" class="py-4 flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <component
                      :is="getCategoryIcon(expense.category.name)"
                      class="h-5 w-5 text-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ expense.title }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(expense.date) }}</p>
                  </div>
                </div>
                <p
                  class="text-sm font-medium"
                  :class="expense.amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'"
                >
                  {{ formatCurrency(expense.amount) }}
                </p>
              </li>
            </ul>
          </div>
          <div v-else class="text-center py-6">
            <CurrencyDollarIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune dépense récente</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Commencez à suivre vos dépenses pour une meilleure gestion financière.
            </p>
            <div class="mt-6">
              <RouterLink
                to="/finance/expense"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon class="h-4 w-4 mr-2" />
                Ajouter une dépense
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from 'vue-toastification';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useUserStore } from '@/stores/user';
import { useWaterReminderStore } from '@/stores/waterReminder';
import { usePositiveThoughtStore } from '@/stores/positiveThought';
import { usePlannerStore } from '@/stores/planner';
import { useFinanceStore } from '@/stores/finance';
import type { PositiveThought } from '@/types/positiveThought';
import type { Expense } from '@/types/finance';
import type { WaterProgressData } from '@/types/waterReminder';
import type { DailyPlanner } from '@/types/planner';
import type { FinancialSummary } from '@/types/finance';
import { formatCurrency, formatMonthYear } from '@/utils/formatters';



// Icons import
import {
  CalendarIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  PlusIcon,
  RefreshIcon,
  ArrowRightIcon,
  CloudIcon,
  ShoppingBagIcon,
  HomeIcon,
  TruckIcon,
  AcademicCapIcon,
  HeartIcon,
  TicketIcon,
  CakeIcon,
  DesktopComputerIcon
} from '@heroicons/vue/outline';

// Stores
const userStore = useUserStore();
const waterReminderStore = useWaterReminderStore();
const positiveThoughtStore = usePositiveThoughtStore();
const plannerStore = usePlannerStore();
const financeStore = useFinanceStore();

// Router and toast
const router = useRouter();
const toast = useToast();

// Component state
const user = computed(() => userStore.user);
const dailyPlanner = ref<DailyPlanner | null>(null);
const recentExpenses = ref<Expense[]>([]);

// Water progress data
const waterProgress = ref({
  current: 0,
  goal: 2000
});

// Budget progress data
const budgetProgress = ref({
  spent: 0,
  total: 1000
});

// Positive thought data
const positiveThought = ref<PositiveThought>({
  content: "Chaque jour est une nouvelle chance de changer votre vie.",
  author: "Anonyme"
});

// Format date method
const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd MMM yyyy', { locale: fr });
  } catch (error) {
    return date;
  }
};

// Get today's date formatted
const getTodayDate = () => {
  return format(new Date(), 'EEEE d MMMM yyyy', { locale: fr });
};

// Format currency method


// Get category icon
const getCategoryIcon = (categoryName: string) => {
  const iconMap: { [key: string]: any } = {
    'Alimentation': ShoppingBagIcon,
    'Logement': HomeIcon,
    'Transport': TruckIcon,
    'Éducation': AcademicCapIcon,
    'Santé': HeartIcon,
    'Loisirs': TicketIcon,
    'Restaurant': CakeIcon,
    'Technologie': DesktopComputerIcon,
  };

  return iconMap[categoryName] || CurrencyDollarIcon;
};

// Log water method
const logWater = async () => {
  try {
    const glassSize = 250; // Default glass size in ml
    await waterReminderStore.logWaterIntake(glassSize);
    waterProgress.value.current += glassSize;
    toast.success(`${glassSize}ml d'eau ajoutés !`);
  } catch (error) {
    console.error('Error logging water:', error);
    toast.error('Erreur lors de l\'ajout d\'eau');
  }
};

// Refresh positive thought
const refreshPositiveThought = async () => {
  try {
    const thought = await positiveThoughtStore.getRandomPositiveThought();
    positiveThought.value = thought;
  } catch (error) {
    console.error('Error refreshing positive thought:', error);
    toast.error('Erreur lors du rafraîchissement de la pensée positive');
  }
};

// Toggle task status
const toggleTaskStatus = async (task: any) => {
  try {
    task.completed = !task.completed;
    await plannerStore.updateTask(task);
    toast.success(`Tâche ${task.completed ? 'marquée comme terminée' : 'marquée comme non terminée'}`);
  } catch (error) {
    console.error('Error toggling task status:', error);
    toast.error('Erreur lors de la mise à jour de la tâche');
  }
};

onMounted(async () => {
  try {
    // Fetch user data if not already loaded
    if (!userStore.user) {
      await userStore.fetchCurrentUser();
    }

    // Fetch water progress
    const waterData: WaterProgressData = await waterReminderStore.getDailyProgress();
    waterProgress.value = {
      current: waterData.currentIntake || 0,
      goal: waterData.dailyGoal || 2000
    };

    // Fetch positive thought
    const thought = await positiveThoughtStore.getRandomPositiveThought();
    positiveThought.value = thought;

    // Fetch daily planner
    dailyPlanner.value = await plannerStore.getTodayPlanner();

    // Fetch budget progress
    const summary: FinancialSummary = await financeStore.getMonthlyFinancialSummary(new Date());
    budgetProgress.value = {
      spent: summary.totalExpenses || 0,
      total: summary.totalBudget || 1000
    };

    // Fetch recent expenses
    recentExpenses.value = summary.recentExpenses || [];
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    toast.error('Erreur lors du chargement des données du tableau de bord');
  }
});
</script>
