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

  interface Window {
    __SW_UPDATE_MODAL_SHOWN: boolean;
    showUpdateModal: () => void;
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

// Variable pour suivre si le modal de mise à jour a déjà été montré
const updateModalShown = false;
// Variable pour éviter les actions multiples
let activationInProgress = false;

// Fonction pour créer un modal de mise à jour élégant - conservée mais non utilisée
// Note: Cette fonction est désactivée mais conservée au cas où vous souhaiteriez revenir à une mise à jour manuelle
function createUpdateModal() {
  // Vérifier si le modal existe déjà
  const existingModal = document.getElementById('sw-update-modal');
  if (existingModal) return;

  // Créer le modal
  const modalContainer = document.createElement('div');
  modalContainer.id = 'sw-update-modal';
  modalContainer.style.position = 'fixed';
  modalContainer.style.zIndex = '9999';
  modalContainer.style.left = '0';
  modalContainer.style.top = '0';
  modalContainer.style.width = '100%';
  modalContainer.style.height = '100%';
  modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  modalContainer.style.display = 'flex';
  modalContainer.style.alignItems = 'center';
  modalContainer.style.justifyContent = 'center';
  modalContainer.style.opacity = '0';
  modalContainer.style.transition = 'opacity 0.3s ease';

  // Le contenu du modal
  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = 'white';
  modalContent.style.borderRadius = '8px';
  modalContent.style.padding = '20px';
  modalContent.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  modalContent.style.width = '90%';
  modalContent.style.maxWidth = '450px';
  modalContent.style.transform = 'translateY(20px)';
  modalContent.style.transition = 'transform 0.3s ease';

  // Adapter le style pour le mode sombre si nécessaire
  if (document.documentElement.classList.contains('dark')) {
    modalContent.style.backgroundColor = '#1f2937';  // Couleur de fond sombre
    modalContent.style.color = 'white';
  }

  // Ajouter le titre
  const title = document.createElement('h3');
  title.textContent = 'Mise à jour disponible';
  title.style.fontSize = '18px';
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '10px';
  title.style.color = document.documentElement.classList.contains('dark') ? 'white' : '#111827';

  // Ajouter le message
  const message = document.createElement('p');
  message.textContent = 'Une nouvelle version de l\'application est disponible. Veuillez rafraîchir la page pour appliquer les mises à jour.';
  message.style.marginBottom = '15px';
  message.style.fontSize = '14px';
  message.style.lineHeight = '1.5';
  message.style.color = document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563';

  // Conteneur pour les boutons
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'flex-end';
  buttonContainer.style.gap = '10px';
  buttonContainer.style.marginTop = '15px';

  // Bouton pour rafraîchir
  const refreshButton = document.createElement('button');
  refreshButton.textContent = 'Rafraîchir maintenant';
  refreshButton.style.backgroundColor = '#4f46e5';  // Couleur primaire
  refreshButton.style.color = 'white';
  refreshButton.style.padding = '8px 16px';
  refreshButton.style.borderRadius = '6px';
  refreshButton.style.border = 'none';
  refreshButton.style.fontWeight = '500';
  refreshButton.style.cursor = 'pointer';
  refreshButton.style.transition = 'background-color 0.2s ease';
  refreshButton.onmouseover = () => { refreshButton.style.backgroundColor = '#4338ca'; };
  refreshButton.onmouseleave = () => { refreshButton.style.backgroundColor = '#4f46e5'; };

  refreshButton.onclick = () => {
    if (activationInProgress) return; // Éviter les clics multiples

    activationInProgress = true;
    refreshButton.textContent = 'Activation en cours...';
    refreshButton.style.backgroundColor = '#9ca3af';
    refreshButton.style.cursor = 'wait';

    // Définir un flag dans localStorage pour éviter la boucle
    localStorage.setItem('sw_update_pending', 'true');

    // Ajout d'un timeout de sécurité pour recharger la page même si controllerchange n'est pas déclenché
    const safetyTimeout = setTimeout(() => {
      console.log('Timeout de sécurité atteint, rechargement de la page');
      localStorage.removeItem('sw_update_pending');
      window.location.reload();
    }, 3000); // 3 secondes de délai

    // Ajouter un écouteur pour le changement de contrôleur
    const controllerChangeHandler = function() {
      console.log('Nouveau contrôleur actif, recharge de la page');
      clearTimeout(safetyTimeout); // Annuler le timeout car l'événement s'est produit
      localStorage.removeItem('sw_update_pending'); // Nettoyer le flag
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', controllerChangeHandler, { once: true });

    // Envoyer la demande d'activation au service worker
    if (navigator.serviceWorker.controller) {
      console.log('Demande au service worker de prendre le contrôle');
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });

      // Dans certains navigateurs, le controller peut ne pas changer immédiatement
      // Vérification supplémentaire après un court délai
      setTimeout(() => {
        try {
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
          }
        } catch (e) {
          console.warn('Impossible d\'envoyer un second message au service worker', e);
        }
      }, 500);
    } else {
      // Si pas de contrôleur, recharger simplement la page après un bref délai
      setTimeout(() => {
        localStorage.removeItem('sw_update_pending');
        window.location.reload();
      }, 1000);
    }
  };

  // Bouton pour différer
  const laterButton = document.createElement('button');
  laterButton.textContent = 'Plus tard';
  laterButton.style.padding = '8px 16px';
  laterButton.style.borderRadius = '6px';
  laterButton.style.backgroundColor = 'transparent';
  laterButton.style.border = document.documentElement.classList.contains('dark') ? '1px solid #6b7280' : '1px solid #d1d5db';
  laterButton.style.color = document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563';
  laterButton.style.fontWeight = '500';
  laterButton.style.cursor = 'pointer';
  laterButton.onclick = () => {
    document.body.removeChild(modalContainer);
    // Réinitialiser le drapeau pour permettre de remontrer le modal plus tard
    window.__SW_UPDATE_MODAL_SHOWN = false;
  };

  // Assembler le modal
  buttonContainer.appendChild(laterButton);
  buttonContainer.appendChild(refreshButton);
  modalContent.appendChild(title);
  modalContent.appendChild(message);
  modalContent.appendChild(buttonContainer);
  modalContainer.appendChild(modalContent);

  // Ajouter le modal au DOM
  document.body.appendChild(modalContainer);

  // Animation d'entrée
  setTimeout(() => {
    modalContainer.style.opacity = '1';
    modalContent.style.transform = 'translateY(0)';
  }, 10);

  return modalContainer;
}

// Fonction pour montrer le modal de mise à jour (désactivée mais conservée)
function showUpdateModal() {
  // Cette fonction est conservée mais ne sera pas appelée dans la nouvelle implémentation
  // Vérifier si le modal a déjà été montré
  if (window.__SW_UPDATE_MODAL_SHOWN) return;

  window.__SW_UPDATE_MODAL_SHOWN = true;
  createUpdateModal();
}

// Exposer la fonction dans window pour pouvoir l'appeler de partout
window.showUpdateModal = showUpdateModal;

// Fonction pour appliquer automatiquement la mise à jour
function applyUpdate(newWorker: ServiceWorker) {
  if (activationInProgress) return; // Éviter les actions multiples

  activationInProgress = true;
  console.log('Application automatique de la mise à jour');

  // Définir un flag dans localStorage pour éviter la boucle
  localStorage.setItem('sw_update_pending', 'true');

  // Ajout d'un timeout de sécurité pour recharger la page
  const safetyTimeout = setTimeout(() => {
    console.log('Timeout de sécurité atteint, rechargement de la page');
    localStorage.removeItem('sw_update_pending');
    window.location.reload();
  }, 3000); // 3 secondes de délai

  // Écouteur pour le changement de contrôleur
  const controllerChangeHandler = function() {
    console.log('Nouveau contrôleur actif, recharge de la page');
    clearTimeout(safetyTimeout);
    localStorage.removeItem('sw_update_pending');
    window.location.reload();
  };

  navigator.serviceWorker.addEventListener('controllerchange', controllerChangeHandler, { once: true });

  // Demander au nouveau worker de prendre le contrôle
  if (newWorker) {
    console.log('Demande au nouveau worker de prendre le contrôle');
    newWorker.postMessage({ type: 'SKIP_WAITING' });
  } else if (navigator.serviceWorker.controller) {
    console.log('Demande au controller actuel de prendre le contrôle');
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
  }
}

// Fonction pour enregistrer le service worker
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Vérifier si une mise à jour est en cours (pour éviter la boucle)
      const updatePending = localStorage.getItem('sw_update_pending') === 'true';
      if (updatePending) {
        console.log('Mise à jour déjà en cours, attente de la prise de contrôle...');
        return; // Ne pas continuer l'initialisation
      }

      // S'assurer que le drapeau de mise à jour est réinitialisé au chargement
      window.__SW_UPDATE_MODAL_SHOWN = false;

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
                  // Un nouveau service worker est disponible
                  console.log('Nouveau Service Worker disponible');

                  // Appliquer automatiquement la mise à jour sans afficher de modal
                  applyUpdate(newWorker);
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
  requestBackgroundSync,
  showUpdateModal
};
