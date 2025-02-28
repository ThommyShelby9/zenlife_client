import { defineStore } from 'pinia';
import { ref } from 'vue';
import { socialApi } from '@/api/social';
import type { Friend, FriendRequest, User } from '@/types/social';

export const useSocialStore = defineStore('social', () => {
  // State
  const friends = ref<Friend[]>([]);
  const friendRequests = ref<FriendRequest[]>([]);
  const blockedUsers = ref([]);
  const isLoading = ref(false);

  // Actions
  const getFriends = async (): Promise<Friend[]> => {
    isLoading.value = true;
    try {
      const response = await socialApi.getUserFriends();
      friends.value = response.data;
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
      const response = await socialApi.searchUsers(query);
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  };

  const getFriendRequests = async (): Promise<FriendRequest[]> => {
    isLoading.value = true;
    try {
      // Combine pending and sent requests
      const [pendingResponse, sentResponse] = await Promise.all([
        socialApi.getPendingFriendRequests(),
        socialApi.getSentFriendRequests()
      ]);

      // Mark outgoing requests
      const pendingRequests = pendingResponse.data.map(req => ({
        ...req,
        isOutgoing: false
      }));

      const sentRequests = sentResponse.data.map(req => ({
        ...req,
        isOutgoing: true
      }));

      friendRequests.value = [...pendingRequests, ...sentRequests];
      return friendRequests.value;
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      throw error;
    } finally {
      isLoading.value = false;
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

        // Update friends list if accepted
        await getFriends();

        return response.data;
      } else {
        const response = await socialApi.rejectFriendRequest(requestId);
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

      // Update requests list
      friendRequests.value = friendRequests.value.filter(req => req.id !== requestId);

      return true;
    } catch (error) {
      console.error('Error canceling friend request:', error);
      throw error;
    }
  };

  const removeFriend = async (friendId: string) => {
    try {
      await socialApi.removeFriend(friendId);

      // Update friends list
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

      // Update friends list if friend was blocked
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

      // Update blocked users list
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

  // Initialize
  const initialize = async () => {
    try {
      await Promise.all([
        getFriends(),
        getFriendRequests()
      ]);
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

    // Actions
    getFriends,
    searchUsers,
    getFriendRequests,
    sendFriendRequest,
    respondToFriendRequest,
    cancelFriendRequest,
    removeFriend,
    blockUser,
    unblockUser,
    getBlockedUsers,
    initialize
  };
});
