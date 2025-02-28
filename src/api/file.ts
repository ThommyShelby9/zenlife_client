import apiClient from './index';

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
    return `${import.meta.env.VITE_APP_API_URL}/files/download/${filename}`;
  },

  /**
   * Get file view URL
   */
  getFileViewUrl: (filename: string) => {
    return `${import.meta.env.VITE_APP_API_URL}/files/view/${filename}`;
  },

  // Dans fileApi.ts
getProfilePictureUrl: (filename: string) => {
  return `${import.meta.env.VITE_APP_API_URL}/files/view/profile_pictures/${filename}`;
},
};
