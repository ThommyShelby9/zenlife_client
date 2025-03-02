
export interface NotificationPreferences {
  tasks: boolean;
  water: boolean;
  positiveThoughts: boolean;
  budget: boolean;
  messages: boolean;
}

export interface UserInfo {
  id: string;
  fullName: string;
  username?: string;
  profilePictureUrl?: string;
}

export interface FriendshipInfo {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  acceptedAt?: string;
}


// Constantes pour les types de notification liés aux amitiés
// @/types/notification.ts

export interface Notification {
  id: string;
  type: string;
  content: string;
  link?: string;
  createdAt: string;
  read: boolean;
  readAt?: string;
  sender?: {
    id: string;
    fullName: string;
    username?: string;
    profilePictureUrl?: string;
  };
  friendship?: {
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    acceptedAt?: string;
  };
  [key: string]: any;
}

export interface NotificationPayload {
  type: string;
  content: string;
  link?: string;
  additionalData?: {
    [key: string]: any;
  };
}

// Types de notification constants
export const NotificationType = {
  FRIEND_REQUEST: 'FRIEND_REQUEST',
  FRIEND_ACCEPTED: 'FRIEND_ACCEPTED',
  NEW_MESSAGE: 'NEW_MESSAGE',
  NEW_VOICE_NOTE: 'NEW_VOICE_NOTE',
  WATER_REMINDER: 'WATER_REMINDER',
  WATER_PROGRESS: 'WATER_PROGRESS',
  REMINDER: 'reminder',
  MESSAGE: 'message',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
}
