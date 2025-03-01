<template>
  <DashboardLayout>
    <div class="mx-auto px-4 sm:px-6 md:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Suivi d'hydratation</h1>
        <RouterLink
          to="/water/settings"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <CogIcon class="h-4 w-4 mr-2" />
          Paramètres
        </RouterLink>
      </div>

      <!-- Water tracker dashboard -->
      <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Daily goal card -->
            <div class="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 border border-blue-100 dark:border-gray-600">
              <div class="flex items-center">
                <FlagIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div class="ml-4">
                  <h3 class="text-sm font-medium text-blue-900 dark:text-blue-100">Objectif quotidien</h3>
                  <div class="mt-1">
                    <p class="text-2xl font-semibold text-blue-700 dark:text-blue-200">
                      {{ waterSettings.dailyGoalML / 1000 }} L
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Today's progress card -->
            <div class="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 border border-blue-100 dark:border-gray-600">
              <div class="flex items-center">
                <StatusOnlineIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div class="ml-4">
                  <h3 class="text-sm font-medium text-blue-900 dark:text-blue-100">Progression</h3>
                  <div class="mt-1">
                    <p class="text-2xl font-semibold text-blue-700 dark:text-blue-200">
                      {{ Math.round(progress) }}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Current intake card -->
            <div class="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 border border-blue-100 dark:border-gray-600">
              <div class="flex items-center">
                <BeakerIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div class="ml-4">
                  <h3 class="text-sm font-medium text-blue-900 dark:text-blue-100">Consommation actuelle</h3>
                  <div class="mt-1">
                    <p class="text-2xl font-semibold text-blue-700 dark:text-blue-200">
                      {{ (todayIntake / 1000).toFixed(1) }} L
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Remaining to goal card -->
            <div class="bg-blue-50 dark:bg-gray-700 rounded-lg p-4 border border-blue-100 dark:border-gray-600">
              <div class="flex items-center">
                <ChartPieIcon class="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div class="ml-4">
                  <h3 class="text-sm font-medium text-blue-900 dark:text-blue-100">Restant à boire</h3>
                  <div class="mt-1">
                    <p class="text-2xl font-semibold" :class="[
                      remainingToGoal > 0
                        ? 'text-blue-700 dark:text-blue-200'
                        : 'text-green-600 dark:text-green-400'
                    ]">
                      {{ remainingToGoal > 0 ? (remainingToGoal / 1000).toFixed(1) + ' L' : 'Objectif atteint!' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress visualization -->
          <div class="mt-8">
            <div class="relative pt-1">
              <div class="flex mb-2 items-center justify-between">
                <div>
                  <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
                    Progrès de la journée
                  </span>
                </div>
                <div class="text-right">
                  <span class="text-xs font-semibold inline-block text-blue-600 dark:text-blue-300">
                    {{ todayIntake }} / {{ waterSettings.dailyGoalML }} ml
                  </span>
                </div>
              </div>
              <div class="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-blue-200 dark:bg-gray-600">
                <div
                  :style="`width: ${progress > 100 ? 100 : progress}%`"
                  class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ease-in-out bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"
                ></div>
              </div>
            </div>
          </div>

          <!-- Water intake buttons -->
          <div class="mt-6 flex flex-wrap justify-center gap-4">
            <button
              v-for="size in waterGlassSizes"
              :key="size"
              @click="logWaterIntake(size)"
              class="flex flex-col items-center px-4 py-3 border border-blue-300 dark:border-blue-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              :disabled="isLogging"
            >
              <WaterDropIcon :class="[
                size <= 150 ? 'h-6 w-6' : size <= 300 ? 'h-8 w-8' : 'h-10 w-10',
                'text-blue-500 dark:text-blue-400'
              ]" />
              <span class="mt-2 text-sm font-medium text-gray-900 dark:text-white">{{ size }} ml</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ getGlassTypeLabel(size) }}
              </span>
            </button>

            <button
              @click="showCustomIntakeModal = true"
              class="flex flex-col items-center px-4 py-3 border border-blue-300 dark:border-blue-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              :disabled="isLogging"
            >
              <PlusCircleIcon class="h-8 w-8 text-blue-500 dark:text-blue-400" />
              <span class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Personnalisé</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                Autre quantité
              </span>
            </button>
          </div>

          <!-- Today's intake history -->
          <div class="mt-10">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Historique d'aujourd'hui</h3>
            <ul class="mt-4 divide-y divide-gray-200 dark:divide-gray-700">
              <li v-if="todayIntakeHistory.length === 0" class="py-6 text-center">
                <WaterDropIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun enregistrement</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Commencez à enregistrer votre consommation d'eau pour voir votre historique.
                </p>
              </li>
              <li v-for="intake in todayIntakeHistory" :key="intake.id" class="py-4 flex justify-between">
                <div class="flex items-center">
                  <WaterDropIcon class="h-6 w-6 text-blue-500 dark:text-blue-400" />
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ intake.quantityML }} ml
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ getGlassTypeLabel(intake.quantityML) }}
                    </p>
                  </div>
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatTime(intake.timestamp) }}
                </div>
              </li>
            </ul>
          </div>

          <!-- Weekly intake chart -->
          <div class="mt-10">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Vue hebdomadaire</h3>
            <div class="mt-4 h-64">
              <WeeklyIntakeChart :data="weeklyData" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom intake modal -->
    <TransitionRoot appear :show="showCustomIntakeModal" as="template">
      <Dialog as="div" @close="showCustomIntakeModal = false" class="relative z-10">
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
                  Quantité personnalisée
                </DialogTitle>
                <div class="mt-4">
                  <label for="custom-intake" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Entrez la quantité en ml
                  </label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="custom-intake"
                      v-model="customIntakeAmount"
                      type="number"
                      min="10"
                      max="2000"
                      step="10"
                      class="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      placeholder="250"
                    />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 dark:text-gray-400 sm:text-sm">ml</span>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    @click="showCustomIntakeModal = false"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    @click="addCustomIntake"
                    :disabled="!isValidCustomIntake || isLogging"
                  >
                    <span v-if="isLogging" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Ajout en cours...
                    </span>
                    <span v-else>Ajouter</span>
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
import { format } from 'date-fns';
import { useToast } from 'vue-toastification';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue';
import {
  BeakerIcon,
  CogIcon,
  ChartPieIcon,
  StatusOnlineIcon,
  PlusCircleIcon,
  FlagIcon // Bonne alternative
} from '@heroicons/vue/outline';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import WeeklyIntakeChart from '@/components/water/WeeklyIntakeChart.vue';
import { useWaterReminderStore } from '@/stores/waterReminder';
import type {WeeklyWaterData, WaterIntake } from '@/types/waterReminder';

// Store and composables
const waterStore = useWaterReminderStore();
const toast = useToast();

// Component state
const isLogging = ref(false);
const showCustomIntakeModal = ref(false);
const customIntakeAmount = ref<number | null>(250);
const waterGlassSizes = [100, 200, 250, 330, 500, 750];
const todayIntakeHistory = ref<WaterIntake[]>([]);

// Computed properties
const waterSettings = computed(() => waterStore.settings || {
  dailyGoalML: 2000,
  reminderEnabled: true,
  reminderInterval: 60,
  startTime: '08:00',
  endTime: '20:00'
});

const todayIntake = computed(() => waterStore.todayIntake);

const progress = computed(() => {
  if (waterSettings.value.dailyGoalML === 0) return 0;
  return (todayIntake.value / waterSettings.value.dailyGoalML) * 100;
});

const remainingToGoal = computed(() => {
  const remaining = waterSettings.value.dailyGoalML - todayIntake.value;
  return remaining > 0 ? remaining : 0;
});

const isValidCustomIntake = computed(() => {
  return customIntakeAmount.value && customIntakeAmount.value > 0 && customIntakeAmount.value <= 2000;
});
const weeklyData = ref<WeeklyWaterData[]>([]);

// Methods
const getGlassTypeLabel = (size: number): string => {
  if (size <= 100) return 'Petit verre';
  if (size <= 200) return 'Verre moyen';
  if (size <= 250) return 'Verre standard';
  if (size <= 330) return 'Canette';
  if (size <= 500) return 'Grande bouteille';
  if (size <= 750) return 'Bouteille';
  return 'Grande quantité';
};

const formatTime = (timestamp: string | number | Date) => {
  if (!timestamp) {
    return '--:--';
  }

  try {
    const date = new Date(timestamp);
    // Vérifier que la date est valide
    if (isNaN(date.getTime())) {
      console.warn('Date invalide:', timestamp);
      return '--:--';
    }
    return format(date, 'HH:mm');
  } catch (error) {
    console.warn('Erreur de formatage de l\'heure:', error, timestamp);
    return '--:--';
  }
};

const logWaterIntake = async (amount: number) => {
  if (isLogging.value) return;

  isLogging.value = true;
  try {
    const intake = await waterStore.logWaterIntake(amount);

    // Add to today's history and sort by timestamp (newest first)
    todayIntakeHistory.value = [intake, ...todayIntakeHistory.value]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Show success toast
    toast.success(`${amount}ml d'eau ajoutés !`);
  } catch (error) {
    console.error('Error logging water intake:', error);
    toast.error('Erreur lors de l\'ajout d\'eau');
  } finally {
    isLogging.value = false;
  }
};

const addCustomIntake = async () => {
  if (!isValidCustomIntake.value || isLogging.value) return;

  const amount = customIntakeAmount.value || 0;
  await logWaterIntake(amount);

  // Close modal and reset
  showCustomIntakeModal.value = false;
  customIntakeAmount.value = 250;
};

// Remplacer complètement la fonction filterTodayIntakes dans WaterTrackerView.vue
const filterTodayIntakes = () => {
  console.log('Filtrage des entrées d\'aujourd\'hui...');
  console.log('Historique brut:', JSON.stringify(waterStore.intakeHistory));

  // Important: vérifier si l'historique est vide
  if (!waterStore.intakeHistory || waterStore.intakeHistory.length === 0) {
    console.log('Historique vide, rien à filtrer');
    todayIntakeHistory.value = [];
    return;
  }

  // Créer la date d'aujourd'hui à 00:00 local
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Extraire année, mois, jour de aujourd'hui
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  console.log(`Date d'aujourd'hui: ${todayYear}-${todayMonth+1}-${todayDay}`);

  // Filtrer l'historique en comparant directement les composants de date
  todayIntakeHistory.value = waterStore.intakeHistory
    .filter(intake => {
      console.log('Évaluation de l\'entrée:', intake);

      if (!intake || !intake.timestamp) {
        console.warn('Entrée sans horodatage:', intake);
        return false;
      }

      try {
        // Créer un objet Date à partir du timestamp
        const intakeDate = new Date(intake.timestamp);

        // Vérifier si la date est valide
        if (isNaN(intakeDate.getTime())) {
          console.warn('Date invalide:', intake.timestamp);
          return false;
        }

        // Extraire année, mois, jour de l'entrée
        const intakeYear = intakeDate.getFullYear();
        const intakeMonth = intakeDate.getMonth();
        const intakeDay = intakeDate.getDate();

        // Comparer année, mois, jour au lieu de comparer les chaînes
        const isToday = intakeYear === todayYear &&
                        intakeMonth === todayMonth &&
                        intakeDay === todayDay;

        console.log(`Entrée ${intake.id}: date=${intakeYear}-${intakeMonth+1}-${intakeDay}, estAujourdhui=${isToday}`);

        return isToday;
      } catch (error) {
        console.error('Erreur de traitement de date pour l\'entrée:', intake, error);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } catch (error) {
        console.warn('Erreur de tri:', error);
        return 0;
      }
    });

  console.log('Historique filtré:', todayIntakeHistory.value);

  // Si l'historique est vide mais qu'il y a une consommation aujourd'hui,
  // peut-être que les timestamps ne sont pas au bon format.
  // Essayons une approche alternative basée sur l'ID si applicable
  if (todayIntakeHistory.value.length === 0 && todayIntake.value > 0) {
    console.log('Historique vide mais consommation > 0, tentative de récupération par dernières entrées');
    // Prendre les entrées les plus récentes (par ID ou ordre d'ajout)
    const sortedIntakes = [...waterStore.intakeHistory].sort((a, b) => {
      // Tenter de trier par ID (assumant que les IDs plus récents sont plus grands/après alphabétiquement)
      return (b.id || '').localeCompare(a.id || '');
    });

    // Prendre jusqu'à 5 entrées les plus récentes pour aujourd'hui
    todayIntakeHistory.value = sortedIntakes.slice(0, 5);
    console.log('Historique récupéré par ID:', todayIntakeHistory.value);
  }
};

const generateWeeklyData = () => {
  console.log('Génération des données hebdomadaires...');

  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const today = new Date();
  const currentDayOfWeek = today.getDay();

  // Initialiser avec des données vides typées
  const weekData: WeeklyWaterData[] = [];

  // Créer la structure de la semaine
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() - currentDayOfWeek + i);

    // Format YYYY-MM-DD
    const dateString = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;

    weekData.push({
      day: days[i],
      date: dateString,
      intake: 0,
      goal: waterSettings.value.dailyGoalML || 2000,
      percentage: 0
    });
  }

  console.log('Structure hebdomadaire:', weekData);

  // Remplir avec les données réelles
  waterStore.intakeHistory.forEach(intake => {
    if (!intake || !intake.timestamp) {
      console.warn('Entrée invalide dans l\'historique:', intake);
      return;
    }

    try {
      const intakeDate = new Date(intake.timestamp);
      if (isNaN(intakeDate.getTime())) {
        console.warn('Date invalide dans l\'historique:', intake.timestamp);
        return;
      }

      const intakeDateString = `${intakeDate.getFullYear()}-${String(intakeDate.getMonth() + 1).padStart(2, '0')}-${String(intakeDate.getDate()).padStart(2, '0')}`;
      const dayIndex = weekData.findIndex(day => day.date === intakeDateString);

      if (dayIndex !== -1) {
        weekData[dayIndex].intake += intake.quantityML;
        const goal = weekData[dayIndex].goal || 2000; // Valeur par défaut si goal est 0
        weekData[dayIndex].percentage = (weekData[dayIndex].intake / goal) * 100;
        console.log(`Ajout à ${days[dayIndex]}: +${intake.quantityML}ml, total=${weekData[dayIndex].intake}ml, ${weekData[dayIndex].percentage.toFixed(1)}%`);
      }
    } catch (error) {
      console.warn('Erreur lors du traitement de l\'entrée:', error, intake);
    }
  });

  console.log('Données hebdomadaires générées:', weekData);
  weeklyData.value = weekData;
};

// Watch for changes in intake history
watch(() => waterStore.intakeHistory, () => {
  filterTodayIntakes();
  generateWeeklyData();
}, { deep: true });

onMounted(async () => {
  try {
    // Initialize water store
    await waterStore.initialize();

    // Filter today's intakes
    filterTodayIntakes();

    // Generate weekly data
    generateWeeklyData();
  } catch (error) {
    console.error('Error initializing water tracker:', error);
    toast.error('Erreur lors de l\'initialisation du suivi d\'hydratation');
  }
});
</script>
