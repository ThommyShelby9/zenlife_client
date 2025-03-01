import { Client, type IFrame, type IStompSocket } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useUserStore } from '@/stores/user';
import { useChatStore } from '@/stores/chat';
import { useNotificationStore } from '@/stores/notification';
import { useToast } from 'vue-toastification';

class WebSocketService {
  private client: Client | null = null;
  private connected: boolean = false;
  private subscriptions: { [key: string]: { id: string, callback: (message: any) => void } } = {};
  private reconnectInterval: number = 5000; // 5 seconds
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;

  // Singleton instance
  private static instance: WebSocketService;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /**
   * Initialize the WebSocket connection
   */
  public init(): void {
    const userStore = useUserStore();
    const toast = useToast();

    if (!userStore.user || !userStore.user.id) {
      console.error('User not authenticated. Cannot initialize WebSocket.');
      return;
    }

    if (this.client) {
      this.disconnect();
    }

    const userId = userStore.user.id;
    const token = localStorage.getItem('token');

    this.client = new Client({
      // Utilisez l'en-tête Authorization standard au lieu de X-Authorization
      connectHeaders: {
        'Authorization': `Bearer ${token}`,
        'userId': userId
      },
      debug: function(str: string) {
        if (import.meta.env.DEV) {
          console.log('STOMP: ' + str);
        }
      },
      reconnectDelay: this.reconnectInterval,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    // CORRECTION : Utilisez le bon chemin pour les WebSockets
    // Ne pas utiliser /api/ws mais simplement /ws
    // L'URL de base doit pointer vers le domaine et le port, sans /api
    const apiBaseUrl = import.meta.env.VITE_APP_API_URL.replace(/\/api$/, '');
    console.log('WebSocket connecting to:', `${apiBaseUrl}/ws`);

    this.client.webSocketFactory = () => {
      return new SockJS(`${apiBaseUrl}/ws`) as unknown as IStompSocket;
    };

    // On connect
    this.client.onConnect = (frame: IFrame) => {
      this.connected = true;
      this.reconnectAttempts = 0;
      console.log('Connected to WebSocket');

      // Subscribe to personal messages
      this.subscribeToPersonalMessages(userId);

      // Subscribe to read receipts
      this.subscribeToReadReceipts(userId);

      // Subscribe to notifications
      this.subscribeToNotifications(userId);

      // Show toast notification
      toast.success('Connecté au service de messages');
    };

    // On WebSocket error
    this.client.onStompError = (frame: IFrame) => {
      console.error('WebSocket Error:', frame);
    };

    // On WebSocket disconnection
    this.client.onWebSocketClose = () => {
      this.connected = false;
      console.log('WebSocket connection closed');

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
      } else {
        this.reconnectAttempts = 0;}
    };

    // Activate the client
    this.client.activate();
  }

  /**
   * Subscribe to personal messages
   */
  private subscribeToPersonalMessages(userId: string): void {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected.');
      return;
    }

    const chatStore = useChatStore();
    const destination = `/user/${userId}/queue/messages`;

    const subscription = this.client.subscribe(destination, (message: { body: string; }) => {
      try {
        const receivedMessage = JSON.parse(message.body);

        // Update chat store with new message
        chatStore.handleIncomingMessage(receivedMessage);

      } catch (e) {
        console.error('Error parsing message', e);
      }
    });

    this.subscriptions['messages'] = {
      id: subscription.id,
      callback: (message) => chatStore.handleIncomingMessage(message)
    };
  }

  /**
   * Subscribe to read receipts
   */
  private subscribeToReadReceipts(userId: string): void {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected.');
      return;
    }

    const chatStore = useChatStore();
    const destination = `/user/${userId}/queue/read-receipts`;

    const subscription = this.client.subscribe(destination, (message: { body: string; }) => {
      try {
        const readReceipt = JSON.parse(message.body);

        // Update chat store with read receipt
        if (readReceipt.messageId) {
          chatStore.handleMessageRead(readReceipt.messageId, readReceipt.readAt);
        } else if (readReceipt.conversationRead) {
          chatStore.handleConversationRead(readReceipt.userId);
        }

      } catch (e) {
        console.error('Error parsing read receipt', e);
      }
    });

    this.subscriptions['readReceipts'] = {
      id: subscription.id,
      callback: (message) => {
        if (message.messageId) {
          chatStore.handleMessageRead(message.messageId, message.readAt);
        } else if (message.conversationRead) {
          chatStore.handleConversationRead(message.userId);
        }
      }
    };
  }

  /**
   * Subscribe to notifications
   */
  private subscribeToNotifications(userId: string): void {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected.');
      return;
    }

    const notificationStore = useNotificationStore();
    const destination = `/user/${userId}/queue/notifications`;

    const subscription = this.client.subscribe(destination, (message: { body: string; }) => {
      try {
        const notification = JSON.parse(message.body);

        // Add notification to store
        notificationStore.handleIncomingNotification(notification);

      } catch (e) {
        console.error('Error parsing notification', e);
      }
    });

    this.subscriptions['notifications'] = {
      id: subscription.id,
      callback: (message) => notificationStore.handleIncomingNotification(message)
    };
  }

  /**
   * Disconnect WebSocket
   */
  public disconnect(): void {
    if (this.client) {
      Object.values(this.subscriptions).forEach(sub => {
        if (this.client && this.connected) {
          this.client.unsubscribe(sub.id);
        }
      });

      this.subscriptions = {};
      this.client.deactivate();
      this.client = null;
      this.connected = false;
      console.log('Disconnected from WebSocket');
    }
  }

  /**
   * Send a chat message
   */
  public sendChatMessage(destination: string, message: any): void {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected.');
      return;
    }

    this.client.publish({
      destination: `/app/${destination}`,
      body: JSON.stringify(message),
      headers: {
        'content-type': 'application/json'
      }
    });
  }

  /**
   * Check if WebSocket is connected
   */
  public isConnected(): boolean {
    return this.connected;
  }
}

export default WebSocketService.getInstance();
