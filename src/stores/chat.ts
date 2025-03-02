import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { chatApi } from '@/api/chat';
import { fileApi } from '@/api/file';
import { useUserStore } from './user';
import { useToast } from 'vue-toastification';
import websocketService from '@/services/websocketService';
import type { User } from '@/types/auth';

// Importation des types depuis le fichier de types
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
  durationSeconds?: number; // Pour les notes vocales
  createdAt?: string;
}

export interface VoiceNote extends FileAttachment {
  durationSeconds: number;
}

export interface ChatConversation {
  contact: ChatContact;
  messages: ChatMessage[];
}

// Types spécifiques au composant
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
}

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
      contacts.value[contactIndex].lastMessage = {
        content: message.content,
        timestamp: message.timestamp,
        isLastMessageFromMe: false
      };
      contacts.value[contactIndex].unreadCount =
        (contacts.value[contactIndex].unreadCount || 0) + 1;

      // Mettre à jour les indicateurs d'attachements
      if (message.attachments && message.attachments.length > 0) {
        contacts.value[contactIndex].hasAttachments = true;
        contacts.value[contactIndex].attachmentsCount = message.attachments.length;
        // Vérifier s'il y a une note vocale
        contacts.value[contactIndex].isVoiceNote = message.attachments.some(
          a => a.durationSeconds !== undefined
        );
      }
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

      // S'assurer que tous les contacts ont les valeurs par défaut pour online et unreadCount
      contacts.value = contacts.value.map(contact => ({
        ...contact,
        online: contact.online || false,
        unreadCount: contact.unreadCount || 0
      }));

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

  const sendMessage = async (messagePayload: ChatMessagePayload) => {
    try {
      const response = await chatApi.sendMessage(messagePayload);

      // Récupérer l'utilisateur actuel
      const userStore = useUserStore();

      // Vérification explicite de l'utilisateur
      if (!userStore.user) {
        throw new Error('Utilisateur non connecté');
      }

      // Obtenir l'ID du destinataire
      const receiverId = typeof messagePayload.receiver === 'object'
        ? messagePayload.receiver.id
        : messagePayload.receiver;

      // Créer le nouveau message pour l'affichage
      const newMessage: Message = {
        id: response.data.messageId,
        content: messagePayload.content,
        sender: {
          id: userStore.user.id,
          fullName: userStore.user.fullName,
          profilePictureUrl: userStore.user.profilePictureUrl
        },
        receiver: { id: receiverId },
        timestamp: new Date().toISOString(),
        read: false
      };

      // Initialiser la conversation si nécessaire
      if (!conversations.value[receiverId]) {
        conversations.value[receiverId] = [];
      }

      conversations.value[receiverId].push(newMessage);

      // Mettre à jour le dernier message du contact
      const contactIndex = contacts.value.findIndex(c => c.id === receiverId);
      if (contactIndex !== -1) {
        contacts.value[contactIndex].lastMessage = {
          content: newMessage.content,
          timestamp: newMessage.timestamp,
          isLastMessageFromMe: true
        };
      }

      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  };

  // Dans sendMessageWithAttachments, assurez-vous que les pièces jointes sont correctement envoyées
  const sendMessageWithAttachments = async (receiverId: string, content: string, files: File[]) => {
    try {
      // Envoyer d'abord le message texte
      const messageResponse = await chatApi.sendMessage({
        receiver: { id: receiverId },
        content: content.trim()
      });

      const messageId = messageResponse.data.messageId;
      console.log('ID du message créé:', messageId);

      // Pour stocker les résultats des téléchargements
      const uploadResults = [];

      // Puis télécharger chaque fichier comme pièce jointe
      for (const file of files) {
        try {
          let result;
          // Envoyer soit comme note vocale, soit comme fichier normal
          if (file.type.startsWith('audio/')) {
            // Pour les notes vocales, calculer la durée approximative
            const durationSeconds = Math.floor(file.size / 10000) + 2;
            result = await fileApi.uploadVoiceNote(file, messageId, durationSeconds);
            console.log('Note vocale envoyée:', file.name);
          } else {
            // Fichier normal
            result = await fileApi.uploadFile(file, messageId);
            console.log('Fichier envoyé:', file.name);
          }
          uploadResults.push(result);
        } catch (fileError) {
          console.error('Erreur lors du téléchargement du fichier:', file.name, fileError);
        }
      }

      // Après avoir téléchargé toutes les pièces jointes, actualiser la conversation
      const conversation = await getConversation(receiverId);

      // Si la dernière opération a réussi, mettre à jour le message dans la conversation locale
      // pour s'assurer que les pièces jointes sont bien associées au message
      if (conversation && conversation.length > 0) {
        // Trouver le message qui vient d'être envoyé dans la conversation mise à jour
        const updatedMessage = conversation.find((msg: { id: any; }) => msg.id === messageId);
        if (updatedMessage) {
          // Mettre à jour le contenu dans la version locale
          updatedMessage.content = content.trim();

          // Mettre à jour le message dans la conversation locale
          const msgIndex = conversations.value[receiverId]?.findIndex(msg => msg.id === messageId) ?? -1;
          if (msgIndex !== -1 && conversations.value[receiverId]) {
            conversations.value[receiverId][msgIndex] = updatedMessage;
          }
        }
      }

      return uploadResults;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message avec pièces jointes:', error);
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
