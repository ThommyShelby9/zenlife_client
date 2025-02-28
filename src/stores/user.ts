import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types/auth';
import { userApi } from '@/api/user';
import { fileApi } from '@/api/file';

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null);
  const isLoading = ref(false);

  // Actions
  const fetchCurrentUser = async () => {
    isLoading.value = true;
    try {
      const response = await userApi.getCurrentUser();
      user.value = response.data;
      return user.value;
    } catch (error) {
      console.error('Error fetching current user:', error);

      // Fall back to localStorage if API fails
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        user.value = JSON.parse(storedUser);
      }

      return user.value;
    } finally {
      isLoading.value = false;
    }
  };

  const getUserById = async (userId: string) => {
    isLoading.value = true;
    try {
      const response = await userApi.getUserById(userId);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${userId}:`, error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const searchUsers = async (query: string) => {
    if (query.length < 3) {
      return [];
    }

    isLoading.value = true;
    try {
      const response = await userApi.searchUsers(query);
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const updateProfile = async (profileData: {
    fullName?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
  }) => {
    isLoading.value = true;
    try {
      const response = await userApi.updateProfile(profileData);

      // Update local user state
      if (response.data.user) {
        user.value = response.data.user;

        // Update localStorage
        localStorage.setItem('user', JSON.stringify(user.value));
      }

      return response.data.user;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const updateProfilePicture = async (file: File) => {
    isLoading.value = true;
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await userApi.updateProfilePicture(formData);

      // Update local user state with new profile picture URL
      if (user.value && response.data.url) {
        user.value.profilePictureUrl = response.data.url;

        // Update localStorage
        localStorage.setItem('user', JSON.stringify(user.value));
      }

      return response.data;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const updateThemePreference = async (theme: string) => {
    try {
      if (!user.value) return null;

      const response = await userApi.updateThemePreference({ themePreference: theme });

      // Update local user state
      if (user.value) {
        user.value.themePreference = theme;

        // Update localStorage
        localStorage.setItem('user', JSON.stringify(user.value));
      }

      return response.data;
    } catch (error) {
      console.error('Error updating theme preference:', error);

      // Update locally even if API fails
      if (user.value) {
        user.value.themePreference = theme;
        localStorage.setItem('user', JSON.stringify(user.value));
      }

      return user.value;
    }
  };

  const updateNotificationPreferences = async (preferences: string) => {
    try {
      if (!user.value) return null;

      const response = await userApi.updateNotificationPreferences({ notificationPreferences: preferences });

      // Update local user state
      if (user.value) {
        user.value.notificationPreferences = preferences;

        // Update localStorage
        localStorage.setItem('user', JSON.stringify(user.value));
      }

      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);

      // Update locally even if API fails
      if (user.value) {
        user.value.notificationPreferences = preferences;
        localStorage.setItem('user', JSON.stringify(user.value));
      }

      return user.value;
    }
  };

  const deactivateAccount = async () => {
    try {
      const response = await userApi.deactivateAccount();

      // Clear user data
      user.value = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      return response.data;
    } catch (error) {
      console.error('Error deactivating account:', error);
      throw error;
    }
  };

  const requestReactivation = async (email: string) => {
    try {
      const response = await userApi.reactivateAccount({ email });
      return response.data;
    } catch (error) {
      console.error('Error requesting account reactivation:', error);
      throw error;
    }
  };

  return {
    // State
    user,
    isLoading,

    // Actions
    fetchCurrentUser,
    getUserById,
    searchUsers,
    updateProfile,
    updateProfilePicture,
    updateThemePreference,
    updateNotificationPreferences,
    deactivateAccount,
    requestReactivation,
  };
});
