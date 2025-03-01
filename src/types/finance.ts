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

// Dans types/finance.ts
export interface Budget {
  id?: string;
  userId?: string;
  categoryId: string; // Chaîne vide pour budget global, ID de catégorie pour sous-budget
  category?: ExpenseCategory;
  amount: number;
  yearMonth: string; // Format: YYYY-MM
  createdAt?: string;
  updatedAt?: string;

  // Propriétés étendues pour l'affichage
  spent?: number;    // Montant dépensé (calculé)
  month?: string;    // Format pour l'affichage
  notes?: string;    // Notes sur le budget
  isGlobal?: boolean; // Propriété calculée, true si categoryId est vide
}
// Dans types/finance.ts - Ajouter cette interface
export interface BudgetDTO {
  id?: string;
  categoryId: string; // Chaîne vide pour budget global, ID de catégorie sinon
  amount: number;
  yearMonth: string;
  notes?: string;
  alertThresholdPercentage?: number;
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

// DTO pour les opérations de création/mise à jour d'une dépense
export interface ExpenseCreateUpdateDTO {
  title: string;
  amount: number;
  date: string;
  categoryId: string; // Utiliser seulement l'ID au lieu de l'objet complet
  description?: string;
}
