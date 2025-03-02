<template>
  <DashboardLayout class="overflow-x-hidden">
    <div class="mx-auto px-4 sm:px-6 md:px-8 max-w-full overflow-x-hidden">
      <!-- Header responsive - reorganize on mobile -->
      <div class="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Planning du jour</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDayName(selectedDate) }}, {{ formatDate(selectedDate) }}</p>
        </div>
        <div class="flex flex-wrap gap-2 md:gap-4">
          <div class="flex flex-nowrap">
            <button
              @click="navigateDate(-1)"
              class="inline-flex items-center p-2 border border-gray-300 dark:border-gray-700 rounded-l-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ChevronLeftIcon class="h-5 w-5" />
            </button>
            <div class="relative">
              <input
                type="date"
                v-model="formattedSelectedDate"
                class="w-full md:min-w-[150px] py-2 px-2 md:px-4 border-y border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                @change="onDateChange"
              />
            </div>
            <button
              @click="navigateDate(1)"
              class="inline-flex items-center p-2 border border-gray-300 dark:border-gray-700 rounded-r-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </div>
          <button
            @click="goToToday"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Aujourd'hui
          </button>
          <button
            @click="showAddTaskModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            <span class="whitespace-nowrap">Ajouter une tâche</span>
          </button>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="mt-8 flex justify-center">
        <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else class="mt-6 max-w-full">
        <!-- Task progress -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 md:p-6 mb-6 overflow-x-hidden">
          <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Progression des tâches</h3>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ completedTasksCount }} / {{ totalTasksCount }} terminées
            </div>
          </div>
          <div class="relative pt-1">
            <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200 dark:bg-gray-700">
              <div
                :style="`width: ${completionPercentage}%`"
                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
              ></div>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ highPriorityCompletion }}%</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Tâches prioritaires</div>
            </div>
            <div>
              <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ completionPercentage }}%</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Tâches totales</div>
            </div>
            <div>
              <div class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ dayCompletionRate > previousDayCompletionRate ? '+' : '' }}{{ (dayCompletionRate - previousDayCompletionRate).toFixed(0) }}%
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">vs. jour précédent</div>
            </div>
          </div>
        </div>

        <!-- Tasks by priority -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 md:p-6 overflow-x-hidden">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Tâches du jour</h3>

          <div v-if="isEmpty" class="py-6 text-center">
            <ClipboardListIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucune tâche pour aujourd'hui</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Commencez à planifier votre journée en ajoutant des tâches.
            </p>
            <div class="mt-6">
              <button
                @click="showAddTaskModal = true"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon class="h-4 w-4 mr-2" />
                Ajouter une tâche
              </button>
            </div>
          </div>

          <div v-else class="space-y-6">
            <!-- High priority tasks -->
            <div v-if="highPriorityTasks.length > 0" class="mb-6">
              <h4 class="text-sm font-medium text-red-600 dark:text-red-400 mb-2 flex items-center">
                <ExclamationCircleIcon class="h-4 w-4 mr-1 flex-shrink-0" />
                <span>Priorité haute</span>
              </h4>
              <ul class="space-y-2">
                <TaskItem
                  v-for="task in highPriorityTasks"
                  :key="task.id"
                  :task="task"
                  @toggle-completion="toggleTaskCompletion"
                  @edit="editTask"
                  @delete="deleteTask"
                  class="w-full"
                />
              </ul>
            </div>

            <!-- Medium priority tasks -->
            <div v-if="mediumPriorityTasks.length > 0" class="mb-6">
              <h4 class="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-2 flex items-center">
                <ExclamationIcon class="h-4 w-4 mr-1 flex-shrink-0" />
                <span>Priorité moyenne</span>
              </h4>
              <ul class="space-y-2">
                <TaskItem
                  v-for="task in mediumPriorityTasks"
                  :key="task.id"
                  :task="task"
                  @toggle-completion="toggleTaskCompletion"
                  @edit="editTask"
                  @delete="deleteTask"
                  class="w-full"
                />
              </ul>
            </div>

            <!-- Low priority tasks -->
            <div v-if="lowPriorityTasks.length > 0">
              <h4 class="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                <MinusCircleIcon class="h-4 w-4 mr-1 flex-shrink-0" />
                <span>Priorité basse</span>
              </h4>
              <ul class="space-y-2">
                <TaskItem
                  v-for="task in lowPriorityTasks"
                  :key="task.id"
                  :task="task"
                  @toggle-completion="toggleTaskCompletion"
                  @edit="editTask"
                  @delete="deleteTask"
                  class="w-full"
                />
              </ul>
            </div>
          </div>
        </div>

        <!-- Daily reflection section -->
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 md:p-6 mt-6 overflow-x-hidden">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Réflexion du jour</h3>
            <MoodEmoji v-model="moodRating" />
          </div>
          <textarea
            v-model="reflection"
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            rows="4"
            placeholder="Notez vos réflexions sur la journée..."
          ></textarea>
          <div class="mt-4 text-right">
            <button
              @click="saveReflection"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              :disabled="isSaving"
            >
              <span v-if="isSaving" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </span>
              <span v-else>Enregistrer la réflexion</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Task Modal -->
    <TransitionRoot appear :show="showAddTaskModal || !!editingTask" as="template">
      <Dialog as="div" @close="closeTaskModal" class="relative z-10">
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
                  {{ editingTask ? 'Modifier la tâche' : 'Ajouter une tâche' }}
                </DialogTitle>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="task-title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Titre
                    </label>
                    <input
                      id="task-title"
                      v-model="taskForm.title"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="Titre de la tâche"
                    />
                  </div>

                  <div>
                    <label for="task-notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notes
                    </label>
                    <textarea
                      id="task-notes"
                      v-model="taskForm.notes"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      rows="3"
                      placeholder="Notes ou détails supplémentaires"
                    ></textarea>
                  </div>

                  <div>
                    <label for="task-priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Priorité
                    </label>
                    <select
                      id="task-priority"
                      v-model="taskForm.priority"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>

                  <div>
                    <label for="task-due-time" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Heure d'échéance
                    </label>
                    <input
                      id="task-due-time"
                      v-model="taskForm.dueTime"
                      type="time"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div class="flex items-center">
                    <input
                      id="task-completed"
                      v-model="taskForm.completed"
                      type="checkbox"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-700 dark:bg-gray-700"
                    />
                    <label for="task-completed" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                      Tâche terminée
                    </label>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="closeTaskModal"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="saveTask"
                    :disabled="!isValidTask || isSavingTask"
                  >
                    <span v-if="isSavingTask" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enregistrement...
                    </span>
                    <span v-else>{{ editingTask ? 'Mettre à jour' : 'Ajouter' }}</span>
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
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useToast } from 'vue-toastification';
import { format, addDays, parseISO } from 'date-fns';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  ExclamationIcon,
  MinusCircleIcon,
  ClipboardListIcon,
} from '@heroicons/vue/outline';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import TaskItem from '@/components/planner/TaskItem.vue';
import { usePlannerStore } from '@/stores/planner';
import type { DailyPlanner, PlannerTask } from '@/types/planner';
import { formatDate, formatDayName } from '@/utils/formatters';
import TaskReminderService from '@/services/taskReminderService';
import MoodEmoji from '@/components/planner/MoodEmoji.vue';

// Store and composables
const plannerStore = usePlannerStore();
const toast = useToast();

// Component state
const isLoading = ref(true);
const isSaving = ref(false);
const isSavingTask = ref(false);
const selectedDate = ref(new Date());
const formattedSelectedDate = ref(format(new Date(), 'yyyy-MM-dd'));
const dailyPlanner = ref<DailyPlanner | null>(null);
const reflection = ref('');
const moodRating = ref(0);
const dayCompletionRate = ref(0);
const previousDayCompletionRate = ref(0);

// Task form state
const showAddTaskModal = ref(false);
const editingTask = ref<PlannerTask | null>(null);
const taskForm = ref<PlannerTask>({
  title: '',
  notes: '',
  priority: 'medium',
  completed: false,
  dueTime: '',
});

// Computed properties
const formattedTasks = computed(() => {
  return dailyPlanner.value?.tasks || [];
});

const isEmpty = computed(() => {
  return formattedTasks.value.length === 0;
});

const highPriorityTasks = computed(() => {
  return formattedTasks.value.filter(task => task.priority === 'high');
});

const mediumPriorityTasks = computed(() => {
  return formattedTasks.value.filter(task => task.priority === 'medium');
});

const lowPriorityTasks = computed(() => {
  return formattedTasks.value.filter(task => task.priority === 'low');
});

const completedTasksCount = computed(() => {
  return formattedTasks.value.filter(task => task.completed).length;
});

const totalTasksCount = computed(() => {
  return formattedTasks.value.length;
});

const completionPercentage = computed(() => {
  if (totalTasksCount.value === 0) return 0;
  return Math.round((completedTasksCount.value / totalTasksCount.value) * 100);
});

const highPriorityCompletion = computed(() => {
  const highPriorityTotal = highPriorityTasks.value.length;
  if (highPriorityTotal === 0) return 0;

  const highPriorityCompleted = highPriorityTasks.value.filter(task => task.completed).length;
  return Math.round((highPriorityCompleted / highPriorityTotal) * 100);
});

const isValidTask = computed(() => {
  return taskForm.value.title.trim() !== '';
});

// Methods
const fetchDailyPlanner = async () => {
  isLoading.value = true;
  try {
    const planner = await plannerStore.getPlannerForDate(selectedDate.value);
    dailyPlanner.value = planner;

    // Set reflection and mood rating if available
    reflection.value = planner?.reflection || '';
    moodRating.value = planner?.moodRating || 0;

    // Get completion rate for the day
    dayCompletionRate.value = completionPercentage.value;

    // Get previous day completion rate
    const previousDate = addDays(selectedDate.value, -1);
    const previousPlanner = await plannerStore.getPlannerForDate(previousDate);

    if (previousPlanner && previousPlanner.tasks.length > 0) {
      const completed = previousPlanner.tasks.filter(task => task.completed).length;
      previousDayCompletionRate.value = Math.round((completed / previousPlanner.tasks.length) * 100);
    } else {
      previousDayCompletionRate.value = 0;
    }
  } catch (error) {
    console.error('Error fetching daily planner:', error);
    toast.error('Erreur lors du chargement du planning');

    // Initialize with empty planner if none exists
    dailyPlanner.value = {
      date: format(selectedDate.value, 'yyyy-MM-dd'),
      tasks: [],
      reflection: '',
      moodRating: 0
    };
  } finally {
    isLoading.value = false;
  }
};

const navigateDate = (days: number) => {
  selectedDate.value = addDays(selectedDate.value, days);
  formattedSelectedDate.value = format(selectedDate.value, 'yyyy-MM-dd');
};

const onDateChange = () => {
  selectedDate.value = parseISO(formattedSelectedDate.value);
};

const goToToday = () => {
  selectedDate.value = new Date();
  formattedSelectedDate.value = format(selectedDate.value, 'yyyy-MM-dd');
};

  const saveReflection = async () => {
  // Vérification debug du token - À RETIRER APRÈS DÉBOGAGE
  console.log("Token présent:", localStorage.getItem('token'));

  if (isSaving.value) return;
  isSaving.value = true;
  try {
    if (!dailyPlanner.value) return;

    // Création d'une copie complète du planificateur pour éviter les références partagées
    const updatedPlanner: DailyPlanner = {
      ...dailyPlanner.value,
      reflection: reflection.value,
      moodRating: moodRating.value,
      // Assurez-vous d'inclure toutes les tâches existantes
      tasks: [...(dailyPlanner.value.tasks || [])]
    };

    console.log("Saving planner with reflection:", updatedPlanner.reflection);
    console.log("Saving planner with mood rating:", updatedPlanner.moodRating);

    // Sauvegarde du planificateur
    const savedPlanner = await plannerStore.savePlanner(updatedPlanner);

    // Mettre à jour le planificateur local avec la réponse du serveur
    dailyPlanner.value = savedPlanner;

    // Et aussi mettre à jour les variables réactives UI
    reflection.value = savedPlanner.reflection || '';
    moodRating.value = savedPlanner.moodRating || 0;

    toast.success('Réflexion enregistrée avec succès');
  } catch (error) {
    console.error('Error saving reflection:', error);
    toast.error('Erreur lors de l\'enregistrement de la réflexion');
  } finally {
    isSaving.value = false;
  }
};


const updateMoodRating = (rating: number) => {
  moodRating.value = rating;
};

const closeTaskModal = () => {
  showAddTaskModal.value = false;
  editingTask.value = null;
  resetTaskForm();
};

const resetTaskForm = () => {
  taskForm.value = {
    title: '',
    notes: '',
    priority: 'medium',
    completed: false,
    dueTime: '',
  };
};

const editTask = (task: PlannerTask) => {
  editingTask.value = task;
  taskForm.value = { ...task };
};
// Dans la méthode saveTask
const saveTask = async () => {
  if (!isValidTask.value || isSavingTask.value) return;

  isSavingTask.value = true;
  try {
    if (!dailyPlanner.value) {
      // Create new planner if none exists
      dailyPlanner.value = {
        date: format(selectedDate.value, 'yyyy-MM-dd'),
        tasks: [],
        reflection: '',
        moodRating: 0
      };
    }

    // S'assurer que tasks est un tableau
    if (!Array.isArray(dailyPlanner.value.tasks)) {
      dailyPlanner.value.tasks = [];
    }

    if (editingTask.value) {
      // Update existing task
      const taskIndex = dailyPlanner.value.tasks.findIndex(t => t.id === editingTask.value?.id);

      if (taskIndex !== -1) {
        dailyPlanner.value.tasks[taskIndex] = {
          ...taskForm.value,
          id: editingTask.value.id
        };
      }
    } else {
      // Add new task
      const newTask: PlannerTask = {
        ...taskForm.value,
        id: `task-${Date.now()}`
      };

      dailyPlanner.value.tasks.push(newTask);
    }

    // Save planner
    await plannerStore.savePlanner(dailyPlanner.value);

    // Close modal and reset form
    closeTaskModal();

    toast.success(editingTask.value ? 'Tâche mise à jour avec succès' : 'Tâche ajoutée avec succès');
    TaskReminderService.checkTasksNow();


  } catch (error) {
    console.error('Error saving task:', error);
    toast.error('Erreur lors de l\'enregistrement de la tâche');
  }

  finally {
    isSavingTask.value = false;
  }
};

// Ajouter des vérifications similaires dans toggleTaskCompletion et deleteTask
const toggleTaskCompletion = async (task: PlannerTask) => {
  try {
    if (!dailyPlanner.value) return;

    // S'assurer que tasks est un tableau
    if (!Array.isArray(dailyPlanner.value.tasks)) {
      dailyPlanner.value.tasks = [];
      return; // Rien à basculer si pas de tâches
    }

    // Find and update task
    const taskIndex = dailyPlanner.value.tasks.findIndex(t => t.id === task.id);

    if (taskIndex !== -1) {
      dailyPlanner.value.tasks[taskIndex].completed = !dailyPlanner.value.tasks[taskIndex].completed;

      // Save planner
      await plannerStore.savePlanner(dailyPlanner.value);

      toast.success(
        dailyPlanner.value.tasks[taskIndex].completed
          ? 'Tâche marquée comme terminée'
          : 'Tâche marquée comme non terminée'
      );
    }
    TaskReminderService.checkTasksNow();

  } catch (error) {
    console.error('Error toggling task completion:', error);
    toast.error('Erreur lors de la mise à jour de la tâche');
  }
};

const deleteTask = async (task: PlannerTask) => {
  try {
    if (!dailyPlanner.value) return;

    // S'assurer que tasks est un tableau
    if (!Array.isArray(dailyPlanner.value.tasks)) {
      dailyPlanner.value.tasks = [];
      return; // Rien à supprimer si pas de tâches
    }

    // Filter out task
    dailyPlanner.value.tasks = dailyPlanner.value.tasks.filter(t => t.id !== task.id);

    // Save planner
    await plannerStore.savePlanner(dailyPlanner.value);

    toast.success('Tâche supprimée avec succès');
  } catch (error) {
    console.error('Error deleting task:', error);
    toast.error('Erreur lors de la suppression de la tâche');
  }
};

// Initialize
onMounted(async () => {

  await fetchDailyPlanner();
  TaskReminderService.start();

// Vérifier immédiatement les tâches pour les rappels
TaskReminderService.checkTasksNow();
});

onBeforeUnmount(() => {
  // Arrêter le service de rappel des tâches lorsque le composant est détruit
  TaskReminderService.stop();
});

// Watch for date changes
watch(selectedDate, async () => {
  await fetchDailyPlanner();
});

watch(() => dailyPlanner.value?.tasks, () => {
  // Vérifier les rappels à chaque changement des tâches
  if (dailyPlanner.value && dailyPlanner.value.tasks) {
    TaskReminderService.checkTasksNow();
  }
}, { deep: true });
</script>


<style scoped>
/* Empêcher le défilement horizontal sur tout le composant */
:deep(body),
:deep(html) {
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
}

/* Styles pour assurer que le contenu ne déborde pas horizontalement */
.overflow-x-hidden {
  overflow-x: hidden;
}

/* Assurer que les boutons ne forcent pas de défilement horizontal */
.flex-wrap {
  flex-wrap: wrap;
}

/* Ajustements pour les petits écrans */
@media screen and (max-width: 640px) {
  .mx-auto {
    max-width: 100% !important;
    width: 100% !important;
  }

  /* Réduire le padding sur mobile */
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  /* S'assurer que les boutons s'adaptent correctement */
  .flex-wrap {
    margin-top: 0.5rem;
  }

  /* Ajuster le texte des boutons pour qu'il ne déborde pas */
  button {
    max-width: 100%;
    white-space: nowrap;
  }
}
</style>
