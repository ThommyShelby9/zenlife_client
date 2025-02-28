import apiClient from './index';

export const userApi = {
  /**
   * Get current user profile
   */
  getCurrentUser: () => {
    return apiClient.get('/users/me');
  },

  /**
   * Get user by ID
   */
  getUserById: (userId: string) => {
    return apiClient.get(`/users/${userId}`);
  },

  /**
   * Search users
   */
  searchUsers: (query: string) => {
    return apiClient.get('/users/search', { params: { query } });
  },

  /**
   * Update user profile
   */
  updateProfile: (profileData: {
    fullName?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
  }) => {
    return apiClient.put('/users/profile', profileData);
  },

  /**
   * Update profile picture
   */
  updateProfilePicture: (formData: FormData) => {
    return apiClient.post('/users/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Update theme preference
   */
  updateThemePreference: (data: { themePreference: string }) => {
    return apiClient.post('/users/theme-preference', data);
  },

  /**
   * Update notification preferences
   */
  updateNotificationPreferences: (data: { notificationPreferences: string }) => {
    return apiClient.post('/users/notify-preferences', data);
  },

  /**
   * Deactivate account
   */
  deactivateAccount: () => {
    return apiClient.post('/users/deactivate');
  },

  /**
   * Request account reactivation
   */
  reactivateAccount: (data: { email: string }) => {
    return apiClient.post('/users/reactivate', data);
  },
};
