<template>
  <DashboardLayout>
    <div class="mx-auto px-4 sm:px-6 md:px-8">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Paramètres</h1>
      <div class="mt-4">
        <RouterLink
          to="/profile"
          class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <ArrowLeftIcon class="h-4 w-4 mr-1" />
          Retour au profil
        </RouterLink>
      </div>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="mt-8 flex justify-center">
        <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else class="mt-6">
        <!-- Settings sections -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
          <!-- Navigation sidebar -->
          <div class="col-span-1">
            <nav class="space-y-1">
              <button
                v-for="section in sections"
                :key="section.id"
                @click="activeSection = section.id"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left"
                :class="activeSection === section.id ? 'bg-primary-50 text-primary-700 dark:bg-gray-800 dark:text-white' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'"
              >
                <component :is="section.icon" class="h-5 w-5 mr-2" />
                {{ section.name }}
              </button>
            </nav>
          </div>

          <!-- Settings content -->
          <div class="col-span-4">
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <!-- Appearance settings -->
              <div v-if="activeSection === 'appearance'">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Apparence</h2>

                <div class="space-y-6">
                  <div>
                    <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Thème</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Choisissez le thème que vous préférez.
                    </p>
                    <div class="mt-3 space-y-3">
                      <div class="flex items-center">
                        <input
                          id="theme-system"
                          v-model="themePreference"
                          type="radio"
                          value="system"
                          class="h-4 w-4 border-gray-300 dark:border-gray-700 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                        />
                        <label for="theme-system" class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Système (utiliser les préférences de votre appareil)
                        </label>
                      </div>
                      <div class="flex items-center">
                        <input
                          id="theme-light"
                          v-model="themePreference"
                          type="radio"
                          value="light"
                          class="h-4 w-4 border-gray-300 dark:border-gray-700 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                        />
                        <label for="theme-light" class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Clair
                        </label>
                      </div>
                      <div class="flex items-center">
                        <input
                          id="theme-dark"
                          v-model="themePreference"
                          type="radio"
                          value="dark"
                          class="h-4 w-4 border-gray-300 dark:border-gray-700 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                        />
                        <label for="theme-dark" class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Sombre
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Langue</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Sélectionnez votre langue préférée pour l'interface.
                    </p>
                    <select
                      v-model="language"
                      class="mt-3 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div>
  <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Devise</h3>
  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
    Choisissez votre devise préférée pour le suivi financier.
  </p>
  <select
    v-model="selectedCurrency"
    @change="updateCurrency"
    class="mt-3 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
  >
    <option value="EUR">Euro (€)</option>
    <option value="USD">Dollar américain ($)</option>
    <option value="XOF">Franc CFA (FCFA)</option>
  </select>
</div>
                </div>
              </div>

              <!-- Notifications settings -->
<div v-if="activeSection === 'notifications'" class="animate-fadeIn">
  <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
    <BellIcon class="h-5 w-5 mr-2 text-primary-600" />
    Notifications
  </h2>

  <div class="space-y-6">
    <!-- Notification Push principale -->
    <div class="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <h3 class="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">Notifications push</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Autorisez ZenLife à vous envoyer des notifications même lorsque l'application est fermée.
      </p>

      <NotificationToggle class="mt-2" />
    </div>

    <!-- Préférences par type -->
    <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div class="px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Types de notifications</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Personnalisez les catégories de notifications que vous souhaitez recevoir.
        </p>
      </div>

      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <!-- Tâches -->
        <div class="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <ClipboardCheckIcon class="h-5 w-5 text-blue-500" />
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Tâches à faire</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Rappels pour vos tâches quotidiennes
              </p>
            </div>
          </div>
          <Switch
            v-model="notifications.tasks"
            :class="notifications.tasks ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'"
            class="relative inline-flex h-6 w-11 items-center rounded-full"
          >
            <span class="sr-only">Activer les notifications de tâches</span>
            <span
              :class="notifications.tasks ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white transition"
            />
          </Switch>
        </div>

        <!-- Hydratation -->
        <div class="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <DropletIcon class="h-5 w-5 text-blue-400" />
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Rappels d'hydratation</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Rappels pour boire de l'eau régulièrement
              </p>
            </div>
          </div>
          <Switch
            v-model="notifications.water"
            :class="notifications.water ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'"
            class="relative inline-flex h-6 w-11 items-center rounded-full"
          >
            <span class="sr-only">Activer les rappels d'hydratation</span>
            <span
              :class="notifications.water ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white transition"
            />
          </Switch>
        </div>

        <!-- Pensées positives -->
        <div class="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <SunIcon class="h-5 w-5 text-yellow-500" />
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Pensées positives</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Notifications de pensées positives quotidiennes
              </p>
            </div>
          </div>
          <Switch
            v-model="notifications.positiveThoughts"
            :class="notifications.positiveThoughts ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'"
            class="relative inline-flex h-6 w-11 items-center rounded-full"
          >
            <span class="sr-only">Activer les pensées positives</span>
            <span
              :class="notifications.positiveThoughts ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white transition"
            />
          </Switch>
        </div>

        <!-- Alertes budgétaires -->
        <div class="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <CurrencyDollarIcon class="h-5 w-5 text-green-500" />
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Alertes budgétaires</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Alertes lorsque vous approchez de vos limites budgétaires
              </p>
            </div>
          </div>
          <Switch
            v-model="notifications.budget"
            :class="notifications.budget ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'"
            class="relative inline-flex h-6 w-11 items-center rounded-full"
          >
            <span class="sr-only">Activer les alertes budgétaires</span>
            <span
              :class="notifications.budget ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white transition"
            />
          </Switch>
        </div>

        <!-- Messages -->
        <div class="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <ChatAltIcon class="h-5 w-5 text-purple-500" />
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Messages</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Notifications pour les nouveaux messages
              </p>
            </div>
          </div>
          <Switch
            v-model="notifications.messages"
            :class="notifications.messages ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'"
            class="relative inline-flex h-6 w-11 items-center rounded-full"
          >
            <span class="sr-only">Activer les notifications de messages</span>
            <span
              :class="notifications.messages ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white transition"
            />
          </Switch>
        </div>
      </div>
    </div>

    <!-- Information de confidentialité -->
    <div class="mt-4 text-xs text-gray-500 dark:text-gray-400 italic">
      <p>Les notifications peuvent contenir des données personnelles et apparaître sur votre écran de verrouillage. Vous pouvez modifier vos paramètres de confidentialité dans les réglages de votre appareil.</p>
    </div>
  </div>
</div>

              <!-- Privacy settings -->
              <div v-if="activeSection === 'privacy'">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Confidentialité</h2>

                <div class="space-y-6">
                  <div>
                    <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Visibilité du profil</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Choisissez qui peut voir votre profil et vos activités.
                    </p>
                    <div class="mt-3 space-y-3">
                      <div class="flex items-center">
                        <input
                          id="visibility-public"
                          v-model="privacy.profileVisibility"
                          type="radio"
                          value="public"
                          class="h-4 w-4 border-gray-300 dark:border-gray-700 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                        />
                        <label for="visibility-public" class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Public (tout le monde peut voir votre profil)
                        </label>
                      </div>
                      <div class="flex items-center">
                        <input
                          id="visibility-friends"
                          v-model="privacy.profileVisibility"
                          type="radio"
                          value="friends"
                          class="h-4 w-4 border-gray-300 dark:border-gray-700 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                        />
                        <label for="visibility-friends" class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Amis uniquement
                        </label>
                      </div>
                      <div class="flex items-center">
                        <input
                          id="visibility-private"
                          v-model="privacy.profileVisibility"
                          type="radio"
                          value="private"
                          class="h-4 w-4 border-gray-300 dark:border-gray-700 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
                        />
                        <label for="visibility-private" class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Privé (personne ne peut voir votre profil)
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Données personnelles</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Gérez vos données personnelles.
                    </p>
                    <div class="mt-3 space-y-3">
                      <div class="flex items-center justify-between">
                        <div>
                          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Autoriser le stockage des données</h4>
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            Nous utilisons vos données pour améliorer votre expérience
                          </p>
                        </div>
                        <Switch
                          v-model="privacy.allowDataStorage"
                          :class="privacy.allowDataStorage ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'"
                          class="relative inline-flex h-6 w-11 items-center rounded-full"
                        >
                          <span class="sr-only">Autoriser le stockage des données</span>
                          <span
                            :class="privacy.allowDataStorage ? 'translate-x-6' : 'translate-x-1'"
                            class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                          />
                        </Switch>
                      </div>
                    </div>

                    <div class="mt-6">
                      <button
                        @click="showDeleteAccountModal = true"
                        class="inline-flex justify-center items-center py-2 px-4 border border-red-300 dark:border-red-700 text-sm font-medium rounded-md text-red-700 dark:text-red-300 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <TrashIcon class="h-5 w-5 mr-2" />
                        Supprimer mon compte
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- About settings -->
              <div v-if="activeSection === 'about'">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">À propos</h2>

                <div class="space-y-6">
                  <div>
                    <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">ZenLife</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Version {{ appVersion }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-3">
                      ZenLife est une application tout-en-un pour prendre soin de soi et gérer son quotidien. Elle vous aide à suivre votre consommation d'eau, gérer vos finances, planifier vos journées et bien plus encore.
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-3">
                      Développée par Rostel PANOUMASSI.
                    </p>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Liens utiles</h3>
                    <div class="mt-3 space-y-2">
                      <p>
                        <a href="#" class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                          Conditions d'utilisation
                        </a>
                      </p>
                      <p>
                        <a href="#" class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                          Politique de confidentialité
                        </a>
                      </p>
                      <p>
                        <a href="#" class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                          Centre d'aide
                        </a>
                      </p>
                      <p>
                        <a href="#" class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                          Nous contacter
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Save button -->
              <div class="mt-6 flex justify-end">
                <button
                  @click="saveSettings"
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
                  <span v-else>Enregistrer les paramètres</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <TransitionRoot appear :show="showDeleteAccountModal" as="template">
      <Dialog as="div" @close="showDeleteAccountModal = false" class="relative z-10">
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
                  Supprimer le compte
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront définitivement perdues.
                  </p>
                </div>

                <div class="mt-4">
                  <label for="delete-confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Veuillez saisir votre mot de passe pour confirmer
                  </label>
                  <input
                    id="delete-confirmation"
                    v-model="deleteAccountPassword"
                    type="password"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    placeholder="Votre mot de passe"
                  />
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    @click="showDeleteAccountModal = false"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    @click="deleteAccount"
                    :disabled="!deleteAccountPassword || isDeleting"
                  >
                    <span v-if="isDeleting" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Suppression...
                    </span>
                    <span v-else>Supprimer le compte</span>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
  Switch
} from '@headlessui/vue';
import {
  BellIcon,
  LockClosedIcon,
  InformationCircleIcon,
  SunIcon,
  TrashIcon,
} from '@heroicons/vue/outline';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import NotificationToggle from '@/components/setting/NotificationToggle.vue';


// Stores and composables
const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

// Component state
const isLoading = ref(true);
const isSaving = ref(false);
const isDeleting = ref(false);
const activeSection = ref('appearance');
const showDeleteAccountModal = ref(false);
const deleteAccountPassword = ref('');
const appVersion = ref(import.meta.env.VITE_APP_VERSION || '0.1.0');

// Settings sections
const sections = [
  { id: 'appearance', name: 'Apparence', icon: SunIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon },
  { id: 'privacy', name: 'Confidentialité', icon: LockClosedIcon },
  { id: 'about', name: 'À propos', icon: InformationCircleIcon },
];

// Settings
const themePreference = ref('system');
const language = ref('fr');

const notifications = ref({
  tasks: true,
  water: true,
  positiveThoughts: true,
  budget: true,
  messages: true,
});

const privacy = ref({
  profileVisibility: 'friends',
  allowDataStorage: true,
});

import { useFinanceStore } from '@/stores/finance';

const financeStore = useFinanceStore();

// Référence pour stocker la devise sélectionnée
const selectedCurrency = ref(financeStore.currencyPreference);

// Fonction pour initialiser la devise selon les préférences stockées
const initCurrency = () => {
  // Récupérer la préférence depuis le store
  selectedCurrency.value = financeStore.currencyPreference;
};

// Appeler initCurrency au chargement du composant
onMounted(() => {
  initCurrency();
});

// Methods
const updateCurrency = () => {
  // Utilise le store pour mettre à jour la devise
  financeStore.setCurrencyPreference(selectedCurrency.value);

  // Affiche une notification pour confirmer le changement
  toast.success(`Devise changée avec succès pour ${
    selectedCurrency.value === 'EUR' ? 'Euro (€)' :
    selectedCurrency.value === 'USD' ? 'Dollar américain ($)' :
    'Franc CFA (FCFA)'
  }`);
};
const saveSettings = async () => {
  if (isSaving.value) return;

  isSaving.value = true;
  try {
    // Save theme preference
    if (themePreference.value === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (themePreference.value === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    // Save theme preference to local storage and user settings
    localStorage.setItem('theme', themePreference.value);
    await userStore.updateThemePreference(themePreference.value);

    // Save notification preferences
    const notificationPreferences = JSON.stringify(notifications.value);
    await userStore.updateNotificationPreferences(notificationPreferences);

    // Save other settings to local storage
    localStorage.setItem('language', language.value);
    localStorage.setItem('privacy', JSON.stringify(privacy.value));

    toast.success('Paramètres enregistrés avec succès');
  } catch (error) {
    console.error('Error saving settings:', error);
    toast.error('Erreur lors de l\'enregistrement des paramètres');
  } finally {
    isSaving.value = false;
  }
};

const deleteAccount = async () => {
  if (!deleteAccountPassword.value || isDeleting.value) return;

  isDeleting.value = true;
  try {
    // In a real app, this would call an API endpoint to verify the password and delete the account
    await userStore.deactivateAccount();

    // Logout
    await authStore.logout();

    // Show success message and redirect to login
    toast.success('Votre compte a été supprimé avec succès');
    router.push('/auth/login');
  } catch (error) {
    console.error('Error deleting account:', error);
    toast.error('Erreur lors de la suppression du compte');
  } finally {
    isDeleting.value = false;
    showDeleteAccountModal.value = false;
  }
};

// Initialize
onMounted(() => {
  // Load theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    themePreference.value = savedTheme;
  } else {
    themePreference.value = 'system';
  }

  // Load language preference
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage) {
    language.value = savedLanguage;
  }

  // Load notification preferences from user settings if available
  if (userStore.user && userStore.user.notificationPreferences) {
    try {
      const parsedPreferences = JSON.parse(userStore.user.notificationPreferences);
      notifications.value = { ...notifications.value, ...parsedPreferences };
    } catch (error) {
      console.error('Error parsing notification preferences:', error);
    }
  }

  // Load privacy settings
  const savedPrivacy = localStorage.getItem('privacy');
  if (savedPrivacy) {
    try {
      const parsedPrivacy = JSON.parse(savedPrivacy);
      privacy.value = { ...privacy.value, ...parsedPrivacy };
    } catch (error) {
      console.error('Error parsing privacy settings:', error);
    }
  }

  isLoading.value = false;
});
</script>

<style>
/* Augmentation de la taille des champs input */
input, select, textarea {
  min-height: 2.75rem !important; /* Hauteur minimale augmentée */
  padding: 0.625rem 0.75rem !important; /* Padding augmenté */
}

/* Style pour les cartes de budget */
.budget-card {
  transition: all 0.3s ease;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.budget-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

/* Taille minimale pour les boutons */
button {
  min-height: 2.5rem;
}
</style>
