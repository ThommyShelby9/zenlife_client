export interface PositiveThought {
  id?: string;
  content: string;
  author?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPositiveThoughtSetting {
  id?: string;
  userId?: string;
  enabled: boolean;
  frequency: string;
  customInterval?: number;
  preferredCategories: string[];
  notificationEnabled: boolean;
  displayOnLockScreen: boolean;
  pushNotificationsEnabled?: boolean; // Nouveau champ pour les notifications push
  createdAt?: string;
  updatedAt?: string;
}
