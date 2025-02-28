import apiClient from './index';
import type { PositiveThought, UserPositiveThoughtSetting } from '@/types/positiveThought';

export const positiveThoughtApi = {
  /**
   * Get a random positive thought
   */
  getRandomThought: (category?: string) => {
    return apiClient.get(`/positive-thoughts/random${category ? `?category=${category}` : ''}`);
  },

  /**
   * Get all positive thoughts
   */
  getAllThoughts: () => {
    return apiClient.get('/positive-thoughts');
  },

  /**
   * Get positive thoughts by category
   */
  getThoughtsByCategory: (category: string) => {
    return apiClient.get(`/positive-thoughts/category/${category}`);
  },

  /**
   * Create a new positive thought
   */
  createPositiveThought: (thought: PositiveThought) => {
    return apiClient.post('/positive-thoughts', thought);
  },

  /**
   * Get user's positive thought settings
   */
  getUserSettings: () => {
    return apiClient.get('/positive-thoughts/settings');
  },

  /**
   * Update user's positive thought settings
   */
  updateUserSettings: (settings: UserPositiveThoughtSetting) => {
    return apiClient.put('/positive-thoughts/settings', settings);
  },
};
