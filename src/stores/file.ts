import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fileApi } from '@/api/file';
import { useToast } from 'vue-toastification';

export interface FileAttachment {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  url?: string;
}

export const useFileStore = defineStore('file', () => {
  const toast = useToast();
  const isLoading = ref(false);
  const attachments = ref<FileAttachment[]>([]);

  /**
   * Upload a file attachment to a message
   */
  const uploadFile = async (file: File, messageId: string) => {
    isLoading.value = true;
    try {
      const response = await fileApi.uploadFile(file, messageId);

      toast.success('Fichier téléchargé avec succès');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier :', error);
      toast.error('Échec du téléchargement du fichier');
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Upload a voice note to a message
   */
  const uploadVoiceNote = async (file: File, messageId: string, durationSeconds: number) => {
    isLoading.value = true;
    try {
      const response = await fileApi.uploadVoiceNote(file, messageId, durationSeconds);

      toast.success('Note vocale téléchargée avec succès');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du téléchargement de la note vocale :', error);
      toast.error('Échec du téléchargement de la note vocale');
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Upload profile picture
   */
  const uploadProfilePicture = async (file: File) => {
    isLoading.value = true;
    try {
      const response = await fileApi.uploadProfilePicture(file);

      toast.success('Photo de profil mise à jour');
      return response.data;
    } catch (error) {
      console.error('Erreur lors du téléchargement de la photo de profil :', error);
      toast.error('Échec de la mise à jour de la photo de profil');
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch attachments for a specific message
   */
  const fetchMessageAttachments = async (messageId: string) => {
    isLoading.value = true;
    try {
      const response = await fileApi.getMessageAttachments(messageId);

      // Enrichir les fichiers avec les URLs de téléchargement et de vue
      attachments.value = response.data.map((attachment: FileAttachment) => ({
        ...attachment,
        downloadUrl: fileApi.getFileDownloadUrl(attachment.filename),
        viewUrl: fileApi.getFileViewUrl(attachment.filename)
      }));

      return attachments.value;
    } catch (error) {
      console.error('Erreur lors de la récupération des pièces jointes :', error);
      toast.error('Impossible de charger les pièces jointes');
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get download URL for a file
   */
  const getFileDownloadUrl = (filename: string) => {
    return fileApi.getFileDownloadUrl(filename);
  };

  /**
   * Get view URL for a file
   */
  const getFileViewUrl = (filename: string) => {
    return fileApi.getFileViewUrl(filename);
  };

  /**
   * Clear attachments
   */
  const clearAttachments = () => {
    attachments.value = [];
  };

  return {
    // State
    isLoading,
    attachments,

    // Actions
    uploadFile,
    uploadVoiceNote,
    uploadProfilePicture,
    fetchMessageAttachments,
    getFileDownloadUrl,
    getFileViewUrl,
    clearAttachments
  };
});
