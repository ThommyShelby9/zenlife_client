import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Notification, NotificationPayload } from '@/types/notification';
import { useToast } from 'vue-toastification';
import { notificationApi } from '@/api/notification';
import websocketService from '@/services/websocketService';
import axios, { AxiosError } from 'axios';




export const useNotificationStore = defineStore('notification', () => {
  // State
  const notifications = ref<Notification[]>([]);
  const isLoading = ref(false);
  const toast = useToast();



  // Computed properties
  const unreadNotifications = computed(() => {
    return notifications.value.filter(notification => !notification.read);
  });

  const unreadCount = computed(() => {
    return unreadNotifications.value.length;
  });

  // WebSocket handlers
  const handleIncomingNotification = (notification: Notification) => {
    // Add notification to the beginning of the list
    notifications.value.unshift(notification);

    // Display a toast notification based on the type
    switch (notification.type) {
      case 'info':
        toast.info(notification.content);
        break;
      case 'success':
        toast.success(notification.content);
        break;
      case 'warning':
        toast.warning(notification.content);
        break;
      case 'error':
        toast.error(notification.content);
        break;
      case 'friend_request':
        toast.info(`Nouvelle demande d'ami: ${notification.content}`);
        break;
      case 'message':
        toast.info(`Nouveau message: ${notification.content}`);
        break;
      case 'reminder':
          // Utiliser toast.warning pour les rappels de tâches
          toast.warning(notification.content, {
            timeout: 10000, // 10 secondes
            closeOnClick: false, // Ne pas fermer au clic
            // Ajouter une icône d'horloge ou une autre icône appropriée si désiré
            icon: true,
          });
        break;
      default:
        toast.info(notification.content);
    }
  };

  const createTaskReminder = async (task: any, minutesLeft: number) => {
    const payload: NotificationPayload = {
      type: 'reminder',
      content: `Rappel: "${task.title}" - Il vous reste ${minutesLeft} minutes avant l'échéance`,
      link: '/planner/today'
    };

    try {
      return await createNotification(payload);
    } catch (error) {
      console.error('Error creating task reminder:', error);
      throw error;
    }
  };
  // Actions
  const getNotifications = async () => {
    isLoading.value = true;
    try {
      const response = await notificationApi.getNotifications();
      notifications.value = response.data;
      return notifications.value;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Impossible de récupérer les notifications');
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const getUnreadNotifications = async () => {
    isLoading.value = true;
    try {
      const response = await notificationApi.getUnreadNotifications();
      const unreadData = response.data;

      // Update only unread notifications
      const unreadIds = new Set(unreadData.map((n: Notification) => n.id));

      // Keep read notifications that aren't in the new data
      notifications.value = [
        ...notifications.value.filter(n => n.read && !unreadIds.has(n.id)),
        ...unreadData
      ];

      return unreadData;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      toast.error('Impossible de récupérer les notifications non lues');
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const countUnreadNotifications = async () => {
    try {
      const response = await notificationApi.countUnreadNotifications();
      return response.data.count;
    } catch (error) {
      console.error('Error counting unread notifications:', error);
      toast.error('Impossible de compter les notifications non lues');
      throw error;
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationApi.markAsRead(notificationId);

      // Update local state
      const index = notifications.value.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        notifications.value[index].read = true;
        notifications.value[index].readAt = new Date().toISOString();
      }

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Impossible de marquer la notification comme lue');
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();

      // Update local state
      notifications.value = notifications.value.map(notification => ({
        ...notification,
        read: true,
        readAt: new Date().toISOString()
      }));

      toast.success('Toutes les notifications ont été marquées comme lues');
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Impossible de marquer toutes les notifications comme lues');
      throw error;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationApi.deleteNotification(notificationId);

      // Update local state
      notifications.value = notifications.value.filter(n => n.id !== notificationId);

      toast.success('Notification supprimée');
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Impossible de supprimer la notification');
      throw error;
    }
  };

  const createNotification = async (payload: NotificationPayload) => {
    try {
      console.log("Création d'une notification:", payload);

      // Vérifier si le token est présent
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Pas de token d'authentification pour créer la notification");
      }

      const response = await notificationApi.createNotification(payload);
      console.log("Réponse du serveur pour la notification:", response.data);

      // Add to local state
      if (response.data && response.data.notification) {
        notifications.value.unshift(response.data.notification);
        console.log("Notification ajoutée localement");
      } else {
        console.warn("Format de réponse inattendu:", response.data);
      }

      return response.data.notification;
    } catch (error: unknown) {
      console.error('Erreur détaillée lors de la création de notification:', error);

      // Vérifier si c'est une erreur Axios
      if (axios.isAxiosError(error)) {
        // C'est une erreur Axios, on peut accéder à ses propriétés spécifiques
        if (error.response) {
          console.error('Réponse d\'erreur:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('Pas de réponse reçue. Requête:', error.request);
        }
      } else if (error instanceof Error) {
        // C'est une erreur JavaScript standard
        console.error('Erreur de configuration:', error.message);
      }

      toast.error('Impossible de créer la notification');
      throw error;
    }
  };

  // Initialize WebSocket connection for notifications
  const initializeNotificationWebSocket = () => {
    // Initialise la connexion WebSocket
    websocketService.init();

    console.log('Notification store initialised for WebSocket notifications');
  };

  return {
    // State
    notifications,
    isLoading,

    // Computed
    unreadNotifications,
    unreadCount,

    // WebSocket handlers
    handleIncomingNotification,
    initializeNotificationWebSocket,

    // Actions
    getNotifications,
    getUnreadNotifications,
    countUnreadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    createTaskReminder
  };
});
