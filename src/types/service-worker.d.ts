// Placez ce fichier dans le dossier src/types

interface ExtendedEvent extends Event {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  waitUntil(fn: Promise<any>): void;
}

interface FetchEvent extends ExtendedEvent {
  request: Request;
  respondWith(response: Promise<Response> | Response): void;
}

interface InstallEvent extends ExtendedEvent {
  activeWorker: ServiceWorker;
}

type ActivateEvent = ExtendedEvent

interface PushEvent extends ExtendedEvent {
  data?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json(): any;
    text(): string;
    arrayBuffer(): ArrayBuffer;
  };
}

interface NotificationEvent extends ExtendedEvent {
  notification: Notification & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    close(): void;
  };
}

interface SyncEvent extends ExtendedEvent {
  tag: string;
}

interface NotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
  renotify?: boolean;
  actions?: NotificationAction[];
  image?: string;
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

interface ServiceWorkerGlobalScope extends WorkerGlobalScope {
  skipWaiting(): Promise<void>;
  clients: Clients;
  registration: ServiceWorkerRegistration;
  addEventListener(event: 'install', handler: (event: InstallEvent) => void): void;
  addEventListener(event: 'activate', handler: (event: ActivateEvent) => void): void;
  addEventListener(event: 'fetch', handler: (event: FetchEvent) => void): void;
  addEventListener(event: 'push', handler: (event: PushEvent) => void): void;
  addEventListener(event: 'notificationclick', handler: (event: NotificationEvent) => void): void;
  addEventListener(event: 'sync', handler: (event: SyncEvent) => void): void;
}

interface Clients {
  claim(): Promise<void>;
  get(id: string): Promise<Client>;
  matchAll(options?: { includeUncontrolled?: boolean; type?: 'window' | 'worker' | 'sharedworker' | 'all' }): Promise<Client[]>;
  openWindow(url: string): Promise<Client>;
}

interface Client {
  id: string;
  url: string;
  focus(): Promise<Client>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postMessage(message: any): void;
}

interface ServiceWorkerRegistration {
  showNotification(title: string, options?: NotificationOptions): Promise<void>;
  active: ServiceWorker | null;
  installing: ServiceWorker | null;
  waiting: ServiceWorker | null;
}

// Redéfinir self pour le contexte de Service Worker
declare let self: ServiceWorkerGlobalScope;
