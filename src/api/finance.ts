import apiClient from './index';
import type { Expense, Budget, ExpenseCategory, ExpenseCategoryDTO, ExpenseDTO, BudgetDTO } from '@/types/finance';
import { format } from 'date-fns';

export const financeApi = {
  /**
   * Get user's expense categories
   */
  getUserCategories: () => {
    return apiClient.get('/finance/categories');
  },

  /**
   * Create a new expense category
   */
  createCategory: (category: ExpenseCategory) => {
    return apiClient.post('/finance/categories', category);
  },

  /**
   * Update an existing expense category
   */
  updateCategory: (categoryId: string, category: ExpenseCategory) => {
    return apiClient.put(`/finance/categories/${categoryId}`, category);
  },

  /**
   * Delete an expense category
   */
  deleteCategory: (categoryId: string) => {
    return apiClient.delete(`/finance/categories/${categoryId}`);
  },

  /**
   * Get all user expenses
   */
  getUserExpenses: () => {
    return apiClient.get('/finance/expenses');
  },

  /**
   * Get user expenses within a date range
   */
  getUserExpensesByRange: (startDate: Date, endDate: Date) => {
    const start = format(startDate, 'yyyy-MM-dd');
    const end = format(endDate, 'yyyy-MM-dd');
    return apiClient.get(`/finance/expenses/range?start=${start}&end=${end}`);
  },

  /**
   * Create a new expense
   */
  createExpense: (expense: Expense) => {
    // Conversion de Expense à ExpenseDTO
    const expenseDTO: ExpenseDTO = {
      title: expense.title,
      amount: expense.amount,
      date: format(new Date(expense.date), 'yyyy-MM-dd'),
      category: { id: expense.category.id },
      description: expense.notes || expense.description
    };

    return apiClient.post('/finance/expenses', expenseDTO);
  },

  /**
   * Update an existing expense
   */
  updateExpense: (expenseId: string, expense: Expense) => {
    return apiClient.put(`/finance/expenses/${expenseId}`, expense);
  },

  /**
   * Delete an expense
   */
  deleteExpense: (expenseId: string) => {
    return apiClient.delete(`/finance/expenses/${expenseId}`);
  },

  /**
   * Get all user budgets for a specific month
   */
  getUserBudgets: (yearMonth: string) => {
    return apiClient.get(`/finance/budgets/${yearMonth}`);
  },

  /**
   * Create or update a budget
   */
  createOrUpdateBudget: (budget: Budget) => {
    // Conversion de Budget à BudgetDTO
    const budgetDTO: BudgetDTO = {
      id: budget.id,
      categoryId: budget.categoryId || '',
      amount: budget.amount,
      yearMonth: budget.yearMonth,
      notes: budget.notes,
      alertThresholdPercentage: 80 // Valeur par défaut
    };

    return apiClient.post('/finance/budgets', budgetDTO);
  },

  /**
   * Delete a budget
   */
  deleteBudget: (budgetId: string) => {
    return apiClient.delete(`/finance/budgets/${budgetId}`);
  },

  /**
   * Get monthly financial summary
   */
  getMonthlyFinancialSummary: (date: Date) => {
    const yearMonth = format(date, 'yyyy-MM');
    return apiClient.get(`/finance/summary/${yearMonth}`);
  },

  getRecentExpenses: (limit = 5) => {
    return apiClient.get(`/finance/expenses/recent?limit=${limit}`);
  }
};
