
window.diagNotifications = {
  diagnostiquer: async function() {
    console.log("=== DIAGNOSTIC DES NOTIFICATIONS ===");

    // 1. Vérifier le support des notifications
    const notificationsSupport = 'Notification' in window;
    console.log(`1. Support des notifications: ${notificationsSupport ? 'OUI ✓' : 'NON ✗'}`);

    if (!notificationsSupport) {
      console.log("❌ Votre navigateur ne prend pas en charge les notifications.");
      return {
        supported: false,
        permission: null,
        serviceWorker: false,
        firebase: false,
        token: null
      };
    }

    // 2. Vérifier la permission
    const permission = Notification.permission;
    console.log(`2. Permission notifications: ${permission}`);

    // 3. Vérifier le service worker
    let serviceWorkerRegistered = false;
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        console.log(`3. Service Workers enregistrés: ${registrations.length}`);

        for (const reg of registrations) {
          console.log(`   - Scope: ${reg.scope}`);
          console.log(`   - Actif: ${reg.active ? 'OUI ✓' : 'NON ✗'}`);
          console.log(`   - Mise à jour: ${reg.updating ? 'OUI ✓' : 'NON ✗'}`);

          if (reg.scope.includes(window.location.origin)) {
            serviceWorkerRegistered = true;
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification des Service Workers:", error);
      }
    } else {
      console.log("3. Service Worker non supporté par ce navigateur");
    }

    // 4. Vérifier Firebase
    let firebaseInitialized = false;
    let fcmToken = null;

    try {
      if (typeof firebase !== 'undefined') {
        console.log("4. Firebase est disponible");

        // Vérifier si la messagerie est disponible
        if (firebase.messaging && typeof firebase.messaging().getToken === 'function') {
          console.log("   - Firebase Messaging est disponible");

          // Essayer de récupérer le token sauvegardé localement
          fcmToken = localStorage.getItem('fcm_token');
          if (fcmToken) {
            console.log(`   - Token FCM en cache: ${fcmToken.substring(0, 10)}...`);
          } else {
            console.log("   - Pas de token FCM en cache");
          }

          firebaseInitialized = true;
        } else {
          console.log("   - Firebase Messaging n'est pas disponible");
        }
      } else {
        console.log("4. Firebase n'est pas disponible");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de Firebase:", error);
    }

    // 5. Vérifier le local storage
    console.log("5. Vérification des données de Local Storage:");
    console.log(`   - push_notifications_enabled: ${localStorage.getItem('push_notifications_enabled')}`);
    console.log(`   - fcm_token: ${localStorage.getItem('fcm_token') ? 'Présent ✓' : 'Absent ✗'}`);

    // 6. Tester une notification locale
    console.log("6. Test d'une notification locale:");
    if (permission === 'granted') {
      try {
        const localNotif = new Notification('Test de Notification', {
          body: 'Ceci est un test local de notification',
          icon: '/img/logo.png'
        });
        console.log("   - Notification locale affichée avec succès ✓");

        // Fermer la notification après 3 secondes
        setTimeout(() => {
          localNotif.close();
        }, 3000);
      } catch (error) {
        console.error("   - Erreur lors de l'affichage de la notification locale:", error);
      }
    } else {
      console.log("   - Impossible de tester la notification locale: permission non accordée");
    }

    return {
      supported: notificationsSupport,
      permission: permission,
      serviceWorker: serviceWorkerRegistered,
      firebase: firebaseInitialized,
      token: fcmToken
    };
  },

  reset: function() {
    console.log("=== RÉINITIALISATION DES NOTIFICATIONS ===");

    // Supprimer les données de Local Storage
    localStorage.removeItem('push_notifications_enabled');
    localStorage.removeItem('fcm_token');
    console.log("1. Données du Local Storage supprimées ✓");

    // Désinscrire les service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const registration of registrations) {
          registration.unregister();
          console.log(`2. Service Worker désinscrit: ${registration.scope} ✓`);
        }
      });
    }

    console.log("3. Réinitialisation terminée. Rechargez la page pour appliquer les changements.");
    return true;
  }
};
