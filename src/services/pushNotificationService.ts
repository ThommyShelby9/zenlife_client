// src/services/pushNotificationService.ts
import { useNotificationStore } from '@/stores/notification';

export class PushNotificationService {
  private notificationStore = useNotificationStore();

  async initialize() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        return true; // Already subscribed
      }

      return this.requestPermission();
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return false;
    }
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        return this.subscribe();
      } else {
        console.log('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async subscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;

      // Get the server's public key
      const response = await fetch('/api/notifications/public-key');
      const { publicKey } = await response.json();

      // Subscribe the user
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(publicKey)
      });

      // Send subscription to server
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ subscription })
      });

      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return false;
    }
  }

  private urlBase64ToUint8Array(base64String: string) {
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
