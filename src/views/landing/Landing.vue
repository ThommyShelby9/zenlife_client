<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen">
    <!-- Barre de navigation fixe avec effet de verre -->
    <nav class="fixed w-full z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm transition-all duration-300" :class="{ 'shadow-md': isScrolled }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img class="h-10 w-auto" src="@/assets/img/logo.png" alt="ZenLife" />
              <span class="ml-2 font-fancy text-xl text-primary-600 dark:text-primary-400">ZenLife</span>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <a href="#fonctionnalites" @click.prevent="scrollToSection('fonctionnalites')" class="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-200">Fonctionnalités</a>
            <a href="#comment-ca-marche" @click.prevent="scrollToSection('comment-ca-marche')" class="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-200">Comment ça marche</a>
            <a href="#temoignages" @click.prevent="scrollToSection('temoignages')" class="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-200">Témoignages</a>
            <a href="#tarifs" @click.prevent="scrollToSection('tarifs')" class="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-200">Tarifs</a>
            <a href="#faq" @click.prevent="scrollToSection('faq')" class="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-200">FAQ</a>

            <!-- Boutons connexion/inscription -->
            <div class="flex items-center space-x-3">
              <a href="/auth/login" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-200">
                Se connecter
              </a>
              <a href="/auth/register" class="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg">
                S'inscrire
              </a>
            </div>

            <!-- Bouton toggle thème -->
            <button @click="toggleTheme" class="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none transform hover:rotate-12 transition-all duration-300">
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

      <!-- Menu mobile avec animation -->
      <div
        v-show="mobileMenuOpen"
        class="sm:hidden transform transition-all duration-300 origin-top"
        :class="mobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'"
      >
        <div class="pt-2 pb-3 space-y-1">
          <a href="#fonctionnalites" @click.prevent="scrollToSection('fonctionnalites')" class="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-500 dark:hover:text-primary-400">Fonctionnalités</a>
          <a href="#comment-ca-marche" @click.prevent="scrollToSection('comment-ca-marche')" class="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-500 dark:hover:text-primary-400">Comment ça marche</a>
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

    <!-- Hero section avec animation et forme moderne -->
    <div class="relative bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden pt-16">
      <div class="absolute inset-0 z-0 opacity-20">
        <div class="absolute right-0 -top-20 w-96 h-96 bg-primary-300 dark:bg-primary-800 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div class="absolute left-20 top-40 w-96 h-96 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 items-center min-h-screen py-12 lg:py-0">
          <div class="px-4 sm:px-6 lg:px-8 text-center lg:text-left py-8">
            <h1 class="animate-fade-in-up text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span class="block xl:inline">Retrouvez votre</span>
              <span class="block text-primary-600 dark:text-primary-400 xl:inline"> équilibre et sérénité</span>
            </h1>
            <p class="animate-fade-in-up animation-delay-300 mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              ZenLife vous accompagne dans votre quête de bien-être quotidien. Planifiez votre vie, gérez vos finances, suivez votre santé et cultivez la positivité en toute simplicité.
            </p>
            <div class="animate-fade-in-up animation-delay-600 mt-8 sm:flex sm:justify-center lg:justify-start">
              <div class="rounded-md shadow">
                <a href="/auth/register" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                  Commencer gratuitement
                </a>
              </div>
              <div class="mt-3 sm:mt-0 sm:ml-3">
                <a href="#comment-ca-marche" @click.prevent="scrollToSection('comment-ca-marche')" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-gray-800 hover:bg-primary-200 dark:hover:bg-gray-700 transform hover:scale-105 transition-all duration-200">
                  <span>Comment ça marche</span>
                  <ChevronDownIcon class="ml-2 h-5 w-5 animate-bounce" />
                </a>
              </div>
            </div>

            <!-- Badge de téléchargements -->
            <div class="animate-fade-in-up animation-delay-900 mt-8 flex items-center justify-center lg:justify-start space-x-2">
              <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <StarIcon class="mr-1 h-4 w-4" />
                4.9/5 (2500+ avis)
              </span>
              <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <DownloadIcon class="mr-1 h-4 w-4" />
                100k+ téléchargements
              </span>
            </div>
          </div>

          <div class="relative px-4 sm:px-6 lg:px-8 animate-fade-in-right">
            <div class="relative rounded-2xl shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-all duration-500 max-w-md mx-auto">
              <img class="w-full object-cover" src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1769&q=80" alt="Méditation et bien-être">

              <!-- Mockups d'application flottants -->
              <div class="absolute -bottom-6 -left-6 w-48 h-auto rounded-lg shadow-xl transform -rotate-6 border-4 border-white dark:border-gray-800">
                <img class="w-full h-full object-cover rounded-lg" src="https://images.unsplash.com/photo-1594085951586-67c71f896e2e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80" alt="Application ZenLife">
              </div>

              <div class="absolute -top-10 -right-10 w-40 h-auto rounded-lg shadow-xl transform rotate-12 border-4 border-white dark:border-gray-800">
                <img class="w-full h-full object-cover rounded-lg" src="https://images.unsplash.com/photo-1606310731008-95903a87a63b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80" alt="Fonctionnalités ZenLife">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Séparateur de section avec forme -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg class="fill-current text-white dark:text-gray-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </div>

    <!-- Section Statistiques -->
    <div class="py-12 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="p-4">
            <div class="text-4xl font-bold text-primary-600 dark:text-primary-400 counter" data-target="15000">
              15k+
            </div>
            <p class="mt-2 text-gray-500 dark:text-gray-400">Utilisateurs actifs</p>
          </div>
          <div class="p-4">
            <div class="text-4xl font-bold text-primary-600 dark:text-primary-400 counter" data-target="87">
              87%
            </div>
            <p class="mt-2 text-gray-500 dark:text-gray-400">Amélioration du bien-être</p>
          </div>
          <div class="p-4">
            <div class="text-4xl font-bold text-primary-600 dark:text-primary-400 counter" data-target="130000">
              130k
            </div>
            <p class="mt-2 text-gray-500 dark:text-gray-400">Tâches accomplies</p>
          </div>
          <div class="p-4">
            <div class="text-4xl font-bold text-primary-600 dark:text-primary-400 counter" data-target="92">
              92%
            </div>
            <p class="mt-2 text-gray-500 dark:text-gray-400">Clients satisfaits</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Fonctionnalités avec design moderne -->
    <div id="fonctionnalites" class="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Fonctionnalités</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Une application complète pour votre bien-être
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
            ZenLife vous propose des outils intuitifs pour améliorer votre quotidien et cultiver un mode de vie équilibré.
          </p>
        </div>

        <div class="mt-16">
          <ul class="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3">
            <!-- Fonctionnalité 1 -->
            <li class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div class="absolute inset-0 bg-gradient-to-r from-primary-400 to-purple-500 opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10 flex items-center justify-center">
                <div class="text-white p-8">
                  <h4 class="text-xl font-bold mb-2">Planning Intelligent</h4>
                  <p>Organisez votre journée avec des rappels personnalisés et des suggestions adaptées à votre rythme de vie.</p>
                  <button class="mt-4 px-4 py-2 bg-white text-primary-600 rounded-lg font-medium">
                    En savoir plus
                  </button>
                </div>
              </div>
              <div class="h-40 bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <CalendarIcon class="h-16 w-16 text-primary-500" />
              </div>
              <div class="p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Planning Intelligent</h3>
                <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Organisez votre journée avec des rappels personnalisés et des suggestions.
                </p>
              </div>
            </li>

            <!-- Fonctionnalité 2 -->
            <li class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div class="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-500 opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10 flex items-center justify-center">
                <div class="text-white p-8">
                  <h4 class="text-xl font-bold mb-2">Suivi Financier</h4>
                  <p>Gérez vos finances sans stress grâce à notre outil de suivi des dépenses, de budget et d'épargne intelligente.</p>
                  <button class="mt-4 px-4 py-2 bg-white text-green-600 rounded-lg font-medium">
                    En savoir plus
                  </button>
                </div>
              </div>
              <div class="h-40 bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CurrencyDollarIcon class="h-16 w-16 text-green-500" />
              </div>
              <div class="p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Suivi Financier</h3>
                <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Gérez vos finances sans stress avec notre outil de budgétisation intelligent.
                </p>
              </div>
            </li>

            <!-- Fonctionnalité 3 -->
            <li class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10 flex items-center justify-center">
                <div class="text-white p-8">
                  <h4 class="text-xl font-bold mb-2">Santé & Hydratation</h4>
                  <p>Suivez votre consommation d'eau et vos indicateurs de santé pour maintenir un mode de vie sain et équilibré.</p>
                  <button class="mt-4 px-4 py-2 bg-white text-blue-600 rounded-lg font-medium">
                    En savoir plus
                  </button>
                </div>
              </div>
              <div class="h-40 bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <CloudIcon class="h-16 w-16 text-blue-500" />
              </div>
              <div class="p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Santé & Hydratation</h3>
                <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Suivez votre consommation d'eau et vos indicateurs de santé quotidiens.
                </p>
              </div>
            </li>

            <!-- Fonctionnalité 4 -->
            <li class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10 flex items-center justify-center">
                <div class="text-white p-8">
                  <h4 class="text-xl font-bold mb-2">Pensées Positives</h4>
                  <p>Cultivez un état d'esprit positif grâce à des citations inspirantes, des exercices de gratitude et des méditations guidées.</p>
                  <button class="mt-4 px-4 py-2 bg-white text-yellow-600 rounded-lg font-medium">
                    En savoir plus
                  </button>
                </div>
              </div>
              <div class="h-40 bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <LightBulbIcon class="h-16 w-16 text-yellow-500" />
              </div>
              <div class="p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Pensées Positives</h3>
                <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Cultivez un état d'esprit positif grâce à des exercices de gratitude.
                </p>
              </div>
            </li>

            <!-- Fonctionnalité 5 -->
            <li class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div class="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-500 opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10 flex items-center justify-center">
                <div class="text-white p-8">
                  <h4 class="text-xl font-bold mb-2">Communauté Bienveillante</h4>
                  <p>Connectez-vous avec des amis partageant les mêmes valeurs et soutenez-vous mutuellement dans votre parcours de bien-être.</p>
                  <button class="mt-4 px-4 py-2 bg-white text-pink-600 rounded-lg font-medium">
                    En savoir plus
                  </button>
                </div>
              </div>
              <div class="h-40 bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
                <UsersIcon class="h-16 w-16 text-pink-500" />
              </div>
              <div class="p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Communauté Bienveillante</h3>
                <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Connectez-vous avec des amis partageant vos valeurs de bien-être.
                </p>
              </div>
            </li>

            <!-- Fonctionnalité 6 -->
            <li class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div class="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10 flex items-center justify-center">
                <div class="text-white p-8">
                  <h4 class="text-xl font-bold mb-2">Statistiques Personnalisées</h4>
                  <p>Visualisez votre progression à travers des rapports détaillés et des analyses qui mettent en lumière vos accomplissements.</p>
                  <button class="mt-4 px-4 py-2 bg-white text-purple-600 rounded-lg font-medium">
                    En savoir plus
                  </button>
                </div>
              </div>
              <div class="h-40 bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <ChartBarIcon class="h-16 w-16 text-purple-500" />
              </div>
              <div class="p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Statistiques Personnalisées</h3>
                <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Visualisez votre progression avec des rapports détaillés et personnalisés.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Comment ça marche - NOUVELLE SECTION -->
    <div id="comment-ca-marche" class="py-16 bg-white dark:bg-gray-800 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Comment ça marche</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Simplifiez votre parcours vers le bien-être
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
            Quelques étapes simples pour commencer à transformer votre quotidien avec ZenLife.
          </p>
        </div>

        <!-- Timeline verticale avec étapes -->
        <div class="relative mt-16 pb-16">
          <!-- Ligne verticale centrale -->
          <div class="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-primary-500 to-purple-500 transform -translate-x-1/2 rounded-full"></div>

          <!-- Étape 1 -->
          <div class="relative z-10 flex items-center justify-between mb-20">
  <div class="w-5/12 pr-8 md:pr-12 text-right">
    <div class="group transform transition-all duration-500 hover:scale-105">
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500">1. Créez votre compte</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        Inscrivez-vous gratuitement en quelques secondes. Définissez vos objectifs de bien-être et personnalisez votre profil.
      </p>
      <a href="/auth/register" class="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium">
        S'inscrire maintenant
        <ArrowRightIcon class="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  </div>
  <div class="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
    <div class="w-12 h-12 rounded-full bg-primary-600 shadow-lg flex items-center justify-center text-xl font-bold text-white">1</div>
  </div>
  <div class="w-5/12 pl-8 md:pl-12">
    <div class="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:shadow-2xl hover:scale-105">
      <!-- Solution 1: Utiliser une image locale si disponible -->
      <img class="w-full h-48 object-cover" src="https://www.google.com/url?sa=i&url=https%3A%2F%2Flecompteasso.associations.gouv.fr%2Fcomment-se-creer-un-compte%2F&psig=AOvVaw0HrAzEHOoaI-TmLcJbNDQL&ust=1741194383037000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNjZwtz08IsDFQAAAAAdAAAAABAE" alt="Création de compte"
           onerror="this.onerror=null; this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\' viewBox=\'0 0 800 400\'%3E%3Crect fill=\'%23f8fafc\' width=\'800\' height=\'400\'/%3E%3Cg fill-opacity=\'0.2\'%3E%3Ccircle fill=\'%23818cf8\' cx=\'400\' cy=\'200\' r=\'50\'/%3E%3Ccircle fill=\'%234f46e5\' cx=\'400\' cy=\'200\' r=\'120\'/%3E%3C/g%3E%3Ctext x=\'400\' y=\'210\' font-family=\'Arial\' font-size=\'16\' text-anchor=\'middle\' fill=\'%23475569\'%3ECréation de compte%3C/text%3E%3C/svg%3E'"/>

      <!-- Solution 2 (alternative): Utiliser une div avec background-image et fallback -->
      <!--
      <div class="w-full h-48 bg-cover bg-center"
           style="background-image: url('@/assets/img/account-creation.jpg');"
           role="img"
           aria-label="Création de compte">
        <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <span class="text-primary-600 dark:text-primary-400 font-medium">Créez votre compte en quelques clics</span>
        </div>
      </div>
      -->
    </div>
  </div>
</div>

          <!-- Étape 2 -->
          <div class="relative z-10 flex items-center justify-between mb-20">
            <div class="w-5/12 pr-8 md:pr-12">
              <div class="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:shadow-2xl hover:scale-105">
                <img class="w-full h-48 object-cover" src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2026&q=80" alt="Configuration finance" />
              </div>
            </div>
            <div class="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div class="w-12 h-12 rounded-full bg-primary-600 shadow-lg flex items-center justify-center text-xl font-bold text-white">2</div>
            </div>
            <div class="w-5/12 pl-8 md:pl-12 text-left">
              <div class="group transform transition-all duration-500 hover:scale-105">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500">2. Configurez vos finances</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                  Ajoutez vos comptes, définissez des catégories de dépenses et établissez votre premier budget mensuel en quelques clics.
                </p>
                <a href="#" class="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium">
                  Voir la démo
                  <PlayIcon class="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          <!-- Étape 3 -->
          <div class="relative z-10 flex items-center justify-between mb-20">
            <div class="w-5/12 pr-8 md:pr-12 text-right">
              <div class="group transform transition-all duration-500 hover:scale-105">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500">3. Planifiez vos journées</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                  Créez des tâches, définissez des rappels et organisez votre emploi du temps pour optimiser votre productivité et votre bien-être.
                </p>
                <a href="#" class="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium">
                  Découvrir les fonctionnalités
                  <ArrowRightIcon class="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
            <div class="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div class="w-12 h-12 rounded-full bg-primary-600 shadow-lg flex items-center justify-center text-xl font-bold text-white">3</div>
            </div>
            <div class="w-5/12 pl-8 md:pl-12">
              <div class="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:shadow-2xl hover:scale-105">
                <img class="w-full h-48 object-cover" src="https://images.unsplash.com/photo-1517490232338-06b912a786b5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" alt="Planification" />
              </div>
            </div>
          </div>

          <!-- Étape 4 -->
          <div class="relative z-10 flex items-center justify-between">
            <div class="w-5/12 pr-8 md:pr-12">
              <div class="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:shadow-2xl hover:scale-105">
                <img class="w-full h-48 object-cover" src="https://images.unsplash.com/photo-1526056316312-ed419ce34a05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" alt="Suivi progrès" />
              </div>
            </div>
            <div class="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div class="w-12 h-12 rounded-full bg-primary-600 shadow-lg flex items-center justify-center text-xl font-bold text-white">4</div>
            </div>
            <div class="w-5/12 pl-8 md:pl-12 text-left">
              <div class="group transform transition-all duration-500 hover:scale-105">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500">4. Suivez vos progrès</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                  Consultez vos statistiques personnalisées, célébrez vos réussites et identifiez les domaines à améliorer pour progresser.
                </p>
                <a href="#" class="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium">
                  Explorer les statistiques
                  <ChartBarIcon class="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Témoignages moderne -->
    <div id="temoignages" class="py-16 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Témoignages</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Ce que nos utilisateurs disent
          </p>
        </div>

        <!-- Témoignages en carousel moderne -->
        <div class="relative">
          <!-- Contrôles du carousel -->
          <div class="absolute inset-0 flex items-center justify-between z-10 pointer-events-none">
            <button @click="prevTestimonial" class="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none transform transition-all duration-300 hover:scale-110 pointer-events-auto">
              <ChevronLeftIcon class="h-6 w-6" />
            </button>
            <button @click="nextTestimonial" class="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none transform transition-all duration-300 hover:scale-110 pointer-events-auto">
              <ChevronRightIcon class="h-6 w-6" />
            </button>
          </div>

          <!-- Carousel container -->
          <div class="overflow-hidden">
            <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentTestimonial * 100}%)` }">
              <!-- Témoignage 1 -->
              <div class="min-w-full px-4">
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                  <div class="md:flex">
                    <div class="md:flex-shrink-0 relative">
                      <img class="h-64 w-full object-cover md:w-64" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80" alt="Sophie">
                      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div class="p-4 text-white">
                          <h4 class="font-bold text-xl">Sophie Durand</h4>
                          <p>Étudiante en médecine</p>
                        </div>
                      </div>
                    </div>
                    <div class="p-8 relative">
                      <div class="absolute top-4 right-4 flex">
                        <StarIcon class="h-5 w-5 text-yellow-500" />
                        <StarIcon class="h-5 w-5 text-yellow-500" />
                        <StarIcon class="h-5 w-5 text-yellow-500" />
                        <StarIcon class="h-5 w-5 text-yellow-500" />
                        <StarIcon class="h-5 w-5 text-yellow-500" />
                      </div>
                      <div class="text-5xl text-primary-200 dark:text-primary-800 opacity-30 absolute top-6 left-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"></path>
                        </svg>
                      </div>
                      <blockquote class="mt-8 text-gray-600 dark:text-gray-300 text-lg relative z-10">
                        "ZenLife a complètement transformé ma façon d'organiser mon quotidien. Le suivi de mon hydratation et les rappels positifs m'aident à rester motivée. Je me sens plus équilibrée et sereine même durant mes périodes d'examens."
                      </blockquote>
                      <p class="mt-4 text-primary-600 dark:text-primary-400 font-medium">Utilisatrice depuis 8 mois</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Témoignage 2 -->
              <div class="min-w-full px-4">
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                  <div class="md:flex">
                    <div class="md:flex-shrink-0 relative">
                      <img class="h-64 w-full object-cover md:w-64" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80" alt="Thomas">
                      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div class="p-4 text-white">
                          <h4 class="font-bold text-xl">Thomas Martin</h4>
                          <p>Consultant en entreprise</p>
                        </div>
                      </div>
                    </div>
                    <div class="p-8 relative">
                      <div class="absolute top-4 right-4 flex">
                        <StarIcon class="h-5 w-5 text-yellow-500" />
                        <StarIcon class="h-5 w-5 text-yellow-500" />
                        <StarIcon class="h-5 w-5 text-yellow-500" />
                        <StarIcon class="h-5 w-5 text-yellow-500" />
                        <StarIcon class="h-5 w-5 text-yellow-500" />
                      </div>
                      <div class="text-5xl text-primary-200 dark:text-primary-800 opacity-30 absolute top-6 left-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"></path>
                        </svg>
                      </div>
                      <blockquote class="mt-8 text-gray-600 dark:text-gray-300 text-lg relative z-10">
                        "L'outil de gestion financière est incroyable ! J'ai enfin une vision claire de mes dépenses et j'ai pu mettre en place un plan d'épargne efficace. Les statistiques me montrent mes progrès mois après mois et m'ont permis d'économiser pour mon premier investissement."
                      </blockquote>
                      <p class="mt-4 text-primary-600 dark:text-primary-400 font-medium">Utilisateur depuis 1 an</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Témoignage 3 -->
              <div class="min-w-full px-4">
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                  <div class="md:flex">
                    <div class="md:flex-shrink-0 relative">
                      <img class="h-64 w-full object-cover md:w-64" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80" alt="Léa">
                      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                        <div class="p-4 text-white">
                          <h4 class="font-bold text-xl">Léa Petit</h4>
                          <p>Professeure des écoles</p>
                        </div>
                      </div>
                    </div>
                    <div class="p-8 relative">
                      <div class="absolute top-4 right-4 flex">
                        <StarIcon class="h-5 w-5 text-yellow-500" />
                        <StarIcon class="h-5 w-5 text-yellow-500" />
                        <StarIcon class="h-5 w-5 text-yellow-500" />
                        <StarIcon class="h-5 w-5 text-yellow-500" />
                        <StarIcon class="h-5 w-5 text-yellow-500" />
                      </div>
                      <div class="text-5xl text-primary-200 dark:text-primary-800 opacity-30 absolute top-6 left-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"></path>
                        </svg>
                      </div>
                      <blockquote class="mt-8 text-gray-600 dark:text-gray-300 text-lg relative z-10">
                        "La fonctionnalité des pensées positives est ce qui me fait ouvrir l'application chaque matin. Les méditations guidées et les exercices de gratitude ont eu un impact énorme sur mon bien-être mental et ma relation avec mes élèves."
                      </blockquote>
                      <p class="mt-4 text-primary-600 dark:text-primary-400 font-medium">Utilisatrice depuis 6 mois</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Indicateurs -->
          <div class="flex justify-center mt-8">
            <button v-for="(_, i) in 3" :key="i" @click="currentTestimonial = i" :class="[
              'w-3 h-3 mx-1 rounded-full',
              currentTestimonial === i ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
            ]"></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Tarifs moderne -->
    <div id="tarifs" class="py-16 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Tarifs</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Des forfaits adaptés à vos besoins
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
            Commencez gratuitement ou optez pour plus de fonctionnalités avec nos offres premium.
          </p>
        </div>

        <div class="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          <!-- Forfait Gratuit -->
          <div class="relative p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
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

            <a href="#" class="mt-8 block w-full bg-white dark:bg-gray-700 border border-primary-500 rounded-md py-3 text-sm font-semibold text-primary-600 dark:text-primary-400 text-center hover:bg-primary-50 dark:hover:bg-gray-600 transition-colors transform hover:scale-105 duration-300">
              Commencer gratuitement
            </a>
          </div>

          <!-- Forfait Premium -->
          <div class="relative p-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-xl flex flex-col transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 scale-105">
            <div class="absolute -top-5 inset-x-0 flex justify-center">
              <span class="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-white text-primary-600 shadow-md">
                Populaire
              </span>
            </div>

            <div class="flex-1">
              <h3 class="text-xl font-semibold text-white">Premium</h3>
              <p class="mt-4 flex items-baseline text-white">
                <span class="text-5xl font-extrabold tracking-tight">9,99€</span>
                <span class="ml-1 text-xl font-semibold">/mois</span>
              </p>
              <p class="mt-6 text-primary-100">
                Un accès complet pour optimiser votre bien-être au quotidien.
              </p>

              <!-- Liste des fonctionnalités -->
              <ul role="list" class="mt-6 space-y-6">
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-white" aria-hidden="true" />
                  <span class="ml-3 text-white">Toutes les fonctionnalités gratuites</span>
                </li>
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-white" aria-hidden="true" />
                  <span class="ml-3 text-white">Suivi financier avancé</span>
                </li>
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-white" aria-hidden="true" />
                  <span class="ml-3 text-white">Statistiques personnalisées</span>
                </li>
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-white" aria-hidden="true" />
                  <span class="ml-3 text-white">Méditations guidées illimitées</span>
                </li>
                <li class="flex">
                  <CheckIcon class="flex-shrink-0 w-6 h-6 text-white" aria-hidden="true" />
                  <span class="ml-3 text-white">Suivi santé complet</span>
                </li>
              </ul>
            </div>

            <a href="#" class="mt-8 block w-full bg-white rounded-md py-3 text-sm font-semibold text-primary-600 text-center hover:bg-gray-50 transition-colors transform hover:scale-105 duration-300 shadow-md">
              Essai gratuit de 30 jours
            </a>
          </div>

          <!-- Forfait Famille -->
          <div class="relative p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
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

            <a href="#" class="mt-8 block w-full bg-white dark:bg-gray-700 border border-primary-500 rounded-md py-3 text-sm font-semibold text-primary-600 dark:text-primary-400 text-center hover:bg-primary-50 dark:hover:bg-gray-600 transition-colors transform hover:scale-105 duration-300">
              Essai gratuit de 30 jours
            </a>
          </div>
        </div>

        <!-- Comparatif des fonctionnalités -->
        <div class="mt-16">
          <button @click="showFeatureComparison = !showFeatureComparison" class="flex items-center mx-auto text-primary-600 dark:text-primary-400 font-medium">
            <span>{{ showFeatureComparison ? 'Masquer' : 'Voir' }} la comparaison des fonctionnalités</span>
            <ChevronDownIcon v-if="!showFeatureComparison" class="ml-1 h-5 w-5" />
            <ChevronUpIcon v-else class="ml-1 h-5 w-5" />
          </button>

          <div v-show="showFeatureComparison" class="mt-8 overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th class="px-6 py-3 bg-gray-50 dark:bg-gray-900 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fonctionnalité</th>
                  <th class="px-6 py-3 bg-gray-50 dark:bg-gray-900 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gratuit</th>
                  <th class="px-6 py-3 bg-primary-50 dark:bg-primary-900 text-center text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">Premium</th>
                  <th class="px-6 py-3 bg-gray-50 dark:bg-gray-900 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Famille</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Planning quotidien</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">Basique</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">Avancé</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">Avancé + Partagé</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Suivi financier</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                    <XIcon class="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">Complet</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">Complet + Multi-comptes</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Suivi d'hydratation</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">Limité</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">Illimité</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">Illimité</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Méditations guidées</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">2 gratuites</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">Illimitées</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">Illimitées</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Statistiques personnalisées</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">Basiques</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">Avancées</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">Avancées + Familiales</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Nombre d'utilisateurs</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">1</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">1</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">Jusqu'à 5</td>
                </tr>
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Support client</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">Email</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">Email + Chat</td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">Prioritaire</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Section FAQ améliorée -->
   <!-- FAQ avec réponses améliorées -->
<!-- Template HTML corrigé pour le FAQ -->
<div id="faq" class="py-16 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h2 class="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">FAQ</h2>
      <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        Questions fréquentes
      </p>
      <p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
        Tout ce que vous devez savoir pour commencer avec ZenLife.
      </p>
    </div>

    <div class="mt-12 max-w-3xl mx-auto">
      <dl class="space-y-6 divide-y divide-gray-200 dark:divide-gray-700">
        <!-- Question 1 -->
        <div class="pt-6">
          <dt class="text-lg">
            <button @click="faq1Open = !faq1Open" class="text-left w-full flex justify-between items-start text-gray-900 dark:text-white focus:outline-none">
              <span class="font-medium">Comment mes données sont-elles protégées ?</span>
              <span class="ml-6 h-7 flex items-center">
                <div class="rounded-full h-7 w-7 flex items-center justify-center border border-gray-200 dark:border-gray-600 transform transition-transform duration-200" :class="{ 'bg-primary-600 border-primary-600 rotate-45': faq1Open }">
                  <PlusIcon v-if="!faq1Open" class="h-5 w-5" />
                  <MinusIcon v-else class="h-5 w-5 text-white" />
                </div>
              </span>
            </button>
          </dt>
          <dd v-if="faq1Open" class="mt-4 pr-12">
            <p class="text-base text-gray-500 dark:text-gray-400">
              Votre confidentialité est notre priorité absolue. Toutes vos données sont stockées de manière sécurisée avec un chiffrement de bout en bout et sont hébergées sur des serveurs conformes au RGPD. Nous ne partageons jamais vos informations personnelles avec des tiers. Vous gardez le contrôle total : vous pouvez à tout moment consulter, exporter ou supprimer définitivement vos données depuis les paramètres de votre compte.
            </p>
          </dd>
        </div>

        <!-- Question 2 -->
        <div class="pt-6">
          <dt class="text-lg">
            <button @click="faq2Open = !faq2Open" class="text-left w-full flex justify-between items-start text-gray-900 dark:text-white focus:outline-none">
              <span class="font-medium">Puis-je utiliser ZenLife sur tous mes appareils ?</span>
              <span class="ml-6 h-7 flex items-center">
                <div class="rounded-full h-7 w-7 flex items-center justify-center border border-gray-200 dark:border-gray-600 transform transition-transform duration-200" :class="{ 'bg-primary-600 border-primary-600 rotate-45': faq2Open }">
                  <PlusIcon v-if="!faq2Open" class="h-5 w-5" />
                  <MinusIcon v-else class="h-5 w-5 text-white" />
                </div>
              </span>
            </button>
          </dt>
          <dd v-if="faq2Open" class="mt-4 pr-12">
            <p class="text-base text-gray-500 dark:text-gray-400">
              Absolument ! ZenLife est une application web progressive (PWA) qui fonctionne sur tous les appareils modernes. Vous pouvez l'installer directement depuis votre navigateur sur iOS, Android, Windows ou Mac, sans passer par un app store. Une fois installée, l'application se comporte comme une application native avec des fonctionnalités hors ligne. Toutes vos données sont synchronisées en temps réel entre vos appareils, vous permettant de passer facilement de l'un à l'autre sans perdre votre progression.
            </p>
            <div class="mt-3 p-3 bg-primary-50 dark:bg-primary-900/30 rounded-md">
              <p class="text-sm font-medium text-primary-700 dark:text-primary-300">
                ⓘ Astuce : Pour installer ZenLife, visitez le site dans Chrome, Safari ou Edge, puis utilisez l'option "Ajouter à l'écran d'accueil" dans le menu du navigateur.
              </p>
            </div>
          </dd>
        </div>

        <!-- Question 3 -->
        <div class="pt-6">
          <dt class="text-lg">
            <button @click="faq3Open = !faq3Open" class="text-left w-full flex justify-between items-start text-gray-900 dark:text-white focus:outline-none">
              <span class="font-medium">Comment fonctionne l'essai gratuit de 30 jours ?</span>
              <span class="ml-6 h-7 flex items-center">
                <div class="rounded-full h-7 w-7 flex items-center justify-center border border-gray-200 dark:border-gray-600 transform transition-transform duration-200" :class="{ 'bg-primary-600 border-primary-600 rotate-45': faq3Open }">
                  <PlusIcon v-if="!faq3Open" class="h-5 w-5" />
                  <MinusIcon v-else class="h-5 w-5 text-white" />
                </div>
              </span>
            </button>
          </dt>
          <dd v-if="faq3Open" class="mt-4 pr-12">
            <p class="text-base text-gray-500 dark:text-gray-400">
              Notre essai gratuit vous donne un accès complet à toutes les fonctionnalités premium pendant 30 jours, sans engagement. Aucune carte bancaire n'est requise pour commencer l'essai. Vous recevrez une notification 3 jours avant la fin de votre période d'essai, vous rappelant de souscrire si vous souhaitez continuer à profiter des fonctionnalités premium. Si vous décidez de ne pas vous abonner, votre compte basculera automatiquement vers la version gratuite sans perdre vos données existantes.
            </p>
          </dd>
        </div>

        <!-- Question 4 -->
        <div class="pt-6">
          <dt class="text-lg">
            <button @click="faq4Open = !faq4Open" class="text-left w-full flex justify-between items-start text-gray-900 dark:text-white focus:outline-none">
              <span class="font-medium">ZenLife est-il compatible avec d'autres applications de santé ?</span>
              <span class="ml-6 h-7 flex items-center">
                <div class="rounded-full h-7 w-7 flex items-center justify-center border border-gray-200 dark:border-gray-600 transform transition-transform duration-200" :class="{ 'bg-primary-600 border-primary-600 rotate-45': faq4Open }">
                  <PlusIcon v-if="!faq4Open" class="h-5 w-5" />
                  <MinusIcon v-else class="h-5 w-5 text-white" />
                </div>
              </span>
            </button>
          </dt>
          <dd v-if="faq4Open" class="mt-4 pr-12">
            <p class="text-base text-gray-500 dark:text-gray-400">
              ZenLife s'intègre parfaitement avec les principales plateformes de santé comme Apple Santé et Google Fit, ainsi qu'avec de nombreux appareils connectés (Fitbit, Garmin, Withings, etc.). Cette intégration vous permet d'importer automatiquement vos données d'activité physique, de sommeil et autres métriques de santé dans ZenLife pour une vue globale de votre bien-être. Pour connecter vos applications et appareils, rendez-vous simplement dans la section "Intégrations" des paramètres de votre compte.
            </p>
            <div class="mt-3 grid grid-cols-5 gap-2">
              <img src="https://via.placeholder.com/50/F5F5F5/000000?text=Apple" class="h-8 rounded" alt="Apple Health" />
              <img src="https://via.placeholder.com/50/F5F5F5/000000?text=Google" class="h-8 rounded" alt="Google Fit" />
              <img src="https://via.placeholder.com/50/F5F5F5/000000?text=Fitbit" class="h-8 rounded" alt="Fitbit" />
              <img src="https://via.placeholder.com/50/F5F5F5/000000?text=Garmin" class="h-8 rounded" alt="Garmin" />
              <img src="https://via.placeholder.com/50/F5F5F5/000000?text=+" class="h-8 rounded" alt="Et plus" />
            </div>
          </dd>
        </div>

        <!-- Question 5 -->
        <div class="pt-6">
          <dt class="text-lg">
            <button @click="faq5Open = !faq5Open" class="text-left w-full flex justify-between items-start text-gray-900 dark:text-white focus:outline-none">
              <span class="font-medium">Comment puis-je contacter le support ?</span>
              <span class="ml-6 h-7 flex items-center">
                <div class="rounded-full h-7 w-7 flex items-center justify-center border border-gray-200 dark:border-gray-600 transform transition-transform duration-200" :class="{ 'bg-primary-600 border-primary-600 rotate-45': faq5Open }">
                  <PlusIcon v-if="!faq5Open" class="h-5 w-5" />
                  <MinusIcon v-else class="h-5 w-5 text-white" />
                </div>
              </span>
            </button>
          </dt>
          <dd v-if="faq5Open" class="mt-4 pr-12">
            <p class="text-base text-gray-500 dark:text-gray-400">
              Notre équipe de support est disponible 7j/7 via plusieurs canaux :
            </p>
            <ul class="mt-2 space-y-1 list-disc list-inside text-base text-gray-500 dark:text-gray-400">
              <li>Chat intégré directement dans l'application (temps de réponse moyen : 30 minutes)</li>
              <li>Email à <a href="mailto:support@zenlife.fr" class="text-primary-600 dark:text-primary-400 underline">zenlifeinnov@gmail.com</a> (réponse sous 24h)</li>
            </ul>
            <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
              Les utilisateurs premium bénéficient d'un support prioritaire avec des temps de réponse généralement inférieurs à 2 heures et d'un accès à des sessions de coaching personnalisées.
            </p>
          </dd>
        </div>

        <!-- Question 6 - Nouvelle question sur la PWA -->
        <div class="pt-6">
          <dt class="text-lg">
            <button @click="faq6Open = !faq6Open" class="text-left w-full flex justify-between items-start text-gray-900 dark:text-white focus:outline-none">
              <span class="font-medium">ZenLife fonctionne-t-il sans connexion internet ?</span>
              <span class="ml-6 h-7 flex items-center">
                <div class="rounded-full h-7 w-7 flex items-center justify-center border border-gray-200 dark:border-gray-600 transform transition-transform duration-200" :class="{ 'bg-primary-600 border-primary-600 rotate-45': faq6Open }">
                  <PlusIcon v-if="!faq6Open" class="h-5 w-5" />
                  <MinusIcon v-else class="h-5 w-5 text-white" />
                </div>
              </span>
            </button>
          </dt>
          <dd v-if="faq6Open" class="mt-4 pr-12">
            <p class="text-base text-gray-500 dark:text-gray-400">
              Oui ! Une fois ZenLife installé sur votre appareil en tant que PWA, vous pouvez utiliser la plupart des fonctionnalités même sans connexion internet. Vos données sont stockées localement et se synchroniseront automatiquement dès que vous serez de nouveau connecté. Cette fonctionnalité est particulièrement utile pour la méditation, le suivi d'habitudes quotidiennes ou la saisie de vos dépenses pendant vos déplacements.
            </p>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</div>

   <!-- CTA Section moderne avec informations PWA -->
<div class="relative bg-primary-700 dark:bg-primary-900 overflow-hidden">
  <div class="hidden lg:block lg:absolute lg:inset-0">
    <svg class="absolute top-0 left-1/2 transform translate-x-64 -translate-y-8" width="640" height="784" fill="none" viewBox="0 0 640 784">
      <defs>
        <pattern id="circle-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1.5" class="text-primary-800 dark:text-primary-400" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="640" height="784" fill="url(#circle-pattern)" />
    </svg>
  </div>

  <div class="relative z-10 max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
    <div class="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
      <div>
        <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Prêt à transformer votre quotidien ?
        </h2>
        <p class="mt-4 text-lg text-primary-100 dark:text-primary-200">
          Rejoignez plus de 100 000 utilisateurs qui ont déjà amélioré leur bien-être avec ZenLife. Commencez dès aujourd'hui gratuitement et découvrez une nouvelle façon de prendre soin de vous.
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <a href="/auth/register" class="bg-white border border-transparent rounded-md shadow px-6 py-3 inline-flex items-center text-base font-medium text-primary-600 hover:bg-primary-50 transform hover:scale-105 transition-all duration-300">
            Commencer gratuitement
          </a>
          <a href="#" class="border border-white rounded-md px-6 py-3 inline-flex items-center text-base font-medium text-white hover:bg-primary-800 transform hover:scale-105 transition-all duration-300">
            <DeviceTabletIcon class="h-5 w-5 mr-2" />
            Installer sur votre appareil
          </a>
        </div>

        <!-- Info PWA au lieu des badges app stores -->
        <div class="mt-8 bg-primary-800/50 backdrop-blur-sm rounded-lg p-4 border border-primary-600/30">
          <h3 class="text-white text-lg font-semibold flex items-center">
            <InformationCircleIcon class="h-5 w-5 mr-2" />
            Disponible sur tous vos appareils
          </h3>
          <p class="mt-2 text-primary-100 text-sm">
            ZenLife est une application web progressive (PWA) qui s'installe directement depuis votre navigateur. Pas besoin d'App Store ou de Play Store !
          </p>
          <div class="mt-3 grid grid-cols-3 gap-2">
            <div class="flex flex-col items-center text-primary-200 text-xs">
              <DeviceMobileIcon class="h-8 w-8 mb-1" />
              <span>iOS & Android</span>
            </div>
            <div class="flex flex-col items-center text-primary-200 text-xs">
              <DesktopComputerIcon class="h-8 w-8 mb-1" />
              <span>Windows & Mac</span>
            </div>
            <div class="flex flex-col items-center text-primary-200 text-xs">
              <GlobeIcon class="h-8 w-8 mb-1" />
              <span>Tout navigateur</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 lg:mt-0 flex justify-center">
        <div class="relative max-w-sm">
          <!-- Phone mockup -->
          <div class="relative mx-auto w-full max-w-xs overflow-hidden rounded-3xl shadow-xl transform rotate-3 hover:rotate-0 transition-all duration-700">
            <img class="w-full" src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" alt="ZenLife Mobile App">

            <!-- App interface overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent flex flex-col justify-end p-6">
              <div class="text-white">
                <div class="font-bold mb-1">Suivi quotidien</div>
                <div class="h-1 w-full bg-white/30 rounded-full mb-1">
                  <div class="h-1 w-4/5 bg-white rounded-full"></div>
                </div>
                <div class="text-xs opacity-80">4/5 objectifs accomplis</div>
              </div>
            </div>
          </div>

          <!-- Floating elements around phone -->
          <div class="absolute -top-4 -right-4 w-24 h-24 bg-white dark:bg-gray-800 rounded-xl shadow-lg transform -rotate-6 flex flex-col items-center justify-center p-2">
            <div class="text-3xl font-bold text-primary-600">85%</div>
            <div class="text-xs text-gray-600 dark:text-gray-400 text-center">d'objectifs atteints</div>
          </div>

          <!-- PWA install popup illustration -->
          <div class="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg transform rotate-6 p-3 max-w-[140px]">
            <div class="flex items-center space-x-1 text-xs font-medium text-gray-800 dark:text-gray-200">
              <PlusCircleIcon class="h-4 w-4 text-primary-600" />
              <span>Installer ZenLife</span>
            </div>
            <div class="mt-1 h-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full">
              <div class="h-1 w-3/4 bg-primary-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Steps to install PWA -->
    <div class="mt-16 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h3 class="text-xl font-bold text-white text-center mb-6">Comment installer ZenLife sur votre appareil</h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Step 1 -->
        <div class="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
          <div class="flex items-center mb-3">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">1</div>
            <h4 class="ml-3 text-lg font-medium text-white">Visitez le site</h4>
          </div>
          <p class="text-sm text-primary-100">
            Ouvrez ZenLife dans votre navigateur web préféré (Chrome, Safari, Firefox, Edge)
          </p>
        </div>

        <!-- Step 2 -->
        <div class="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
          <div class="flex items-center mb-3">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">2</div>
            <h4 class="ml-3 text-lg font-medium text-white">Menu du navigateur</h4>
          </div>
          <p class="text-sm text-primary-100">
            Appuyez sur le menu du navigateur (⋮ ou ⋯) puis "Ajouter à l'écran d'accueil" / "Installer"
          </p>
        </div>

        <!-- Step 3 -->
        <div class="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
          <div class="flex items-center mb-3">
            <div class="flex-shrink-0 h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">3</div>
            <h4 class="ml-3 text-lg font-medium text-white">Utilisez comme une app</h4>
          </div>
          <p class="text-sm text-primary-100">
            ZenLife s'installe sur votre appareil et fonctionne comme une application native, même hors ligne !
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

  <!-- Footer moderne -->
<footer class="bg-white dark:bg-gray-800">
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Logo & description -->
      <div class="col-span-1 md:col-span-2">
        <div class="flex items-center">
          <img class="h-10 w-auto" src="@/assets/img/logo.png" alt="ZenLife" />
          <span class="ml-2 font-fancy text-2xl text-primary-600 dark:text-primary-400">ZenLife</span>
        </div>
        <p class="mt-4 text-gray-600 dark:text-gray-400 max-w-md">
          ZenLife est une application complète dédiée à votre bien-être, combinant gestion financière, planning intelligent, suivi de santé et pratiques de pensée positive.
        </p>
        <div class="mt-6 flex space-x-6">
          <a href="#" class="text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
            <span class="sr-only">Facebook</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
            </svg>
          </a>
          <a href="#" class="text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
            <span class="sr-only">Instagram</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
            </svg>
          </a>
          <a href="#" class="text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
            <span class="sr-only">Twitter</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a href="#" class="text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
            <span class="sr-only">LinkedIn</span>
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
            </svg>
          </a>
        </div>
      </div>

      <!-- Navigation -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Entreprise</h3>
        <ul class="mt-4 space-y-4">
          <li>
            <a href="#" class="text-base text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">À propos</a>
          </li>
          <li>
            <a href="#" class="text-base text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Emplois</a>
          </li>
          <li>
            <a href="#" class="text-base text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Blog</a>
          </li>
          <li>
            <a href="#" class="text-base text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Presse</a>
          </li>
        </ul>
      </div>

      <!-- Support -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Support</h3>
        <ul class="mt-4 space-y-4">
          <li>
            <a href="#" class="text-base text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Centre d'aide</a>
          </li>
          <li>
            <a href="#" class="text-base text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</a>
          </li>
          <li>
            <a href="#" class="text-base text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Confidentialité</a>
          </li>
          <li>
            <a href="#" class="text-base text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Conditions d'utilisation</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <p class="text-center text-base text-gray-500 dark:text-gray-400">
        &copy; 2025 ZenLife, Inc. Tous droits réservés.
      </p>
    </div>
  </div>
</footer>
  </div>

</template>


<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
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
  MinusIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ArrowRightIcon,
  PlayIcon,
  StarIcon,
  DownloadIcon,
  DeviceMobileIcon,
  DesktopComputerIcon,
  GlobeIcon,
  InformationCircleIcon,
  PlusCircleIcon,
  DeviceTabletIcon
} from '@heroicons/vue/outline';

// État pour les interactions
const mobileMenuOpen = ref(false);
const faq1Open = ref(false);
const faq2Open = ref(false);
const faq3Open = ref(false);
const faq4Open = ref(false);
const faq5Open = ref(false);
const faq6Open = ref(false); // Ajout de la variable pour la 6ème question
const isDarkMode = ref(document.documentElement.classList.contains('dark'));
const currentTestimonial = ref(0);
const showFeatureComparison = ref(false);
const isScrolled = ref(false);

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

// Fonctions pour le carousel de témoignages
const nextTestimonial = () => {
  currentTestimonial.value = (currentTestimonial.value + 1) % 3;
};

const prevTestimonial = () => {
  currentTestimonial.value = (currentTestimonial.value + 2) % 3;
};

// Fonction pour détecter le défilement et appliquer des effets à la navbar
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

// Animation des compteurs
const animateCounters = () => {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const targetAttr = counter.getAttribute('data-target');
    if (!targetAttr) return; // Skip if data-target is null

    const target = parseInt(targetAttr);
    const count = () => {
      // Use textContent instead of innerText for TypeScript compatibility
      const currentText = counter.textContent || '0';
      const currentValue = parseInt(currentText.replace(/[^0-9]/g, ''));
      const increment = Math.ceil(target / 100);

      if (currentValue < target) {
        counter.textContent = `${Math.min(currentValue + increment, target)}${target > 1000 ? 'k+' : '%'}`;
        setTimeout(count, 20);
      }
    };
    count();
  });
};

// Fonction pour animer les éléments au scroll
const checkAnimation = () => {
  const elements = document.querySelectorAll('.animate-on-scroll:not(.animated)');
  elements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      el.classList.add('animated');
    }
  });
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

  // Ajout des écouteurs d'événements
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('scroll', checkAnimation);

  // Animation des compteurs après un court délai
  setTimeout(() => {
    animateCounters();
  }, 1000);

  // Démarrer le carousel automatique toutes les 5 secondes
  const testimonialInterval = setInterval(() => {
    nextTestimonial();
  }, 5000);

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('scroll', checkAnimation);
    clearInterval(testimonialInterval);
  });

  // Déclencher la vérification des animations une première fois
  checkAnimation();
  handleScroll();
});
</script>
