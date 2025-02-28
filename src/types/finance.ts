// Finance-related types
export interface ExpenseCategory {
  id?: string;
  userId?: string;
  name: string;
  icon?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Expense {
  id?: string;
  userId?: string;
  title: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  description?: string;
  notes?: string; // Ajouter cette ligne
  recurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt?: string;
  updatedAt?: string;
}

// Dans votre fichier types/finance.ts
export interface Budget {
  id?: string;
  userId?: string;
  categoryId: string;
  category?: ExpenseCategory;
  amount: number;
  yearMonth: string; // Format: YYYY-MM
  createdAt?: string;
  updatedAt?: string;

  // Propriétés étendues pour l'affichage
  spent?: number;    // Montant dépensé (calculé)
  month?: string;    // Format pour l'affichage, peut être undefined
  notes?: string;    // Ajout des notes
}

export interface FinancialSummary {
  totalExpenses: number;
  totalBudget: number;
  remaining: number;
  spentPercentage: number;
  categoryBreakdown: CategoryBreakdown[];
  recentExpenses: Expense[];
  budgetStatus: 'under' | 'near' | 'over';
}

export interface CategoryBreakdown {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  budget?: number;
  status?: 'under' | 'near' | 'over';
}

// Interfaces pour les communications avec l'API
export interface ExpenseCategoryDTO {
  id?: string;
  name?: string; // Optionnel pour l'API
}

export interface ExpenseDTO {
  id?: string;
  title?: string;
  amount: number;
  date: string;
  category: ExpenseCategoryDTO; // Ou simplement { id: string }
  description?: string;
}
