/* eslint-disable @typescript-eslint/no-explicit-any */
import { useToast } from 'vue-toastification';
import apiClient from '@/api/index';
import { messaging } from '@/firebase/config';
import { getToken, onMessage, deleteToken } from 'firebase/messaging';

class PushNotificationService {
  private toast = useToast();
  private isInitialized = false;
  private localStorageKey = 'push_notifications_enabled';
  private fcmTokenKey = 'fcm_token';
  private vapidKey = 'BJsD0abRfRE3CxTW9PWX04JVj0YNh__cNko8OSRxTGVVAd7Gf-0tMskITTasqp5e6_e3DJ398_r_sReS4HbKYxw';

  constructor() {
    this.setupForegroundHandler();
  }

  /**
   * Configure l'écouteur de messages en premier plan
   */
  private setupForegroundHandler() {
    if (this.isSupported()) {
      try {
        // Gestion des messages en premier plan
        onMessage(messaging, (payload) => {
          console.log('Message reçu en premier plan:', payload);

          // Afficher un toast pour les notifications en premier plan
          if (payload.notification) {
            this.toast.info(
              `${payload.notification.title}: ${payload.notification.body}`,
              {
                timeout: 10000,
                closeOnClick: true,
                onClick: () => {
                  if (payload.data && payload.data.url) {
                    window.location.href = payload.data.url;
                  }
                }
              }
            );
          }
        });
      } catch (error) {
        console.error('Erreur lors de la configuration du gestionnaire de premier plan:', error);
      }
    }
  }

  /**
   * Vérifie si le navigateur est en développement local
   */
  public isLocalDevelopment(): boolean {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }

  /**
   * Vérifie si les notifications push sont supportées
   */
  public isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  /**
   * Initialise le service de notification push
   */
  public async initialize(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Push notifications are not supported by this browser');
      return false;
    }

    if (this.isInitialized) {
      return await this.getSubscriptionStatus();
    }

    try {
      // Attendre que le service worker soit prêt
      await this.waitForServiceWorkerReady();

      // Vérifier l'état sauvegardé dans localStorage
      const enabled = localStorage.getItem(this.localStorageKey) === 'true';

      // Si les notifications sont activées selon localStorage, vérifier le token
      if (enabled) {
        const currentToken = localStorage.getItem(this.fcmTokenKey);

        if (!currentToken) {
          // Si le token n'existe pas mais que les notifications sont censées être activées,
          // essayer de s'abonner à nouveau si la permission est déjà accordée
          if (Notification.permission === 'granted') {
            await this.subscribe();
          } else {
            // Si la permission n'est pas accordée, mettre à jour l'état
            localStorage.setItem(this.localStorageKey, 'false');
          }
        }
      }

      this.isInitialized = true;
      return await this.getSubscriptionStatus();
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return false;
    }
  }

  /**
   * Attend que le service worker soit prêt
   */
  private async waitForServiceWorkerReady(): Promise<ServiceWorkerRegistration> {
    // Attendre que le service worker soit prêt
    try {
      // Vérifier si le service worker est déjà enregistré
      return await navigator.serviceWorker.ready;
    } catch (error) {
      console.error('Erreur lors de l\'attente du service worker:', error);

      // Tenter d'enregistrer le service worker si nécessaire
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          console.log('Service Worker enregistré avec succès:', registration.scope);
          return registration;
        } catch (regError) {
          console.error('Erreur lors de l\'enregistrement du service worker:', regError);
          throw regError;
        }
      } else {
        throw new Error('Service Worker non supporté');
      }
    }
  }

  /**
   * Demande la permission et s'abonne aux notifications
   */
  public async requestPermissionAndSubscribe(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Push notifications are not supported by this browser');
      return false;
    }

    try {
      // Vérifier d'abord le statut actuel des permissions
      if (Notification.permission === "granted") {
        console.log("Permissions déjà accordées");
        return await this.subscribe();
      }
      else if (Notification.permission === "denied") {
        console.warn("Les permissions de notifications ont été bloquées");
        this.toast.warning(
          'Les notifications sont bloquées par votre navigateur. Veuillez modifier les paramètres de votre navigateur pour permettre les notifications.',
          { timeout: 8000 }
        );
        localStorage.setItem(this.localStorageKey, 'false');
        return false;
      }

      // Demander la permission si elle n'a pas été accordée ou refusée
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        const success = await this.subscribe();
        localStorage.setItem(this.localStorageKey, success ? 'true' : 'false');
        return success;
      } else {
        localStorage.setItem(this.localStorageKey, 'false');
        this.toast.warning(
          'Les notifications sont désactivées. Vous ne recevrez pas de rappels lorsque l\'application est fermée.',
          { timeout: 8000 }
        );
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      localStorage.setItem(this.localStorageKey, 'false');
      return false;
    }
  }

  /**
   * S'abonne aux notifications push
   */
  private async subscribe(): Promise<boolean> {
    try {
      // Vérifier si nous sommes en développement local
      if (this.isLocalDevelopment()) {
        console.log('Environnement local détecté - simulation d\'un abonnement aux notifications');
        localStorage.setItem(this.fcmTokenKey, 'local-dev-token');
        localStorage.setItem(this.localStorageKey, 'true');
        return true;
      }

      // S'assurer que le service worker est enregistré et prêt
      const swRegistration = await this.waitForServiceWorkerReady();

      // Tentative de création d'un abonnement Web Push standard
      let subscription;
      let currentToken;
      let isStandardWebPush = false;

      try {
        // Essayer d'abord avec l'API Web Push standard
        subscription = await swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.vapidKey)
        });
        isStandardWebPush = true;
        console.log('Abonnement Web Push créé avec succès');
      } catch (webPushError) {
        console.warn('Échec de l\'abonnement Web Push standard, tentative avec FCM:', webPushError);

        // Utiliser FCM comme fallback
        try {
          currentToken = await getToken(messaging, {
            vapidKey: this.vapidKey,
            serviceWorkerRegistration: swRegistration
          });

          if (!currentToken) {
            throw new Error('Impossible d\'obtenir un token FCM');
          }

          console.log('Token FCM obtenu avec succès');
        } catch (fcmError) {
          console.error('Erreur lors de l\'obtention du token FCM:', fcmError);
          return false;
        }
      }

      // Préparer les données d'abonnement à envoyer au serveur
      let serverSubscription;

      if (isStandardWebPush && subscription) {
        // Format pour l'abonnement Web Push standard
        const subscriptionJSON = subscription.toJSON();

        // Vérifier que l'endpoint existe bien
        if (!subscriptionJSON.endpoint) {
          throw new Error("L'endpoint de souscription est manquant");
        }

        serverSubscription = {
          endpoint: subscriptionJSON.endpoint,
          keys: {
            p256dh: subscriptionJSON.keys?.p256dh || '',
            auth: subscriptionJSON.keys?.auth || ''
          }
        };

        // Stocker un identifiant pour cet abonnement - avec vérification
        localStorage.setItem(this.fcmTokenKey, btoa(subscriptionJSON.endpoint));
      } else if (currentToken) {
        // Format pour l'abonnement FCM
        serverSubscription = {
          endpoint: `https://fcm.googleapis.com/fcm/send/${currentToken}`,
          keys: {
            p256dh: 'FCM-p256dh-key', // Utiliser une chaîne en encodage base64 valide
            auth: 'FCM-auth-key'       // Utiliser une chaîne en encodage base64 valide
          }
        };

        // Stocker le token FCM
        localStorage.setItem(this.fcmTokenKey, currentToken);
      } else {
        console.error('Aucun abonnement créé');
        return false;
      }

      // Définir le statut comme activé
      localStorage.setItem(this.localStorageKey, 'true');

      // Envoyer l'abonnement au serveur
      try {
        await apiClient.post('/notifications/subscribe', serverSubscription);
        console.log('Abonnement enregistré avec succès sur le serveur');
      } catch (apiError) {
        console.error('Erreur lors de l\'enregistrement de l\'abonnement:', apiError);
        // Continuer même si l'envoi au serveur échoue, car l'abonnement local est valide
      }

      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      localStorage.setItem(this.localStorageKey, 'false');
      return false;
    }
  }

  /**
   * Se désabonne des notifications push
   */
  public async unsubscribe(): Promise<boolean> {
    try {
      const token = localStorage.getItem(this.fcmTokenKey);

      if (!token) {
        localStorage.setItem(this.localStorageKey, 'false');
        return true; // Déjà désabonné
      }

      // Supprimer le token FCM
      try {
        await deleteToken(messaging);
      } catch (error) {
        console.warn('Erreur lors de la suppression du token FCM:', error);
        // Continuer malgré l'erreur, car nous allons informer le serveur
      }

      // Désabonnement du service worker si possible
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
      } catch (swError) {
        console.warn('Erreur lors du désabonnement du service worker:', swError);
      }

      // Informer le serveur
      try {
        await apiClient.post('/notifications/unsubscribe', {
          endpoint: token.startsWith('http') ? token : `https://fcm.googleapis.com/fcm/send/${token}`
        });
      } catch (apiError) {
        console.warn('Erreur lors de l\'information du serveur de désabonnement:', apiError);
      }

      // Supprimer le token du stockage local
      localStorage.removeItem(this.fcmTokenKey);
      localStorage.setItem(this.localStorageKey, 'false');

      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }

  /**
   * Vérifie l'état de l'abonnement
   */
  public async getSubscriptionStatus(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      // Vérifier d'abord dans localStorage si les notifications sont activées
      const enabled = localStorage.getItem(this.localStorageKey) === 'true';

      // Si oui, vérifier si nous avons un token FCM
      if (enabled) {
        const token = localStorage.getItem(this.fcmTokenKey);
        return !!token;
      }

      return false;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  /**
   * Utilitaire pour convertir une clé base64 en Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
}

export const pushNotificationService = new PushNotificationService();

// Initialiser automatiquement le service
if (typeof window !== 'undefined') {
  pushNotificationService.initialize().catch(error => {
    console.error('Erreur lors de l\'initialisation du service de notification push:', error);
  });
}
