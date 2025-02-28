<template>
  <DashboardLayout>
    <div class="mx-auto px-4 sm:px-6 md:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Budget mensuel</h1>
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Ajouter un budget
        </button>
      </div>

      <!-- Month selector -->
      <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div class="flex justify-between items-center">
          <div class="flex space-x-4">
            <button
              @click="navigateMonth(-1)"
              class="inline-flex items-center p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ChevronLeftIcon class="h-5 w-5" />
            </button>
            <div class="relative">
              <input
                type="month"
                v-model="selectedMonth"
                class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              />
            </div>
            <button
              @click="navigateMonth(1)"
              class="inline-flex items-center p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </div>
          <span class="text-lg font-medium text-gray-900 dark:text-white">
            {{ formatMonthYear(new Date(selectedMonth)) }}
          </span>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="mt-8 flex justify-center">
        <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Budget summary -->
      <div v-else class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
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
                      {{ formatCurrency(totalBudget) }}
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
                      {{ formatCurrency(totalExpenses) }}
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
                  remainingBudget > 0 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-red-100 dark:bg-red-900'
                ]"
              >
                <CurrencyDollarIcon
                  class="h-6 w-6"
                  :class="[
                    remainingBudget > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
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
                        remainingBudget > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
                      ]"
                    >
                      {{ formatCurrency(remainingBudget) }}
                      <span class="text-sm ml-1">
                        ({{ Math.min(100, spentPercentage) }}% utilisés)
                      </span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Budget by category -->
      <div class="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Budget par catégorie
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Détails et progression par catégorie pour {{ formatMonthYear(new Date(selectedMonth)) }}
          </p>
        </div>

        <div v-if="budgets.length === 0" class="p-6 text-center">
          <CurrencyDollarIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun budget</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Commencez par ajouter un budget pour une catégorie.
          </p>
          <div class="mt-6">
            <button
              @click="openCreateModal"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Ajouter un budget
            </button>
          </div>
        </div>

        <div v-else class="px-4 sm:px-6 py-5">
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="budget in budgets" :key="budget.id" class="py-4">
              <div class="flex items-center justify-between mb-2">
                <div v-if="budget.category" class="flex items-center">
  <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
       :style="{ backgroundColor: getCategoryColor(budget.category) }">
    <component :is="getCategoryIcon(budget.category.name)" class="h-5 w-5 text-white" />
  </div>
  <div class="ml-4">
    <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ budget.category.name }}</h4>
    <p class="text-sm text-gray-500 dark:text-gray-400">
      Budget: {{ formatCurrency(budget.amount) }}
    </p>
  </div>
</div>
<div v-else class="flex items-center">
  <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-gray-500">
    <SparklesIcon class="h-5 w-5 text-white" />
  </div>
  <div class="ml-4">
    <h4 class="text-sm font-medium text-gray-900 dark:text-white">Catégorie inconnue</h4>
    <p class="text-sm text-gray-500 dark:text-gray-400">
      Budget: {{ formatCurrency(budget.amount) }}
    </p>
  </div>
</div>
                <div class="flex space-x-3">
                  <button
                    @click="editBudget(budget)"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <PencilIcon class="h-3.5 w-3.5 mr-1" />
                    Modifier
                  </button>
                  <button
                    @click="deleteBudget(budget)"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon class="h-3.5 w-3.5 mr-1" />
                    Supprimer
                  </button>
                </div>
              </div>

              <div class="w-full mt-2">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="text-gray-500 dark:text-gray-400">
                    {{ formatCurrency(budget.spent ?? 0) }} dépensés
                  </span>
                  <span class="text-gray-500 dark:text-gray-400">
                    {{ getBudgetProgress(budget) }}%
                  </span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    class="h-2.5 rounded-full"
                    :style="{ width: `${Math.min(100, getBudgetProgress(budget))}%` }"
                    :class="[
                      getBudgetStatus(budget) === 'under' ? 'bg-green-600' :
                      getBudgetStatus(budget) === 'near' ? 'bg-yellow-600' :
                      'bg-red-600'
                    ]"
                  ></div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Available categories to budget -->
      <div v-if="availableCategories.length > 0" class="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Catégories disponibles
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Catégories sans budget pour {{ formatMonthYear(new Date(selectedMonth)) }}
          </p>
        </div>

        <div class="px-4 sm:px-6 py-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="category in availableCategories"
              :key="category.id"
              @click="createBudgetForCategory(category)"
              class="border border-gray-300 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center" :style="{ backgroundColor: category.color || '#4B5563' }">
                  <component :is="getCategoryIcon(category.name)" class="h-5 w-5 text-white" />
                </div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ category.name }}</div>
              </div>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Cliquez pour définir un budget
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit budget modal -->
    <TransitionRoot appear :show="showBudgetModal" as="template">
      <Dialog as="div" @close="showBudgetModal = false" class="relative z-10">
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
                  {{ editingBudget ? 'Modifier le budget' : 'Ajouter un budget' }}
                </DialogTitle>
                <div class="mt-4 space-y-4">
                  <div v-if="!editingBudget">
                    <label for="budget-category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Catégorie
                    </label>
                    <select
                      id="budget-category"
                      v-model="budgetForm.categoryId"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option v-for="category in availableCategories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>

                  <div v-else class="flex items-center space-x-3">
  <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
       :style="{ backgroundColor: categoryDisplay.color }">
    <component :is="categoryDisplay.icon" class="h-5 w-5 text-white" />
  </div>
  <div class="text-sm font-medium text-gray-900 dark:text-white">
    {{ categoryDisplay.name }}
  </div>
</div>

                  <div>
                    <label for="budget-month" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mois
                    </label>
                    <input
                      id="budget-month"
                      type="month"
                      v-model="budgetForm.month"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label for="budget-amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Montant (en euros)
                    </label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 dark:text-gray-400 sm:text-sm">€</span>
                      </div>
                      <input
                        id="budget-amount"
                        v-model="budgetForm.amount"
                        type="number"
                        min="0"
                        step="0.01"
                        class="pl-7 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label for="budget-notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notes
                    </label>
                    <textarea
                      id="budget-notes"
                      v-model="budgetForm.notes"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="Notes optionnelles"
                    ></textarea>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="showBudgetModal = false"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    :disabled="!isValidBudget || isSaving"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="saveBudget"
                  >
                    <span v-if="isSaving" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enregistrement...
                    </span>
                    <span v-else>{{ editingBudget ? 'Mettre à jour' : 'Ajouter' }}</span>
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
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { format } from 'date-fns';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import {
  CashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  TrendingDownIcon,
  ShoppingBagIcon,
  HomeIcon,
  TruckIcon,
  HeartIcon,
  TicketIcon,
  CakeIcon,
  DesktopComputerIcon,
  UserIcon,
  BriefcaseIcon,
  LightBulbIcon,
  OfficeBuildingIcon,
  ScaleIcon,
  SparklesIcon,
} from '@heroicons/vue/outline';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useFinanceStore } from '@/stores/finance';
import { formatCurrency, formatMonthYear } from '@/utils/formatters';
import type { Budget, ExpenseCategory } from '@/types/finance';

// Store and composables
const financeStore = useFinanceStore();
const route = useRoute();
const toast = useToast();

// Component state
const isLoading = ref(true);
const isSaving = ref(false);
const currentDate = new Date();
const selectedMonth = ref(format(currentDate, 'yyyy-MM'));
const budgets = ref<Budget[]>([]);
const categories = ref<ExpenseCategory[]>([]);
const showBudgetModal = ref(false);
const editingBudget = ref<Budget | null>(null);
const totalBudget = ref(0);
const totalExpenses = ref(0);

// Computed properties
const remainingBudget = computed(() => totalBudget.value - totalExpenses.value);
const spentPercentage = computed(() => {
  if (totalBudget.value === 0) return 0;
  return Math.round((totalExpenses.value / totalBudget.value) * 100);
});

const availableCategories = computed(() => {
  // Collecte des IDs de catégories qui ont déjà un budget
  const budgetCategoryIds = budgets.value
    .map(budget => budget.category?.id)
    .filter(Boolean); // Filtre les valeurs undefined/null

  // Utiliser un Set pour une recherche plus efficace
  const budgetCategoryIdSet = new Set(budgetCategoryIds);

  // Filtrer les catégories qui n'ont pas de budget
  return categories.value.filter(category =>
    // Vérifier que category.id existe ET qu'il n'est pas dans l'ensemble des IDs
    category.id && !budgetCategoryIdSet.has(category.id)
  );
});
const isValidBudget = computed(() => {
  return (
    (budgetForm.value.categoryId !== '' || editingBudget.value) &&
    budgetForm.value.month !== '' &&
    budgetForm.value.amount > 0
  );
});

// Ajouter cette propriété calculée dans votre script setup
const categoryDisplay = computed(() => {
  if (!editingBudget.value || !editingBudget.value.category) {
    return {
      name: 'Catégorie inconnue',
      color: '#4B5563',
      icon: SparklesIcon
    };
  }

  return {
    name: editingBudget.value.category.name,
    color: editingBudget.value.category.color || '#4B5563',
    icon: getCategoryIcon(editingBudget.value.category.name)
  };
});

// Form state
const budgetForm = ref<{
  categoryId: string;
  month: string;
  amount: number;
  notes: string;
}>({
  categoryId: '',
  month: selectedMonth.value,
  amount: 0,
  notes: '',
});

// Methods
const loadBudgets = async () => {
  isLoading.value = true;
  try {
    // Parse month to get year and month
    const [year, month] = selectedMonth.value.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);

    // Get budgets and financial summary for the selected month
    const [budgetsData, financialSummary] = await Promise.all([
      financeStore.fetchBudgets(date),
      financeStore.getMonthlyFinancialSummary(date)
    ]);

    // Ajouter les propriétés spent et month à chaque budget
    budgets.value = budgetsData.map(budget => {
      const categoryBreakdown = financialSummary.categoryBreakdown.find(
        cb => cb.category.id === budget.categoryId
      );

      return {
        ...budget,
        spent: categoryBreakdown?.amount || 0,
        month: selectedMonth.value, // Ajouter le mois actuel pour l'affichage
      };
    });

    totalBudget.value = financialSummary.totalBudget;
    totalExpenses.value = financialSummary.totalExpenses;
  } catch (error) {
    console.error('Error loading budgets:', error);
    toast.error('Erreur lors du chargement des budgets');
  } finally {
    isLoading.value = false;
  }
};

const loadCategories = async () => {
  try {
    // Utiliser fetchCategories au lieu d'appeler categories comme une fonction
    categories.value = await financeStore.fetchCategories();
  } catch (error) {
    console.error('Error loading categories:', error);
    toast.error('Erreur lors du chargement des catégories');
  }
};

const navigateMonth = (step: number) => {
  const [year, month] = selectedMonth.value.split('-');
  const newDate = new Date(parseInt(year), parseInt(month) - 1 + step, 1);
  selectedMonth.value = format(newDate, 'yyyy-MM');
};

const getCategoryIcon = (categoryName: string) => {
  const iconMap: Record<string, any> = {
    'Alimentation': ShoppingBagIcon,
    'Logement': HomeIcon,
    'Transport': TruckIcon,
    'Santé': HeartIcon,
    'Loisirs': TicketIcon,
    'Restaurant': CakeIcon,
    'Technologie': DesktopComputerIcon,
    'Personnel': UserIcon,
    'Travail': BriefcaseIcon,
    'Factures': LightBulbIcon,
    'Assurance': OfficeBuildingIcon,
    'Impôts': ScaleIcon,
    'Autres': SparklesIcon,
  };

  return iconMap[categoryName] || SparklesIcon;
};

const getCategoryColor = (category: ExpenseCategory): string => {
  if (category.color) return category.color;

  const colorMap: Record<string, string> = {
    'Alimentation': '#3B82F6', // blue-500
    'Logement': '#8B5CF6', // violet-500
    'Transport': '#10B981', // emerald-500
    'Santé': '#EF4444', // red-500
    'Loisirs': '#EC4899', // pink-500
    'Restaurant': '#F97316', // orange-500
    'Technologie': '#6366F1', // indigo-500
    'Personnel': '#14B8A6', // teal-500
    'Travail': '#4B5563', // gray-600
    'Factures': '#7C3AED', // violet-600
    'Assurance': '#1D4ED8', // blue-700
    'Impôts': '#B91C1C', // red-700
    'Autres': '#9CA3AF', // gray-400
  };

  return colorMap[category.name] || '#6B7280'; // gray-500 as default
};

const getBudgetProgress = (budget: Budget): number => {
  if (budget.amount === 0) return 0;
  // Utiliser 0 comme valeur par défaut si spent est undefined
  return Math.round(((budget.spent || 0) / budget.amount) * 100);
};

const getBudgetStatus = (budget: Budget): 'under' | 'near' | 'over' => {
  const progress = getBudgetProgress(budget);

  if (progress < 80) return 'under';
  if (progress < 100) return 'near';
  return 'over';
};

const openCreateModal = () => {
  editingBudget.value = null;
  budgetForm.value = {
    categoryId: '',
    month: selectedMonth.value,
    amount: 0,
    notes: '',
  };
  showBudgetModal.value = true;
};

const createBudgetForCategory = (category: ExpenseCategory) => {
  editingBudget.value = null;
  budgetForm.value = {
    categoryId: category.id || '',
    month: selectedMonth.value,
    amount: 0,
    notes: '',
  };
  showBudgetModal.value = true;
};

const editBudget = (budget: Budget) => {
  editingBudget.value = budget;
  budgetForm.value = {
    categoryId: budget.category?.id || '',
    month: budget.month || selectedMonth.value, // Valeur par défaut
    amount: budget.amount,
    notes: budget.notes || '',
  };
  showBudgetModal.value = true;
};

const saveBudget = async () => {
  if (!isValidBudget.value || isSaving.value) return;

  isSaving.value = true;
  try {
    const [year, month] = budgetForm.value.month.split('-');
    const budgetDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const yearMonth = format(budgetDate, 'yyyy-MM'); // Utilisez le format YYYY-MM pour yearMonth

    // Créer un objet budget conforme à l'interface
    const budgetData: Budget = {
      categoryId: editingBudget.value?.category?.id || budgetForm.value.categoryId,
      amount: budgetForm.value.amount,
      yearMonth: yearMonth,
      notes: budgetForm.value.notes
    };

    // Si on édite un budget existant, ajoutons son ID
    if (editingBudget.value?.id) {
      budgetData.id = editingBudget.value.id;
    }

    // Utiliser createOrUpdateBudget au lieu de updateBudget/createBudget
    await financeStore.createOrUpdateBudget(budgetData);

    toast.success(editingBudget.value
      ? 'Budget mis à jour avec succès'
      : 'Budget ajouté avec succès');

    showBudgetModal.value = false;
    loadBudgets();
  } catch (error) {
    console.error('Error saving budget:', error);
    toast.error('Erreur lors de l\'enregistrement du budget');
  } finally {
    isSaving.value = false;
  }
};

const deleteBudget = async (budget: Budget) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
    return;
  }

  try {
    await financeStore.deleteBudget(budget.id!);
    toast.success('Budget supprimé avec succès');
    loadBudgets();
  } catch (error) {
    console.error('Error deleting budget:', error);
    toast.error('Erreur lors de la suppression du budget');
  }
};

// Initialize
onMounted(async () => {
  // Check if category id is specified in the URL
  const categoryId = route.query.category as string;

  await Promise.all([loadCategories(), loadBudgets()]);

  // If category is specified, open create modal for that category
  if (categoryId && categories.value.find(c => c.id === categoryId)) {
    budgetForm.value.categoryId = categoryId;
    showBudgetModal.value = true;
  }
});

// Watch for changes in selected month
watch(selectedMonth, () => {
  loadBudgets();
});
</script>
