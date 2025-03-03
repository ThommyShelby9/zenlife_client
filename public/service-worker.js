// Configuration
const CACHE_NAME = 'zenlife-cache-v1';
const ASSETS_CACHE = 'zenlife-assets-v1';
const API_CACHE = 'zenlife-api-cache-v1';
const OFFLINE_PAGE = '/offline.html';
const DB_NAME = 'zenlife-offline-db';
const DB_VERSION = 1;
const SYNC_QUEUE_STORE = 'sync-queue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const API_BASE_URL = 'https://zenlife-api.onrender.com/api';

// Ressources à mettre en cache immédiatement
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/img/logo.png',
  '/img/icons/android-chrome-192x192.png',
  '/img/icons/android-chrome-512x512.png',
  '/img/icons/apple-touch-icon.png',
  // CSS et JS principaux (ajustez selon vos noms de fichiers)
  '/assets/index.css',
  '/assets/index.js'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation en cours');

  // Pré-mise en cache des ressources essentielles
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Mise en cache des ressources essentielles');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        // Activer immédiatement sans attendre la fermeture des onglets existants
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Erreur lors de la mise en cache initiale:', error);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation');

  // Nettoyage des anciens caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => {
            return cacheName.startsWith('zenlife-') &&
                  cacheName !== CACHE_NAME &&
                  cacheName !== ASSETS_CACHE &&
                  cacheName !== API_CACHE;
          })
          .map(cacheName => {
            console.log('Service Worker: Suppression de l\'ancien cache', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => {
      // Prendre le contrôle immédiatement de tous les clients
      return self.clients.claim();
    })
    .then(() => {
      // Initialiser la base de données IndexedDB
      return initDatabase();
    })
  );
});

// Initialisation de la base de données
function initDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = event => {
      console.error('Erreur d\'ouverture de la base de données:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = event => {
      console.log('Base de données initialisée avec succès');
      resolve(event.target.result);
    };

    request.onupgradeneeded = event => {
      const db = event.target.result;

      // Créer les object stores nécessaires
      if (!db.objectStoreNames.contains(SYNC_QUEUE_STORE)) {
        const store = db.createObjectStore(SYNC_QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('retryCount', 'retryCount', { unique: false });
        console.log('Object store pour la file de synchronisation créé');
      }
    };
  });
}

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ne pas intercepter les requêtes pour les Chrome extensions ou autres
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Stratégie différente selon le type de requête
  if (request.method !== 'GET') {
    // Pour les requêtes non-GET (POST, PUT, DELETE), enregistrer pour synchronisation si hors ligne
    if (!self.navigator.onLine) {
      event.respondWith(handleOfflineMutation(request));
    }
    return;
  }

  // Stratégie pour les requêtes d'API (network-first)
  if (url.href.includes('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Stratégie pour les ressources statiques (cache-first)
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/) ||
    url.pathname.includes('/assets/') ||
    url.pathname.includes('/img/')
  ) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Stratégie pour les pages HTML (network-first avec fallback sur offline page)
  event.respondWith(networkFirstWithOfflineFallback(request));
});

// Stratégie Cache-First (pour ressources statiques)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    // Mettre en cache uniquement si c'est une réponse valide
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(ASSETS_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('Erreur lors de la récupération de la ressource:', error);
    return new Response('Ressource non disponible hors ligne', { status: 404 });
  }
}

// Stratégie Network-First (pour API)
async function networkFirstStrategy(request) {
  try {
    // Essayer d'abord le réseau
    const networkResponse = await fetch(request);

    // Mettre en cache la réponse
    const cache = await caches.open(API_CACHE);
    cache.put(request, networkResponse.clone());

    return networkResponse;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log('Réseau indisponible, utilisation du cache pour:', request.url);

    // Essayer depuis le cache
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Réponse par défaut si pas en cache
    return new Response(
      JSON.stringify({ message: 'Données non disponibles hors ligne' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Stratégie Network-First avec fallback sur page hors ligne
async function networkFirstWithOfflineFallback(request) {
  try {
    // Essayer d'abord le réseau
    const networkResponse = await fetch(request);

    // Mettre en cache la réponse
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());

    return networkResponse;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log('Réseau indisponible, utilisation du cache pour:', request.url);

    // Essayer depuis le cache
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Si aucune correspondance en cache, renvoyer la page hors ligne
    return caches.match(OFFLINE_PAGE);
  }
}

// Gestion des requêtes de mutation (POST, PUT, DELETE) en mode hors ligne
async function handleOfflineMutation(request) {
  try {
    // Cloner la requête car body ne peut être lu qu'une fois
    const requestClone = request.clone();
    const body = await requestClone.json();

    // Préparer l'objet pour la file d'attente
    const queueItem = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: body,
      timestamp: new Date().toISOString(),
      retryCount: 0
    };

    // Stocker dans IndexedDB
    await addToSyncQueue(queueItem);

    // Enregistrer la requête de synchronisation
    await self.registration.sync.register('zenlife-sync-queue');

    // Répondre au client
    return new Response(
      JSON.stringify({
        message: 'Votre requête a été enregistrée et sera traitée lorsque vous serez en ligne.',
        offline: true,
        success: true,
        data: { offline: true, queued: true }
      }),
      {
        status: 202, // Accepted
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la requête hors ligne:', error);

    // En cas d'échec, retourner une erreur explicite
    return new Response(
      JSON.stringify({
        message: 'Impossible de traiter votre demande hors ligne.',
        offline: true,
        success: false,
        error: error.message
      }),
      {
        status: 503, // Service Unavailable
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Ajouter à la file d'attente de synchronisation
async function addToSyncQueue(item) {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

    openRequest.onerror = event => reject(event.target.error);

    openRequest.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction([SYNC_QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);

      const request = store.add(item);

      request.onsuccess = () => {
        console.log('Requête ajoutée à la file d\'attente de synchronisation');
        resolve(true);
      };

      request.onerror = event => {
        console.error('Erreur lors de l\'ajout à la file d\'attente:', event.target.error);
        reject(event.target.error);
      };

      transaction.oncomplete = () => db.close();
    };
  });
}

// Récupérer les requêtes en attente
async function getPendingRequests() {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

    openRequest.onerror = event => reject(event.target.error);

    openRequest.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction([SYNC_QUEUE_STORE], 'readonly');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
        db.close();
      };

      request.onerror = event => {
        reject(event.target.error);
        db.close();
      };
    };
  });
}

// Supprimer une requête de la file
async function deleteRequestFromQueue(id) {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

    openRequest.onerror = event => reject(event.target.error);

    openRequest.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction([SYNC_QUEUE_STORE], 'readwrite');
      const store = transaction.objectStore(SYNC_QUEUE_STORE);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = event => {
        reject(event.target.error);
      };

      transaction.oncomplete = () => db.close();
    };
  });
}

// Gestion des événements de synchronisation
self.addEventListener('sync', (event) => {
  console.log(`Événement de synchronisation reçu: ${event.tag}`);

  if (event.tag === 'zenlife-sync-queue') {
    // Notifier le démarrage de la synchronisation
    event.waitUntil(syncData());
  }
});

// Fonction principale de synchronisation
async function syncData() {
  console.log('Début de la synchronisation des données');

  try {
    // Récupérer les requêtes en attente
    const pendingRequests = await getPendingRequests();
    console.log(`${pendingRequests.length} requêtes en attente à synchroniser`);

    if (pendingRequests.length === 0) {
      console.log('Aucune donnée à synchroniser');
      return;
    }

    // Récupérer le token d'authentification
    const token = await getAuthToken();

    if (!token) {
      console.error('Impossible de synchroniser : non authentifié');
      return;
    }

    // Synchroniser chaque requête
    for (const request of pendingRequests) {
      try {
        const success = await processSingleRequest(request, token);

        if (success) {
          // Supprimer la requête traitée avec succès
          await deleteRequestFromQueue(request.id);
          console.log(`Requête ${request.id} synchronisée avec succès`);
        } else {
          // Incrémenter le compteur d'essais
          await incrementRetryCount(request.id);
          console.warn(`Échec de la synchronisation de la requête ${request.id}`);
        }
      } catch (error) {
        console.error(`Erreur lors du traitement de la requête ${request.id}:`, error);
        // Incrémenter le compteur d'essais
        await incrementRetryCount(request.id);
      }
    }

    console.log('Synchronisation terminée');

    // Notifier le client que la synchronisation est terminée
    const clients = await self.clients.matchAll();
    for (const client of clients) {
      client.postMessage({
        type: 'SYNC_COMPLETED',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Erreur globale lors de la synchronisation:', error);
  }
}

// Traiter une seule requête
async function processSingleRequest(request, token) {
  try {
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
    const response = await fetch(request.url, options);

    // Vérifier si la requête a réussi
    if (response.ok) {
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

// Incrémenter le compteur de tentatives
async function incrementRetryCount(id) {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

    openRequest.onerror = event => reject(event.target.error);

    openRequest.onsuccess = event => {
      const db = event.target.result;
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
          updateRequest.onerror = (event) => reject(event.target.error);
        } else {
          reject(new Error('Requête non trouvée'));
        }
      };

      getRequest.onerror = event => reject(event.target.error);

      transaction.oncomplete = () => db.close();
    };
  });
}

// Récupérer le token d'authentification
async function getAuthToken() {
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

// Gestion des notifications push
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();

    const title = data.title || 'ZenLife';
    const options = {
      body: data.body || 'Nouvelle notification',
      icon: data.icon || '/img/icons/android-chrome-192x192.png',
      badge: data.badge || '/img/icons/android-chrome-192x192.png',
      data: data.data || {},
      actions: data.actions || []
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (error) {
    console.error('Erreur lors du traitement de la notification push:', error);

    // Fallback pour les notifications qui ne sont pas au format JSON
    const message = event.data.text();
    event.waitUntil(
      self.registration.showNotification('ZenLife', {
        body: message,
        icon: '/img/icons/android-chrome-192x192.png'
      })
    );
  }
});

// Gestion des clics sur notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clientList => {
      // Si une fenêtre est déjà ouverte, l'utiliser
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }

      // Sinon ouvrir une nouvelle fenêtre
      return self.clients.openWindow(url);
    })
  );
});

// Écouter les messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_AUTH_TOKEN') {
    // Répondre avec le token stocké dans localStorage
    event.ports[0].postMessage({ token: localStorage.getItem('token') });
  }

  if (event.data && event.data.type === 'IMMEDIATE_SYNC') {
    syncData().catch(error => {
      console.error('Erreur lors de la synchronisation immédiate:', error);
    });
  }
});
