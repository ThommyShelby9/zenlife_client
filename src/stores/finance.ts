import { defineStore } from 'pinia';
import { ref } from 'vue';
import { format } from 'date-fns';
import { financeApi } from '@/api/finance';
import type { Budget, Expense, ExpenseCategory, FinancialSummary } from '@/types/finance';

export const useFinanceStore = defineStore('finance', () => {
  // State
  const categories = ref<ExpenseCategory[]>([]);
  const expenses = ref<Expense[]>([]);
  const budgets = ref<Budget[]>([]);
  const isLoading = ref(false);

  // Actions
  const fetchCategories = async () => {
    isLoading.value = true;
    try {
      const response = await financeApi.getUserCategories();
      categories.value = response.data;
      return categories.value;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const createCategory = async (category: ExpenseCategory) => {
    try {
      const response = await financeApi.createCategory(category);
      categories.value.push(response.data.category);
      return response.data.category;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  };

  const updateCategory = async (categoryId: string, category: ExpenseCategory) => {
    try {
      const response = await financeApi.updateCategory(categoryId, category);

      // Update in local state
      const index = categories.value.findIndex(c => c.id === categoryId);
      if (index !== -1) {
        categories.value[index] = response.data.category;
      }

      return response.data.category;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await financeApi.deleteCategory(categoryId);

      // Remove from local state
      categories.value = categories.value.filter(c => c.id !== categoryId);

      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  const fetchExpenses = async () => {
    isLoading.value = true;
    try {
      const response = await financeApi.getUserExpenses();
      expenses.value = response.data;
      return expenses.value;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchExpensesByDateRange = async (startDate: Date, endDate: Date) => {
    isLoading.value = true;
    try {
      const response = await financeApi.getUserExpensesByRange(startDate, endDate);
      return response.data;
    } catch (error) {
      console.error('Error fetching expenses by range:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const createExpense = async (expense: Expense) => {
    try {
      const response = await financeApi.createExpense(expense);
      expenses.value.push(response.data.expense);
      return response.data.expense;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  };

  const updateExpense = async (expenseId: string, expense: Expense) => {
    try {
      const response = await financeApi.updateExpense(expenseId, expense);

      // Update in local state
      const index = expenses.value.findIndex(e => e.id === expenseId);
      if (index !== -1) {
        expenses.value[index] = response.data.expense;
      }

      return response.data.expense;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  };

  const deleteExpense = async (expenseId: string) => {
    try {
      await financeApi.deleteExpense(expenseId);

      // Remove from local state
      expenses.value = expenses.value.filter(e => e.id !== expenseId);

      return true;
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  };

  const fetchBudgets = async (date: Date) => {
    isLoading.value = true;
    try {
      const yearMonth = format(date, 'yyyy-MM');
      const response = await financeApi.getUserBudgets(yearMonth);
      budgets.value = response.data;
      return budgets.value;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const createOrUpdateBudget = async (budget: Budget) => {
    try {
      const response = await financeApi.createOrUpdateBudget(budget);

      // Update in local state if exists, otherwise add
      const index = budgets.value.findIndex(b => b.id === response.data.budget.id);
      if (index !== -1) {
        budgets.value[index] = response.data.budget;
      } else {
        budgets.value.push(response.data.budget);
      }

      return response.data.budget;
    } catch (error) {
      console.error('Error creating/updating budget:', error);
      throw error;
    }
  };

  const deleteBudget = async (budgetId: string) => {
    try {
      await financeApi.deleteBudget(budgetId);

      // Remove from local state
      budgets.value = budgets.value.filter(b => b.id !== budgetId);

      return true;
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  };

  const getMonthlyFinancialSummary = async (date: Date): Promise<FinancialSummary> => {
    isLoading.value = true;
    try {
      const response = await financeApi.getMonthlyFinancialSummary(date);
      const data = response.data;

      console.log("Données brutes reçues du backend:", data);

      // Transformation des données au format attendu par le frontend
      const transformed: FinancialSummary = {
        totalExpenses: data.totalExpenses || 0,
        totalBudget: data.budgetAmount || 0,
        remaining: data.remaining || (data.budgetAmount ? data.budgetAmount - data.totalExpenses : 0),
        spentPercentage: data.percentageUsed || 0,
        budgetStatus:
          data.percentageUsed < 80 ? 'under' :
          data.percentageUsed < 100 ? 'near' : 'over',

        // Transformation de l'objet byCategory en tableau d'objets
        categoryBreakdown: Object.entries(data.byCategory || {}).map(([name, amount]) => {
          // Trouver la catégorie complète par son nom
          const category = categories.value.find(c => c.name === name) || {
            id: 'unknown',
            name: name,
            color: '#9CA3AF' // Couleur par défaut
          };

          return {
            category: category,
            amount: amount as number,
            percentage: data.totalExpenses ? ((amount as number) / data.totalExpenses) * 100 : 0,
            // Vous pouvez ajouter budget et status si vous avez ces données
          };
        }),

        // Vous devez récupérer les dépenses récentes séparément si elles ne sont pas
        // incluses dans la réponse du backend
        recentExpenses: [], // À remplir avec un autre appel API si nécessaire
      };

      console.log("Données transformées:", transformed);

      return transformed;
    } catch (error) {
      console.error('Error fetching financial summary:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const getExpensesByCategory = async (categoryId: string, startDate: Date, endDate: Date) => {
    isLoading.value = true;
    try {
      // First get all expenses in the date range
      const allExpenses = await fetchExpensesByDateRange(startDate, endDate);

      // Filter by category
      return allExpenses.filter((expense: Expense) => expense.category.id === categoryId);
    } catch (error) {
      console.error('Error fetching expenses by category:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const getRecentExpenses = async (limit: number = 5) => {
    try {
      // If we already have expenses, sort and return
      if (expenses.value.length > 0) {
        return [...expenses.value]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
      }

      // Otherwise fetch all expenses
      await fetchExpenses();

      return [...expenses.value]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recent expenses:', error);
      throw error;
    }
  };

  const currencyPreference = ref(localStorage.getItem('userCurrency') || 'EUR');

  const setCurrencyPreference = (currency: string) => {
    currencyPreference.value = currency;
    localStorage.setItem('userCurrency', currency);
  };

// Au chargement de l'application
const initCurrencyPreference = () => {
  const savedCurrency = localStorage.getItem('userCurrency');
  if (savedCurrency) {
    currencyPreference.value = savedCurrency;
  }
};

  // Initialize
  const initialize = async () => {
    try {
      await Promise.all([
        fetchCategories(),
        fetchExpenses(),
        fetchBudgets(new Date()),
      ]);
    } catch (error) {
      console.error('Error initializing finance store:', error);
    }
  };

  return {
    // State
    categories,
    expenses,
    budgets,
    isLoading,

    // Actions
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchExpenses,
    fetchExpensesByDateRange,
    createExpense,
    updateExpense,
    deleteExpense,
    fetchBudgets,
    createOrUpdateBudget,
    deleteBudget,
    getMonthlyFinancialSummary,
    getExpensesByCategory,
    getRecentExpenses,
    initialize,
    setCurrencyPreference,
    initCurrencyPreference,
    currencyPreference
  };
});
