/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Service Worker Registration
import { TYPE, useToast, type PluginOptions } from 'vue-toastification';
import type { ToastID, ToastContent, ToastOptions } from 'vue-toastification/dist/types/types';

// Définir les interfaces pour les types manquants
interface SyncManager {
  register(tag: string): Promise<void>;
}

// Étendre l'interface ServiceWorkerRegistration pour inclure sync
declare global {
  interface ServiceWorkerRegistration {
    sync?: SyncManager;
  }
}

// Définir un type pour le toast fallback
type ToastFallback = {
  (content: ToastContent, options?: ToastOptions): ToastID;
  info: (content: ToastContent, options?: ToastOptions) => ToastID;
  success: (content: ToastContent, options?: ToastOptions) => ToastID;
  error: (content: ToastContent, options?: ToastOptions) => ToastID;
  warning?: (content: ToastContent, options?: ToastOptions) => ToastID;
  [key: string]: any;
};

// Configuration
let toast: ToastFallback;

try {
  // Utiliser le toast de vue-toastification si disponible
  const realToast = useToast();
  toast = realToast as ToastFallback;
} catch (error) {
  // Fallback si useToast n'est pas disponible hors composant Vue
  const dummyToastId = Date.now() as unknown as ToastID;
  const dummyToastFn = (msg: any) => {
    console.log('[Toast]', msg);
    return dummyToastId;
  };

  toast = dummyToastFn as unknown as ToastFallback;
  toast.info = (msg: any) => {
    console.log('[Toast Info]', msg);
    return dummyToastId;
  };
  toast.success = (msg: any) => {
    console.log('[Toast Success]', msg);
    return dummyToastId;
  };
  toast.error = (err: any) => {
    console.error('[Toast Error]', err);
    return dummyToastId;
  };
  toast.warning = (msg: any) => {
    console.warn('[Toast Warning]', msg);
    return dummyToastId;
  };
}

// Fonction pour enregistrer le service worker
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker enregistré avec succès:', registration.scope);

          // Vérifier les mises à jour du service worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('Service Worker: mise à jour trouvée, installation...');

            // Vérifier que newWorker n'est pas null
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Un nouveau service worker est disponible, mais attend d'être activé
                  console.log('Nouveau Service Worker disponible');
                  toast.info('Une mise à jour est disponible. Rafraîchissez la page pour l\'appliquer.');

                  // Option pour rafraîchir automatiquement
                  if (confirm('Une mise à jour de l\'application est disponible. Rafraîchir maintenant?')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                    window.location.reload();
                  }
                }
              });
            }
          });

          // Écouter les événements de contrôle du service worker
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Nouveau service worker actif');
          });

          // Écouter les messages du service worker
          navigator.serviceWorker.addEventListener('message', event => {
            const { type, timestamp } = event.data || {};

            if (type === 'SYNC_COMPLETED') {
              toast.success('Synchronisation terminée avec succès.');
              console.log('Synchronisation terminée à:', timestamp);
            }
          });

          return registration;
        })
        .catch(error => {
          console.error('Erreur lors de l\'enregistrement du service worker:', error);

          // Si l'erreur est 404, c'est que le fichier n'est pas trouvé
          if (error.message && error.message.includes('(404)')) {
            console.warn('Le fichier service-worker.js n\'est pas trouvé. Vérifiez qu\'il est bien dans le dossier public.');
          }
        });

      // Écouter les réponses aux requêtes de token
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'GET_AUTH_TOKEN') {
          // Récupérer le token depuis localStorage et le renvoyer au service worker
          const token = localStorage.getItem('token');
          if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({ token });
          }
        }
      });
    });
  } else {
    console.log('Les Service Workers ne sont pas supportés par ce navigateur.');
  }
}

// Fonction pour demander une synchronisation en arrière-plan
export async function requestBackgroundSync(tag = 'zenlife-sync-queue') {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;

      // Vérifier si sync est disponible
      if (registration.sync) {
        await registration.sync.register(tag);
        console.log(`Requête de synchronisation "${tag}" enregistrée`);
        return true;
      } else {
        throw new Error('SyncManager non disponible');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la synchronisation:', error);

      // Fallback: tenter une synchronisation immédiate
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'IMMEDIATE_SYNC',
          tag
        });
      }

      return false;
    }
  } else {
    console.warn('Background Sync non supporté par ce navigateur');

    // Fallback pour les navigateurs qui ne supportent pas sync
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'IMMEDIATE_SYNC',
        tag
      });
    }

    return false;
  }
}

// Fonction d'initialisation à appeler dans main.js
export function initServiceWorker() {
  registerServiceWorker();
}

// Si appelé directement
if (typeof window !== 'undefined') {
  registerServiceWorker();
}

export default {
  registerServiceWorker,
  requestBackgroundSync
};
