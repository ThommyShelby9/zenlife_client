// public/firebase-messaging-sw.js
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

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Gérer les messages en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('Message reçu en arrière-plan:', payload);

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
  });
});

// Gérer les clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Récupérer l'URL à ouvrir (défaut: racine de l'application)
  const url = event.notification.data?.url || '/';

  // Ouvrir ou focaliser une fenêtre existante
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clientsList => {
      // Chercher si une fenêtre de l'application est déjà ouverte
      for (const client of clientsList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.navigate(url).then(() => client.focus());
        }
      }

      // Sinon ouvrir une nouvelle fenêtre
      return self.clients.openWindow(url);
    })
  );
});

// Gestionnaire d'installation de service worker
// eslint-disable-next-line @typescript-eslint/no-unused-vars
self.addEventListener('install', (event) => {
  console.log('Service Worker installé');
  self.skipWaiting(); // Prendre le contrôle immédiatement
});

// Gestionnaire d'activation de service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activé');
  event.waitUntil(self.clients.claim()); // Prendre le contrôle immédiatement
});

// Handler pour les messages venant du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
