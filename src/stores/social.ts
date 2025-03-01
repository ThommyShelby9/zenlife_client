import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { socialApi } from '@/api/social';
import type { Friend, FriendRequest, User } from '@/types/social';
import websocketService from '@/services/websocketService';
import type { BlockedUser } from '@/types/social'; // Assurez-vous d'importer le type
import type { AxiosError } from 'axios';
import axios from 'axios';
 // Assurez-vous d'importer le type


export const useSocialStore = defineStore('social', () => {
  // State
  const friends = ref<Friend[]>([]);
  const friendRequests = ref<FriendRequest[]>([]);
  const isLoading = ref(false);
  const friendRequestsCount = ref(0);
  const onlineUsers = ref<Set<string>>(new Set());

const blockedUsers = ref<BlockedUser[]>([]);

  // Computed
  const onlineFriendsCount = computed(() => {
    return friends.value.filter(friend => onlineUsers.value.has(friend.id)).length;
  });

  // Actions
  const getFriends = async (): Promise<Friend[]> => {
    isLoading.value = true;
    try {
      const response = await socialApi.getUserFriends();
      friends.value = response.data;

      // Mettre à jour le statut en ligne des amis à partir du cache local
      friends.value.forEach(friend => {
        if (onlineUsers.value.has(friend.id)) {
          friend.online = true;
        }
      });

      return friends.value;
    } catch (error) {
      console.error('Error fetching friends:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const searchUsers = async (query: string): Promise<User[]> => {
    try {
      console.log('Recherche d\'utilisateurs avec:', query);
      const response = await socialApi.searchUsers(query);

      // Assure-toi de retourner directement les données
      // si la structure de la réponse est déjà un tableau
      if (Array.isArray(response.data)) {
        return response.data;
      }

      // Sinon, si la structure est { data: [...] }
      return response.data;
    } catch (error: unknown) {
      console.error('Error searching users:', error);

      // Vérifier si l'erreur est une erreur Axios
      if (axios.isAxiosError(error)) {
        // Maintenant TypeScript sait que c'est une AxiosError
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error('Response error:', axiosError.response.status, axiosError.response.data);
        }
      }

      throw error;
    }
  };

  const getFriendRequests = async (): Promise<FriendRequest[]> => {
    isLoading.value = true;
    try {
      const response = await socialApi.getFriendRequests();
      friendRequests.value = response.data;

      // Mettre à jour le compteur de demandes
      updateFriendRequestCount();

      return friendRequests.value;
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const updateFriendRequestCount = () => {
    // Compter les demandes reçues et en attente
    friendRequestsCount.value = friendRequests.value.filter(
      req => !req.isOutgoing && req.status === 'pending'
    ).length;
  };

  // Traitement des mises à jour de statut utilisateur via WebSocket
  const handleUserStatusUpdate = (statusUpdate: { userId: string, online: boolean }) => {
    // Mettre à jour le cache des utilisateurs en ligne
    if (statusUpdate.online) {
      onlineUsers.value.add(statusUpdate.userId);
    } else {
      onlineUsers.value.delete(statusUpdate.userId);
    }

    // Mettre à jour le statut en ligne des amis
    const friendIndex = friends.value.findIndex(friend => friend.id === statusUpdate.userId);
    if (friendIndex !== -1) {
      friends.value[friendIndex].online = statusUpdate.online;
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      const response = await socialApi.sendFriendRequest(userId);
      return response.data;
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  };

  const respondToFriendRequest = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') {
        const response = await socialApi.acceptFriendRequest(requestId);

        // Mettre à jour la liste d'amis
        await getFriends();

        // Mettre à jour la liste des demandes
        friendRequests.value = friendRequests.value.filter(req => req.id !== requestId);
        updateFriendRequestCount();

        return response.data;
      } else {
        const response = await socialApi.rejectFriendRequest(requestId);

        // Mettre à jour la liste des demandes
        friendRequests.value = friendRequests.value.filter(req => req.id !== requestId);
        updateFriendRequestCount();

        return response.data;
      }
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
      throw error;
    }
  };

  const cancelFriendRequest = async (requestId: string) => {
    try {
      await socialApi.cancelFriendRequest(requestId);

      // Mettre à jour la liste des demandes
      friendRequests.value = friendRequests.value.filter(req => req.id !== requestId);
      updateFriendRequestCount();

      return true;
    } catch (error) {
      console.error('Error canceling friend request:', error);
      throw error;
    }
  };

  const removeFriend = async (friendId: string) => {
    try {
      await socialApi.removeFriend(friendId);

      // Mettre à jour la liste d'amis
      friends.value = friends.value.filter(friend => friend.id !== friendId);

      return true;
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  };

  const blockUser = async (userId: string) => {
    try {
      const response = await socialApi.blockUser(userId);

      // Mettre à jour la liste d'amis si l'ami a été bloqué
      const friendIndex = friends.value.findIndex(friend => friend.id === userId);
      if (friendIndex !== -1) {
        friends.value.splice(friendIndex, 1);
      }

      return response.data;
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  };

  const unblockUser = async (userId: string) => {
    try {
      await socialApi.unblockUser(userId);

      // Mettre à jour la liste des utilisateurs bloqués
      blockedUsers.value = blockedUsers.value.filter((user: any) => user.id !== userId);

      return true;
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  };

  const getBlockedUsers = async () => {
    try {
      const response = await socialApi.getBlockedUsers();
      blockedUsers.value = response.data;
      return blockedUsers.value;
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      throw error;
    }
  };

  // S'abonner aux événements WebSocket pour les statuts utilisateur
  const subscribeToUserStatusUpdates = () => {
    // Assurez-vous que le service websocket est initialisé
    if (!websocketService.isConnected()) {
      websocketService.init();
    }

    // Utiliser la nouvelle méthode publique pour s'abonner aux mises à jour de statut
    websocketService.subscribeToTopic('/topic/user-status', handleUserStatusUpdate);
  };


  // Initialiser
  const initialize = async () => {
    try {
      await Promise.all([
        getFriends(),
        getFriendRequests()
      ]);

      // S'abonner aux mises à jour de statut
      subscribeToUserStatusUpdates();
    } catch (error) {
      console.error('Error initializing social store:', error);
    }
  };

  return {
    // State
    friends,
    friendRequests,
    blockedUsers,
    isLoading,
    friendRequestsCount,
    onlineUsers,

    // Computed
    onlineFriendsCount,

    // Actions
    getFriends,
    searchUsers,
    getFriendRequests,
    updateFriendRequestCount,
    handleUserStatusUpdate,
    sendFriendRequest,
    respondToFriendRequest,
    cancelFriendRequest,
    removeFriend,
    blockUser,
    unblockUser,
    getBlockedUsers,
    subscribeToUserStatusUpdates,
    initialize
  };
});
