export interface Friend {
  id: string;
  fullName: string;
  username?: string;
  email?: string;
  profilePictureUrl?: string;
  online: boolean;
  unreadCount?: number;
}

export interface User {
  id: string;
  fullName: string;
  username?: string;
  email?: string;
  profilePictureUrl?: string;
  friendStatus?: 'none' | 'pending' | 'friend' | 'blocked';
}

export interface FriendRequest {
  id: string;
  sender: User;
  recipient: User;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
  isOutgoing: boolean;
}

export interface BlockedUser {
  id: string;
  fullName: string;
  username?: string;
  email?: string;
  profilePictureUrl?: string;
  blockedAt: string;
}

export interface FriendshipResponse {
  status: string;
  message: string;
  friendship?: {
    id: string;
    senderId: string;
    recipientId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface SearchUsersResponse {
  users: User[];
}

export interface FriendRequestsResponse {
  requests: FriendRequest[];
}

export interface FriendsResponse {
  friends: Friend[];
}
