<template>
  <DashboardLayout>
    <div class="mx-auto px-4 sm:px-6 md:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Gestion des dépenses</h1>
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Ajouter une dépense
        </button>
      </div>

      <!-- Filters and controls -->
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

          <!-- Category filter -->
          <div class="w-full md:w-48">
            <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Catégorie</label>
            <select
              id="category"
              v-model="filters.categoryId"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="">Toutes les catégories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
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

      <!-- Loading state -->
      <div v-if="isLoading" class="mt-8 flex justify-center">
        <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Expenses list -->
      <div v-else-if="expenses.length > 0" class="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
          <li v-for="expense in expenses" :key="expense.id" class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" @click="openExpenseDetails(expense)">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center" :style="{ backgroundColor: expense.category.color || '#4B5563' }">
                  <component :is="getCategoryIcon(expense.category.name)" class="h-5 w-5 text-white" />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ expense.title }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(expense.date) }}</div>
                </div>
              </div>
              <div>
                <div class="text-sm font-medium" :class="expense.amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                  {{ formatCurrency(expense.amount) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 text-right">
                  {{ expense.category.name }}
                </div>
              </div>
            </div>
          </li>
        </ul>

        <!-- Pagination -->
        <div class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
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
                Affichage de <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> à <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span> sur <span class="font-medium">{{ totalItems }}</span> résultats
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
        <ReceiptTaxIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune dépense</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Commencez à suivre vos dépenses pour une meilleure gestion financière.
        </p>
        <div class="mt-6">
          <button
            @click="openCreateModal"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Ajouter une dépense
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit expense modal -->
    <TransitionRoot appear :show="showExpenseModal" as="template">
      <Dialog as="div" @close="showExpenseModal = false" class="relative z-10">
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
                  {{ editingExpense ? 'Modifier la dépense' : 'Ajouter une dépense' }}
                </DialogTitle>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="expense-title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Titre
                    </label>
                    <input
                      id="expense-title"
                      v-model="expenseForm.title"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="Titre de la dépense"
                    />
                  </div>

                  <div>
                    <label for="expense-amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Montant (en euros)
                    </label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 dark:text-gray-400 sm:text-sm">€</span>
                      </div>
                      <input
                        id="expense-amount"
                        v-model="expenseForm.amount"
                        type="number"
                        step="0.01"
                        class="pl-7 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label for="expense-category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Catégorie
                    </label>
                    <select
                      id="expense-category"
                      v-model="expenseForm.categoryId"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label for="expense-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date
                    </label>
                    <input
                      id="expense-date"
                      v-model="expenseForm.date"
                      type="date"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label for="expense-notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notes
                    </label>
                    <textarea
                      id="expense-notes"
                      v-model="expenseForm.notes"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="Notes optionnelles"
                    ></textarea>
                  </div>
                </div>

                <div class="mt-6 flex justify-between">
                  <button
                    v-if="editingExpense"
                    @click="deleteExpense"
                    type="button"
                    :disabled="isSaving"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-100 dark:bg-red-900 px-4 py-2 text-sm font-medium text-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Supprimer
                  </button>
                  <div class="flex space-x-3">
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      @click="showExpenseModal = false"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      :disabled="!isValidExpense || isSaving"
                      class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      @click="saveExpense"
                    >
                      <span v-if="isSaving" class="flex items-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </span>
                      <span v-else>{{ editingExpense ? 'Mettre à jour' : 'Ajouter' }}</span>
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Expense details modal -->
    <TransitionRoot appear :show="showDetailsModal" as="template">
      <Dialog as="div" @close="showDetailsModal = false" class="relative z-10">
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
                  Détails de la dépense
                </DialogTitle>
                <div v-if="selectedExpense" class="mt-4">
                  <div class="flex items-center mb-4">
                    <div class="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center" :style="{ backgroundColor: selectedExpense.category.color || '#4B5563' }">
                      <component :is="getCategoryIcon(selectedExpense.category.name)" class="h-6 w-6 text-white" />
                    </div>
                    <div class="ml-4">
                      <h4 class="text-xl font-semibold text-gray-900 dark:text-white">
                        {{ selectedExpense.title }}
                      </h4>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ formatDate(selectedExpense.date) }}
                      </p>
                    </div>
                  </div>

                  <div class="border-t border-gray-200 dark:border-gray-700 py-4">
                    <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Montant</dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white font-semibold">
                          <span :class="selectedExpense.amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                            {{ formatCurrency(selectedExpense.amount) }}
                          </span>
                        </dd>
                      </div>
                      <div class="sm:col-span-1">
                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Catégorie</dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                          {{ selectedExpense.category.name }}
                        </dd>
                      </div>
                      <div class="sm:col-span-2">
                        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</dt>
                        <dd class="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-line">
                          {{ selectedExpense.notes || 'Aucune note' }}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="showDetailsModal = false"
                  >
                    Fermer
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="editSelectedExpense"
                  >
                    Modifier
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
import { ref, reactive, computed, onMounted, watchEffect } from 'vue';
import { useToast } from 'vue-toastification';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
  ReceiptTaxIcon,
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
import { formatCurrency, formatDate } from '@/utils/formatters';
import type { Expense, ExpenseCategory } from '@/types/finance';
import { format } from 'date-fns';

// Store and composables
const financeStore = useFinanceStore();
const toast = useToast();

// Component state
const isLoading = ref(true);
const isSaving = ref(false);
const expenses = ref<Expense[]>([]);
const categories = ref<ExpenseCategory[]>([]);
const showExpenseModal = ref(false);
const showDetailsModal = ref(false);
const editingExpense = ref<Expense | null>(null);
const selectedExpense = ref<Expense | null>(null);

// Pagination state
const currentPage = ref(1);
const pageSize = ref(10);
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
  categoryId: '',
  startDate: '',
  endDate: '',
});

// Form state
const expenseForm = ref({
  title: '',
  amount: 0,
  categoryId: '',
  date: formatDate(new Date()),
  notes: '',
});

// Computed properties
const isValidExpense = computed(() => {
  return (
    expenseForm.value.title.trim() !== '' &&
    expenseForm.value.amount !== 0 &&
    expenseForm.value.categoryId !== '' &&
    expenseForm.value.date !== ''
  );
});

// Methods
const loadExpenses = async () => {
  isLoading.value = true;
  try {
    // Utiliser fetchExpenses au lieu d'appeler expenses comme une fonction
    const response = await financeStore.fetchExpensesByDateRange(
      filters.startDate ? new Date(filters.startDate) : new Date(new Date().getFullYear(), 0, 1),
      filters.endDate ? new Date(filters.endDate) : new Date()
    );
    console.log(response)

    // Filtrer les résultats côté client si nécessaire
    let filteredExpenses = response;

    if (filters.search) {
      filteredExpenses = filteredExpenses.filter((exp: { title: string; description: string; }) =>
        exp.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        exp.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.categoryId) {
      filteredExpenses = filteredExpenses.filter((exp: { category: { id: string; }; }) =>
        exp.category.id === filters.categoryId
      );
    }

    expenses.value = filteredExpenses;
    totalItems.value = filteredExpenses.length;
  } catch (error) {
    console.error('Error loading expenses:', error);
    toast.error('Erreur lors du chargement des dépenses');
  } finally {
    isLoading.value = false;
  }
};

// Pour loadCategories
const loadCategories = async () => {
  try {
    // Utiliser fetchCategories au lieu d'appeler categories comme une fonction
    categories.value = await financeStore.fetchCategories();
  } catch (error) {
    console.error('Error loading categories:', error);
    toast.error('Erreur lors du chargement des catégories');
  }
};

const applyFilters = () => {
  currentPage.value = 1;
  loadExpenses();
};

const resetFilters = () => {
  filters.search = '';
  filters.categoryId = '';
  filters.startDate = '';
  filters.endDate = '';
  currentPage.value = 1;
  loadExpenses();
};

const loadPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadExpenses();
  }
};

const loadNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    loadExpenses();
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
  loadExpenses();
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

const openCreateModal = () => {
  editingExpense.value = null;
  expenseForm.value = {
    title: '',
    amount: 0,
    categoryId: '',
    date: formatDate(new Date()),
    notes: '',
  };
  showExpenseModal.value = true;
};

const openExpenseDetails = (expense: Expense) => {
  selectedExpense.value = expense;
  showDetailsModal.value = true;
};

const editSelectedExpense = () => {
  if (selectedExpense.value) {
    editingExpense.value = selectedExpense.value;
    expenseForm.value = {
      title: selectedExpense.value.title,
      amount: selectedExpense.value.amount,
      categoryId: selectedExpense.value.category.id || '',
      date: formatDate(new Date(selectedExpense.value.date)),
      notes: selectedExpense.value.notes || '',
    };
    showDetailsModal.value = false;
    showExpenseModal.value = true;
  }
};
const saveExpense = async () => {
  if (!isValidExpense.value || isSaving.value) return;

  isSaving.value = true;
  try {
    // Trouver la catégorie correspondant à l'ID sélectionné
    const selectedCategory = categories.value.find(cat => cat.id === expenseForm.value.categoryId);

    if (!selectedCategory) {
      throw new Error('Catégorie non trouvée');
    }

    // IMPORTANT: Formater la date au format ISO YYYY-MM-DD
    const isoFormattedDate = format(new Date(expenseForm.value.date), 'yyyy-MM-dd');

    // Créer l'objet expense avec la date correctement formatée
// Créer l'objet expense avec la date correctement formatée
const expenseData = {
  title: expenseForm.value.title,
  amount: expenseForm.value.amount,
  date: isoFormattedDate,
  category: selectedCategory, // Utiliser l'objet complet de catégorie
  description: expenseForm.value.notes
};

    if (editingExpense.value) {
      await financeStore.updateExpense(editingExpense.value.id!, expenseData);
      toast.success('Dépense mise à jour avec succès');
    } else {
      await financeStore.createExpense(expenseData);
      toast.success('Dépense ajoutée avec succès');
    }

    showExpenseModal.value = false;
    loadExpenses();
  } catch (error) {
    console.error('Error saving expense:', error);
    toast.error('Erreur lors de l\'enregistrement de la dépense');
  } finally {
    isSaving.value = false;
  }
};

const deleteExpense = async () => {
  if (!editingExpense.value || isSaving.value) return;

  if (!confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
    return;
  }

  isSaving.value = true;
  try {
    await financeStore.deleteExpense(editingExpense.value.id!);
    toast.success('Dépense supprimée avec succès');
    showExpenseModal.value = false;
    loadExpenses();
  } catch (error) {
    console.error('Error deleting expense:', error);
    toast.error('Erreur lors de la suppression de la dépense');
  } finally {
    isSaving.value = false;
  }
};

// Initialize
onMounted(async () => {
  await Promise.all([loadCategories(), loadExpenses()]);
});
</script>
