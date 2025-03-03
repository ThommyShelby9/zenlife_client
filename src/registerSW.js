import { registerSW } from 'virtual:pwa-register';
import { useToast } from 'vue-toastification';

// Créer une instance de toast en dehors de Vue
let toast;
try {
  toast = useToast();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
  // Fallback si useToast n'est pas disponible hors d'un composant Vue
  toast = {
    info: (msg) => console.log(msg),
    success: (msg) => console.log(msg),
    error: (msg) => console.error(msg)
  };
}

// Enregistrer le service worker principal PWA
export const updateSW = registerSW({
  onNeedRefresh() {
    // Afficher une notification pour inviter l'utilisateur à mettre à jour
    if (confirm('Une nouvelle version de ZenLife est disponible. Mettre à jour maintenant?')) {
      updateSW();
    }
  },
  onOfflineReady() {
    toast.info('ZenLife est prêt pour une utilisation hors-ligne');
  },
  onRegistered(registration) {
    // Planifier des vérifications périodiques de mise à jour
    if (import.meta.env.PROD) {
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Vérifier les mises à jour toutes les heures
    }
  },
  onRegisterError(error) {
    console.error('Erreur lors de l\'enregistrement du service worker:', error);
  }
});

// Fonction pour enregistrer le service worker de synchronisation
export async function registerSyncWorker() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      // Enregistrer le service worker de synchronisation
      const registration = await navigator.serviceWorker.register('/sync-worker.js');

      console.log('Sync Service Worker enregistré avec succès', registration.scope);

      // Vérifier l'état du service worker
      if (registration.installing) {
        console.log('Sync Service Worker en cours d\'installation');
      } else if (registration.waiting) {
        console.log('Sync Service Worker installé et en attente');
      } else if (registration.active) {
        console.log('Sync Service Worker actif');
      }

      return registration;
    } catch (error) {
      console.error('Échec de l\'enregistrement du Sync Service Worker:', error);
      throw error;
    }
  } else {
    console.warn('La synchronisation en arrière-plan n\'est pas supportée par ce navigateur');
    return null;
  }
}

// Fonction pour demander une synchronisation en arrière-plan
export async function requestBackgroundSync(tag = 'zenlife-sync-queue') {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register(tag);
      console.log(`Requête de synchronisation "${tag}" enregistrée`);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la synchronisation:', error);
      // Fallback: tenter une synchronisation immédiate
      const msg = { type: 'IMMEDIATE_SYNC', tag };
      navigator.serviceWorker.controller?.postMessage(msg);
      return false;
    }
  } else {
    console.warn('Background Sync non supporté, exécution immédiate');
    // Simuler une synchronisation immédiate
    try {
      // Envoyer un message aux service workers actifs
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'IMMEDIATE_SYNC',
          tag
        });
      }
    } catch (e) {
      console.error('Échec de la synchronisation immédiate:', e);
    }
    return false;
  }
}

// Initialisation
export function initServiceWorkers() {
  registerSyncWorker().then(registration => {
    if (registration) {
      // Écouter les messages du service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, status, message } = event.data;

        if (type === 'SYNC_STATUS') {
          switch (status) {
            case 'started':
              toast.info('Synchronisation des données en cours...');
              break;
            case 'success':
              toast.success('Synchronisation terminée avec succès');
              break;
            case 'error':
              toast.error(`Erreur de synchronisation: ${message}`);
              break;
          }
        }
      });
    }
  });
}

// Exécuter l'initialisation automatiquement
if (typeof window !== 'undefined') {
  initServiceWorkers();
}
