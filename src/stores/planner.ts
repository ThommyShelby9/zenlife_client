import { defineStore } from 'pinia';
import { ref } from 'vue';
import { format, isToday } from 'date-fns';
import { dailyPlannerApi } from '@/api/dailyPlanner';
import type { DailyPlanner, PlannerTask, PlannerStats, PlannerHistoryResponse } from '@/types/planner';

export const usePlannerStore = defineStore('planner', () => {
  // State
  const todayPlanner = ref<DailyPlanner | null>(null);
  const planners = ref<{ [date: string]: DailyPlanner }>({});
  const plannerHistory = ref<DailyPlanner[]>([]);
  const isLoading = ref(false);

  // Actions
// Mettre à jour getTodayPlanner pour s'assurer de la bonne structure des données
const getTodayPlanner = async (): Promise<DailyPlanner> => {
  isLoading.value = true;
  try {
    if (todayPlanner.value && isToday(new Date(todayPlanner.value.date))) {
      return todayPlanner.value;
    }

    const response = await dailyPlannerApi.getTodayPlanner();

    // Garantir la bonne structure des données
    const data = response.data;

    // Créer un objet DailyPlanner avec des valeurs par défaut
    const todayPlannerData: DailyPlanner = {
      date: format(new Date(), 'yyyy-MM-dd'),
      tasks: Array.isArray(data.tasks) ? data.tasks : [],
      reflection: data.reflection || '',
      moodRating: data.moodRating ?? 0,
      id: data.id,
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };

    todayPlanner.value = todayPlannerData;

    // Also add to planners cache
    planners.value[format(new Date(), 'yyyy-MM-dd')] = todayPlannerData;

    return todayPlannerData;
  } catch (error) {
    console.error('Error fetching today planner:', error);

    // En cas d'erreur, retourner un planificateur par défaut
    const defaultPlanner: DailyPlanner = {
      date: format(new Date(), 'yyyy-MM-dd'),
      tasks: [],
      reflection: '',
      moodRating: 0
    };

    todayPlanner.value = defaultPlanner;
    planners.value[format(new Date(), 'yyyy-MM-dd')] = defaultPlanner;

    return defaultPlanner;
  } finally {
    isLoading.value = false;
  }
};

 // Faire des ajustements similaires pour getPlannerForDate
const getPlannerForDate = async (date: Date): Promise<DailyPlanner> => {
  const dateKey = format(date, 'yyyy-MM-dd');

  // Check if we already have this planner cached
  if (planners.value[dateKey]) {
    return planners.value[dateKey];
  }

  isLoading.value = true;
  try {
    const response = await dailyPlannerApi.getPlannerForDate(date);

    if (response.status === 404) {
      // Create an empty planner for this date
      const emptyPlanner: DailyPlanner = {
        date: dateKey,
        tasks: [],
        reflection: '',
        moodRating: 0
      };

      planners.value[dateKey] = emptyPlanner;
      return emptyPlanner;
    }

    // Extraction sécurisée des données
    const data = response.data;

    const plannerData: DailyPlanner = {
      date: dateKey,
      tasks: Array.isArray(data.tasks) ? data.tasks : [],
      reflection: data.reflection || '',  // Valeur par défaut explicite
      moodRating: data.moodRating ?? 0,   // Valeur par défaut explicite
      id: data.id,
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };

    // Cache the planner
    planners.value[dateKey] = plannerData

    // If this is today, also update todayPlanner
    if (isToday(date)) {
      todayPlanner.value = plannerData;
    }

    return plannerData;
  } catch (error) {
    console.error(`Error fetching planner for date ${dateKey}:`, error);

    // Create an empty planner for this date if there's an error
    const emptyPlanner: DailyPlanner = {
      date: dateKey,
      tasks: [],
      reflection: '',
      moodRating: 0
    };

    planners.value[dateKey] = emptyPlanner;
    return emptyPlanner;
  } finally {
    isLoading.value = false;
  }
};

const getPlannerHistory = async (params?: {
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
  search?: string;
  completion?: string;
  priority?: string;
}): Promise<PlannerHistoryResponse> => {
  isLoading.value = true;
  try {
    let url = '/api/planner/history';

    // Si des paramètres sont fournis, ajoutez-les à l'URL
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate.toISOString());
      if (params.endDate) queryParams.append('endDate', params.endDate.toISOString());
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.completion) queryParams.append('completion', params.completion);
      if (params.priority) queryParams.append('priority', params.priority);

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }

    const response = await dailyPlannerApi.getPlannerHistoryWithFilters(url);

    // Si le backend ne renvoie pas directement le format attendu, transformez-le ici
    const historyResponse: PlannerHistoryResponse = {
      days: response.data.days || response.data, // Fallback au cas où l'API renvoie directement un tableau
      total: response.data.total || response.data.length
    };

    return historyResponse;
  } catch (error) {
    console.error('Error fetching planner history:', error);
    throw error;
  } finally {
    isLoading.value = false;
  }
};

  const getPlannersByDateRange = async (startDate: Date, endDate: Date): Promise<DailyPlanner[]> => {
    isLoading.value = true;
    try {
      const response = await dailyPlannerApi.getPlannersByDateRange(startDate, endDate);

      // Add to planners cache
      response.data.forEach((planner: DailyPlanner) => {
        planners.value[planner.date] = planner;
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching planners by date range:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Modification de savePlanner pour gérer les champs optionnels
  const savePlanner = async (planner: DailyPlanner): Promise<DailyPlanner> => {
    try {
      // Assurez-vous que ces champs sont explicitement définis, même s'ils sont vides
      const plannerToSave = {
        ...planner,
        reflection: planner.reflection !== undefined ? planner.reflection : '',
        moodRating: planner.moodRating !== undefined ? planner.moodRating : 0,
        createdAt: planner.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log("Store sending planner with reflection:", plannerToSave.reflection);
      console.log("Store sending planner with mood rating:", plannerToSave.moodRating);

      const response = await dailyPlannerApi.savePlanner(plannerToSave);

      // Utiliser une approche adaptative qui fonctionne avec les deux formats de réponse
      const savedPlanner = response.data.planner || response.data;

      // S'assurer que les champs sont toujours définis
      if (savedPlanner) {
        savedPlanner.reflection = savedPlanner.reflection || '';
        savedPlanner.moodRating = savedPlanner.moodRating || 0;
        savedPlanner.tasks = Array.isArray(savedPlanner.tasks) ? savedPlanner.tasks : [];
      }

      // Mettre à jour le cache local
      planners.value[planner.date] = savedPlanner;

      // Mettre à jour todayPlanner si c'est le planificateur du jour
      if (isToday(new Date(planner.date))) {
        todayPlanner.value = savedPlanner;
      }

      return savedPlanner;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du planificateur:', error);
      throw error;
    }
  };
  const updateTask = async (task: PlannerTask): Promise<PlannerTask> => {
    try {
      // Find which planner contains this task
      let plannerDate = '';
      let plannerToUpdate: DailyPlanner | null = null;

      for (const [date, planner] of Object.entries(planners.value)) {
        const taskIndex = planner.tasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          plannerDate = date;
          plannerToUpdate = { ...planner };
          plannerToUpdate.tasks[taskIndex] = { ...task };
          break;
        }
      }

      if (!plannerToUpdate) {
        throw new Error('Task not found in any planner');
      }

      // Save the updated planner
      await savePlanner(plannerToUpdate);

      return task;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  // Modification de addTask pour gérer les champs optionnels
const addTask = async (plannerDate: Date, task: PlannerTask): Promise<PlannerTask> => {
  try {
    const dateKey = format(plannerDate, 'yyyy-MM-dd');

    // Récupérer ou créer un planificateur
    const planner = planners.value[dateKey] || {
      date: dateKey,
      tasks: [],
      reflection: '', // Chaîne vide comme valeur par défaut
      moodRating: 0   // 0 comme valeur par défaut
    };

    // Créer une nouvelle tâche avec des valeurs par défaut
    const newTask: PlannerTask = {
      id: task.id || `task-${Date.now()}`,
      title: task.title,
      priority: task.priority || 'low',
      completed: task.completed || false,
      notes: task.notes || '',
      dueTime: task.dueTime,
      createdAt: task.createdAt || new Date().toISOString(),
      updatedAt: task.updatedAt
    };

    // Ajouter la tâche
    planner.tasks.push(newTask);

    // Sauvegarder le planificateur
    await savePlanner(planner);

    return newTask;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la tâche:', error);
    throw error;
  }
};

  const deleteTask = async (taskId: string): Promise<boolean> => {
    try {
      // Find which planner contains this task
      let plannerToUpdate: DailyPlanner | null = null;

      for (const planner of Object.values(planners.value)) {
        const taskIndex = planner.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          plannerToUpdate = { ...planner };
          plannerToUpdate.tasks = plannerToUpdate.tasks.filter(t => t.id !== taskId);
          break;
        }
      }

      if (!plannerToUpdate) {
        throw new Error('Task not found in any planner');
      }

      // Save the updated planner
      await savePlanner(plannerToUpdate);

      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const getStats = async (): Promise<PlannerStats> => {
    try {
      // Si nous n'avons pas de planificateurs, récupérer l'historique d'abord
      if (Object.keys(planners.value).length === 0) {
        await getPlannerHistory();
      }

      // Initialiser les variables de calcul
      let totalTasks = 0;
      let completedTasks = 0;
      let highPriorityTasks = 0;
      let completedHighPriorityTasks = 0;
      let totalMoodRating = 0;
      let moodRatingCount = 0;

      // Données de complétion hebdomadaire
      const weeklyCompletion = [
        { day: 'Mon', rate: 0, total: 0, completed: 0 },
        { day: 'Tue', rate: 0, total: 0, completed: 0 },
        { day: 'Wed', rate: 0, total: 0, completed: 0 },
        { day: 'Thu', rate: 0, total: 0, completed: 0 },
        { day: 'Fri', rate: 0, total: 0, completed: 0 },
        { day: 'Sat', rate: 0, total: 0, completed: 0 },
        { day: 'Sun', rate: 0, total: 0, completed: 0 },
      ];

      // Traiter chaque planificateur
      for (const planner of Object.values(planners.value)) {
        // Ignorer les planificateurs nuls ou invalides
        if (!planner?.tasks) continue;

        // Obtenir le jour de la semaine (0 = Dimanche, 6 = Samedi)
        const dayOfWeek = new Date(planner.date).getDay();
        const weekdayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ajuster pour Lun-Dim

        // Calculer les tâches
        totalTasks += planner.tasks.length;
        const completed = planner.tasks.filter(task => task.completed).length;
        completedTasks += completed;

        // Tâches de haute priorité
        const highPriority = planner.tasks.filter(task => task.priority === 'high');
        highPriorityTasks += highPriority.length;
        completedHighPriorityTasks += highPriority.filter(task => task.completed).length;

        // Note d'humeur
        if (planner.moodRating !== undefined && planner.moodRating > 0) {
          totalMoodRating += planner.moodRating;
          moodRatingCount++;
        }

        // Complétion hebdomadaire
        if (planner.tasks.length > 0) {
          weeklyCompletion[weekdayIndex].total += planner.tasks.length;
          weeklyCompletion[weekdayIndex].completed += completed;
        }
      }

      // Calculer les taux de complétion hebdomadaire
      weeklyCompletion.forEach(day => {
        day.rate = day.total > 0 ? (day.completed / day.total) * 100 : 0;
      });

      // Statistiques finales
      const stats: PlannerStats = {
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        highPriorityCompletion: highPriorityTasks > 0
          ? (completedHighPriorityTasks / highPriorityTasks) * 100
          : 0,
        averageMood: moodRatingCount > 0
          ? totalMoodRating / moodRatingCount
          : undefined,
        weeklyCompletion: weeklyCompletion.map(day => ({
          day: day.day,
          rate: day.rate
        })),
      };

      return stats;
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques du planificateur:', error);
      throw error;
    }
  };

  return {
    // State
    todayPlanner,
    planners,
    plannerHistory,
    isLoading,

    // Actions
    getTodayPlanner,
    getPlannerForDate,
    getPlannerHistory,
    getPlannersByDateRange,
    savePlanner,
    updateTask,
    addTask,
    deleteTask,
    getStats,
  };
});
