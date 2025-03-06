import apiClient from './index';
import type { ChatMessagePayload } from '@/types/chat';

export const chatApi = {
  /**
   * Send a chat message
   */
  sendMessage: (payload: ChatMessagePayload) => {
    return apiClient.post('/send/chat', payload);
  },

  /**
   * Send a chat message with attachments
   */
  sendMessageWithAttachments: (receiver: string, content: string, files: File[], replyToMessageId?: string) => {
    const formData = new FormData();
    formData.append('receiver', receiver);
    formData.append('content', content);

    // Ajouter replyToMessageId s'il est présent
    if (replyToMessageId) {
      formData.append('replyToMessageId', replyToMessageId);
    }

    // Append each file to formData
    files.forEach(file => {
      formData.append('files', file);
    });

    return apiClient.post('/send/chat/with-attachments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Upload a voice note
   */
  uploadVoiceNote: (file: File, messageId: string, durationSeconds: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('messageId', messageId);
    formData.append('durationSeconds', durationSeconds.toString());

    return apiClient.post('/files/voice-note', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Upload a regular file attachment
   */
  uploadFile: (file: File, messageId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('messageId', messageId);

    return apiClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Get conversation with a specific user
   */
  getConversation: (otherUserId: string) => {
    return apiClient.get(`/chat/conversation/${otherUserId}`);
  },

  /**
   * Mark a message as read
   */
  markAsRead: (messageId: string) => {
    return apiClient.post(`/chat/messages/${messageId}/read`);
  },

  /**
   * Mark all messages in a conversation as read
   */
  markConversationAsRead: (senderId: string) => {
    return apiClient.post(`/chat/conversations/${senderId}/read`);
  },

  /**
   * Get user's chat contacts
   */
  getContacts: () => {
    return apiClient.get('/chat/contacts');
  },
};
