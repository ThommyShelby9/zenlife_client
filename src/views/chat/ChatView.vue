<template>
  <DashboardLayout>
    <div class="flex h-screen-minus-header">
      <!-- Contacts sidebar -->
      <div class="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col overflow-hidden">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Messages</h2>
          <div class="mt-2 relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Rechercher..."
              class="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white pl-9"
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon class="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto p-2 space-y-1">
          <div v-if="isLoadingContacts" class="flex justify-center py-6">
            <svg class="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div v-else-if="contacts.length === 0" class="text-center py-6">
            <UserAddIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun contact</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Ajoutez des amis pour commencer à discuter.
            </p>
            <div class="mt-6">
              <RouterLink
                to="/friends"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <UserAddIcon class="h-4 w-4 mr-2" />
                Ajouter des amis
              </RouterLink>
            </div>
          </div>
          <div v-else>
            <ChatContactItem
              v-for="contact in filteredContacts"
              :key="contact.id"
              :contact="contact"
              :active="activeContactId === contact.id"
              @click="selectContact(contact)"
            />
          </div>
        </div>
      </div>

      <!-- Chat content -->
      <div class="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        <div v-if="!activeContactId" class="flex-1 flex flex-col items-center justify-center">
          <ChatAlt2Icon class="h-16 w-16 text-gray-400" />
          <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">Vos messages</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Sélectionnez un contact pour commencer à discuter.
          </p>
        </div>
        <template v-else>
          <!-- Chat header -->
          <div class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
              <img
                v-if="activeContact?.profilePictureUrl"
                :src="activeContact.profilePictureUrl"
                alt="Profile"
                class="h-10 w-10 rounded-full"
              />
              <div
                v-else
                class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
              >
                <span class="text-primary-800 dark:text-primary-200 font-medium">
                  {{ getInitials(activeContact?.fullName || '') }}
                </span>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ activeContact?.fullName }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ activeContact?.online ? 'En ligne' : 'Hors ligne' }}
                </p>
              </div>
            </div>
            <div class="flex">
              <button
                class="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PhoneIcon class="h-5 w-5" />
              </button>
              <button
                class="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <VideoCameraIcon class="h-5 w-5" />
              </button>
              <button
                class="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <DotsVerticalIcon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Messages area -->
          <div
            ref="messagesContainer"
            class="flex-1 overflow-y-auto p-4 space-y-4"
          >
            <div v-if="isLoadingMessages" class="flex justify-center py-6">
              <svg class="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div v-else-if="messages.length === 0" class="text-center py-6">
              <ChatAlt2Icon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun message</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Commencez la conversation en envoyant un message.
              </p>
            </div>
            <div v-else>
              <div
                v-for="(message, index) in messages"
                :key="message.id"
                class="flex"
                :class="message.sender.id === currentUserId ? 'justify-end' : 'justify-start'"
              >
                <div class="flex flex-col space-y-1 max-w-[70%]">
                  <!-- Date separator if needed -->
                  <div
                    v-if="shouldShowDateSeparator(index)"
                    class="text-center my-4"
                  >
                    <div class="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300">
                      {{ formatMessageDate(message.timestamp) }}
                    </div>
                  </div>

                  <!-- Message bubble -->
                  <div
                    class="inline-block p-3 rounded-lg"
                    :class="message.sender.id === currentUserId ?
                      'bg-primary-500 text-white rounded-br-none' :
                      'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-none'"
                  >
                    <p class="text-sm">{{ message.content }}</p>
                  </div>

                  <!-- Message attachments if any -->
                  <div v-if="message.attachments && message.attachments.length > 0" class="space-y-1">
                    <div
                      v-for="attachment in message.attachments"
                      :key="attachment.id"
                      class="inline-block rounded-lg overflow-hidden"
                    >
                      <!-- Image attachment -->
                      <img
                        v-if="isImageAttachment(attachment.filename)"
                        :src="getFileViewUrl(attachment.filename)"
                        alt="Image attachment"
                        class="max-w-xs max-h-48 object-cover cursor-pointer"
                        @click="openAttachment(attachment)"
                      />

                      <!-- Voice note attachment -->
                      <div
                        v-else-if="isVoiceNoteAttachment(attachment.filename)"
                        class="flex items-center bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <button
                          @click="toggleAudioPlay(attachment)"
                          class="p-2 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                        >
                          <PlayIcon v-if="playingAudioId !== attachment.id" class="h-5 w-5" />
                          <PauseIcon v-else class="h-5 w-5" />
                        </button>
                        <div class="ml-2">
                          <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              class="h-full bg-primary-500"
                              :style="{ width: (audioProgress[attachment.id] || 0) + '%' }"
                            ></div>
                          </div>
                          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {{ formatAudioDuration(attachment.durationSeconds || 0) }}
                          </div>
                        </div>
                      </div>

                      <!-- Other file attachments -->
                      <div
                        v-else
                        class="flex items-center bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer"
                        @click="openAttachment(attachment)"
                      >
                        <DocumentIcon class="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        <div class="ml-2">
                          <p class="text-sm text-gray-900 dark:text-white truncate max-w-[150px]">
                            {{ attachment.filename }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            {{ formatFileSize(attachment.size || 0) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Message timestamp -->
                  <div
                    class="text-xs"
                    :class="message.sender.id === currentUserId ?
                      'text-right text-gray-500 dark:text-gray-400' :
                      'text-left text-gray-500 dark:text-gray-400'"
                  >
                    {{ formatMessageTime(message.timestamp) }}
                    <span v-if="message.read && message.sender.id === currentUserId" class="ml-1 text-primary-500">
                      ✓
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Message input area -->
          <div class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <div class="relative">
              <textarea
                v-model="newMessage"
                rows="1"
                placeholder="Écrivez un message..."
                class="block w-full rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white pr-20 py-3 resize-none"
                @keydown.enter.prevent="sendMessage"
              ></textarea>
              <div class="absolute right-2 bottom-2 flex space-x-1">
                <button
                  @click="openFilePicker"
                  class="p-1.5 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                >
                  <PaperClipIcon class="h-5 w-5" />
                </button>
                <button
                  @click="startVoiceRecording"
                  class="p-1.5 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                  :class="{ 'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300': isRecording }"
                >
                  <MicrophoneIcon class="h-5 w-5" />
                </button>
                <button
                  @click="sendMessage"
                  class="p-1.5 rounded-full bg-primary-500 text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  :disabled="!canSendMessage"
                >
                  <PaperAirplaneIcon class="h-5 w-5 rotate-90" />
                </button>
              </div>
            </div>
            <!-- Selected files preview -->
            <div v-if="selectedFiles.length > 0" class="mt-2 flex flex-wrap gap-2">
              <div
                v-for="(file, index) in selectedFiles"
                :key="index"
                class="relative bg-gray-100 dark:bg-gray-700 rounded-md p-2 flex items-center"
              >
                <span class="text-xs text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                  {{ file.name }}
                </span>
                <button
                  @click="removeFile(index)"
                  class="ml-1 p-0.5 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  <XIcon class="h-3 w-3" />
                </button>
              </div>
            </div>
            <!-- Voice recording indicator -->
            <div v-if="isRecording" class="mt-2 flex items-center text-red-500 dark:text-red-400">
              <span class="inline-block h-2 w-2 rounded-full bg-red-500 dark:bg-red-400 animate-pulse mr-2"></span>
              <span class="text-sm">Enregistrement... {{ recordingDuration }}s</span>
              <button
                @click="stopVoiceRecording"
                class="ml-auto p-1 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
              >
                <StopIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
          <input
      ref="fileInput"
      type="file"
      multiple
      class="hidden"
      @change="(event: Event) => handleFileSelection(event)"
    />
        </template>
      </div>
    </div>
  </DashboardLayout>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ChatAlt2Icon,
  SearchIcon,
  UserAddIcon,
  PhoneIcon,
  VideoCameraIcon,
  DotsVerticalIcon,
  PaperClipIcon,
  MicrophoneIcon,
  PaperAirplaneIcon,
  PlayIcon,
  PauseIcon,
  DocumentIcon,
  XIcon,
  StopIcon,
} from '@heroicons/vue/outline';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import ChatContactItem from '@/components/chat/ChatContactItem.vue';
import { useChatStore } from '@/stores/chat';
import { useUserStore } from '@/stores/user';
import { formatFileSize } from '@/utils/formatters';
import type {
  Contact as ChatContact,
  ChatMessagePayload,
  Message
} from '@/types/chat';
import type { User } from '@/types/auth';


// Stores and composables
const chatStore = useChatStore();
const userStore = useUserStore();
const toast = useToast();

// Component state
const searchQuery = ref('');
const activeContactId = ref('');
const activeContact = ref<ChatContact | null>(null);
const messages = ref<Message[]>([]);
const newMessage = ref('');
const isLoadingContacts = ref(true);
const isLoadingMessages = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

// File handling state
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<File[]>([]);

// Audio recording state
const isRecording = ref(false);
const recordingDuration = ref(0);
const recordingInterval = ref<ReturnType<typeof setInterval> | null>(null);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);

// Audio playback state
const playingAudioId = ref('');
const audioElements = ref<Record<string, HTMLAudioElement>>({});
const audioProgress = ref<Record<string, number>>({});
// Computed properties
// Computed properties
const currentUserId = computed(() => userStore.user?.id || '');

const contacts = computed(() => chatStore.contacts || []);

const filteredContacts = computed(() => {
  if (!searchQuery.value) return contacts.value;

  const query = searchQuery.value.toLowerCase();
  return contacts.value.filter(contact =>
    contact.fullName.toLowerCase().includes(query) ||
    (contact.username && contact.username.toLowerCase().includes(query))
  );
});

const canSendMessage = computed(() => {
  return (newMessage.value.trim() !== '' || selectedFiles.value.length > 0) && activeContactId.value;
});

// Methods
const getInitials = (name: string): string => {
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};

const selectContact = async (contact: ChatContact) => {
  activeContactId.value = contact.id;
  activeContact.value = contact;
  isLoadingMessages.value = true;

  try {
    const conversation = await chatStore.getConversation(contact.id);
    messages.value = conversation;

    // Marquer la conversation comme lue
    await chatStore.markConversationAsRead(contact.id);

    // Mettre à jour le nombre de messages non lus du contact
    const contactIndex = contacts.value.findIndex(c => c.id === contact.id);
    if (contactIndex !== -1) {
      contacts.value[contactIndex].unreadCount = 0;
    }

    // Défiler vers le bas
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('Error loading conversation:', error);
    toast.error('Erreur lors du chargement de la conversation');
  } finally {
    isLoadingMessages.value = false;
  }
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const formatMessageTime = (timestamp: string): string => {
  try {
    return format(parseISO(timestamp), 'HH:mm');
  } catch (error) {
    return '';
  }
};

const formatMessageDate = (timestamp: string): string => {
  try {
    const date = parseISO(timestamp);

    if (isToday(date)) {
      return "Aujourd'hui";
    } else if (isYesterday(date)) {
      return 'Hier';
    } else {
      return format(date, 'EEEE d MMMM', { locale: fr });
    }
  } catch (error) {
    return '';
  }
};

const shouldShowDateSeparator = (index: number): boolean => {
  if (index === 0) return true;

  const currentDate = parseISO(messages.value[index].timestamp);
  const previousDate = parseISO(messages.value[index - 1].timestamp);

  return (
    currentDate.getDate() !== previousDate.getDate() ||
    currentDate.getMonth() !== previousDate.getMonth() ||
    currentDate.getFullYear() !== previousDate.getFullYear()
  );
};

const sendMessage = async () => {
  if (!canSendMessage.value) return;

  try {
    const payload: ChatMessagePayload = {
      receiver: { id: activeContactId.value },
      content: newMessage.value.trim()
    };

    if (selectedFiles.value.length > 0) {
      // Envoyer un message avec des pièces jointes
      await chatStore.sendMessageWithAttachments(
        activeContactId.value,
        newMessage.value.trim(),
        selectedFiles.value
      );
    } else {
      // Envoyer un message texte
      await chatStore.sendMessage(payload);
    }

    // Réinitialiser l'entrée et recharger la conversation
    newMessage.value = '';
    selectedFiles.value = [];

    // Recharger les messages
    const conversation = await chatStore.getConversation(activeContactId.value);
    messages.value = conversation;

    // Défiler vers le bas
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('Erreur lors de l\'envoi du message');
  }
};
// File handling methods
const openFilePicker = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileSelection = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files ? Array.from(target.files as FileList) : [];
  selectedFiles.value = [...selectedFiles.value, ...files];

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
};

const isImageAttachment = (filename: string): boolean => {
  const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return extensions.some(ext => filename.toLowerCase().endsWith(ext));
};

const isVoiceNoteAttachment = (filename: string): boolean => {
  return filename.toLowerCase().endsWith('.webm') || filename.toLowerCase().endsWith('.mp3');
};

const getFileViewUrl = (filename: string): string => {
  return `${import.meta.env.VITE_APP_API_URL}/files/view/${filename}`;
};

const openAttachment = (attachment: { filename: string; }) => {
  window.open(getFileViewUrl(attachment.filename), '_blank');
};

// Voice recording methods
const startVoiceRecording = async () => {
  if (isRecording.value) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder.value = new MediaRecorder(stream);
    audioChunks.value = [];

    mediaRecorder.value.ondataavailable = (event: BlobEvent) => {
      audioChunks.value.push(event.data);
    };

    mediaRecorder.value.onstop = () => {
      if (mediaRecorder.value) {
        const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `voice-note-${Date.now()}.webm`, { type: 'audio/webm' });

        selectedFiles.value.push(audioFile);

        // Reset recording state
        recordingDuration.value = 0;
        if (recordingInterval.value !== null) {
          clearInterval(recordingInterval.value);
        }

        // Stop all tracks
        mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
      }
    };

    // Start recording
    mediaRecorder.value.start();
    isRecording.value = true;

    // Start timer
    recordingInterval.value = setInterval(() => {
      recordingDuration.value += 1;

      // Automatically stop after 2 minutes
      if (recordingDuration.value >= 120) {
        stopVoiceRecording();
      }
    }, 1000);
  } catch (error) {
    console.error('Error starting voice recording:', error);
    toast.error('Erreur lors du démarrage de l\'enregistrement vocal');
  }
};

const stopVoiceRecording = () => {
  if (!isRecording.value || !mediaRecorder.value) return;

  mediaRecorder.value.stop();
  isRecording.value = false;
};

// Audio playback methods
const toggleAudioPlay = (attachment: { id: string; filename: string; }) => {
  if (playingAudioId.value === attachment.id) {
    // Pause current audio
    if (audioElements.value[attachment.id]) {
      audioElements.value[attachment.id].pause();
    }
    playingAudioId.value = '';
  } else {
    // Stop any currently playing audio
    if (playingAudioId.value && audioElements.value[playingAudioId.value]) {
      audioElements.value[playingAudioId.value].pause();
    }

    // Start playing this audio
    playingAudioId.value = attachment.id;

    if (!audioElements.value[attachment.id]) {
      // Create new audio element if it doesn't exist
      const audio = new Audio(getFileViewUrl(attachment.filename));

      audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        audioProgress.value[attachment.id] = progress;
      });

      audio.addEventListener('ended', () => {
        playingAudioId.value = '';
        audioProgress.value[attachment.id] = 0;
      });

      audioElements.value[attachment.id] = audio;
    }

    audioElements.value[attachment.id].play();
  }
};

const formatAudioDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Initialize
onMounted(async () => {
  try {
    // Load user contacts
    await chatStore.loadContacts();
    isLoadingContacts.value = false;
  } catch (error) {
    console.error('Error loading contacts:', error);
    toast.error('Erreur lors du chargement des contacts');
  }
});

// Watch for new messages coming in
watch(() => chatStore.contacts, (newContacts, oldContacts) => {
  if (newContacts && oldContacts) {
    // Check if any contact has new messages
    newContacts.forEach(newContact => {
      const oldContact = oldContacts.find(c => c.id === newContact.id);

      if (oldContact && newContact.unreadCount > oldContact.unreadCount) {
        // If this is the active contact, reload conversation
        if (activeContactId.value === newContact.id) {
          selectContact(newContact);
        }
      }
    });
  }
}, { deep: true });
</script>

<style scoped>
.h-screen-minus-header {
  height: calc(100vh - 4rem);
}
</style>
