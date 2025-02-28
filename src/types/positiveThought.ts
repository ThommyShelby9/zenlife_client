// PositiveThought-related types
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
  frequency: 'hourly' | 'daily' | 'custom';
  customInterval?: number; // in minutes
  preferredCategories?: string[];
  notificationEnabled: boolean;
  displayOnLockScreen?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
