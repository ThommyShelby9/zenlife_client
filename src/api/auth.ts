import apiClient from './index';
import type { RegisterPayload, LoginPayload, ForgotPasswordPayload, ChangePasswordPayload } from '@/types/auth';

export const authApi = {
  /**
   * Register a new user
   */
  register: (payload: RegisterPayload) => {
    return apiClient.post('/auth/register', payload);
  },

  /**
   * Login user
   */
  login: (payload: LoginPayload) => {
    return apiClient.post('/auth/login', payload);
  },

  /**
   * Logout user
   */
  logout: () => {
    return apiClient.post('/auth/logout');
  },

  /**
   * Verify email with token
   */
  verifyEmail: (token: string) => {
    console.log('Appel à verifyEmail avec token:', token);
    return apiClient.post(`/auth/verify-email/${token}`);
  },

  /**
   * Resend verification email
   */
  resendVerification: (email: string) => {
    return apiClient.post('/auth/resend-verification', { email });
  },

  /**
   * Request password reset email
   */
  forgotPassword: (payload: ForgotPasswordPayload) => {
    return apiClient.post('/auth/forgot-password', payload);
  },

  /**
   * Reset password with token
   */
  resetPassword: (payload: { token: string, newPassword: string }) => {
    return apiClient.post(`/auth/reset-password/${payload.token}`, { newPassword: payload.newPassword });
  },

  /**
   * Change user password
   */
  changePassword: (payload: ChangePasswordPayload) => {
    return apiClient.post('/auth/change-password', payload);
  },

  /**
   * Validate JWT token
   */
  validateToken: (token: string) => {
    return apiClient.post('/auth/validate-token', { token });
  },
};
