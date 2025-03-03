/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/syncService.ts
import { openDB } from 'idb';

export class SyncService {
  private db: any;

  async initialize() {
    this.db = await openDB('zenlife-offline-db', 1, {
      upgrade(db) {
        // Create object stores for each entity that needs offline support
        db.createObjectStore('water-entries', { keyPath: 'id', autoIncrement: true });
        db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
        db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
        db.createObjectStore('pendingRequests', { keyPath: 'id', autoIncrement: true });
      }
    });
  }

  async saveOfflineData(storeName: string, data: any) {
    return await this.db.add(storeName, data);
  }

  async getPendingOperations(storeName: string) {
    return await this.db.getAll(storeName);
  }

  async clearOperation(storeName: string, id: number) {
    return await this.db.delete(storeName, id);
  }

  async syncWithServer() {
    const pendingRequests = await this.getPendingOperations('pendingRequests');

    for (const request of pendingRequests) {
      try {
        // Attempt to perform the operation
        await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body
        });

        // If successful, remove from pending operations
        await this.clearOperation('pendingRequests', request.id);
      } catch (error) {
        console.error('Failed to sync operation:', error);
        // Leave in the queue to retry later
      }
    }
  }
}

export const syncService = new SyncService();
