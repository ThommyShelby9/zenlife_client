import apiClient from './index';
import type {
  Friend,
  FriendRequest,
  FriendshipResponse,
  User,
  SearchUsersResponse
} from '@/types/social';

export const socialApi = {
  // Amis
  getUserFriends: () => {
    return apiClient.get<Friend[]>('/friends');
  },

  // Recherche d'utilisateurs
  searchUsers: (query: string) => {
    return apiClient.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
  },

  // Demandes d'amis
  getFriendRequests: () => {
    return apiClient.get<FriendRequest[]>('/friends/requests');
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

  // Annuler une demande d'ami envoyée
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

  // Obtenir les utilisateurs bloqués
  getBlockedUsers: () => {
    return apiClient.get('/friends/blocked');
  }
};
