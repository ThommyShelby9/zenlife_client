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
  sendMessageWithAttachments: (receiver: string, content: string, files: File[]) => {
    const formData = new FormData();
    formData.append('receiver', receiver);
    formData.append('content', content);

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
