import apiClient from './index';

// Fonction pour éviter les chemins dupliqués
const joinPaths = (base: string, path: string): string => {
  // Supprimer les trailing slashes de la base
  base = base.replace(/\/+$/, '');

  // Supprimer les leading slashes du chemin
  path = path.replace(/^\/+/, '');

  // Si le chemin contient déjà 'api/', ne pas l'ajouter à nouveau
  if (path.startsWith('api/') && base.endsWith('/api')) {
    // Enlever 'api/' du début du chemin
    path = path.substring(4);
  }

  // Joindre avec un unique slash
  return `${base}/${path}`;
};

export const fileApi = {
  /**
   * Upload a file attachment
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
   * Upload profile picture
   */
  uploadProfilePicture: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post('/files/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  /**
   * Get all attachments for a message
   */
  getMessageAttachments: (messageId: string) => {
    return apiClient.get(`/files/attachments/${messageId}`);
  },

  /**
   * Get file download URL
   */
  getFileDownloadUrl: (filename: string) => {
    if (!filename) return '';

    const baseUrl = import.meta.env.VITE_APP_API_URL || '';
    return joinPaths(baseUrl, `files/download/${filename}`);
  },

  /**
   * Get file view URL
   */
  getFileViewUrl: (filename: string) => {
    if (!filename) return '';

    const baseUrl = import.meta.env.VITE_APP_API_URL || '';
    return joinPaths(baseUrl, `files/view/${filename}`);
  },

  /**
   * Pour les notes vocales spécifiquement
   */
  getVoiceNoteUrl: (filename: string) => {
    if (!filename) return '';

    const baseUrl = import.meta.env.VITE_APP_API_URL || '';
    return joinPaths(baseUrl, `files/view/${filename}`);
  },

  /**
   * Get profile picture URL
   */
  getProfilePictureUrl: (filename: string) => {
    if (!filename) return null;

    const baseUrl = import.meta.env.VITE_APP_API_URL || '';
    return joinPaths(baseUrl, `files/profile-pictures/${filename}`);
  },

  /**
   * Debug URL construction
   */
  debugUrl: (path: string) => {
    const baseUrl = import.meta.env.VITE_APP_API_URL || '';
    const url = joinPaths(baseUrl, path);

    console.group('Debug URL Construction');
    console.log('Base URL:', baseUrl);
    console.log('Path:', path);
    console.log('Final URL:', url);
    console.groupEnd();

    return url;
  }
};

export default fileApi;
