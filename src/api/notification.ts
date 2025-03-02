import apiClient from './index';
import type { NotificationPayload } from '@/types/notification';

export const notificationApi = {
  /**
   * Créer une nouvelle notification
   */
  createNotification: (payload: NotificationPayload) => {
    return apiClient.post('/notifications/create', payload);
  },

  /**
   * Récupérer toutes les notifications de l'utilisateur
   */
  getNotifications: () => {
    return apiClient.get('/notifications');
  },

  /**
   * Récupérer les notifications non lues
   */
  getUnreadNotifications: () => {
    return apiClient.get('/notifications/unread');
  },

  /**
   * Compter les notifications non lues
   */
  countUnreadNotifications: () => {
    return apiClient.get('/notifications/count');
  },

  /**
   * Marquer une notification spécifique comme lue
   */
  markAsRead: (notificationId: string) => {
    return apiClient.put(`/notifications/${notificationId}/read`);
  },

  /**
   * Marquer toutes les notifications comme lues
   */
  markAllAsRead: () => {
    return apiClient.put('/notifications/read-all');
  },

  /**
   * Supprimer une notification spécifique
   */
  deleteNotification: (notificationId: string) => {
    return apiClient.delete(`/notifications/${notificationId}`);
  }
};
