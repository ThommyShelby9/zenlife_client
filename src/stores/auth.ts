// stores/auth.ts - Store mis à jour

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authApi } from '@/api/auth';
import type { User } from '@/types/auth';

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref<string | null>(null);
  const user = ref<User | null>(null);
  const isLoggedIn = ref<boolean>(false);
  const isLoading = ref<boolean>(false);

  // Initialize from localStorage (if available)
  const initializeAuth = () => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        token.value = storedToken;
        isLoggedIn.value = true;
      }
    }
  };

  // Actions
  const setToken = (newToken: string | null) => {
    token.value = newToken;

    if (typeof window !== 'undefined') {
      if (newToken) {
        localStorage.setItem('token', newToken);
      } else {
        localStorage.removeItem('token');
      }
    }
  };

  const setUser = (newUser: User | null) => {
    user.value = newUser;
  };

  const setLoggedIn = (loggedIn: boolean) => {
    isLoggedIn.value = loggedIn;
  };

  const login = async (email: string, password: string) => {
    isLoading.value = true;

    try {
      const response = await authApi.login({ email, password });
      const { token: authToken, user: userData } = response.data;

      setToken(authToken);
      setUser(userData);
      setLoggedIn(true);

      return response.data;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (registerData: {
    fullName: string;
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    isLoading.value = true;

    try {
      const response = await authApi.register(registerData);
      return response.data;
    } finally {
      isLoading.value = false;
    }
  };

  const forgotPassword = async (email: string) => {
    isLoading.value = true;

    try {
      const response = await authApi.forgotPassword({ email });
      return response.data;
    } finally {
      isLoading.value = false;
    }
  };

  const validateResetCode = async (code: string) => {
    isLoading.value = true;

    try {
      const response = await authApi.validateResetCode({ code });
      return response.data;
    } finally {
      isLoading.value = false;
    }
  };

  const resetPassword = async (code: string, password: string) => {
    isLoading.value = true;

    try {
      const response = await authApi.resetPassword({ code, password });
      return response.data;
    } finally {
      isLoading.value = false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    isLoading.value = true;

    try {
      const response = await authApi.changePassword({
        currentPassword,
        newPassword,
      });
      return response.data;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoading.value = true;

    try {
      if (token.value) {
        await authApi.logout();
      }
    } finally {
      setToken(null);
      setUser(null);
      setLoggedIn(false);
      isLoading.value = false;
    }
  };

  const validateToken = async () => {
    if (!token.value) return false;

    try {
      const response = await authApi.validateToken(token.value);
      return response.data.valid;
    } catch {
      setToken(null);
      setUser(null);
      setLoggedIn(false);
      return false;
    }
  };

  // Initialize on store creation
  initializeAuth();

  return {
    // State
    token,
    user,
    isLoggedIn,
    isLoading,

    // Actions
    setToken,
    setUser,
    setLoggedIn,
    login,
    register,
    forgotPassword,
    validateResetCode,
    resetPassword,
    changePassword,
    logout,
    validateToken,
  };
});
