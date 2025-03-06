/* eslint-disable @typescript-eslint/no-unused-vars */
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Configuration Firebase ZenLife
const firebaseConfig = {
  apiKey: "AIzaSyBPjNVRFMW8UIQD_fcEzObyQorRPbH3EzI",
  authDomain: "zenlife-b7b30.firebaseapp.com",
  projectId: "zenlife-b7b30",
  storageBucket: "zenlife-b7b30.firebasestorage.app",
  messagingSenderId: "369768393311",
  appId: "1:369768393311:web:b11e09b4541edf5ed709ea",
  measurementId: "G-VB9HXW4RRR"
};

// Variables pour la journalisation et le dépannage
const DEBUG = true;
const logDebug = (message) => {
  if (DEBUG) {
    console.log(`[SW] ${message}`);
  }
};

// Initialiser Firebase
try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();
  logDebug('Firebase initialisé avec succès');

  // Gérer les messages en arrière-plan
  messaging.onBackgroundMessage((payload) => {
    logDebug('Message reçu en arrière-plan:');
    logDebug(JSON.stringify(payload));

    // Extraire les informations de notification
    let title = 'ZenLife';
    let body = 'Vous avez une nouvelle notification';
    let icon = '/img/logo.png';
    let url = '/';
    let tag = 'default';

    // Utiliser les données du payload si disponibles
    if (payload.notification) {
      title = payload.notification.title || title;
      body = payload.notification.body || body;
      icon = payload.notification.icon || icon;
    }

    if (payload.data) {
      url = payload.data.url || url;
      tag = payload.data.tag || tag;
    }

    // Afficher une notification
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      badge: '/img/logo.png',
      tag: tag,
      data: { url: url },
      vibrate: [100, 50, 100],
      requireInteraction: true
    }).then(() => {
      logDebug('Notification affichée avec succès');
    }).catch(error => {
      console.error('Erreur lors de l\'affichage de la notification:', error);
    });
  });
} catch (error) {
  console.error('Erreur lors de l\'initialisation de Firebase:', error);
}

// Gérer les événements push (pour les navigateurs ne supportant pas FCM)
self.addEventListener('push', (event) => {
  logDebug('Événement push reçu');

  if (!event.data) {
    logDebug('Pas de données dans l\'événement push');
    return;
  }

  try {
    const data = event.data.json();
    logDebug('Données push parsées:');
    logDebug(JSON.stringify(data));

    // Si les données contiennent un objet notification
    if (data.notification) {
      const notification = data.notification;

      event.waitUntil(
        self.registration.showNotification(notification.title || 'ZenLife', {
          body: notification.body || 'Vous avez une nouvelle notification',
          icon: notification.icon || '/img/logo.png',
          badge: notification.badge || '/img/logo.png',
          tag: notification.tag || 'default',
          data: notification.data || { url: '/' },
          vibrate: [100, 50, 100],
          requireInteraction: true
        })
      );
    }
  } catch (error) {
    console.error('Erreur lors du traitement de l\'événement push:', error);

    // Tentative de récupération - afficher une notification basique
    event.waitUntil(
      self.registration.showNotification('ZenLife', {
        body: 'Vous avez une nouvelle notification',
        icon: '/img/logo.png'
      })
    );
  }
});

// Gérer les clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  logDebug('Clic sur une notification');
  event.notification.close();

  // Récupérer l'URL à ouvrir (défaut: racine de l'application)
  const url = event.notification.data?.url || '/';
  logDebug(`URL à ouvrir: ${url}`);

  // Ouvrir ou focaliser une fenêtre existante
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientsList => {
      logDebug(`${clientsList.length} clients trouvés`);

      // Chercher si une fenêtre de l'application est déjà ouverte
      for (const client of clientsList) {
        logDebug(`Client URL: ${client.url}`);
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          logDebug('Client existant trouvé, navigation et focus');
          return client.navigate(url).then(() => client.focus());
        }
      }

      // Sinon ouvrir une nouvelle fenêtre
      logDebug('Aucun client existant trouvé, ouverture d\'une nouvelle fenêtre');
      return clients.openWindow(url);
    })
  );
});

// Gestionnaire d'installation de service worker
self.addEventListener('install', (event) => {
  logDebug('Service Worker installé');
  self.skipWaiting(); // Prendre le contrôle immédiatement
});

// Gestionnaire d'activation de service worker
self.addEventListener('activate', (event) => {
  logDebug('Service Worker activé');
  event.waitUntil(clients.claim()); // Prendre le contrôle immédiatement
});

// Handler pour les messages venant du client
self.addEventListener('message', (event) => {
  logDebug(`Message reçu du client: ${JSON.stringify(event.data)}`);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
