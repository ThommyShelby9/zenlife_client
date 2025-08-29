/*  */

// api/auth.ts - Méthodes API mises à jour

import apiClient from './index';
import api from './index';

export interface ForgotPasswordRequest {
  email: string;
}

export interface ValidateResetCodeRequest {
  code: string;
}

export interface ResetPasswordRequest {
  code: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const authApi = {
  login: (data: LoginRequest) => api.post('/auth/login', data),

  register: (data: RegisterRequest) => api.post('/auth/register', data),

  logout: () => api.post('/auth/logout'),

  forgotPassword: (data: ForgotPasswordRequest) => api.post('/auth/forgot-password', data),

  validateResetCode: (data: ValidateResetCodeRequest) => api.post('/auth/validate-reset-code', data),

  resetPassword: (data: ResetPasswordRequest) => api.post('/auth/reset-password', data),

  changePassword: (data: UpdatePasswordRequest) => api.post('/auth/change-password', data),

  validateToken: (token: string) => api.post('/auth/validate-token', { token }),

  getCurrentUser: () => api.get('/auth/me'),

  refreshToken: () => api.post('/auth/refresh'),

    verifyEmail: (token: string) => {
    console.log('Appel à verifyEmail avec token:', token);
    return apiClient.post(`/auth/verify-email/${token}`);
  },
};
