<template>
  <DashboardLayout>
    <div class="mx-auto px-4 sm:px-6 md:px-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Paramètres d'hydratation</h1>
        <RouterLink
          to="/water"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <ArrowLeftIcon class="h-4 w-4 mr-2" />
          Retour au suivi
        </RouterLink>
      </div>

      <!-- Main settings form -->
      <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <form @submit.prevent="saveSettings">
            <div class="space-y-6">
              <!-- Daily goal setting -->
              <div>
                <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Objectif quotidien</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Définissez votre objectif quotidien d'hydratation.
                </p>
                <div class="mt-4">
                  <label for="daily-goal" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantité d'eau par jour (en ml)
                  </label>
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="daily-goal"
                      v-model.number="settingsForm.dailyGoalML"
                      type="number"
                      min="500"
                      max="5000"
                      step="100"
                      class="block w-full h-10 rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white pr-16"
                      placeholder="2000"
                    />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <span class="text-gray-500 dark:text-gray-400 sm:text-sm">ml</span>
                    </div>
                  </div>
                  <div class="mt-2 flex items-center">
                    <input
                      type="range"
                      v-model.number="settingsForm.dailyGoalML"
                      min="500"
                      max="5000"
                      step="100"
                      class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span class="ml-4 text-sm text-gray-700 dark:text-gray-300">{{ (settingsForm.dailyGoalML / 1000).toFixed(1) }} L</span>
                  </div>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Recommandation: Environ 2L d'eau par jour pour un adulte moyen.
                  </p>
                </div>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Rappels d'hydratation</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Configurez des rappels pour vous aider à atteindre votre objectif quotidien.
                </p>

                <div class="mt-4">
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input
                        id="reminder-enabled"
                        v-model="settingsForm.enabled"
                        type="checkbox"
                        class="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 dark:border-gray-700 rounded dark:bg-gray-700"
                      />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="reminder-enabled" class="font-medium text-gray-700 dark:text-gray-300">Activer les rappels</label>
                      <p class="text-gray-500 dark:text-gray-400">Recevez des notifications pour vous rappeler de boire de l'eau.</p>
                    </div>
                  </div>
                </div>

                <div v-if="settingsForm.enabled" class="mt-4 space-y-4">
                  <div>
                    <label for="reminder-interval" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Intervalle entre les rappels (en minutes)
                    </label>
                    <div class="mt-1">
                      <select
                        id="reminder-interval"
                        v-model="settingsForm.reminderInterval"
                        class="block w-full h-10 rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      >
                        <option value="30">30 minutes</option>
                        <option value="60">1 heure</option>
                        <option value="90">1 heure 30 minutes</option>
                        <option value="120">2 heures</option>
                        <option value="180">3 heures</option>
                        <option value="240">4 heures</option>
                      </select>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label for="start-time" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Heure de début
                      </label>
                      <div class="mt-1">
                        <input
                          id="start-time"
                          v-model="startTimeInput"
                          type="time"
                          class="block w-full h-10 rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label for="end-time" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Heure de fin
                      </label>
                      <div class="mt-1">
                        <input
                          id="end-time"
                          v-model="endTimeInput"
                          type="time"
                          class="block w-full h-10 rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Tailles de verre personnalisées</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Personnalisez les tailles de verre disponibles dans le suivi d'hydratation.
                </p>

                <div class="mt-4">
                  <div class="flex items-center space-x-2 mb-2">
                    <label for="custom-size" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ajouter une taille personnalisée (en ml)
                    </label>
                    <span
                      v-if="customGlassSizeError"
                      class="text-xs text-red-500"
                    >
                      {{ customGlassSizeError }}
                    </span>
                  </div>
                  <div class="flex space-x-2">
                    <div class="relative rounded-md shadow-sm flex-1">
                      <input
                        id="custom-size"
                        v-model.number="customGlassSize"
                        type="number"
                        min="50"
                        max="2000"
                        class="block w-full h-10 rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white pr-10"
                      />
                      <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 dark:text-gray-400 sm:text-sm">ml</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="addCustomGlassSize"
                      class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 h-10"
                    >
                      <PlusIcon class="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tailles de verre actuelles
                  </label>
                  <div class="flex flex-wrap gap-2">
                    <div
                      v-for="(size, index) in customGlassSizes"
                      :key="index"
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      {{ size }} ml
                      <button
                        type="button"
                        @click="removeGlassSize(index)"
                        class="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                      >
                        <span class="sr-only">Supprimer</span>
                        <XIcon class="h-3 w-3" />
                      </button>
                    </div>
                    <div v-if="customGlassSizes.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
                      Aucune taille personnalisée. Les tailles par défaut seront utilisées.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8 flex justify-end">
              <button
                type="button"
                @click="resetSettings"
                class="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Réinitialiser
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSaving ? 'Enregistrement...' : 'Enregistrer les paramètres' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Water intake data section -->
      <div class="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Données d'hydratation</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Gérez vos données d'hydratation.
            </p>
          </div>
        </div>
        <div class="px-4 py-5 sm:p-6">
          <div class="space-y-6">
            <div>
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Exporter les données</h4>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Téléchargez vos données d'hydratation dans différents formats pour une analyse personnelle.
              </p>
              <div class="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  @click="exportData('csv')"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <DocumentTextIcon class="h-4 w-4 mr-2" />
                  Exporter en CSV
                </button>
                <button
                  type="button"
                  @click="exportData('excel')"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <DocumentReportIcon class="h-4 w-4 mr-2" />
                  Exporter en Excel
                </button>
                <button
                  type="button"
                  @click="exportData('pdf')"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <DocumentIcon class="h-4 w-4 mr-2" />
                  Exporter en PDF
                </button>
              </div>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Réinitialiser l'historique</h4>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Supprimez toutes vos données d'hydratation enregistrées. Cette action ne peut pas être annulée.
              </p>
              <div class="mt-3">
                <button
                  type="button"
                  @click="confirmReset"
                  class="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-700 shadow-sm text-sm font-medium rounded-md text-red-700 dark:text-red-300 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <TrashIcon class="h-4 w-4 mr-2" />
                  Réinitialiser l'historique
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation modal -->
    <TransitionRoot appear :show="showResetModal" as="template">
      <Dialog as="div" @close="showResetModal = false" class="relative z-10">
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
                  Confirmer la réinitialisation
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Êtes-vous sûr de vouloir réinitialiser tout votre historique d'hydratation? Cette action ne peut pas être annulée.
                  </p>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="showResetModal = false"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    @click="resetHistory"
                    :disabled="isResetting"
                  >
                    <span v-if="isResetting" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Réinitialisation...
                    </span>
                    <span v-else>Réinitialiser</span>
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
import { ref, reactive, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import {
  ArrowLeftIcon,
  DownloadIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
  DocumentTextIcon,
  DocumentReportIcon,
  DocumentIcon
} from '@heroicons/vue/outline';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useWaterReminderStore } from '@/stores/waterReminder';
import type { WaterReminderSetting } from '@/types/waterReminder';
// Modifier les imports pour jsPDF et autoTable
import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Store and composables
const waterStore = useWaterReminderStore();
const toast = useToast();

// Component state
const isSaving = ref(false);
const isResetting = ref(false);
const showResetModal = ref(false);
const customGlassSize = ref<number>(0);
const customGlassSizeError = ref<string>('');
const customGlassSizes = ref<number[]>([]);

// Time inputs
const startTimeInput = ref('08:00');
const endTimeInput = ref('20:00');

// Default settings
const defaultSettings: WaterReminderSetting = {
  dailyGoalML: 2000,
  reminderEnabled: true,
  reminderInterval: 60,
  startTime: new Date().toISOString().replace('Z', '+00:00'), // Modifier pour la compatibilité backend
  endTime: new Date().toISOString().replace('Z', '+00:00'), // Modifier pour la compatibilité backend
  customGlassSizes: [],
  enabled: undefined
};

// Settings form
const settingsForm = reactive<WaterReminderSetting>({
  dailyGoalML: 2000,
  reminderEnabled: true,
  reminderInterval: 60,
  startTime: new Date().toISOString().replace('Z', '+00:00'), // Modifier pour la compatibilité backend
  endTime: new Date().toISOString().replace('Z', '+00:00'), // Modifier pour la compatibilité backend
  customGlassSizes: [],
  enabled: undefined
});

// Helpers for time conversion
const timeStringToInstant = (timeStr: string): string => {
  const now = new Date();
  const [hours, minutes] = timeStr.split(':').map(Number);

  now.setHours(hours, minutes, 0, 0);
  // Remplacer le Z par +00:00 pour éviter le problème avec le backend
  return now.toISOString().replace('Z', '+00:00');
};

const instantToTimeString = (instant: string): string => {
  try {
    const date = new Date(instant);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  } catch (error) {
    console.error('Error parsing date:', error);
    return '00:00';
  }
};

// Methods
const loadSettings = async () => {
  try {
    await waterStore.fetchSettings();

    // S'assurer que settings existe
    if (waterStore.settings) {
      // Update local settings state
      settingsForm.dailyGoalML = waterStore.settings.dailyGoalML;
      settingsForm.reminderEnabled = waterStore.settings.reminderEnabled;
      settingsForm.reminderInterval = waterStore.settings.reminderInterval;

      // Gérer les heures (conversion entre string et Instant)
      if (waterStore.settings.startTime) {
        startTimeInput.value = instantToTimeString(waterStore.settings.startTime);
      }

      if (waterStore.settings.endTime) {
        endTimeInput.value = instantToTimeString(waterStore.settings.endTime);
      }

      // Gérer les tailles de verre personnalisées si elles existent
      if (waterStore.settings.customGlassSizes && Array.isArray(waterStore.settings.customGlassSizes)) {
        customGlassSizes.value = [...waterStore.settings.customGlassSizes];
      }
    }
  } catch (error) {
    console.error('Error loading water settings:', error);
    toast.error('Erreur lors du chargement des paramètres');
  }
};

const saveSettings = async () => {
  if (isSaving.value) return;

  isSaving.value = true;
  try {
    // Conversion des heures de string à Instant
    settingsForm.startTime = timeStringToInstant(startTimeInput.value);
    settingsForm.endTime = timeStringToInstant(endTimeInput.value);

    // Créer un objet de paramètres avec les tailles de verre personnalisées
    const updatedSettings: WaterReminderSetting = {
      ...settingsForm,
      customGlassSizes: customGlassSizes.value
    };

    await waterStore.updateSettings(updatedSettings);
    toast.success('Paramètres enregistrés avec succès');
  } catch (error) {
    console.error('Error saving water settings:', error);
    toast.error('Erreur lors de l\'enregistrement des paramètres');
  } finally {
    isSaving.value = false;
  }
};

const resetSettings = () => {
  // Reset to default settings
  settingsForm.dailyGoalML = defaultSettings.dailyGoalML;
  settingsForm.reminderEnabled = defaultSettings.reminderEnabled;
  settingsForm.reminderInterval = defaultSettings.reminderInterval;
  startTimeInput.value = '08:00';
  endTimeInput.value = '20:00';
  settingsForm.startTime = defaultSettings.startTime;
  settingsForm.endTime = defaultSettings.endTime;
  customGlassSizes.value = [];

  toast.info('Paramètres réinitialisés. Cliquez sur "Enregistrer" pour appliquer les changements.');
};

const addCustomGlassSize = () => {
  customGlassSizeError.value = '';

  if (!customGlassSize.value || customGlassSize.value <= 0) {
    customGlassSizeError.value = 'Veuillez entrer une valeur valide';
    return;
  }

  if (customGlassSize.value < 50 || customGlassSize.value > 2000) {
    customGlassSizeError.value = 'La taille doit être entre 50 et 2000 ml';
    return;
  }

  if (customGlassSizes.value.includes(customGlassSize.value)) {
    customGlassSizeError.value = 'Cette taille existe déjà';
    return;
  }

  customGlassSizes.value.push(customGlassSize.value);
  customGlassSizes.value.sort((a, b) => a - b);
  customGlassSize.value = 0;
};

const removeGlassSize = (index: number) => {
  customGlassSizes.value.splice(index, 1);
};

const createExportData = async () => {
  // Récupérer l'historique des données d'hydratation
  await waterStore.fetchIntakeHistory();

  // Formater les données pour l'export
  return waterStore.intakeHistory.map(intake => ({
    Date: new Date(intake.timestamp).toLocaleDateString(),
    Heure: new Date(intake.timestamp).toLocaleTimeString(),
    Quantite: `${intake.quantityML} ml`,
    QuantiteL: `${(intake.quantityML / 1000).toFixed(2)} L`,
  }));
};

const exportData = async (format: 'csv' | 'excel' | 'pdf') => {
  try {
    const exportData = await createExportData();

    // Si aucune donnée, afficher un message d'avertissement
    if (exportData.length === 0) {
      toast.warning("Aucune donnée à exporter");
      return;
    }

    const filename = `hydration_data_${new Date().toISOString().split('T')[0]}`;

    if (format === 'csv') {
      // Formatage CSV
      const header = "Date,Heure,Quantité (ml),Quantité (L)\n";
      const rows = exportData.map(item =>
        `${item.Date},${item.Heure},${item.Quantite},${item.QuantiteL}`
      ).join("\n");

      const csvContent = header + rows;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
    else if (format === 'excel') {
      // Formatage Excel
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Hydratation");

      // Ajouter des styles et mettre en forme
      worksheet['!cols'] = [
        { width: 15 }, // Date
        { width: 15 }, // Heure
        { width: 15 }, // Quantité ml
        { width: 15 }, // Quantité L
      ];

      XLSX.writeFile(workbook, `${filename}.xlsx`);
    }
    else if (format === 'pdf') {
      try {
        // Créer un nouveau document PDF
        const doc = new jspdf();

        // Ajouter un titre
        doc.setFontSize(18);
        doc.setTextColor(44, 62, 80);
        doc.text("Rapport d'Hydratation ZenLife", 105, 15, { align: 'center' });

        // Ajouter la date de génération
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Généré le: ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}`, 105, 25, { align: 'center' });

        // Ajouter un résumé
        doc.setFontSize(12);
        doc.setTextColor(44, 62, 80);
        doc.text(`Nombre total d'entrées: ${exportData.length}`, 20, 35);

        if (exportData.length > 0) {
          // Trouver la quantité totale
          const totalQuantity = exportData.reduce((sum, item) => {
            const qty = parseInt(item.Quantite.replace(' ml', ''));
            return sum + qty;
          }, 0);

          doc.text(`Quantité totale: ${totalQuantity} ml (${(totalQuantity / 1000).toFixed(2)} L)`, 20, 45);
        }

        // Créer le tableau manuellement si autoTable n'est pas disponible
        if (typeof doc.autoTable !== 'function') {
          console.log("Utilisation d'une méthode alternative pour créer le tableau");

          // Définir les positions du tableau
          const startY = 55;
          const rowHeight = 10;
          const colWidths = [40, 40, 40, 40];
          const startX = 20;

          // Créer l'en-tête du tableau
          doc.setFillColor(41, 128, 185);
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.rect(startX, startY, colWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');

          // Texte d'en-tête
          const headers = ['Date', 'Heure', 'Quantité (ml)', 'Quantité (L)'];
          let currentX = startX;
          headers.forEach((header, index) => {
            doc.text(header, currentX + 5, startY + 7);
            currentX += colWidths[index];
          });

          // Lignes des données
          let currentY = startY + rowHeight;
          exportData.forEach((item, rowIndex) => {
            // Alternance de couleurs
            if (rowIndex % 2 === 0) {
              doc.setFillColor(240, 240, 240);
              doc.rect(startX, currentY, colWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
            }

            // Texte de la ligne
            doc.setTextColor(0, 0, 0);
            currentX = startX;
            [item.Date, item.Heure, item.Quantite, item.QuantiteL].forEach((value, index) => {
              doc.text(value, currentX + 5, currentY + 7);
              currentX += colWidths[index];
            });

            currentY += rowHeight;
          });
        } else {
          // Utiliser autoTable si disponible
          doc.autoTable({
            head: [['Date', 'Heure', 'Quantité (ml)', 'Quantité (L)']],
            body: exportData.map(item => [item.Date, item.Heure, item.Quantite, item.QuantiteL]),
            startY: 55,
            theme: 'grid',
            headStyles: {
              fillColor: [41, 128, 185],
              textColor: [255, 255, 255],
              fontStyle: 'bold'
            },
            alternateRowStyles: {
              fillColor: [240, 240, 240]
            },
            margin: { top: 60 },
          });
        }

        // Ajouter un pied de page
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`ZenLife - Suivi d'hydratation - Page 1`, 105, doc.internal.pageSize.height - 10, { align: 'center' });

        // Sauvegarder le PDF
        doc.save(`${filename}.pdf`);
      } catch (err) {
        console.error("Erreur lors de la génération du PDF:", err);
        throw err;
      }
    }
    toast.success(`Données exportées avec succès au format ${format.toUpperCase()}`);
  } catch (error) {
    console.error(`Error exporting data to ${format}:`, error);
    toast.error(`Erreur lors de l'exportation des données en ${format.toUpperCase()}`);
  }
};

const confirmReset = () => {
  showResetModal.value = true;
};

const resetHistory = async () => {
  if (isResetting.value) return;

  isResetting.value = true;
  try {
    // Appeler l'API pour réinitialiser l'historique
    await waterStore.resetHistory();

    // Mise à jour locale
    waterStore.intakeHistory = [];
    waterStore.todayIntake = 0;

    toast.success('Historique réinitialisé avec succès');
    showResetModal.value = false;
  } catch (error) {
    console.error('Error resetting history:', error);
    toast.error('Erreur lors de la réinitialisation de l\'historique');
  } finally {
    isResetting.value = false;
  }
};

// Initialize
onMounted(async () => {
  await loadSettings();
});
</script>
