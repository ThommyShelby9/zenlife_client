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

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Gérer les messages en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('Message reçu en arrière-plan:', payload);

  const notificationTitle = payload.notification?.title || 'ZenLife';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.icon || '/img/logo.png',
    badge: '/img/logo.png',
    tag: payload.data?.tag || 'default',
    data: payload.data || {},
    vibrate: [100, 50, 100],
    requireInteraction: true
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gérer les clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Récupérer l'URL à ouvrir (défaut: racine de l'application)
  const urlToOpen = event.notification.data?.url || '/';

  // Ouvrir ou focaliser une fenêtre existante
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clientsList => {
      // Chercher si une fenêtre de l'application est déjà ouverte
      for (const client of clientsList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }

      // Sinon ouvrir une nouvelle fenêtre
      return self.clients.openWindow(urlToOpen);
    })
  );
});
