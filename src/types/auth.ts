/* eslint-disable @typescript-eslint/no-explicit-any */
// Auth-related types
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
  firstName: string; // Ajout du prénom comme propriété optionnelle
  lastName: string;  // Ajout du nom comme propriété optionnelle
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Dans @/types/auth.ts, étendez l'interface User

export interface User {
  userDisplayName: any;
  id: string;
  fullName: string;
  firstName?: string;  // Ajouté pour correspondre au backend
  lastName?: string;   // Ajouté pour correspondre au backend
  username: string;
  email: string;
  profilePictureUrl?: string;
  isVerified: boolean;
  bio?: string;        // Ajouté pour correspondre au backend
  dailyWaterGoalML?: number; // Ajouté pour correspondre au backend
  themePreference?: string;
  notificationPreferences?: string;
  enabled?: boolean;   // Ajouté pour correspondre au backend
  createdAt: string;
  updatedAt: string;
}

// Interface pour UpdateUserRequest
export interface UpdateUserRequest {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  dailyWaterGoalML?: number;
  notificationPreferences?: string;
  themePreference?: string;
  profilePicture?: File;  // Pour l'upload de fichier
}
