/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { openDB, type IDBPDatabase } from 'idb';
import { requestBackgroundSync } from '@/registerServiceWorker';
import apiClient from '@/api/index';
import { useToast } from 'vue-toastification';

// Définition des types
export interface PendingRequest {
  id?: number;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: any;
  timestamp: string;
  retryCount: number;
  entityType?: string; // Le type d'entité concernée (expense, task, etc.)
  entityId?: string;   // L'ID local de l'entité concernée
  lastError?: string;  // La dernière erreur rencontrée
}

export interface SyncResult {
  success: boolean;
  offline: boolean;
  queued: boolean;
  entityId?: string;
  message?: string;
}

const DB_NAME = 'zenlife-offline-db';
const DB_VERSION = 1;
const SYNC_QUEUE = 'pendingRequests';
const ENTITY_STORES = ['water-entries', 'expenses', 'tasks', 'positive-thoughts', 'planner-entries'];
const MAX_RETRY_COUNT = 5;

export class SyncService {
  private db: IDBPDatabase | null = null;
  private initialized = false;
  private toast: any;

  constructor() {
    try {
      this.toast = useToast();
    } catch (error) {
      // Fallback si useToast n'est pas disponible
      this.toast = {
        info: (msg: string) => console.log('[Toast]', msg),
        success: (msg: string) => console.log('[Toast Success]', msg),
        error: (msg: string) => console.error('[Toast Error]', msg)
      };
    }
  }

  /**
   * Initialise la base de données IndexedDB
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Créer les object stores pour chaque entité nécessitant un support hors ligne
          ENTITY_STORES.forEach(storeName => {
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            }
          });

          // Créer l'object store pour les requêtes en attente
          if (!db.objectStoreNames.contains(SYNC_QUEUE)) {
            const store = db.createObjectStore(SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('retryCount', 'retryCount', { unique: false });
            store.createIndex('entityType', 'entityType', { unique: false });
          }
        }
      });

      this.initialized = true;
      console.log('Base de données IndexedDB initialisée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la base de données:', error);
      throw error;
    }
  }

/**
 * Sauvegarde des données localement
 * @param storeName Nom du magasin de données
 * @param data Données à sauvegarder
 */
async saveOfflineData(storeName: string, data: any): Promise<IDBValidKey> {
  await this.ensureInitialized();

  try {
    // Générer un ID temporaire si aucun n'est fourni
    if (!data.id) {
      data.id = `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }

    // Ajouter une indication que c'est une entité hors ligne
    data._offlineCreated = true;
    data._syncPending = true;
    data._timestamp = new Date().toISOString();

    return await this.db!.add(storeName, data);
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde des données dans ${storeName}:`, error);
    throw error;
  }
}


/**
 * Ajoute une requête à la file d'attente de synchronisation
 * @param request La requête à ajouter
 */
async addToSyncQueue(request: PendingRequest): Promise<IDBValidKey> {
  await this.ensureInitialized();

  try {
    // S'assurer que les champs requis sont présents
    if (!request.timestamp) {
      request.timestamp = new Date().toISOString();
    }

    if (request.retryCount === undefined) {
      request.retryCount = 0;
    }

    return await this.db!.add(SYNC_QUEUE, request);
  } catch (error) {
    console.error('Erreur lors de l\'ajout à la file d\'attente de synchronisation:', error);
    throw error;
  }
}
  /**
   * Récupère toutes les requêtes en attente
   */
  async getPendingRequests(): Promise<PendingRequest[]> {
    await this.ensureInitialized();
    return await this.db!.getAll(SYNC_QUEUE);
  }

  /**
   * Supprime une requête de la file d'attente
   * @param id ID de la requête à supprimer
   */
  async clearRequest(id: number): Promise<void> {
    await this.ensureInitialized();
    await this.db!.delete(SYNC_QUEUE, id);
  }

  /**
   * Incrémente le compteur de tentatives pour une requête
   * @param id ID de la requête
   * @param error Erreur rencontrée (optionnel)
   */
  async incrementRetryCount(id: number, error?: any): Promise<void> {
    await this.ensureInitialized();

    const tx = this.db!.transaction(SYNC_QUEUE, 'readwrite');
    const store = tx.objectStore(SYNC_QUEUE);

    const request = await store.get(id);
    if (request) {
      request.retryCount += 1;
      request.lastError = error ? error.message || String(error) : undefined;
      await store.put(request);
    }

    await tx.done;
  }

  /**
   * Récupère toutes les données d'un magasin
   * @param storeName Nom du magasin
   */
  async getAllData(storeName: string): Promise<any[]> {
    await this.ensureInitialized();
    return await this.db!.getAll(storeName);
  }

/**
 * Fonction qui exécute une requête API avec support hors ligne
 * @param apiCall Fonction qui effectue l'appel API
 * @param entityType Type d'entité (expense, task, etc.)
 * @param data Données à envoyer
 * @param options Options supplémentaires
 */
async safeApiCall<T>(
  apiCall: () => Promise<T>,
  entityType: string,
  data: any,
  options: {
    notifyOffline?: boolean;
    method?: string;
    endpoint?: string;
  } = {}
): Promise<T | SyncResult> {
  // S'assurer que la base de données est initialisée
  await this.ensureInitialized();

  // Options par défaut
  const {
    notifyOffline = true,
    method = 'POST',
    endpoint = ''
  } = options;

  try {
    // Essayer l'appel API normal si en ligne
    if (navigator.onLine) {
      return await apiCall();
    } else {
      // Stocker les données localement
      const entityId = await this.saveOfflineData(entityType, data);
      const entityIdString = entityId.toString(); // Convertir en string

      // Préparer l'URL de l'endpoint
      let url = endpoint;
      if (!url.startsWith('http') && !url.startsWith('/')) {
        url = `/${url}`;
      }
      if (!url.startsWith('http') && !url.includes('/api/')) {
        url = `/api${url}`;
      }

      // Construire la requête pour la file d'attente
      const pendingRequest: PendingRequest = {
        url,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: data,
        timestamp: new Date().toISOString(),
        retryCount: 0,
        entityType,
        entityId: entityIdString
      };

      // Ajouter à la file d'attente
      await this.addToSyncQueue(pendingRequest);

      // Demander une synchronisation en arrière-plan
      await requestBackgroundSync('zenlife-sync-queue');

      // Notification
      if (notifyOffline) {
        this.toast.info('Données enregistrées localement. Elles seront synchronisées dès que vous serez en ligne.');
      }

      // Retourner un résultat positif
      return {
        success: true,
        offline: true,
        queued: true,
        entityId: entityIdString,
        message: 'Données enregistrées localement pour synchronisation ultérieure'
      };
    }
  } catch (error: any) {
    console.error('Erreur lors de l\'appel API sécurisé:', error);

    // Si l'erreur est due à une perte de connexion
    if (!navigator.onLine || error.message === 'Network Error') {
      try {
        // Stocker les données localement
        const entityId = await this.saveOfflineData(entityType, data);
        const entityIdString = entityId.toString(); // Convertir en string

        // Préparer la requête pour la file d'attente
        const pendingRequest: PendingRequest = {
          url: endpoint,
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: data,
          timestamp: new Date().toISOString(),
          retryCount: 0,
          entityType,
          entityId: entityIdString
        };

        // Ajouter à la file d'attente
        await this.addToSyncQueue(pendingRequest);

        // Demander une synchronisation en arrière-plan
        await requestBackgroundSync('zenlife-sync-queue');

        // Notification
        if (notifyOffline) {
          this.toast.info('Données enregistrées localement. Elles seront synchronisées dès que vous serez en ligne.');
        }

        return {
          success: true,
          offline: true,
          queued: true,
          entityId: entityIdString,
          message: 'Données enregistrées localement pour synchronisation ultérieure'
        };
      } catch (storageError) {
        console.error('Erreur lors de la sauvegarde locale:', storageError);
        throw storageError;
      }
    }

    // Dans les autres cas d'erreur, relayer normalement
    throw error;
  }
}


  /**
   * Synchronise les données avec le serveur
   */
  async syncWithServer(): Promise<{ success: number; failed: number }> {
    await this.ensureInitialized();

    const pendingRequests = await this.getPendingRequests();
    console.log(`${pendingRequests.length} requêtes en attente de synchronisation`);

    if (pendingRequests.length === 0) {
      return { success: 0, failed: 0 };
    }

    let successCount = 0;
    let failedCount = 0;

    // Récupérer le token d'authentification
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('Impossible de synchroniser: aucun token d\'authentification');
      return { success: 0, failed: pendingRequests.length };
    }

    for (const request of pendingRequests) {
      // Ignorer les requêtes ayant dépassé le nombre maximum de tentatives
      if (request.retryCount >= MAX_RETRY_COUNT) {
        console.warn(`Requête ${request.id} abandonnée après ${request.retryCount} tentatives`);
        if (request.id) await this.clearRequest(request.id);
        failedCount++;
        continue;
      }

      try {
        // Créer les en-têtes avec le token à jour
        const headers = {
          ...request.headers,
          'Authorization': `Bearer ${token}`
        };

        // Exécuter la requête
        const response = await fetch(request.url, {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined
        });

        if (response.ok) {
          console.log(`Requête ${request.id} synchronisée avec succès:`, response.status);
          if (request.id) await this.clearRequest(request.id);
          successCount++;

          // Mettre à jour l'entité locale pour indiquer qu'elle est synchronisée
          if (request.entityType && request.entityId) {
            await this.updateEntitySyncStatus(
              request.entityType,
              request.entityId,
              true
            );
          }
        } else {
          console.error(`Échec de la requête ${request.id}:`, response.status);
          if (request.id) await this.incrementRetryCount(request.id, new Error(`HTTP ${response.status}`));
          failedCount++;
        }
      } catch (error) {
        console.error(`Erreur lors du traitement de la requête ${request.id}:`, error);
        if (request.id) await this.incrementRetryCount(request.id, error);
        failedCount++;
      }
    }

    // Notifier le résultat
    if (failedCount === 0 && successCount > 0) {
      this.toast.success(`${successCount} opération(s) synchronisée(s) avec succès.`);
    } else if (successCount > 0) {
      this.toast.info(`Synchronisation partielle: ${successCount} réussie(s), ${failedCount} en attente.`);
    }

    return { success: successCount, failed: failedCount };
  }

/**
 * Met à jour le statut de synchronisation d'une entité
 */
private async updateEntitySyncStatus(
  entityType: string,
  entityId: string | number,
  synced: boolean
): Promise<void> {
  try {
    const tx = this.db!.transaction(entityType, 'readwrite');
    const store = tx.objectStore(entityType);

    const entity = await store.get(entityId);
    if (entity) {
      entity._syncPending = !synced;
      if (synced) {
        entity._syncedAt = new Date().toISOString();
      }
      await store.put(entity);
    }

    await tx.done;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du statut de synchronisation pour ${entityType}/${entityId}:`, error);
  }
}
  /**
   * S'assure que la base de données est initialisée
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  /**
   * Vérifie si des données sont en attente de synchronisation
   */
  async hasPendingSyncData(): Promise<boolean> {
    await this.ensureInitialized();
    const count = await this.db!.count(SYNC_QUEUE);
    return count > 0;
  }

  /**
   * Récupère le nombre de requêtes en attente
   */
  async getPendingCount(): Promise<number> {
    await this.ensureInitialized();
    return await this.db!.count(SYNC_QUEUE);
  }
}

// Instance singleton
export const syncService = new SyncService();

// Initialiser lors de l'importation
syncService.initialize().catch(error => {
  console.error('Erreur lors de l\'initialisation du service de synchronisation:', error);
});

// Helper pour les intercepteurs Axios
export function setupAxiosOfflineInterceptor() {
  // Intercepteur de réponse pour gérer les erreurs réseau
  apiClient.interceptors.response.use(
    response => response,
    async error => {
      // Si c'est une erreur réseau et que nous sommes hors ligne
      if ((!error.response || error.message === 'Network Error') && !navigator.onLine) {
        console.log('Connexion hors ligne détectée, stockage de la requête pour synchronisation ultérieure');

        // Récupérer les données de la requête originale
        const originalRequest = error.config;

        if (!originalRequest.url || !originalRequest.method) {
          return Promise.reject(error);
        }

        try {
          // Déterminer le type d'entité à partir de l'URL
          const entityType = guessEntityTypeFromUrl(originalRequest.url);

          if (entityType && ['POST', 'PUT', 'PATCH'].includes(originalRequest.method.toUpperCase())) {
            // Sauvegarder les données localement
            const localData = originalRequest.data;
            const entityId = await syncService.saveOfflineData(entityType, localData);

            // Ajouter à la file d'attente de synchronisation
            await syncService.addToSyncQueue({
              url: originalRequest.url,
              method: originalRequest.method,
              headers: originalRequest.headers,
              body: originalRequest.data,
              timestamp: new Date().toISOString(),
              retryCount: 0,
              entityType,
              entityId: String(entityId)
            });

            // Demander une synchronisation
            await requestBackgroundSync('zenlife-sync-queue');

            // Notifier l'utilisateur
            const toast = useToast();
            toast.info('Données enregistrées localement. Elles seront synchronisées dès que vous serez en ligne.');

            // Retourner une réponse "positive" pour ne pas interrompre l'UX
            return Promise.resolve({
              status: 202,
              data: {
                success: true,
                offline: true,
                queued: true,
                entityId: String(entityId),
                message: 'Données enregistrées localement pour synchronisation ultérieure'
              }
            });
          }
        } catch (storageError) {
          console.error('Erreur lors de la sauvegarde pour synchronisation:', storageError);
        }
      }

      // Si ce n'est pas une erreur réseau, ou si nous n'avons pas pu stocker
      // la requête, propager l'erreur normalement
      return Promise.reject(error);
    }
  );
}

// Fonction helper pour déterminer le type d'entité à partir de l'URL
function guessEntityTypeFromUrl(url: string): string | null {
  if (url.includes('/expenses')) return 'expenses';
  if (url.includes('/planner')) return 'tasks';
  if (url.includes('/water')) return 'water-entries';
  if (url.includes('/positive-thoughts')) return 'positive-thoughts';

  // Si on ne peut pas déterminer le type, retourner null
  return null;
}

// Exporter les fonctions utilitaires
export default {
  syncService,
  setupAxiosOfflineInterceptor
};
