export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'friend_request'
  | 'message'
  | 'reminder'
  | 'water'
  | 'health';
  
  export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    content: string;
    link?: string;
    read: boolean;
    readAt?: string; // Nouvelle propriété optionnelle
    createdAt: string;
    updatedAt?: string;
  }

export interface NotificationPayload {
  type: NotificationType;
  content: string;
  link?: string;
}

export interface NotificationPreferences {
  tasks: boolean;
  water: boolean;
  positiveThoughts: boolean;
  budget: boolean;
  messages: boolean;
}
