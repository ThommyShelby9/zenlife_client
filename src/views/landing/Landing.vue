<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen">
    <!-- Barre de navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img class="h-10 w-auto" src="@/assets/img/logo.png" alt="ZenLife" />
              <span class="ml-2 font-fancy text-xl text-primary-600 dark:text-primary-400">ZenLife</span>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <a href="#fonctionnalites" @click.prevent="scrollToSection('fonctionnalites')" class="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium">Fonctionnalités</a>
            <a href="#temoignages" @click.prevent="scrollToSection('temoignages')" class="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium">Témoignages</a>
            <a href="#tarifs" @click.prevent="scrollToSection('tarifs')" class="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium">Tarifs</a>
            <a href="#faq" @click.prevent="scrollToSection('faq')" class="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium">FAQ</a>

            <!-- Boutons connexion/inscription -->
            <div class="flex items-center space-x-3">
              <a href="/auth/login" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium">
                Se connecter
              </a>
              <a href="/auth/register" class="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium">
                S'inscrire
              </a>
            </div>

            <!-- Bouton toggle thème -->
            <button @click="toggleTheme" class="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none">
              <SunIcon v-if="isDarkMode" class="h-6 w-6" />
              <MoonIcon v-else class="h-6 w-6" />
            </button>
          </div>
          <div class="flex items-center sm:hidden">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none">
              <MenuIcon v-if="!mobileMenuOpen" class="h-6 w-6" />
              <XIcon v-else class="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Menu mobile -->
      <div v-show="mobileMenuOpen" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <a href="#fonctionnalites" @click.prevent="scrollToSection('fonctionnalites')" class="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-500 dark:hover:text-primary-400">Fonctionnalités</a>
          <a href="#temoignages" @click.prevent="scrollToSection('temoignages')" class="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-500 dark:hover:text-primary-400">Témoignages</a>
          <a href="#tarifs" @click.prevent="scrollToSection('tarifs')" class="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-500 dark:hover:text-primary-400">Tarifs</a>
          <a href="#faq" @click.prevent="scrollToSection('faq')" class="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-500 dark:hover:text-primary-400">FAQ</a>
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <a href="/auth/login" class="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-500 dark:hover:text-primary-400">Se connecter</a>
            <a href="/auth/register" class="block px-3 py-2 text-base font-medium bg-primary-600 text-white hover:bg-primary-700 rounded-md mt-2 mx-3 text-center">S'inscrire</a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero section -->
    <div class="relative bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 bg-gray-50 dark:bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg class="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-gray-50 dark:text-gray-900 transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>
          <main class="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
            <div class="sm:text-center lg:text-left">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span class="block xl:inline">Retrouvez votre</span>
                <span class="block text-primary-600 dark:text-primary-400 xl:inline"> équilibre et sérénité</span>
              </h1>
              <p class="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                ZenLife vous accompagne dans votre quête de bien-être quotidien. Planifiez votre vie, gérez vos finances, suivez votre santé et cultivez la positivité en toute simplicité.
              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <a href="/auth/register" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10">
                    Commencer gratuitement
                  </a>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-gray-800 hover:bg-primary-200 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10">
                    En savoir plus
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1769&q=80" alt="Méditation et bien-être">
      </div>
    </div>

    <!-- Section Fonctionnalités -->
    <div id="fonctionnalites" class="py-12 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Fonctionnalités</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Tout ce dont vous avez besoin, réuni en une seule application
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
            ZenLife vous propose des outils intuitifs pour améliorer votre quotidien et cultiver un mode de vie équilibré.
          </p>
        </div>

        <div class="mt-10">
          <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <!-- Fonctionnalité 1 -->
            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                <CalendarIcon class="h-6 w-6" />
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Planning Intelligent</h3>
                <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Organisez votre journée et planifiez vos activités avec des rappels personnalisés et des suggestions adaptées à votre rythme de vie.
                </p>
              </div>
            </div>

            <!-- Fonctionnalité 2 -->
            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                <CurrencyDollarIcon class="h-6 w-6" />
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Suivi Financier</h3>
                <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Gérez vos finances sans stress grâce à notre outil de suivi des dépenses, de budget et d'épargne intelligente.
                </p>
              </div>
            </div>

            <!-- Fonctionnalité 3 -->
            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                <CloudIcon class="h-6 w-6" />
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Santé & Hydratation</h3>
                <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Suivez votre consommation d'eau et vos indicateurs de santé pour maintenir un mode de vie sain et équilibré.
                </p>
              </div>
            </div>

            <!-- Fonctionnalité 4 -->
            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                <LightBulbIcon class="h-6 w-6" />
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Pensées Positives</h3>
                <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Cultivez un état d'esprit positif grâce à des citations inspirantes, des exercices de gratitude et des méditations guidées.
                </p>
              </div>
            </div>

            <!-- Fonctionnalité 5 -->
            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                <UsersIcon class="h-6 w-6" />
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Communauté Bienveillante</h3>
                <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Connectez-vous avec des amis partageant les mêmes valeurs et soutenez-vous mutuellement dans votre parcours de bien-être.
                </p>
              </div>
            </div>

            <!-- Fonctionnalité 6 -->
            <div class="relative">
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                <ChartBarIcon class="h-6 w-6" />
              </div>
              <div class="ml-16">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Statistiques Personnalisées</h3>
                <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Visualisez votre progression à travers des rapports détaillés et des analyses qui mettent en lumière vos accomplissements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Témoignages -->
    <div id="temoignages" class="py-12 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Témoignages</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Ce que nos utilisateurs disent
          </p>
        </div>

        <div class="mt-10">
          <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
            <!-- Témoignage 1 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div class="p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <img class="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80" alt="Sophie">
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-bold text-gray-900 dark:text-white">Sophie Durand</h4>
                    <div class="flex items-center mt-1">
                      <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <p class="mt-4 text-gray-600 dark:text-gray-300">
                  "ZenLife a complètement transformé ma façon d'organiser mon quotidien. Le suivi de mon hydratation et les rappels positifs m'aident à rester motivée. Je me sens plus équilibrée et sereine."
                </p>
              </div>
            </div>

            <!-- Témoignage 2 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div class="p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <img class="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80" alt="Thomas">
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-bold text-gray-900 dark:text-white">Thomas Martin</h4>
                    <div class="flex items-center mt-1">
                      <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <p class="mt-4 text-gray-600 dark:text-gray-300">
                  "L'outil de gestion financière est incroyable ! J'ai enfin une vision claire de mes dépenses et j'ai pu mettre en place un plan d'épargne efficace. Les statistiques me montrent mes progrès mois après mois."
                </p>
              </div>
            </div>

            <!-- Témoignage 3 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div class="p-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <img class="h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80" alt="Léa">
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-bold text-gray-900 dark:text-white">Léa Petit</h4>
                    <div class="flex items-center mt-1">
                      <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg class="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <p class="mt-4 text-gray-600 dark:text-gray-300">
                  "La fonctionnalité des pensées positives est ce qui me fait ouvrir l'application chaque matin. Les méditations guidées et les exercices de gratitude ont eu un impact énorme sur mon bien-être mental."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Tarifs -->
    <div id="tarifs" class="py-12 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Tarifs</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Des forfaits adaptés à vos besoins
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
            Commencez gratuitement ou optez pour plus de fonctionnalités avec nos offres premium.
          </p>
        </div>

        <div class="mt-10 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          <!-- Forfait Gratuit -->
          <div class="relative p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm flex flex-col">
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Gratuit</h3>
              <p class="mt-4 flex items-baseline text-gray-900 dark:text-white">
                <span class="text-5xl font-extrabold tracking-tight">0€</span>
                <span class="ml-1 text-xl font-semibold">/mois</span>
              </p>
              <p class="mt-6 text-gray-500 dark:text-gray-400">
                L'essentiel pour commencer votre parcours vers le bien-être.
              </p>

              <!-- Liste des fonctionnalités -->
              <ul role="list" class="mt-6 space-y-6">
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                  <span class="ml-3 text-gray-500 dark:text-gray-400">Tableau de bord basique</span>
                </li>
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                  <span class="ml-3 text-gray-500 dark:text-gray-400">Planning quotidien</span>
                </li>
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                  <span class="ml-3 text-gray-500 dark:text-gray-400">Suivi d'hydratation limité</span>
                </li>
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                  <span class="ml-3 text-gray-500 dark:text-gray-400">Pensée positive quotidienne</span>
                </li>
              </ul>
            </div>

            <a href="#" class="mt-8 block w-full bg-primary-50 dark:bg-primary-900 border border-primary-200 dark:border-primary-700 rounded-md py-2 text-sm font-semibold text-primary-700 dark:text-primary-300 text-center hover:bg-primary-100 dark:hover:bg-primary-800">
              Commencer gratuitement
            </a>
          </div>

          <!-- Forfait Premium -->
          <div class="relative p-8 bg-white dark:bg-gray-800 border border-primary-500 rounded-2xl shadow-sm flex flex-col">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary-600 text-white">
                Populaire
              </span>
            </div>

            <div class="flex-1">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Premium</h3>
              <p class="mt-4 flex items-baseline text-gray-900 dark:text-white">
                <span class="text-5xl font-extrabold tracking-tight">9,99€</span>
                <span class="ml-1 text-xl font-semibold">/mois</span>
              </p>
              <p class="mt-6 text-gray-500 dark:text-gray-400">
                Un accès complet pour optimiser votre bien-être au quotidien.
              </p>

              <!-- Liste des fonctionnalités -->
              <ul role="list" class="mt-6 space-y-6">
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                  <span class="ml-3 text-gray-500 dark:text-gray-400">Toutes les fonctionnalités gratuites</span>
                </li>
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                  <span class="ml-3 text-gray-500 dark:text-gray-400">Suivi financier avancé</span>
                </li>
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                  <span class="ml-3 text-gray-500 dark:text-gray-400">Statistiques personnalisées</span>
                </li>
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                  <span class="ml-3 text-gray-500 dark:text-gray-400">Méditations guidées illimitées</span>
                </li>
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                  <span class="ml-3 text-gray-500 dark:text-gray-400">Suivi santé complet</span>
                </li>
              </ul>
            </div>

            <a href="#" class="mt-8 block w-full bg-primary-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-primary-700">
              Essai gratuit de 30 jours
            </a>
          </div>

          <!-- Forfait Famille -->
          <div class="relative p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm flex flex-col">
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Famille</h3>
              <p class="mt-4 flex items-baseline text-gray-900 dark:text-white">
                <span class="text-5xl font-extrabold tracking-tight">19,99€</span>
                <span class="ml-1 text-xl font-semibold">/mois</span>
              </p>
              <p class="mt-6 text-gray-500 dark:text-gray-400">
                Partagez le bien-être avec jusqu'à 5 membres de votre famille.
              </p>

              <!-- Liste des fonctionnalités -->
              <ul role="list" class="mt-6 space-y-6">
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                  <span class="ml-3 text-gray-500 dark:text-gray-400">Toutes les fonctionnalités Premium</span>
                </li>
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                  <span class="ml-3 text-gray-500 dark:text-gray-400">Jusqu'à 5 comptes</span>
                </li>
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                  <span class="ml-3 text-gray-500 dark:text-gray-400">Planning familial partagé</span>
                </li>
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                  <span class="ml-3 text-gray-500 dark:text-gray-400">Défis familiaux motivants</span>
                </li>
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                  <span class="ml-3 text-gray-500 dark:text-gray-400">Support prioritaire</span>
                </li>
              </ul>
            </div>

            <a href="#" class="mt-8 block w-full bg-primary-50 dark:bg-primary-900 border border-primary-200 dark:border-primary-700 rounded-md py-2 text-sm font-semibold text-primary-700 dark:text-primary-300 text-center hover:bg-primary-100 dark:hover:bg-primary-800">
              Essai gratuit de 30 jours
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Section FAQ -->
    <div id="faq" class="py-12 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">FAQ</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Questions fréquentes
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
            Tout ce que vous devez savoir pour commencer avec ZenLife.
          </p>
        </div>

        <div class="mt-12">
          <dl class="space-y-6 divide-y divide-gray-200 dark:divide-gray-700">
            <div class="pt-6">
              <dt class="text-lg">
                <button @click="faq1Open = !faq1Open" class="text-left w-full flex justify-between items-start text-gray-900 dark:text-white">
                  <span class="font-medium">Comment mes données sont-elles protégées ?</span>
                  <span class="ml-6 h-7 flex items-center">
                    <PlusIcon v-if="!faq1Open" class="h-6 w-6" />
                    <MinusIcon v-else class="h-6 w-6" />
                  </span>
                </button>
              </dt>
              <dd v-show="faq1Open" class="mt-2 pr-12">
                <p class="text-base text-gray-500 dark:text-gray-400">
                  Votre confidentialité est notre priorité. Toutes vos données sont stockées de manière sécurisée avec un chiffrement de bout en bout. Nous ne partageons jamais vos informations personnelles avec des tiers. Vous pouvez à tout moment exporter ou supprimer vos données depuis les paramètres de votre compte.
                </p>
              </dd>
            </div>

            <div class="pt-6">
              <dt class="text-lg">
                <button @click="faq2Open = !faq2Open" class="text-left w-full flex justify-between items-start text-gray-900 dark:text-white">
                  <span class="font-medium">Puis-je utiliser ZenLife sur tous mes appareils ?</span>
                  <span class="ml-6 h-7 flex items-center">
                    <PlusIcon v-if="!faq2Open" class="h-6 w-6" />
                    <MinusIcon v-else class="h-6 w-6" />
                  </span>
                </button>
              </dt>
              <dd v-show="faq2Open" class="mt-2 pr-12">
                <p class="text-base text-gray-500 dark:text-gray-400">
                  Oui ! ZenLife est disponible sur iOS, Android, et comme application web. Toutes vos données sont synchronisées en temps réel entre vos appareils, vous permettant de passer facilement de l'un à l'autre sans perdre votre progression.
                </p>
              </dd>
            </div>

            <div class="pt-6">
              <dt class="text-lg">
                <button @click="faq3Open = !faq3Open" class="text-left w-full flex justify-between items-start text-gray-900 dark:text-white">
                  <span class="font-medium">Comment fonctionne l'essai gratuit de 30 jours ?</span>
                  <span class="ml-6 h-7 flex items-center">
                    <PlusIcon v-if="!faq3Open" class="h-6 w-6" />
                    <MinusIcon v-else class="h-6 w-6" />
                  </span>
                </button>
              </dt>
              <dd v-show="faq3Open" class="mt-2 pr-12">
                <p class="text-base text-gray-500 dark:text-gray-400">
                  Notre essai gratuit vous donne un accès complet à toutes les fonctionnalités premium pendant 30 jours. Vous pouvez annuler à tout moment avant la fin de la période d'essai et vous ne serez pas facturé. Nous vous enverrons un rappel 3 jours avant la fin de votre essai.
                </p>
              </dd>
            </div>

            <div class="pt-6">
              <dt class="text-lg">
                <button @click="faq4Open = !faq4Open" class="text-left w-full flex justify-between items-start text-gray-900 dark:text-white">
                  <span class="font-medium">ZenLife est-il compatible avec d'autres applications de santé ?</span>
                  <span class="ml-6 h-7 flex items-center">
                    <PlusIcon v-if="!faq4Open" class="h-6 w-6" />
                    <MinusIcon v-else class="h-6 w-6" />
                  </span>
                </button>
              </dt>
              <dd v-show="faq4Open" class="mt-2 pr-12">
                <p class="text-base text-gray-500 dark:text-gray-400">
                  ZenLife s'intègre parfaitement avec Apple Santé, Google Fit, et plusieurs autres applications et trackers populaires. Vous pouvez synchroniser vos données de santé pour obtenir une vue complète de votre bien-être dans ZenLife.
                </p>
              </dd>
            </div>

            <div class="pt-6">
              <dt class="text-lg">
                <button @click="faq5Open = !faq5Open" class="text-left w-full flex justify-between items-start text-gray-900 dark:text-white">
                  <span class="font-medium">Comment puis-je contacter le support ?</span>
                  <span class="ml-6 h-7 flex items-center">
                    <PlusIcon v-if="!faq5Open" class="h-6 w-6" />
                    <MinusIcon v-else class="h-6 w-6" />
                  </span>
                </button>
              </dt>
              <dd v-show="faq5Open" class="mt-2 pr-12">
                <p class="text-base text-gray-500 dark:text-gray-400">
                  Notre équipe de support est disponible 7j/7 via le chat intégré dans l'application ou par email à support@zenlife.fr. Les utilisateurs premium bénéficient d'un support prioritaire avec des temps de réponse généralement inférieurs à 2 heures.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-primary-700 dark:bg-primary-900">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span class="block">Prêt à transformer votre quotidien ?</span>
          <span class="block text-primary-200">Commencez dès aujourd'hui gratuitement.</span>
        </h2>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div class="inline-flex rounded-md shadow">
            <a href="#" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50">
              Télécharger l'application
            </a>
          </div>
          <div class="ml-3 inline-flex rounded-md shadow">
            <a href="#" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-800 hover:bg-primary-700">
              En savoir plus
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div class="flex justify-center">
          <div class="flex items-center">
            <img class="h-10 w-auto" src="@/assets/img/logo.png" alt="ZenLife" />
            <span class="ml-2 font-fancy text-2xl text-primary-600 dark:text-primary-400">ZenLife</span>
          </div>
        </div>
        <nav class="mt-8 flex flex-wrap justify-center" aria-label="Footer">
          <div class="px-5 py-2">
            <a href="#" class="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              À propos
            </a>
          </div>
          <div class="px-5 py-2">
            <a href="#" class="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Blog
            </a>
          </div>
          <div class="px-5 py-2">
            <a href="#" class="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Emplois
            </a>
          </div>
          <div class="px-5 py-2">
            <a href="#" class="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Presse
            </a>
          </div>
          <div class="px-5 py-2">
            <a href="#" class="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Conditions d'utilisation
            </a>
          </div>
          <div class="px-5 py-2">
            <a href="#" class="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Confidentialité
            </a>
          </div>
        </nav>
        <div class="mt-8 flex justify-center space-x-6">
          <a href="#" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <span class="sr-only">Facebook</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
            </svg>
          </a>
          <a href="#" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <span class="sr-only">Instagram</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
            </svg>
          </a>
          <a href="#" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <span class="sr-only">Twitter</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
        </div>
        <p class="mt-8 text-center text-base text-gray-500 dark:text-gray-400">
          &copy; 2025 ZenLife, Inc. Tous droits réservés.
        </p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import {
  MenuIcon,
  XIcon,
  SunIcon,
  MoonIcon,
  CheckIcon,
  CalendarIcon,
  CloudIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  LightBulbIcon,
  UsersIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/vue/outline';

// État pour les interactions
const mobileMenuOpen = ref(false);
const faq1Open = ref(false);
const faq2Open = ref(false);
const faq3Open = ref(false);
const faq4Open = ref(false);
const faq5Open = ref(false);
const isDarkMode = ref(document.documentElement.classList.contains('dark'));

// Toggle theme
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

// Fonction pour le défilement fluide vers les sections
const scrollToSection = (sectionId: string) => {
  mobileMenuOpen.value = false; // Fermer le menu mobile si ouvert
  const element = document.getElementById(sectionId);
  if (element) {
    const offsetTop = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: offsetTop - 80, // Offset pour la barre de navigation
      behavior: 'smooth'
    });
  }
};

// Gestion du scroll et de l'URL au chargement de la page
onMounted(() => {
  // Si la page est chargée avec un hash dans l'URL, défilez vers cette section
  if (window.location.hash) {
    const section = window.location.hash.substring(1);
    setTimeout(() => {
      scrollToSection(section);
    }, 100);
  }
});
</script>

<style>
/* Styles pour la police spéciale */
.font-fancy {
  font-family: 'Pacifico', cursive, sans-serif;
  letter-spacing: 1px;
}

/* Ajouter des transitions fluides */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Style pour que toutes les images utilisent object-fit: cover */
img {
  object-fit: cover;
}
</style>
