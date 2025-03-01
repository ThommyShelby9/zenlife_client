
export interface NotificationPreferences {
  tasks: boolean;
  water: boolean;
  positiveThoughts: boolean;
  budget: boolean;
  messages: boolean;
}

export interface Notification {
  id: string;
  type: string;
  content: string;
  link?: string;
  createdAt: string;
  read: boolean;
  readAt?: string;
  // Données additionnelles spécifiques au type de notification
  sender?: UserInfo;
  friendship?: FriendshipInfo;
  // Autres propriétés possibles
  [key: string]: any;
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

export interface NotificationPayload {
  type: string;
  content: string;
  link?: string;
  additionalData?: {
    [key: string]: any;
  };
}

// Constantes pour les types de notification liés aux amitiés
export const NotificationType = {
  FRIEND_REQUEST: 'FRIEND_REQUEST',
  FRIEND_ACCEPTED: 'FRIEND_ACCEPTED',
  FRIEND_REJECTED: 'FRIEND_REJECTED',
  FRIEND_REMOVED: 'FRIEND_REMOVED',
  FRIEND_BLOCKED: 'FRIEND_BLOCKED',
  FRIEND_UNBLOCKED: 'FRIEND_UNBLOCKED',
  // Autres types existants...
  WATER_REMINDER: 'WATER_REMINDER',
  WATER_PROGRESS: 'WATER_PROGRESS',
  REMINDER: 'reminder',
  MESSAGE: 'message',
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};
