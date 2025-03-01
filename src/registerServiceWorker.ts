/* eslint-disable no-console */

import { register } from 'register-service-worker';
import { POSITION, useToast } from 'vue-toastification';

// Fonction d'initialisation pour enregistrer le service worker
export function initServiceWorker() {
  if (import.meta.env.MODE === 'production') {
    const toast = useToast();

    register(`${import.meta.env.BASE_URL}service-worker.js`, {
      ready() {
        console.log(
          'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB'
        );
      },
      registered() {
        console.log('Service worker has been registered.');
      },
      cached() {
        console.log('Content has been cached for offline use.');
        toast.info('ZenLife est prêt pour une utilisation hors ligne');
      },
      updatefound() {
        console.log('New content is downloading.');
        toast.info('Téléchargement d\'une nouvelle version de ZenLife');
      },
      updated() {
        console.log('New content is available; please refresh.');
        toast.info('Une nouvelle version est disponible. Veuillez rafraîchir la page.');

        // Add a refresh button in the toast
        const refreshAction = document.createElement('button');
        refreshAction.className = 'mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500';
        refreshAction.textContent = 'Rafraîchir maintenant';
        refreshAction.addEventListener('click', () => {
          window.location.reload();
        });

        toast.info(
          'Une nouvelle version est disponible.',
          {
            position: POSITION.BOTTOM_CENTER,
            timeout: 0,
            closeOnClick: false,
            draggable: false,
            draggablePercent: 0,
            showCloseButtonOnHover: false,
            hideProgressBar: true,
            closeButton: false,
            icon: true,
            rtl: false
          }
        );
      },
      offline() {
        console.log('No internet connection found. App is running in offline mode.');
        toast.warning('Vous êtes hors ligne. ZenLife fonctionne en mode hors ligne');
      },
      error(error) {
        console.error('Error during service worker registration:', error);
      }
    });
  }
}

// Vous pouvez appeler cette fonction dans votre main.ts comme suit:
// import { initServiceWorker } from './registerServiceWorker';
// initServiceWorker();
