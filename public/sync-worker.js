/* eslint-disable @typescript-eslint/no-unused-vars */
// Configuration
const CACHE_NAME = 'zenlife-sync-cache-v1';
const DB_NAME = 'zenlife-offline-db';
const DB_VERSION = 1;
const SYNC_QUEUE_STORE = 'sync-queue';
const API_BASE_URL = 'https://zenlife-api.onrender.com/api';
const MAX_RETRY_COUNT = 5;

// Installer le service worker
self.addEventListener('install', (event) => {
  console.log('Sync Service Worker: Installation');
  // Activer immédiatement sans attendre la fermeture des onglets
  self.skipWaiting();
});

// Activer le service worker
self.addEventListener('activate', (event) => {
  console.log('Sync Service Worker: Activation');
  // Prendre le contrôle immédiatement
  event.waitUntil(clients.claim());

  // Nettoyer le cache ancien
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Gérer les événements de synchronisation
self.addEventListener('sync', (event) => {
  console.log(`Événement de synchronisation reçu: ${event.tag}`);

  if (event.tag === 'zenlife-sync-queue') {
    // Notifier le démarrage de la synchronisation
    notifyClients({ type: 'SYNC_STATUS', status: 'started' });

    // Exécuter la synchronisation
    event.waitUntil(syncData());
  }
});

// Gérer les messages depuis le client
self.addEventListener('message', (event) => {
  console.log('Message reçu par le sync worker:', event.data);

  if (event.data && event.data.type === 'IMMEDIATE_SYNC') {
    // Notifier le démarrage de la synchronisation
    notifyClients({ type: 'SYNC_STATUS', status: 'started' });

    // Exécuter la synchronisation immédiatement
    syncData().catch(error => {
      console.error('Erreur lors de la synchronisation immédiate:', error);
      notifyClients({
        type: 'SYNC_STATUS',
        status: 'error',
        message: 'Échec de la synchronisation immédiate'
      });
    });
  }
});

// Fonction principale de synchronisation
async function syncData() {
  try {
    console.log('Début de la synchronisation des données');

    // Récupérer les requêtes en attente
    const pendingRequests = await getPendingRequests();
    console.log(`${pendingRequests.length} requêtes en attente à synchroniser`);

    if (pendingRequests.length === 0) {
      notifyClients({ type: 'SYNC_STATUS', status: 'success', message: 'Aucune donnée à synchroniser' });
      return;
    }

    // Récupérer le token d'authentification
    const token = await getAuthToken();

    if (!token) {
      notifyClients({
        type: 'SYNC_STATUS',
        status: 'error',
        message: 'Impossible de synchroniser : non authentifié'
      });
      return;
    }

    // Synchroniser chaque requête
    let successCount = 0;
    let errorCount = 0;

    for (const request of pendingRequests) {
      try {
        const success = await processSingleRequest(request, token);
        if (success) {
          // Supprimer la requête traitée avec succès
          await deleteRequestFromQueue(request.id);
          successCount++;
        } else {
          // Incrémenter le compteur d'essais
          await incrementRetryCount(request.id);
          errorCount++;
        }
      } catch (error) {
        console.error('Erreur lors du traitement d\'une requête:', error);
        // Incrémenter le compteur d'essais
        await incrementRetryCount(request.id);
        errorCount++;
      }
    }

    // Notifier le résultat
    if (errorCount === 0) {
      notifyClients({
        type: 'SYNC_STATUS',
        status: 'success',
        message: `${successCount} requêtes synchronisées avec succès`
      });
    } else {
      notifyClients({
        type: 'SYNC_STATUS',
        status: 'warning',
        message: `Synchronisation partielle: ${successCount} succès, ${errorCount} échecs`
      });
    }

  } catch (error) {
    console.error('Erreur globale lors de la synchronisation:', error);
    notifyClients({
      type: 'SYNC_STATUS',
      status: 'error',
      message: error.message || 'Erreur inconnue lors de la synchronisation'
    });
    throw error;
  }
}

// Traiter une seule requête
async function processSingleRequest(request, token) {
  // Ignorer les requêtes qui ont dépassé le nombre maximum de tentatives
  if (request.retryCount >= MAX_RETRY_COUNT) {
    console.warn(`Requête ${request.id} abandonnée après ${request.retryCount} tentatives.`);
    return true; // Considérer comme "traitée" pour la supprimer de la file
  }

  try {
    // Construire l'URL complète
    const url = new URL(request.url.startsWith('/')
      ? `${API_BASE_URL}${request.url}`
      : request.url);

    // Construire les en-têtes
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...request.headers
    };

    // Construire les options de la requête
    const options = {
      method: request.method,
      headers,
      mode: 'cors',
      credentials: 'same-origin'
    };

    // Ajouter le corps de la requête si nécessaire
    if (['POST', 'PUT', 'PATCH'].includes(request.method) && request.body) {
      options.body = JSON.stringify(request.body);
    }

    // Exécuter la requête
    const response = await fetch(url.toString(), options);

    // Vérifier si la requête a réussi
    if (response.ok) {
      console.log(`Requête ${request.id} synchronisée avec succès:`, response.status);
      return true;
    } else {
      console.error(`Échec de la requête ${request.id}:`, response.status, await response.text());
      return false;
    }
  } catch (error) {
    console.error(`Erreur lors du traitement de la requête ${request.id}:`, error);
    return false;
  }
}

// Fonctions d'accès à IndexedDB

// Ouvrir la base de données
async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject('Erreur d\'ouverture de la base de données');
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Créer les object stores si nécessaire
      if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
        const store = db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('retryCount', 'retryCount', { unique: false });
        console.log('Object store pour la file de synchronisation créé');
      }
    };
  });
}

// Récupérer toutes les requêtes en attente
async function getPendingRequests() {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SYNC_QUEUE_STORE], 'readonly');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const request = store.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject('Erreur lors de la récupération des requêtes en attente');
    };
  });
}

// Supprimer une requête de la file
async function deleteRequestFromQueue(id) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SYNC_QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const request = store.delete(id);

    request.onsuccess = (event) => {
      resolve(true);
    };

    request.onerror = (event) => {
      reject('Erreur lors de la suppression de la requête');
    };
  });
}

// Incrémenter le compteur de tentatives
async function incrementRetryCount(id) {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SYNC_QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const getRequest = store.get(id);

    getRequest.onsuccess = (event) => {
      const data = event.target.result;
      if (data) {
        data.retryCount = (data.retryCount || 0) + 1;
        data.lastRetry = new Date().toISOString();

        const updateRequest = store.put(data);
        updateRequest.onsuccess = () => resolve(true);
        updateRequest.onerror = () => reject('Erreur lors de la mise à jour du compteur de tentatives');
      } else {
        reject('Requête non trouvée');
      }
    };

    getRequest.onerror = (event) => {
      reject('Erreur lors de la récupération de la requête');
    };
  });
}

// Utilitaires

// Récupérer le token d'authentification
async function getAuthToken() {
  // Essayer d'abord de le récupérer depuis localStorage
  return new Promise((resolve) => {
    self.clients.matchAll().then(clients => {
      if (clients.length === 0) {
        resolve(null);
        return;
      }

      // Demander le token au premier client
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.token);
      };

      clients[0].postMessage({ type: 'GET_AUTH_TOKEN' }, [messageChannel.port2]);

      // Timeout pour éviter les attentes infinies
      setTimeout(() => resolve(null), 3000);
    });
  });
}

// Notifier tous les clients
function notifyClients(message) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(message);
    });
  });
}

// Ajouter un écouteur pour les événements d'ajout de requête
self.addEventListener('fetch', (event) => {
  // Nous laissons passer la requête et nous n'intervenons pas ici
  // Cette fonction est nécessaire pour que le service worker soit activé
  // pour toutes les requêtes
});
