// src/services/deviceService.ts
// Importez chaque plugin séparément
import { Share } from '@capacitor/share';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Geolocation } from '@capacitor/geolocation';

export const deviceService = {
  async shareContent(options: { title: string; text: string; url?: string }) {
    try {
      await Share.share(options);
      return true;
    } catch (error) {
      console.error('Error sharing content:', error);
      return false;
    }
  },

  async scheduleNotification(notification: {
    title: string;
    body: string;
    id: number;
    schedule?: { at: Date };
  }) {
    return await LocalNotifications.schedule({
      notifications: [notification]
    });
  },

  async getCurrentPosition() {
    return await Geolocation.getCurrentPosition();
  }
};
