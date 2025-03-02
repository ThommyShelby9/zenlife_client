import type { User } from './auth';

// Types pour les messages
export interface ChatMessage {
  id?: string;
  sender: User;
  receiver: User;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: FileAttachment[];
}

// types/chat.ts
export type ChatMessagePayload = {
  receiver: { id: string };
  content: string;
  attachments?: Array<{
    id: string;
    type: 'FILE' | 'VOICE_NOTE';
    url: string;
    metadata: {
      duration?: number;
      size: number;
      mimeType: string;
    };
  }>;
};

// Types pour les contacts
export interface ChatContact {
  id: string;
  fullName: string;
  username?: string;
  profilePictureUrl?: string;
  online: boolean;
  lastMessage?: ChatMessage;
  unreadCount: number;
}

// Types pour les pièces jointes
export interface FileAttachment {
  url: any;
  storagePath: string;
  id: string;
  messageId: string;
  filename: string;
  originalFilename?: string;
  size?: number;
  contentType?: string;
  durationSeconds?: number; // Pour les notes vocales
  createdAt?: string;
  fileSize?: number;
}

export interface VoiceNote extends FileAttachment {
  durationSeconds: number;
}

export interface ChatConversation {
  contact: ChatContact;
  messages: ChatMessage[];
}

// Types utilisés dans les composants
export interface Contact {
  id: string;
  fullName: string;
  username?: string;
  email?: string;
  profilePictureUrl?: string;
  lastMessage?: {
    content: string;
    timestamp: string;
    isLastMessageFromMe?: boolean;
  };
  online: boolean;
  unreadCount: number;
  isVoiceNote?: boolean;
  hasAttachments?: boolean;
  attachmentsCount?: number;
}

export interface Message {
  senderId: string;
  tempSide: string;
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
  attachments?: FileAttachment[];
  isLastMessageFromMe?: boolean;
  isFromCurrentUser?: boolean;
}
