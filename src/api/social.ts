import apiClient from './index';
import type {
  Friend,
  FriendRequest,
  FriendshipResponse,
  User,
  BlockedUser
} from '@/types/social';

export const socialApi = {
  // Amis
  getUserFriends: () => {
    return apiClient.get<Friend[]>('/friends');
  },

  // Recherche d'utilisateurs
  searchUsers: (searchTerm: string) => {
    // Utiliser 'q' comme nom de paramètre pour correspondre à l'attente du backend
    return apiClient.get<User[]>(`/friends/users/search?q=${encodeURIComponent(searchTerm)}`);
  },

  // Demandes d'amis
  getFriendRequests: () => {
    // Combinaison des demandes reçues et envoyées
    return Promise.all([
      apiClient.get<FriendRequest[]>('/friends/requests/pending'),
      apiClient.get<FriendRequest[]>('/friends/requests/sent')
    ]).then(([pending, sent]) => {
      const pendingRequests = pending.data.map(req => ({
        ...req,
        isOutgoing: false
      }));
      const sentRequests = sent.data.map(req => ({
        ...req,
        isOutgoing: true
      }));
      return { data: [...pendingRequests, ...sentRequests] };
    });
  },

  getPendingFriendRequests: () => {
    return apiClient.get<FriendRequest[]>('/friends/requests/pending');
  },

  getSentFriendRequests: () => {
    return apiClient.get<FriendRequest[]>('/friends/requests/sent');
  },

  // Envoyer une demande d'ami
  sendFriendRequest: (userId: string) => {
    return apiClient.post<FriendshipResponse>(`/friends/request/${userId}`);
  },

  // Accepter une demande d'ami
  acceptFriendRequest: (requestId: string) => {
    return apiClient.post<FriendshipResponse>(`/friends/accept/${requestId}`);
  },

  // Rejeter une demande d'ami
  rejectFriendRequest: (requestId: string) => {
    return apiClient.post<FriendshipResponse>(`/friends/reject/${requestId}`);
  },

  // Annuler une demande d'ami envoyée (à implémenter côté backend)
  cancelFriendRequest: (requestId: string) => {
    return apiClient.delete(`/friends/request/${requestId}`);
  },

  // Supprimer un ami
  removeFriend: (friendId: string) => {
    return apiClient.delete(`/friends/remove/${friendId}`);
  },

  // Bloquer un utilisateur
  blockUser: (userId: string) => {
    return apiClient.post<FriendshipResponse>(`/friends/block/${userId}`);
  },

  // Débloquer un utilisateur
  unblockUser: (userId: string) => {
    return apiClient.post<FriendshipResponse>(`/friends/unblock/${userId}`);
  },

  // Obtenir les utilisateurs bloqués (à implémenter côté backend)
  getBlockedUsers: () => {
    return apiClient.get<BlockedUser[]>('/friends/blocked');
  }
};
