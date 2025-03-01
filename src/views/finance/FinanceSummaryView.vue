<template>
  <DashboardLayout>
    <div class="mx-auto px-4 sm:px-6 md:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Résumé financier</h1>
        <div class="flex space-x-2">
      <RouterLink
        to="/finance/budget"
        class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <CashIcon class="h-4 w-4 mr-1" />
        Budget
      </RouterLink>
      <RouterLink
        to="/finance/expense"
        class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <ReceiptTaxIcon class="h-4 w-4 mr-1" />
        Dépenses
      </RouterLink>
    </div>
        <div class="flex space-x-4">
          <div class="relative">
            <input
              type="month"
              v-model="selectedMonth"
              class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              :max="maxMonth"
              @change="fetchFinancialSummary"
            />
          </div>
          <div class="flex space-x-2">
            <button
              @click="navigateMonth(-1)"
              class="inline-flex items-center p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ChevronLeftIcon class="h-5 w-5" />
            </button>
            <button
              @click="navigateMonth(1)"
              class="inline-flex items-center p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              :disabled="isCurrentMonth"
            >
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="mt-8 flex justify-center">
        <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else>
        <!-- Financial overview cards -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- Total budget card -->
          <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
                  <CashIcon class="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Budget total
                    </dt>
                    <dd>
                      <div class="text-lg font-medium text-gray-900 dark:text-white">
                        {{ formatCurrency(summary.totalBudget) }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Total expenses card -->
          <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-red-100 dark:bg-red-900 rounded-md p-3">
                  <TrendingDownIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Dépenses totales
                    </dt>
                    <dd>
                      <div class="text-lg font-medium text-gray-900 dark:text-white">
                        {{ formatCurrency(summary.totalExpenses) }}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Remaining budget card -->
          <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 rounded-md p-3"
                  :class="[
                    summary.budgetStatus === 'under' ? 'bg-blue-100 dark:bg-blue-900' :
                    summary.budgetStatus === 'near' ? 'bg-yellow-100 dark:bg-yellow-900' :
                    'bg-red-100 dark:bg-red-900'
                  ]"
                >
                  <CurrencyDollarIcon
                    class="h-6 w-6"
                    :class="[
                      summary.budgetStatus === 'under' ? 'text-blue-600 dark:text-blue-400' :
                      summary.budgetStatus === 'near' ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    ]"
                  />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Budget restant
                    </dt>
                    <dd>
                      <div
                        class="text-lg font-medium"
                        :class="[
                          summary.budgetStatus === 'under' ? 'text-blue-600 dark:text-blue-400' :
                          summary.budgetStatus === 'near' ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        ]"
                      >
                        {{ formatCurrency(summary.remaining) }}
                        <span
                          v-if="summary.spentPercentage > 0"
                          class="text-sm ml-1"
                        >
                          ({{ summary.spentPercentage.toFixed(1) }}% utilisés)
                        </span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Spending by category -->
        <div class="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Dépenses par catégorie
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Répartition de vos dépenses par catégorie pour {{ formatMonthYear(new Date(selectedMonth)) }}
            </p>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <div v-if="summary.categoryBreakdown && summary.categoryBreakdown.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Pie chart -->
              <div class="flex flex-col items-center">
                <div class="h-64 w-full">
                  <DoughnutChart
                    :data="chartData"
                    :colors="chartColors"
                    :labels="chartLabels"
                  />
                </div>
                <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Cliquez sur une catégorie pour voir les détails
                </div>
              </div>

              <!-- Category breakdown table -->
              <div class="overflow-hidden">
                <div class="flex flex-col">
                  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div class="overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Catégorie
                              </th>
                              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Montant
                              </th>
                              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                %
                              </th>
                              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Budget
                              </th>
                            </tr>
                          </thead>
                          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            <tr
                              v-for="category in summary.categoryBreakdown"
                              :key="category.category.id"
                              @click="showCategoryDetails(category)"
                              class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                            >
                              <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                  <div class="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center" :style="{ backgroundColor: getCategoryColor(category.category) }">
                                    <component :is="getCategoryIcon(category.category)" class="h-4 w-4 text-white" />
                                  </div>
                                  <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                                      {{ category.category.name }}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                                {{ formatCurrency(category.amount) }}
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                                {{ category.percentage.toFixed(1) }}%
                              </td>
                              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                                <div v-if="category.budget" :class="[
                                  category.status === 'under' ? 'text-green-600 dark:text-green-400' :
                                  category.status === 'near' ? 'text-yellow-600 dark:text-yellow-400' :
                                  'text-red-600 dark:text-red-400'
                                ]">
                                  {{ formatCurrency(category.budget) }}
                                  <span class="ml-1 text-xs">
                                    ({{ ((category.amount / category.budget) * 100).toFixed(0) }}%)
                                  </span>
                                </div>
                                <div v-else class="text-gray-500 dark:text-gray-400">
                                  Non défini
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="py-6 text-center">
              <CurrencyDollarIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune dépense</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Vous n'avez pas encore de dépenses pour ce mois.
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

        <!-- Recent expenses -->
        <div class="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Dépenses récentes
              </h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Vos dernières transactions
              </p>
            </div>
            <RouterLink
              to="/finance/expense"
              class="text-sm font-medium text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Voir tout
            </RouterLink>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <div v-if="summary.recentExpenses && summary.recentExpenses.length > 0">
              <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                <li v-for="expense in summary.recentExpenses" :key="expense.id" class="py-4 flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center" :style="{ backgroundColor: getCategoryColor(expense.category) }">
                      <component :is="getCategoryIcon(expense.category)" class="h-5 w-5 text-white" />
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
            <div v-else class="py-6 text-center">
              <ReceiptTaxIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune dépense récente</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Commencez à suivre vos dépenses pour une meilleure gestion financière.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category details modal -->
    <TransitionRoot appear :show="showCategoryModal" as="template">
      <Dialog as="div" @close="closeCategoryModal" class="relative z-10">
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
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Détails de la catégorie: {{ selectedCategory?.category.name }}
                </DialogTitle>

                <div v-if="selectedCategory" class="mt-4">
                  <div class="flex items-center mb-4">
                    <div class="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center" :style="{ backgroundColor: getCategoryColor(selectedCategory.category) }">
                      <component :is="getCategoryIcon(selectedCategory.category)" class="h-6 w-6 text-white" />
                    </div>
                    <div class="ml-4">
                      <h4 class="text-xl font-semibold text-gray-900 dark:text-white">
                        {{ formatCurrency(selectedCategory.amount) }}
                      </h4>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ selectedCategory.percentage.toFixed(1) }}% de vos dépenses totales
                      </p>
                    </div>
                  </div>

                  <div v-if="selectedCategory.budget" class="mb-6">
                    <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Budget: {{ formatCurrency(selectedCategory.budget) }}</h5>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        class="h-2.5 rounded-full"
                        :style="{ width: `${Math.min(100, (selectedCategory.amount / selectedCategory.budget) * 100)}%` }"
                        :class="[
                          selectedCategory.status === 'under' ? 'bg-green-600' :
                          selectedCategory.status === 'near' ? 'bg-yellow-600' :
                          'bg-red-600'
                        ]"
                      ></div>
                    </div>
                    <div class="flex justify-between text-xs mt-1">
                      <span class="text-gray-500 dark:text-gray-400">0</span>
                      <span class="text-gray-500 dark:text-gray-400">{{ formatCurrency(selectedCategory.budget) }}</span>
                    </div>
                  </div>

                  <!-- Category expenses list -->
                  <div class="mt-6">
                    <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dépenses de cette catégorie</h5>
                    <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                      <li v-for="expense in categoryExpenses" :key="expense.id" class="py-4 flex items-center justify-between">
                        <div>
                          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ expense.title }}</p>
                          <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(expense.date) }}</p>
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
                </div>

                <div class="mt-6 flex justify-between">
                  <RouterLink
                    :to="`/finance/budget?category=${selectedCategory?.category.id}`"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-100 dark:bg-primary-900 px-4 py-2 text-sm font-medium text-primary-900 dark:text-primary-100 hover:bg-primary-200 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Définir un budget
                  </RouterLink>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="closeCategoryModal"
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
  CashIcon,
  TrendingDownIcon,
  CurrencyDollarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ReceiptTaxIcon,
  PlusIcon,
  ShoppingBagIcon,
  HomeIcon,
  TruckIcon,
  AcademicCapIcon,
  HeartIcon,
  TicketIcon,
  CakeIcon,
  DesktopComputerIcon,
  UserIcon,
  BriefcaseIcon,
  GiftIcon,
  LightBulbIcon,
  OfficeBuildingIcon,
  ScaleIcon,
  SparklesIcon,
} from '@heroicons/vue/outline';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import DoughnutChart from '@/components/finance/DoughnutChart.vue';
import { useFinanceStore } from '@/stores/finance';
import type { CategoryBreakdown, Expense, ExpenseCategory, FinancialSummary } from '@/types/finance';
import { formatCurrency, formatDate, formatMonthYear } from '@/utils/formatters';
import { format } from 'date-fns';

// Store and composables
const financeStore = useFinanceStore();
const router = useRouter();
const toast = useToast();

// Component state
const isLoading = ref(true);
const selectedMonth = ref(format(new Date(), 'yyyy-MM'));
const summary = ref<FinancialSummary>({
  totalExpenses: 0,
  totalBudget: 0,
  remaining: 0,
  spentPercentage: 0,
  categoryBreakdown: [],
  recentExpenses: [],
  budgetStatus: 'under'
});

// Category modal state
const showCategoryModal = ref(false);
const selectedCategory = ref<CategoryBreakdown | null>(null);
const categoryExpenses = ref<Expense[]>([]);

// Computed properties
const maxMonth = computed(() => {
  return format(new Date(), 'yyyy-MM');
});

const isCurrentMonth = computed(() => {
  return selectedMonth.value === format(new Date(), 'yyyy-MM');
});

// Chart data
const chartData = computed(() => {
  return summary.value.categoryBreakdown.map(category => category.amount);
});

const chartLabels = computed(() => {
  return summary.value.categoryBreakdown.map(category => category.category.name);
});

const chartColors = computed(() => {
  return summary.value.categoryBreakdown.map(category => getCategoryColor(category.category));
});

// Methods// Ajoutez des logs pour déboguer
const fetchFinancialSummary = async () => {
  isLoading.value = true;
  try {
    const [year, month] = selectedMonth.value.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    console.log("Fetching data for:", date);

    const financialSummary = await financeStore.getMonthlyFinancialSummary(date);
    console.log("Received summary:", financialSummary);
    summary.value = financialSummary;
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    toast.error('Erreur lors du chargement du résumé financier');
  } finally {
    isLoading.value = false;
  }
};

const navigateMonth = (step: number) => {
  const [year, month] = selectedMonth.value.split('-');
  const newDate = new Date(parseInt(year), parseInt(month) - 1 + step, 1);

  if (newDate > new Date()) {
    return; // Don't allow future months
  }

  selectedMonth.value = format(newDate, 'yyyy-MM');
};

const showCategoryDetails = async (category: CategoryBreakdown) => {
  selectedCategory.value = category;
  showCategoryModal.value = true;

  try {
    // Get expenses for this category in the selected month
    const [year, month] = selectedMonth.value.split('-');
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const expenses = await financeStore.getExpensesByCategory(
      category.category.id!, // Utilisation de l'assertion non-null
      startDate,
      endDate
    );
    categoryExpenses.value = expenses;
  } catch (error) {
    console.error('Error fetching category expenses:', error);
    toast.error('Erreur lors du chargement des dépenses de la catégorie');
  }
};

const closeCategoryModal = () => {
  showCategoryModal.value = false;
  selectedCategory.value = null;
  categoryExpenses.value = [];
};

const getCategoryIcon = (category: ExpenseCategory) => {
  const iconMap: { [key: string]: any } = {
    'Alimentation': ShoppingBagIcon,
    'Logement': HomeIcon,
    'Transport': TruckIcon,
    'Éducation': AcademicCapIcon,
    'Santé': HeartIcon,
    'Loisirs': TicketIcon,
    'Restaurant': CakeIcon,
    'Technologie': DesktopComputerIcon,
    'Personnel': UserIcon,
    'Travail': BriefcaseIcon,
    'Cadeaux': GiftIcon,
    'Factures': LightBulbIcon,
    'Assurance': OfficeBuildingIcon,
    'Impôts': ScaleIcon,
    'Autres': SparklesIcon,
  };

  return iconMap[category.name] || CurrencyDollarIcon;
};

const getCategoryColor = (category: ExpenseCategory) => {
  if (category.color) return category.color;

  const colorMap: { [key: string]: string } = {
    'Alimentation': '#3B82F6', // blue-500
    'Logement': '#8B5CF6', // violet-500
    'Transport': '#10B981', // emerald-500
    'Éducation': '#F59E0B', // amber-500
    'Santé': '#EF4444', // red-500
    'Loisirs': '#EC4899', // pink-500
    'Restaurant': '#F97316', // orange-500
    'Technologie': '#6366F1', // indigo-500
    'Personnel': '#14B8A6', // teal-500
    'Travail': '#4B5563', // gray-600
    'Cadeaux': '#DB2777', // pink-600
    'Factures': '#7C3AED', // violet-600
    'Assurance': '#1D4ED8', // blue-700
    'Impôts': '#B91C1C', // red-700
    'Autres': '#9CA3AF', // gray-400
  };

  return colorMap[category.name] || '#6B7280'; // gray-500 as default
};

// Initialize
onMounted(async () => {
  await fetchFinancialSummary();
});

// Watch for changes to selected month
watch(selectedMonth, async () => {
  await fetchFinancialSummary();
});
</script>
