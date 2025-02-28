import type { User } from './auth';

export interface ChatMessage {
  id?: string;
  sender: User;
  receiver: User;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: FileAttachment[];
}

export interface ChatMessagePayload {
  receiver: User | { id: string };
  content: string;
}

export interface ChatContact {
  id: string;
  fullName: string;
  username?: string;
  profilePictureUrl?: string;
  online: boolean;
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export interface FileAttachment {
  id: string;
  messageId: string;
  filename: string;
  originalFilename?: string;
  size?: number;
  contentType?: string;
  durationSeconds?: number; // For voice notes
  createdAt?: string;
}

export interface VoiceNote extends FileAttachment {
  durationSeconds: number;
}

export interface ChatConversation {
  contact: ChatContact;
  messages: ChatMessage[];
}

// Dans votre fichier de types chat.ts
// Dans @/types/chat.ts
export interface Contact {
  id: string;
  fullName: string;
  username?: string;
  profilePictureUrl?: string;
  unreadCount: number;
  lastMessage?: Message;
  online?: boolean; // Ajoutez cette propriété optionnelle
}

// Dans @/types/chat.ts
export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    fullName: string;
    profilePictureUrl?: string;
  };
  receiver: { id: string };
  timestamp: string;
  read: boolean;
  readAt?: string;
  attachments?: FileAttachment[]; // Ajoutez cette propriété
}
