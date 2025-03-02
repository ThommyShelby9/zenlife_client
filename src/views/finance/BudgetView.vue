<template>
  <DashboardLayout>
    <div class="mx-auto px-4 sm:px-6 md:px-8">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Budget mensuel</h1>
          <RouterLink
            to="/finance/summary"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <CurrencyDollarIcon class="h-4 w-4 mr-1" />
            Historique financier
          </RouterLink>
        </div>
        <button
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Ajouter un budget
        </button>
      </div>

      <!-- Month selector -->
      <div class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div class="flex justify-between items-center">
          <div class="flex space-x-4">
            <button
              @click="navigateMonth(-1)"
              class="inline-flex items-center p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ChevronLeftIcon class="h-5 w-5" />
            </button>
            <div class="relative">
              <input
                type="month"
                v-model="selectedMonth"
                class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              />
            </div>
            <button
              @click="navigateMonth(1)"
              class="inline-flex items-center p-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ChevronRightIcon class="h-5 w-5" />
            </button>
          </div>
          <span class="text-lg font-medium text-gray-900 dark:text-white">
            {{ formatMonthYear(new Date(selectedMonth)) }}
          </span>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="isLoading" class="mt-8 flex justify-center">
        <svg class="animate-spin h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Ajout du résumé des budgets avec indicateur du rapport entre budget global et sous-budgets -->
      <div v-else-if="generalBudget && categoryBudgets.length > 0" class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Budget total et sous-budgets
          </h3>

          <div class="text-sm font-medium rounded-full px-3 py-1"
               :class="[
                 (totalCategoryBudgets / generalBudget.amount) > 0.9 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                 (totalCategoryBudgets / generalBudget.amount) > 0.8 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
               ]">
            {{ formatCurrency(totalCategoryBudgets) }} / {{ formatCurrency(generalBudget.amount) }}
            ({{ Math.round(totalCategoryBudgets / generalBudget.amount * 100) }}% alloué)
          </div>
        </div>

        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Le budget global définit la limite totale de dépenses. Les sous-budgets permettent de répartir ce montant par catégorie.
        </p>
      </div>

      <!-- Budget summary -->
      <div v-else class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        <!-- Total budget card -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
                <CashIcon class="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Budget total
                  </dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ formatCurrency(totalBudget) }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Total expenses card -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 bg-red-100 dark:bg-red-900 rounded-md p-3">
                <TrendingDownIcon class="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Dépenses totales
                  </dt>
                  <dd>
                    <div class="text-lg font-medium text-gray-900 dark:text-white">
                      {{ formatCurrency(totalExpenses) }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Remaining budget card -->
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div
                class="flex-shrink-0 rounded-md p-3"
                :class="[
                  remainingBudget > 0 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-red-100 dark:bg-red-900'
                ]"
              >
                <CurrencyDollarIcon
                  class="h-6 w-6"
                  :class="[
                    remainingBudget > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
                  ]"
                />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Budget restant
                  </dt>
                  <dd>
                    <div
                      class="text-lg font-medium"
                      :class="[
                        remainingBudget > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'
                      ]"
                    >
                      {{ formatCurrency(remainingBudget) }}
                      <span class="text-sm ml-1">
                        ({{ Math.min(100, spentPercentage) }}% utilisés)
                      </span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Budget général - section améliorée -->
      <div class="mt-6 mb-6 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Budget général
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Budget total pour le mois de {{ formatMonthYear(new Date(selectedMonth)) }}
          </p>
        </div>

        <div class="px-4 py-5 sm:p-6">
          <div v-if="generalBudget" class="flex items-center justify-between budget-card p-4 border-l-4 border-l-primary-500 rounded-lg">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center bg-primary-600">
                <CurrencyDollarIcon class="h-6 w-6 text-white" />
              </div>
              <div class="ml-4">
                <div class="flex items-center">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ formatCurrency(generalBudget.amount) }}
                  </h4>
                  <span class="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                    Global
                  </span>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ Math.min(100, spentPercentage) }}% utilisés
                </p>
              </div>
            </div>
            <button
              @click="editGeneralBudget"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PencilIcon class="h-4 w-4 mr-1" />
              Modifier
            </button>
          </div>

          <div v-else class="text-center py-6">
            <CurrencyDollarIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun budget général</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Définissez un budget global pour le mois avant de créer des sous-budgets.
            </p>
            <div class="mt-6">
              <button
                @click="openCreateGeneralBudgetModal"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon class="h-4 w-4 mr-2" />
                Définir le budget global
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Budget by category - section améliorée -->
      <div class="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Répartition du budget par catégorie
            </h3>

            <div v-if="generalBudget && categoryBudgets.length > 0"
                 class="text-sm font-medium"
                 :class="[
                   (totalCategoryBudgets / generalBudget.amount) > 0.9 ? 'text-red-600 dark:text-red-400' :
                   (totalCategoryBudgets / generalBudget.amount) > 0.8 ? 'text-yellow-600 dark:text-yellow-400' :
                   'text-green-600 dark:text-green-400'
                 ]">
              {{ formatCurrency(totalCategoryBudgets) }} / {{ formatCurrency(generalBudget.amount) }}
              ({{ Math.round(totalCategoryBudgets / generalBudget.amount * 100) }}%)
            </div>
          </div>
          <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Détails des sous-budgets par catégorie pour {{ formatMonthYear(new Date(selectedMonth)) }}
          </p>
        </div>

        <div v-if="categoryBudgets.length === 0" class="p-6 text-center">
          <CurrencyDollarIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun budget par catégorie</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Commencez par ajouter un budget pour une catégorie.
          </p>
          <div class="mt-6">
            <button
              @click="openCreateModal"
              :disabled="!generalBudget"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Ajouter un budget de catégorie
            </button>
            <p v-if="!generalBudget" class="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
              Vous devez d'abord définir un budget global avant de créer des sous-budgets.
            </p>
          </div>
        </div>

        <div v-else class="px-4 sm:px-6 py-5">
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="budget in categoryBudgets" :key="budget.id"
                class="py-4 budget-card px-4 mb-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="flex items-center justify-between mb-2">
               <!-- Après -->
<div class="flex items-center" v-if="budget.category">
  <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
       :style="{ backgroundColor: getCategoryColor(budget.category) }">
    <component :is="getCategoryIcon(budget.category.name)" class="h-5 w-5 text-white" />
  </div>
  <div class="ml-4">
    <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ budget.category.name }}</h4>
    <p class="text-sm text-gray-500 dark:text-gray-400">
      Budget: {{ formatCurrency(budget.amount) }}
    </p>
  </div>
</div>

                <div class="flex space-x-3">
                  <button
                    @click="editBudget(budget)"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <PencilIcon class="h-3.5 w-3.5 mr-1" />
                    Modifier
                  </button>
                  <button
                    @click="deleteBudget(budget)"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon class="h-3.5 w-3.5 mr-1" />
                    Supprimer
                  </button>
                </div>
              </div>

              <div class="w-full mt-2">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="text-gray-500 dark:text-gray-400">
                    {{ formatCurrency(budget.spent ?? 0) }} dépensés
                  </span>
                  <span class="text-gray-500 dark:text-gray-400">
                    {{ getBudgetProgress(budget) }}%
                  </span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    class="h-2.5 rounded-full"
                    :style="{ width: `${Math.min(100, getBudgetProgress(budget))}%` }"
                    :class="[
                      getBudgetStatus(budget) === 'under' ? 'bg-green-600' :
                      getBudgetStatus(budget) === 'near' ? 'bg-yellow-600' :
                      'bg-red-600'
                    ]"
                  ></div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Available categories to budget -->
      <div v-if="availableCategories.length > 0" class="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Catégories disponibles
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Catégories sans budget pour {{ formatMonthYear(new Date(selectedMonth)) }}
          </p>
        </div>

        <div class="px-4 sm:px-6 py-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="category in availableCategories"
              :key="category.id"
              @click="createBudgetForCategory(category)"
              class="border border-gray-300 dark:border-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 budget-card"
              :class="{ 'opacity-50 cursor-not-allowed': !generalBudget }"
            >
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center" :style="{ backgroundColor: category.color || '#4B5563' }">
                  <component :is="getCategoryIcon(category.name)" class="h-5 w-5 text-white" />
                </div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ category.name }}</div>
              </div>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {{ generalBudget ? 'Cliquez pour définir un budget' : 'Définissez d\'abord un budget global' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit budget modal -->
    <TransitionRoot appear :show="showBudgetModal" as="template">
      <Dialog as="div" @close="showBudgetModal = false" class="relative z-10">
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
                  {{ editingBudget ? 'Modifier le budget' : 'Ajouter un budget' }}
                </DialogTitle>

                <div class="mt-4 space-y-4">
                  <!-- Sélection du type de budget -->
                  <div v-if="!editingBudget" class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type de budget
                    </label>
                    <div class="flex space-x-4">
                      <button
                        type="button"
                        @click="setBudgetType('general')"
                        class="px-4 py-2 rounded-md transition-colors duration-200"
                        :class="isGeneralBudget
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
                      >
                        Budget Général
                      </button>
                      <button
                        type="button"
                        @click="setBudgetType('category')"
                        class="px-4 py-2 rounded-md transition-colors duration-200"
                        :class="!isGeneralBudget
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
                      >
                        Budget par Catégorie
                      </button>
                    </div>
                  </div>

                  <!-- Bloc d'information amélioré pour la relation budget global / sous-budgets -->
                  <div v-if="!isGeneralBudget && generalBudget" class="p-3 rounded-md mb-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800">
                    <div class="flex items-center">
                      <InformationCircleIcon class="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
                      <div>
                        <p class="text-sm text-blue-700 dark:text-blue-300 font-medium">
                          Distribution des budgets
                        </p>
                        <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Total des sous-budgets: {{ formatCurrency(totalCategoryBudgets) }} /
                          Budget global: {{ formatCurrency(generalBudget.amount) }}
                          ({{ Math.round(totalCategoryBudgets / generalBudget.amount * 100) }}%)
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Catégorie pour budget de catégorie -->
                  <div v-if="!isGeneralBudget" class="space-y-2">
                    <label for="budget-category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Catégorie
                    </label>
<!-- Après -->
<select
  id="budget-category"
  v-model="budgetForm.categoryId"
  :disabled="!!editingBudget"
  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
>
                      <option value="" disabled>Sélectionner une catégorie</option>
                      <option
                        v-for="category in availableCategories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Bloc d'information pour le budget général -->
                  <div v-if="isGeneralBudget" class="bg-primary-50 dark:bg-primary-900 p-3 rounded-md flex items-center">
                    <CurrencyDollarIcon class="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3" />
                    <p class="text-sm text-primary-700 dark:text-primary-300">
                      Ce budget s'appliquera à l'ensemble des dépenses du mois
                    </p>
                  </div>

                  <!-- Avertissement de dépassement de budget -->
                  <div
                    v-if="!isGeneralBudget && generalBudget && totalCategoryBudgets > generalBudget.amount"
                    class="mt-4 p-3 rounded-md bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-800"
                  >
                    <div class="flex items-center">
                      <ExclamationIcon class="h-5 w-5 mr-2 text-red-500 dark:text-red-400" />
                      <p class="text-sm font-medium">
                        Attention : Le total des sous-budgets ({{ formatCurrency(totalCategoryBudgets) }})
                        dépasse le budget global ({{ formatCurrency(generalBudget.amount) }})
                      </p>
                    </div>
                  </div>

                  <!-- Avertissement pour budget global inférieur aux sous-budgets existants -->
                  <div
                    v-if="isGeneralBudget && categoryBudgets.length > 0 && budgetForm.amount < totalCategoryBudgets"
                    class="mt-4 p-3 rounded-md bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-800"
                  >
                    <div class="flex items-center">
                      <ExclamationIcon class="h-5 w-5 mr-2 text-red-500 dark:text-red-400" />
                      <p class="text-sm font-medium">
                        Le budget global ({{ formatCurrency(budgetForm.amount) }}) ne peut pas être inférieur
                        à la somme des sous-budgets existants ({{ formatCurrency(totalCategoryBudgets) }})
                      </p>
                    </div>
                  </div>

                  <!-- Mois -->
                  <div>
                    <label for="budget-month" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mois
                    </label>
                    <input
                      id="budget-month"
                      type="month"
                      v-model="budgetForm.month"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <!-- Montant -->
                  <div>
                    <label for="budget-amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Montant (en {{ getCurrencySymbol() }})
                    </label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<!--                         <span class="text-gray-500 dark:text-gray-400 sm:text-sm">{{ getCurrencySymbol() }}</span>
 -->                      </div>
                      <input
                        id="budget-amount"
                        v-model.number="budgetForm.amount"
                        type="number"
                        min="0"
                        step="0.01"
                        class="pl-7 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <!-- Notes -->
                  <div>
                    <label for="budget-notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notes
                    </label>
                    <textarea
                      id="budget-notes"
                      v-model="budgetForm.notes"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="Notes optionnelles"
                    ></textarea>
                  </div>
                </div>

                <!-- Actions -->
                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    @click="showBudgetModal = false"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    :disabled="!isValidBudget || isSaving"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="saveBudget"
                  >
                    <span v-if="isSaving" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enregistrement...
                    </span>
                    <span v-else>{{ editingBudget ? 'Mettre à jour' : 'Ajouter' }}</span>
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
import { useRoute, RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import { format } from 'date-fns';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import {
  CashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  TrendingDownIcon,
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
  InformationCircleIcon,
  ExclamationIcon
} from '@heroicons/vue/outline';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import { useFinanceStore } from '@/stores/finance';
import { formatCurrency, formatMonthYear } from '@/utils/formatters';
import type { Budget, ExpenseCategory } from '@/types/finance';

// Store and composables
const financeStore = useFinanceStore();
const route = useRoute();
const toast = useToast();

// ==================== ÉTAT DU COMPOSANT ====================
const isLoading = ref(true);
const isSaving = ref(false);
const currentDate = new Date();
const selectedMonth = ref(format(currentDate, 'yyyy-MM'));
const budgets = ref<Budget[]>([]);
const categories = ref<ExpenseCategory[]>([]);
const showBudgetModal = ref(false);
const editingBudget = ref<Budget | null>(null);
const totalBudget = ref(0);
const totalExpenses = ref(0);
// Variable d'état pour suivre si nous éditons un budget général
const isGeneralBudget = ref(false);

// ==================== PROPRIÉTÉS CALCULÉES ====================
// Budget restant et pourcentage dépensé
const remainingBudget = computed(() => totalBudget.value - totalExpenses.value);
const spentPercentage = computed(() => {
  if (totalBudget.value === 0) return 0;
  return Math.round((totalExpenses.value / totalBudget.value) * 100);
});

// Catégories disponibles pour créer des budgets
const availableCategories = computed(() => {
  // Collecte des IDs de catégories qui ont déjà un budget
  const budgetCategoryIds = budgets.value
    .filter(budget => budget.category)
    .map(budget => budget.category?.id)
    .filter(Boolean);

  // Utiliser un Set pour une recherche plus efficace
  const budgetCategoryIdSet = new Set(budgetCategoryIds);

  // Filtrer les catégories qui n'ont pas de budget
  return categories.value.filter(category =>
    category.id && !budgetCategoryIdSet.has(category.id)
  );
});

// Budgets par type
const generalBudget = computed(() => {
  return budgets.value.find(budget => !budget.category);
});

const categoryBudgets = computed(() => {
  return budgets.value.filter(budget => budget.category);
});

// Calcul du total des budgets de catégories (excluant le budget en cours d'édition)
const totalCategoryBudgets = computed(() => {
  const editingBudgetId = editingBudget.value?.id;
  const categoryBudgetsSum = categoryBudgets.value
    .filter(b => b.id !== editingBudgetId)
    .reduce((total, budget) => total + budget.amount, 0);

  // Si on édite un budget de catégorie, ajouter son montant au total
  if (!isGeneralBudget.value && budgetForm.value.amount > 0) {
    return categoryBudgetsSum + budgetForm.value.amount;
  }

  return categoryBudgetsSum;
});

// Validation améliorée du budget
const isValidBudget = computed(() => {
  // Validation de base
  const baseValidation =
    budgetForm.value.month !== '' &&
    budgetForm.value.amount > 0;

  // Budget général
  if (isGeneralBudget.value) {
    // Si des sous-budgets existent, vérifier que le budget global n'est pas inférieur
    if (categoryBudgets.value.length > 0) {
      const totalExistingCategories = categoryBudgets.value
        .filter(b => b.id !== editingBudget.value?.id)
        .reduce((total, budget) => total + budget.amount, 0);

      return baseValidation && budgetForm.value.amount >= totalExistingCategories;
    }
    return baseValidation;
  }

  // Budget de catégorie
  const categorySelected = budgetForm.value.categoryId !== '';

  // Si un budget global existe, vérifier que le total des sous-budgets ne le dépasse pas
  if (generalBudget.value) {
    return baseValidation &&
           categorySelected &&
           totalCategoryBudgets.value <= generalBudget.value.amount;
  }

  return baseValidation && categorySelected;
});

// ==================== ÉTAT DU FORMULAIRE ====================
const budgetForm = ref<{
  categoryId: string;
  month: string;
  amount: number;
  notes: string;
}>({
  categoryId: '',
  month: selectedMonth.value,
  amount: 0,
  notes: '',
});

// ==================== FONCTIONS UTILITAIRES ====================
// Obtenir le symbole de la devise
const getCurrencySymbol = () => {
  const currency = financeStore.currencyPreference || 'EUR';
  switch(currency) {
    case 'USD': return '$';
    case 'XOF': return 'FCFA';
    case 'EUR':
    default: return '€';
  }
};

// Obtenir l'icône d'une catégorie
const getCategoryIcon = (categoryName: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// Obtenir la couleur d'une catégorie
const getCategoryColor = (category: ExpenseCategory): string => {
  if (category.color) return category.color;

  const colorMap: Record<string, string> = {
    'Alimentation': '#3B82F6',
    'Logement': '#8B5CF6',
    'Transport': '#10B981',
    'Santé': '#EF4444',
    'Loisirs': '#EC4899',
    'Restaurant': '#F97316',
    'Technologie': '#6366F1',
    'Personnel': '#14B8A6',
    'Travail': '#4B5563',
    'Factures': '#7C3AED',
    'Assurance': '#1D4ED8',
    'Impôts': '#B91C1C',
    'Autres': '#9CA3AF',
  };

  return colorMap[category.name] || '#6B7280';
};

// Calculer le pourcentage d'utilisation d'un budget
const getBudgetProgress = (budget: Budget): number => {
  if (budget.amount === 0) return 0;
  return Math.round(((budget.spent || 0) / budget.amount) * 100);
};

// Déterminer le statut d'un budget (sous, proche, dépassé)
const getBudgetStatus = (budget: Budget): 'under' | 'near' | 'over' => {
  const progress = getBudgetProgress(budget);

  if (progress < 80) return 'under';
  if (progress < 100) return 'near';
  return 'over';
};

// ==================== FONCTIONS DE NAVIGATION ====================
const navigateMonth = (step: number) => {
  const [year, month] = selectedMonth.value.split('-');
  const newDate = new Date(parseInt(year), parseInt(month) - 1 + step, 1);
  selectedMonth.value = format(newDate, 'yyyy-MM');
};

// ==================== FONCTIONS DE CHARGEMENT DES DONNÉES ====================
const loadBudgets = async () => {
  isLoading.value = true;
  try {
    // Parse month to get year and month
    const [year, month] = selectedMonth.value.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);

    // Get budgets and financial summary for the selected month
    const [budgetsData, financialSummary] = await Promise.all([
      financeStore.fetchBudgets(date),
      financeStore.getMonthlyFinancialSummary(date)
    ]);

    // Ajouter les propriétés spent et month à chaque budget
    budgets.value = budgetsData.map(budget => {
      // Pour les budgets par catégorie
      if (budget.category != null) {
        const categoryBreakdown = financialSummary.categoryBreakdown?.find(
          cb => cb.category?.id === budget.category?.id
        );

        return {
          ...budget,
          spent: categoryBreakdown?.amount || 0,
          month: selectedMonth.value,
        };
      }
      // Pour le budget global
      else {
        return {
          ...budget,
          spent: financialSummary.totalExpenses || 0,
          month: selectedMonth.value,
        };
      }
    });

    totalBudget.value = financialSummary.totalBudget || 0;
    totalExpenses.value = financialSummary.totalExpenses || 0;
  } catch (error) {
    console.error('Error loading budgets:', error);
    toast.error('Erreur lors du chargement des budgets');
  } finally {
    isLoading.value = false;
  }
};

const loadCategories = async () => {
  try {
    categories.value = await financeStore.fetchCategories();
  } catch (error) {
    console.error('Error loading categories:', error);
    toast.error('Erreur lors du chargement des catégories');
  }
};

// ==================== FONCTIONS DE GESTION DES BUDGETS ====================
// Définir le type de budget (général ou catégorie)
const setBudgetType = (type: string) => {
  isGeneralBudget.value = type === 'general';

  // Réinitialiser le formulaire
  budgetForm.value = {
    categoryId: type === 'general' ? '' : budgetForm.value.categoryId,
    month: selectedMonth.value,
    amount: 0,
    notes: ''
  };
};

// Ouvrir le modal pour créer un budget par catégorie
const openCreateModal = () => {
  editingBudget.value = null;
  budgetForm.value = {
    categoryId: '',
    month: selectedMonth.value,
    amount: 0,
    notes: '',
  };
  showBudgetModal.value = true;
  isGeneralBudget.value = false;
};

// Créer un budget pour une catégorie spécifique
const createBudgetForCategory = (category: ExpenseCategory) => {
  // Vérifier si un budget global existe
  if (!generalBudget.value) {
    toast.warning('Vous devez d\'abord définir un budget global avant de créer des sous-budgets');
    return;
  }

  editingBudget.value = null;
  budgetForm.value = {
    categoryId: category.id || '',
    month: selectedMonth.value,
    amount: 0,
    notes: '',
  };
  showBudgetModal.value = true;
  isGeneralBudget.value = false;
};

// Ouvrir le modal pour créer un budget général
const openCreateGeneralBudgetModal = () => {
  editingBudget.value = null;
  budgetForm.value = {
    categoryId: '',
    month: selectedMonth.value,
    amount: 0,
    notes: '',
  };
  showBudgetModal.value = true;
  isGeneralBudget.value = true;
};

// Éditer un budget existant
const editBudget = (budget: Budget) => {
  editingBudget.value = budget;
  budgetForm.value = {
    categoryId: budget.category?.id || '',
    month: budget.month || selectedMonth.value,
    amount: budget.amount,
    notes: budget.notes || '',
  };
  showBudgetModal.value = true;
  isGeneralBudget.value = !budget.category;
};

// Éditer le budget général
const editGeneralBudget = () => {
  if (!generalBudget.value) return;

  editingBudget.value = generalBudget.value;
  budgetForm.value = {
    categoryId: '',
    month: selectedMonth.value,
    amount: generalBudget.value.amount,
    notes: generalBudget.value.notes || '',
  };
  showBudgetModal.value = true;
  isGeneralBudget.value = true;
};

// Sauvegarder un budget
const saveBudget = async () => {
  if (!isValidBudget.value || isSaving.value) return;

  // Vérification explicite des contraintes
  if (!isGeneralBudget.value && generalBudget.value) {
    if (totalCategoryBudgets.value > generalBudget.value.amount) {
      toast.error('Le total des sous-budgets ne peut pas dépasser le budget global');
      return;
    }
  }

  if (isGeneralBudget.value && categoryBudgets.value.length > 0) {
    const totalExistingCategoryBudgets = categoryBudgets.value.reduce((total, budget) => total + budget.amount, 0);
    if (budgetForm.value.amount < totalExistingCategoryBudgets) {
      toast.error('Le budget global ne peut pas être inférieur à la somme des sous-budgets existants');
      return;
    }
  }

  isSaving.value = true;
  try {
    const [year, month] = budgetForm.value.month.split('-');
    const budgetDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const yearMonth = format(budgetDate, 'yyyy-MM');

    // Créer un objet budget conforme à l'interface Budget
    const budgetData: Budget = {
      categoryId: isGeneralBudget.value ? '' :
                 (editingBudget.value?.categoryId || budgetForm.value.categoryId),
      amount: budgetForm.value.amount,
      yearMonth: yearMonth,
      notes: budgetForm.value.notes || ''
    };

    // Si on édite un budget existant, ajoutons son ID
    if (editingBudget.value?.id) {
      budgetData.id = editingBudget.value.id;
    }

    // Utiliser createOrUpdateBudget
    await financeStore.createOrUpdateBudget(budgetData);

    toast.success(isGeneralBudget.value
      ? 'Budget général mis à jour avec succès'
      : editingBudget.value
        ? 'Budget de catégorie mis à jour avec succès'
        : 'Budget de catégorie ajouté avec succès');

    showBudgetModal.value = false;
    loadBudgets();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error saving budget:', error);
    toast.error(error.response?.data?.error || 'Erreur lors de l\'enregistrement du budget');
  } finally {
    isSaving.value = false;
  }
};

// Supprimer un budget
const deleteBudget = async (budget: Budget) => {
  // Si c'est un budget global et qu'il y a des sous-budgets, empêcher la suppression
  if (!budget.category && categoryBudgets.value.length > 0) {
    toast.error('Vous ne pouvez pas supprimer le budget global tant que des sous-budgets existent');
    return;
  }

  if (!budget.id || !confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
    return;
  }

  try {
    await financeStore.deleteBudget(budget.id);
    toast.success('Budget supprimé avec succès');
    loadBudgets();
  } catch (error) {
    console.error('Error deleting budget:', error);
    toast.error('Erreur lors de la suppression du budget');
  }
};

// ==================== INITIALISATION ET OBSERVATEURS ====================
onMounted(async () => {
  // Check if category id is specified in the URL
  const categoryId = route.query.category as string;

  await Promise.all([loadCategories(), loadBudgets()]);

  // If category is specified, open create modal for that category
  if (categoryId && categories.value.find(c => c.id === categoryId)) {
    budgetForm.value.categoryId = categoryId;
    showBudgetModal.value = true;
  }
});

// Watch for changes in selected month
watch(selectedMonth, () => {
  loadBudgets();
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
