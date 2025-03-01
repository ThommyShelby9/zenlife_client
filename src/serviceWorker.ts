// @ts-nocheck
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

// Nom du cache pour les pensées positives
const POSITIVE_THOUGHTS_CACHE = 'positive-thoughts-cache-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Événement d'installation du service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation');

  // Pré-cacher les ressources importantes
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/offline.html' // Page à afficher quand hors ligne
      ]);
    })
  );

  self.skipWaiting();
});

// Événement d'activation du service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation');

  // Nettoyer les anciens caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE &&
            cacheName !== POSITIVE_THOUGHTS_CACHE
          ) {
            console.log('Service Worker: Suppression de l\'ancien cache', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );

  return self.clients.claim();
});

// Intercepter les requêtes réseau
self.addEventListener('fetch', (event) => {
  // Stratégie : Network First, puis Cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache la réponse fraîche
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Si le réseau échoue, essayer depuis le cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }

          // Si c'est une requête pour une page HTML, renvoyer la page offline
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/offline.html');
          }

          return new Response('Contenu non disponible hors ligne');
        });
      })
  );
});

// Gérer les notifications push
self.addEventListener('push', (event) => {
  if (!event.data) {
    console.log('Événement push sans données');
    return;
  }

  try {
    const data = event.data.json();
    console.log('Notification push reçue:', data);

    // Configuration par défaut
    let notificationData = {
      title: 'Nouvelle notification',
      body: 'Vous avez reçu une nouvelle notification',
      icon: '/img/icons/android-chrome-192x192.png',
      badge: '/img/icons/badge-128x128.png',
      tag: 'general-notification',
      data: {
        url: '/'
      }
    };

    // Si c'est une notification de pensée positive
    if (data.type === 'POSITIVE_THOUGHT') {
      const author = data.author ? ` - ${data.author}` : '';

      notificationData = {
        title: 'Pensée positive ✨',
        body: `${data.content}${author}`,
        icon: '/img/icons/android-chrome-192x192.png',
        badge: '/img/icons/badge-128x128.png',
        tag: 'positive-thought',
        data: {
          url: data.link || '/positive-thoughts',
          thought: data.content,
          author: data.author
        },
        // Activer la vibration
        vibrate: [100, 50, 100],
        // Afficher sur l'écran verrouillé si configuré
        requireInteraction: data.displayOnLockScreen === true,
        silent: false
      };

      // Sauvegarder la pensée dans le cache si elle existe
      if (data.thought) {
        cachePenseePositive(data.thought);
      }
    }

    // Afficher la notification
    event.waitUntil(
      self.registration.showNotification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon,
        badge: notificationData.badge,
        tag: notificationData.tag,
        data: notificationData.data,
        vibrate: notificationData.vibrate,
        requireInteraction: notificationData.requireInteraction,
        silent: notificationData.silent
      })
    );
  } catch (error) {
    console.error('Erreur lors de l\'affichage de la notification:', error);
  }
});

// Gérer le clic sur une notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Déterminer l'URL à ouvrir
  const urlToOpen = event.notification.data?.url || '/';

  // Ouvrir ou mettre au premier plan la fenêtre avec cette URL
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((windowClients) => {
      // Vérifier s'il y a déjà une fenêtre/onglet ouvert avec l'URL cible
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // Si oui, la mettre au premier plan
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }

      // Sinon, ouvrir une nouvelle fenêtre/onglet
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Mettre en cache les pensées positives pour un accès hors ligne
async function cachePenseePositive(pensee) {
  try {
    const cache = await caches.open(POSITIVE_THOUGHTS_CACHE);

    // Créer une clé unique pour cette pensée
    const key = `/api/positive-thoughts/cached/${pensee.id || Date.now()}`;

    // Créer une réponse mock avec la pensée
    const response = new Response(JSON.stringify(pensee), {
      headers: {'Content-Type': 'application/json'}
    });

    // Mettre en cache
    await cache.put(key, response);

    // Limiter le cache à 50 pensées
    const keys = await cache.keys();
    if (keys.length > 50) {
      await cache.delete(keys[0]);
    }

    console.log('Pensée mise en cache avec succès');
  } catch (error) {
    console.error('Erreur lors de la mise en cache de la pensée:', error);
  }
}

// Récupérer les pensées du cache
async function getPenseesFromCache() {
  try {
    const cache = await caches.open(POSITIVE_THOUGHTS_CACHE);
    const keys = await cache.keys();

    const pensees = [];
    for (const key of keys) {
      const response = await cache.match(key);
      if (response) {
        const pensee = await response.json();
        pensees.push(pensee);
      }
    }

    return pensees;
  } catch (error) {
    console.error('Erreur lors de la récupération des pensées du cache:', error);
    return [];
  }
}

// Sync en arrière-plan pour les actions en attente
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pensees-positives') {
    event.waitUntil(syncPenseesPositives());
  }
});

// Fonction pour synchroniser les pensées en attente
async function syncPenseesPositives() {
  try {
    // Logique de synchronisation ici
    console.log('Synchronisation des pensées positives en arrière-plan');
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
  }
}
