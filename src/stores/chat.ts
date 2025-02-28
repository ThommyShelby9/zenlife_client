import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { chatApi } from '@/api/chat';
import { fileApi } from '@/api/file';
import { useUserStore } from './user';
import { useToast } from 'vue-toastification';
import websocketService from '@/services/websocketService';
import type { Message, Contact } from '@/types/chat';

// Définition des types
// Dans votre fichier de types chat.ts


export const useChatStore = defineStore('chat', () => {
  // State
  const contacts = ref<Contact[]>([]);
  const conversations = ref<Record<string, Message[]>>({});
  const isLoading = ref(false);
  const toast = useToast();

  // Getters
  const getContactById = computed(() => {
    return (id: string) => contacts.value.find(contact => contact.id === id);
  });

  const getConversationMessages = computed(() => {
    return (contactId: string) => conversations.value[contactId] || [];
  });

  const hasUnreadMessages = computed(() => {
    return contacts.value.some(contact => contact.unreadCount > 0);
  });

  const totalUnreadCount = computed(() => {
    return contacts.value.reduce((count, contact) => count + (contact.unreadCount || 0), 0);
  });

  // WebSocket management
  const handleIncomingMessage = (message: Message) => {
    const senderId = message.sender.id;

    // Initialiser la conversation si elle n'existe pas
    if (!conversations.value[senderId]) {
      conversations.value[senderId] = [];
    }

    // Ajouter le message à la conversation
    conversations.value[senderId].push(message);

    // Mettre à jour le dernier message et le nombre de messages non lus
    const contactIndex = contacts.value.findIndex(c => c.id === senderId);
    if (contactIndex !== -1) {
      contacts.value[contactIndex].lastMessage = message;
      contacts.value[contactIndex].unreadCount =
        (contacts.value[contactIndex].unreadCount || 0) + 1;
    }

    // Afficher une notification toast
    const userStore = useUserStore();
    if (userStore.user && message.sender.id !== userStore.user.id) {
      toast.info(`Nouveau message de ${message.sender.fullName}`);
    }
  };

  const handleMessageRead = (messageId: string, readAt: string) => {
    Object.keys(conversations.value).forEach(contactId => {
      const messageIndex = conversations.value[contactId].findIndex(
        (m: Message) => m.id === messageId
      );
      if (messageIndex !== -1) {
        conversations.value[contactId][messageIndex].read = true;
        conversations.value[contactId][messageIndex].readAt = readAt;
      }
    });
  };

  const handleConversationRead = (userId: string) => {
    if (conversations.value[userId]) {
      const userStore = useUserStore();
      conversations.value[userId].forEach((message: Message) => {
        if (userStore.user && message.sender.id === userStore.user.id) {
          message.read = true;
          message.readAt = new Date().toISOString();
        }
      });
    }

    // Mettre à jour le nombre de messages non lus
    const contactIndex = contacts.value.findIndex(c => c.id === userId);
    if (contactIndex !== -1) {
      contacts.value[contactIndex].unreadCount = 0;
    }
  };

  // Actions
  const loadContacts = async () => {
    isLoading.value = true;
    try {
      const response = await chatApi.getContacts();
      contacts.value = response.data;
      return contacts.value;
    } catch (error) {
      console.error('Error loading contacts:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const getConversation = async (contactId: string) => {
    try {
      const response = await chatApi.getConversation(contactId);
      conversations.value[contactId] = response.data;

      // Mark messages as read through WebSocket
      markConversationAsRead(contactId);

      return response.data;
    } catch (error) {
      console.error(`Error fetching conversation with ${contactId}:`, error);
      throw error;
    }
  };

  const sendMessage = async (message: { receiver: { id: string }, content: string }) => {
    try {
      const response = await chatApi.sendMessage(message);

      // Récupérer l'utilisateur actuel
      const userStore = useUserStore();

      // Vérification explicite de l'utilisateur
      if (!userStore.user) {
        throw new Error('Utilisateur non connecté');
      }

      const sender = {
        id: userStore.user.id,
        fullName: userStore.user.fullName,
        profilePictureUrl: userStore.user.profilePictureUrl
      };

      // Créer le nouveau message
      const newMessage: Message = {
        id: response.data.messageId,
        content: message.content,
        sender,
        receiver: { id: message.receiver.id },
        timestamp: new Date().toISOString(),
        read: false
      };

      // Initialiser la conversation si nécessaire
      if (!conversations.value[message.receiver.id]) {
        conversations.value[message.receiver.id] = [];
      }

      conversations.value[message.receiver.id].push(newMessage);

      // Mettre à jour le dernier message du contact
      const contactIndex = contacts.value.findIndex(c => c.id === message.receiver.id);
      if (contactIndex !== -1) {
        contacts.value[contactIndex].lastMessage = newMessage;
      }

      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  };
  const sendMessageWithAttachments = async (receiverId: string, content: string, files: File[]) => {
    try {
      // First, send the text message
      const messageResponse = await chatApi.sendMessage({
        receiver: { id: receiverId },
        content: content
      });

      const messageId = messageResponse.data.messageId;

      // Then upload each file as an attachment
      const attachmentPromises = files.map(file => {
        // Check if it's a voice note (audio file)
        if (file.type.startsWith('audio/')) {
          // For voice notes, we need to calculate duration
          const durationSeconds = Math.floor(file.size / 10000) + 2;
          return fileApi.uploadVoiceNote(file, messageId, durationSeconds);
        } else {
          // Regular file attachment
          return fileApi.uploadFile(file, messageId);
        }
      });

      await Promise.all(attachmentPromises);

      // After uploading all attachments, refresh the conversation
      await getConversation(receiverId);

      return { messageId };
    } catch (error) {
      console.error('Error sending message with attachments:', error);
      throw error;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await chatApi.markAsRead(messageId);

      // Update message read status in all conversations
      Object.keys(conversations.value).forEach(contactId => {
        const messageIndex = conversations.value[contactId].findIndex(
          (m: Message) => m.id === messageId
        );
        if (messageIndex !== -1) {
          conversations.value[contactId][messageIndex].read = true;
        }
      });
    } catch (error) {
      console.error(`Error marking message ${messageId} as read:`, error);
      throw error;
    }
  };

  const markConversationAsRead = async (contactId: string) => {
    try {
      await chatApi.markConversationAsRead(contactId);

      // Update unread count for contact
      const contactIndex = contacts.value.findIndex(c => c.id === contactId);
      if (contactIndex !== -1) {
        contacts.value[contactIndex].unreadCount = 0;
      }

      // Mark all messages as read in conversation
      if (conversations.value[contactId]) {
        conversations.value[contactId].forEach((message: Message) => {
          message.read = true;
        });
      }
    } catch (error) {
      console.error(`Error marking conversation with ${contactId} as read:`, error);
      throw error;
    }
  };

  // Initialize WebSocket connection
  const initializeWebSocket = () => {
    websocketService.init();
  };

  return {
    // State
    contacts,
    conversations,
    isLoading,

    // Getters
    getContactById,
    getConversationMessages,
    hasUnreadMessages,
    totalUnreadCount,

    // WebSocket handlers
    handleIncomingMessage,
    handleMessageRead,
    handleConversationRead,
    initializeWebSocket,

    // Actions
    loadContacts,
    getConversation,
    sendMessage,
    sendMessageWithAttachments,
    markAsRead,
    markConversationAsRead
  };
});
