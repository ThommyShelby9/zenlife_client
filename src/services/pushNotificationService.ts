// src/services/pushNotificationService.ts
import { useToast } from 'vue-toastification';
import apiClient from '@/api/index';
import { messaging } from '@/firebase/config';
import { getToken, onMessage, deleteToken } from 'firebase/messaging';

export class PushNotificationService {
  private toast = useToast();
  private isInitialized = false;
  private localStorageKey = 'push_notifications_enabled';

  constructor() {
    if (this.isSupported()) {
      // Gestion des messages en premier plan
      onMessage(messaging, (payload) => {
        console.log('Message reçu en premier plan:', payload);

        // Afficher un toast pour les notifications en premier plan
        if (payload.notification) {
          this.toast.info(`${payload.notification.title}: ${payload.notification.body}`, {
            timeout: 10000,
            closeOnClick: false
          });
        }
      });
    }
  }

  private isLocalDevelopment(): boolean {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }

  // Vérifier si les notifications push sont supportées
  public isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // Initialiser le service de notification push
  public async initialize(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Push notifications are not supported by this browser');
      return false;
    }

    if (this.isInitialized) {
      return true;
    }

    try {
      // Attendre que le service worker soit prêt
      await navigator.serviceWorker.ready;

      // Vérifier l'état sauvegardé dans localStorage
      const enabled = localStorage.getItem(this.localStorageKey) === 'true';

      // Si les notifications sont activées selon localStorage, vérifier le token
      if (enabled) {
        const currentToken = localStorage.getItem('fcm_token');

        if (!currentToken) {
          // Si le token n'existe pas mais que les notifications sont censées être activées,
          // essayer de s'abonner à nouveau
          await this.requestPermissionAndSubscribe();
        }
      }

      this.isInitialized = true;
      return await this.getSubscriptionStatus();
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return false;
    }
  }

  // Demander la permission et s'abonner
  public async requestPermissionAndSubscribe(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        const success = await this.subscribe();

        // Sauvegarder l'état dans localStorage
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

  // S'abonner aux notifications push
  private async subscribe(): Promise<boolean> {
    try {
      if (this.isLocalDevelopment()) {
        console.log('Environnement local détecté - simulation d\'un abonnement aux notifications');
        localStorage.setItem('fcm_token', 'local-dev-token');
        localStorage.setItem(this.localStorageKey, 'true');
        return true;
      }
      // Récupérer la clé VAPID du serveur
      const response = await apiClient.get('/notifications/public-key');
      const vapidKey = response.data.publicKey;

      if (!vapidKey) {
        console.error('No public key available');
        return false;
      }

      // Obtenir le token FCM
      const currentToken = await getToken(messaging, { vapidKey });

      if (!currentToken) {
        console.error('No FCM token received');
        return false;
      }

      // Sauvegarder le token localement
      localStorage.setItem('fcm_token', currentToken);
      localStorage.setItem(this.localStorageKey, 'true');

      // Créer l'objet d'abonnement au format attendu par le serveur
      const subscription = {
        endpoint: `https://fcm.googleapis.com/fcm/send/${currentToken}`,
        keys: {
          p256dh: 'FCM-key', // Valeur placeholder
          auth: 'FCM-auth'   // Valeur placeholder
        }
      };

      // Envoyer l'abonnement au serveur
      await apiClient.post('/notifications/subscribe', subscription);

      this.toast.success('Notifications activées sur cet appareil');
      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      localStorage.setItem(this.localStorageKey, 'false');

      // Message d'erreur plus explicite
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        this.toast.error('Notification bloquée par le navigateur. Vérifiez les paramètres de votre navigateur.');
      } else {
        this.toast.error('Erreur lors de l\'activation des notifications');
      }

      return false;
    }
  }

  // Se désabonner des notifications push
  public async unsubscribe(): Promise<boolean> {
    try {
      const token = localStorage.getItem('fcm_token');

      if (!token) {
        localStorage.setItem(this.localStorageKey, 'false');
        return true; // Déjà désabonné
      }

      // Supprimer le token FCM
      await deleteToken(messaging);

      // Informer le serveur
      await apiClient.post('/notifications/unsubscribe', {
        endpoint: `https://fcm.googleapis.com/fcm/send/${token}`
      });

      // Supprimer le token du stockage local
      localStorage.removeItem('fcm_token');
      localStorage.setItem(this.localStorageKey, 'false');

      this.toast.success('Notifications désactivées sur cet appareil');
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      this.toast.error('Erreur lors de la désactivation des notifications');
      return false;
    }
  }

  // Vérifier l'état de l'abonnement
  public async getSubscriptionStatus(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      // Vérifier d'abord dans localStorage si les notifications sont activées
      const enabled = localStorage.getItem(this.localStorageKey) === 'true';

      // Si oui, vérifier si nous avons un token FCM
      if (enabled) {
        const token = localStorage.getItem('fcm_token');
        return !!token;
      }

      return false;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  // Utilitaire pour convertir une clé base64 en Uint8Array
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
  pushNotificationService.initialize();
}
