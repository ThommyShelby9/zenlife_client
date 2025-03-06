<template>
  <DashboardLayout>
    <div class="flex h-screen-minus-header">
      <!-- Contacts sidebar - Caché sur mobile quand une conversation est active -->
      <div
        :class="[
          'border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col overflow-hidden transition-all duration-300',
          {'w-80': !isMobileView || !activeContactId},
          {'hidden': isMobileView && activeContactId},
          {'w-full': isMobileView && !activeContactId}, // Plein écran sur mobile sans conversation active
        ]"
      >
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
                to="/social/friends"
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

      <!-- Chat content - Style amélioré pour mobile -->
      <div
        :class="[
          'flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 transition-all duration-300',
          {'w-full': isMobileView && activeContactId},
          {'hidden md:flex': !activeContactId}, // Caché sur desktop sans conversation active
          {'block': isMobileView && activeContactId}, // Visible sur mobile avec conversation active
        ]"
      >
        <div v-if="!activeContactId && !isMobileView" class="flex-1 flex flex-col items-center justify-center">
          <ChatAlt2Icon class="h-16 w-16 text-gray-400" />
          <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">Vos messages</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Sélectionnez un contact pour commencer à discuter.
          </p>
        </div>
        <template v-else-if="activeContactId">
          <!-- Chat header avec bouton retour pour mobile -->
          <div class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
              <!-- Bouton retour sur mobile -->
              <button
                v-if="isMobileView"
                @click="closeConversation"
                class="mr-2 p-2 rounded-full text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <ArrowLeftIcon class="h-5 w-5" />
              </button>

              <UserAvatar
                :imageUrl="activeContact?.profilePictureUrl"
                :initials="getInitials(activeContact?.fullName || '')"
                size="md"
                alt="Photo de profil"
                @error="handleImageErrore"
              />
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
                class="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 hidden md:block"
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

          <!-- Messages area - hauteur fixe pour éviter les problèmes de scroll -->
          <div
            ref="messagesContainer"
            class="flex-1 overflow-y-auto p-4 space-y-4 h-messages"
          >
            <div v-if="isLoadingMessages" class="flex justify-center py-6">
              <svg class="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div v-else-if="safeMessages.length === 0" class="text-center py-6">
              <ChatAlt2Icon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun message</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Commencez la conversation en envoyant un message.
              </p>
            </div>
            <div v-else>
              <div
                v-for="(message, index) in safeMessages"
                :key="message.id || index"
                class="flex flex-col space-y-1 w-full my-2"
              >
                <span v-if="shouldShowDateSeparator(index)"
                  class="text-center my-4 w-full"
                >
                  <div class="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300">
                    {{ formatMessageDate(message.timestamp) }}
                  </div>
                </span>

                <!-- Message container with flexbox -->
                <div
                  class="relative"
                  @contextmenu.prevent="showMessageOptions(message, $event)"
                  @long-touch="showMessageOptions(message, $event)"
                >
                  <!-- Message bubble avec les fonctionnalités de swipe/glissement -->
                  <div
                    class="w-full flex"
                    :class="isSentByMe(message) ? 'justify-end' : 'justify-start'"
                    @touchstart="startSwipe($event, message)"
                    @touchmove="moveSwipe($event)"
                    @touchend="endSwipe($event, message)"
                  >
                    <!-- Action de réponse qui apparaît lors du swipe -->
                    <div v-if="swiping && swipingMessageId === message.id" class="flex items-center mr-2">
                      <button
                        class="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
                        @click="setReplyToMessage(message)"
                      >
                        <ReplyIcon class="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>

                    <div class="flex flex-col max-w-[85%] md:max-w-[70%]">
                      <!-- Section de réponse si ce message répond à un autre -->
                      <div
                        v-if="message.replyTo"
                        class="p-2 rounded-t-lg text-xs border-l-2 border-primary-500 bg-gray-100 dark:bg-gray-700 mt-1 mb-0"
                      >
                        <p class="font-semibold">Réponse à {{ message.replyTo.senderName }}</p>
                        <p class="truncate">{{ message.replyTo.content }}</p>
                      </div>

                      <!-- Message bubble -->
                      <div
                        v-if="message.content && message.content.trim() !== ''"
                        class="p-3 rounded-lg shadow-sm"
                        :class="[
                          isSentByMe(message) ?
                            'message-sent bg-primary-500 text-white rounded-br-none' :
                            'message-received bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-none'
                        ]"
                      >
                        <p class="text-sm break-words">{{ message.content }}</p>
                      </div>

                      <!-- Message attachments if any -->
                      <div v-if="message.attachments && message.attachments.length > 0" class="mt-1 space-y-1">
                        <div
                          v-for="attachment in message.attachments"
                          :key="attachment.id"
                          class="rounded-lg overflow-hidden"
                        >
                          <!-- Image attachment -->
                          <img
  v-if="isImageAttachment(attachment.filename || '')"
  :src="getAttachmentUrl(attachment)"
  alt="Image"
  class="max-w-[300px] max-h-[250px] object-cover cursor-pointer rounded shadow-sm"
  @click="() => openAttachment(attachment)"
  @error="handleImageError"
/>

                          <!-- Audio attachment (note vocale) -->
                          <div v-else-if="isVoiceNote(attachment)" class="flex items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mt-1">
                            <button
                              @click="toggleAudioPlayback(attachment)"
                              class="p-2 rounded-full bg-primary-500 text-white mr-2"
                            >
                              <component :is="isPlaying(attachment.id) ? PauseIcon : PlayIcon" class="h-4 w-4" />
                            </button>
                            <div class="flex-1">
                              <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                                <div
                                  class="bg-primary-500 h-1.5 rounded-full"
                                  :style="{ width: getAudioProgress(attachment.id) + '%' }"
                                ></div>
                              </div>
                              <div class="flex justify-between text-xs mt-1">
                                <span>{{ formatAudioTime(getCurrentTime(attachment.id)) }}</span>
                                <span>{{ formatAudioTime(attachment.durationSeconds || 0) }}</span>
                              </div>
                            </div>
                          </div>

                          <!-- Other file attachments -->
                          <div
                            v-else
                            class="flex items-center bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer shadow-sm mt-1"
                            :class="[
                              isSentByMe(message) ? 'ml-auto' : 'mr-auto'
                            ]"
                            @click="() => openAttachment(attachment)"
                          >
                            <DocumentIcon class="h-6 w-6 text-gray-500 dark:text-gray-400" />
                            <div class="ml-2">
                              <p class="text-sm text-gray-900 dark:text-white truncate max-w-[150px]">
                                {{ attachment.originalFilename || attachment.filename }}
                              </p>
                              <p class="text-xs text-gray-500 dark:text-gray-400">
                                {{ formatFileSize(attachment.size || attachment.fileSize || 0) }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Message timestamp -->
                      <div
                        class="text-xs mt-1"
                        :class="isSentByMe(message) ?
                          'text-right text-gray-500 dark:text-gray-400' :
                          'text-left text-gray-500 dark:text-gray-400'"
                      >
                        {{ formatMessageTime(message.timestamp) }}
                        <span v-if="message.read && isSentByMe(message)" class="ml-1 text-primary-500">
                          ✓
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Message input area -->
          <div class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <!-- Afficher le message auquel on répond -->
            <div
              v-if="replyToMessage"
              class="bg-gray-100 dark:bg-gray-700 p-2 mb-2 rounded-md flex justify-between items-start"
            >
              <div class="flex-1">
                <p class="text-xs font-medium">Réponse à {{ replyToMessage.sender.fullName }}</p>
                <p class="text-sm truncate">{{ replyToMessage.content }}</p>
              </div>
              <button @click="cancelReply" class="p-1 text-gray-500">
                <XIcon class="h-4 w-4" />
              </button>
            </div>

            <!-- Interface d'enregistrement audio -->
            <div v-if="isRecording" class="flex items-center justify-between mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
              <div class="flex items-center">
                <div class="animate-pulse mr-2">
                  <MicrophoneIcon class="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p class="text-sm font-medium">Enregistrement en cours</p>
                  <p class="text-xs">{{ recordingDuration }}</p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                  @click="cancelRecording"
                  class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  <XIcon class="h-5 w-5" />
                </button>
                <button
                  @click="stopRecording"
                  class="p-2 rounded-full bg-red-500 text-white"
                >
                  <StopIcon class="h-5 w-5" />
                </button>
              </div>
            </div>

            <div class="relative">
              <textarea
                v-model="newMessage"
                :rows="textareaRows"
                ref="messageInput"
                placeholder="Écrivez un message..."
                class="block w-full rounded-lg border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:text-white pr-20 py-3 resize-none"
                @input="adjustTextareaHeight"
                @keydown.enter.prevent="sendMessage"
              ></textarea>
              <div class="absolute right-2 bottom-2 flex space-x-1">
                <!-- Bouton de note vocale -->
                <button
                  v-if="!isRecording"
                  @click="startRecording"
                  class="p-1.5 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                  aria-label="Enregistrer une note vocale"
                >
                  <MicrophoneIcon class="h-5 w-5" />
                </button>

                <button
                  @click="toggleEmojiPicker"
                  class="p-1.5 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none emoji-button"
                  aria-label="Ajouter un emoji"
                >
                  <EmojiHappyIcon class="h-5 w-5" />
                </button>
                <button
                  @click="openFilePicker"
                  class="p-1.5 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                  aria-label="Ajouter un fichier"
                >
                  <PaperClipIcon class="h-5 w-5" />
                </button>
                <button
                  @click="sendMessage"
                  class="p-1.5 rounded-full bg-primary-500 text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  :disabled="!canSendMessage"
                  aria-label="Envoyer le message"
                >
                  <PaperAirplaneIcon class="h-5 w-5 rotate-90" />
                </button>
              </div>
            </div>

            <!-- Emoji picker -->
            <div
              v-if="showEmojiPicker"
              class="absolute bottom-20 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-10 emoji-picker"
              @click.stop
            >
              <div class="flex flex-wrap max-w-xs max-h-40 overflow-y-auto">
                <button
                  v-for="emoji in emojiList"
                  :key="emoji"
                  @click="addEmoji(emoji)"
                  class="p-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                >
                  {{ emoji }}
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
                  aria-label="Supprimer le fichier"
                >
                  <XIcon class="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
          <input
            ref="fileInput"
            type="file"
            multiple
            class="hidden"
            @change="handleFileSelection"
          />
        </template>
      </div>

      <!-- Menu contextuel pour les messages -->
      <div
        v-if="showMessageMenu"
        class="fixed z-50"
        :style="{
          top: messageMenuPosition.y + 'px',
          left: messageMenuPosition.x + 'px'
        }"
      >
        <div class="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
          <button
            @click="() => { activeMessageForMenu && setReplyToMessage(activeMessageForMenu); showMessageMenu = false; }"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div class="flex items-center">
              <ReplyIcon class="h-4 w-4 mr-2" />
              Répondre
            </div>
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script lang="ts" setup>
// ---------- IMPORTS ----------
import { ref, computed, onMounted, nextTick, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
  PaperAirplaneIcon,
  DocumentIcon,
  XIcon,
  ArrowLeftIcon,
  EmojiHappyIcon,
  ReplyIcon,
  MicrophoneIcon,
  StopIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/vue/outline';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import ChatContactItem from '@/components/chat/ChatContactItem.vue';
import { useChatStore } from '@/stores/chat';
import { useUserStore } from '@/stores/user';
import { formatFileSize } from '@/utils/formatters';
import type {
  Contact,
  ChatMessagePayload,
  Message,
} from '@/types/chat';
import UserAvatar from '@/components/common/UserAvatar.vue';

// ---------- STORES ET COMPOSABLES ----------
const chatStore = useChatStore();
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

// ---------- ÉTAT DU COMPOSANT ----------
// Interface utilisateur
const searchQuery = ref('');
const activeContactId = ref('');
const activeContact = ref<Contact | null>(null);
const messages = ref<Message[]>([]);
const newMessage = ref('');
const isLoadingContacts = ref(true);
const isLoadingMessages = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const isMobileView = ref(window.innerWidth < 768);
const messageInput = ref<HTMLTextAreaElement | null>(null);
const textareaRows = ref(1);

// Gestion des fichiers
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<File[]>([]);

// Gestion des emojis
const showEmojiPicker = ref(false);
const emojiList = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '☺️',
  '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗',
  '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓',
  '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕',
  '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤',
  '👍', '👎', '❤️', '👏', '🔥', '🎉', '✅', '⭐', '🌟', '💯'
];

// Gestion des réponses
const replyToMessage = ref<Message | null>(null);
const showMessageMenu = ref(false);
const messageMenuPosition = ref({ x: 0, y: 0 });
const activeMessageForMenu = ref<Message | null>(null);

// Pour le swipe sur mobile
const swiping = ref(false);
const swipeStartX = ref(0);
const swipingMessageId = ref<string | null>(null);
const SWIPE_THRESHOLD = 80; // Pixels à swiper pour déclencher l'action

// Pour l'enregistrement audio
const isRecording = ref(false);
const recordingDuration = ref('00:00');
const recordingTimer = ref<number | null>(null);
const recordingStartTime = ref<number>(0);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<BlobPart[]>([]);

// Pour la lecture audio
const audioPlayers = ref<Record<string, HTMLAudioElement>>({});
const playingAudioId = ref<string | null>(null);
const audioProgress = ref<Record<string, number>>({});
const audioCurrentTime = ref<Record<string, number>>({});

// ---------- COMPUTED PROPERTIES ----------
const currentUserId = computed(() => userStore.user?.id || '');

const contacts = computed(() => chatStore.contacts || []);

// Pour le positionnement manuel temporaire
const isSentByMe = (message: Message): boolean => {
  // Cas spécial pour le test manuel
  if (message.tempSide === 'right') {
    return true;
  }
  if (message.tempSide === 'left') {
    return false;
  }

  // Si le message est explicitement marqué par notre application
  if (message.isFromCurrentUser === true) {
    return true;
  }

  // Si le message a un expéditeur défini, vérifier l'ID
  if (message.sender && message.sender.id === currentUserId.value) {
    return true;
  }

  // Si le message a un senderId défini
  if (message.senderId === currentUserId.value) {
    return true;
  }

  // Pour tous les autres cas, considérer que le message n'est pas de l'utilisateur actuel
  return false;
};

const imageError = ref(false); // Ajoutez cette ligne pour déclarer la variable manquante

// Cette fonction construit l'URL complète de l'image
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getFullImageUrl = (url: string): string => {
  // Si l'URL commence déjà par http, la retourner telle quelle
  if (url.startsWith('http')) {
    return url;
  }

  // Sinon, préfixer avec l'URL de l'API
  return `${import.meta.env.VITE_APP_API_URL.replace(/\/api$/, '')}${url}`;
};

// Gérer l'erreur de chargement d'image
const handleImageErrore = () => {
  imageError.value = true;
  console.error("Erreur de chargement de l'image de profil");
};

const filteredContacts = computed(() => {
  if (!searchQuery.value) return contacts.value;

  const query = searchQuery.value.toLowerCase();
  return contacts.value.filter(contact =>
    contact.fullName.toLowerCase().includes(query) ||
    (contact.username && contact.username.toLowerCase().includes(query))
  );
});

const safeMessages = computed(() => messages.value);

const canSendMessage = computed(() => {
  return (newMessage.value.trim() !== '' || selectedFiles.value.length > 0) && activeContactId.value !== '';
});

// ---------- MÉTHODES UTILITAIRES ----------
/**
 * Obtient les initiales d'un nom
 */
const getInitials = (name: string): string => {
  if (!name) return '';
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Formate l'heure d'un message
 */
const formatMessageTime = (timestamp: string): string => {
  if (!timestamp) return '';
  try {
    return format(parseISO(timestamp), 'HH:mm');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return '';
  }
};

/**
 * Formate la date d'un message
 */
const formatMessageDate = (timestamp: string): string => {
  if (!timestamp) return '';
  try {
    const date = parseISO(timestamp);

    if (isToday(date)) {
      return "Aujourd'hui";
    } else if (isYesterday(date)) {
      return 'Hier';
    } else {
      return format(date, 'EEEE d MMMM', { locale: fr });
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return '';
  }
};

/**
 * Détermine si un séparateur de date doit être affiché
 */
const shouldShowDateSeparator = (index: number): boolean => {
  if (index === 0) return true;
  if (!messages.value[index] || !messages.value[index - 1]) return false;
  if (!messages.value[index].timestamp || !messages.value[index - 1].timestamp) return false;

  try {
    const currentDate = parseISO(messages.value[index].timestamp);
    const previousDate = parseISO(messages.value[index - 1].timestamp);

    return (
      currentDate.getDate() !== previousDate.getDate() ||
      currentDate.getMonth() !== previousDate.getMonth() ||
      currentDate.getFullYear() !== previousDate.getFullYear()
    );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
};

/**
 * Fait défiler la liste des messages vers le bas
 */
const scrollToBottom = (): void => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

/**
 * Gère le redimensionnement de la fenêtre
 */
const handleResize = (): void => {
  isMobileView.value = window.innerWidth < 768;
};

/**
 * Ajuste la hauteur du textarea en fonction du contenu
 */
const adjustTextareaHeight = (): void => {
  if (!messageInput.value) return;

  // Réinitialiser la hauteur pour obtenir la hauteur naturelle
  messageInput.value.style.height = 'auto';

  // Calculer le nombre de lignes
  const lineHeight = 20; // hauteur de ligne approximative en pixels
  const lines = Math.ceil(messageInput.value.scrollHeight / lineHeight);

  // Limiter à 5 lignes maximum
  textareaRows.value = Math.min(5, Math.max(1, lines));

  // Appliquer la nouvelle hauteur
  messageInput.value.style.height = `${Math.min(messageInput.value.scrollHeight, 5 * lineHeight)}px`;
};

/**
 * Affiche/masque le sélecteur d'emojis
 */
const toggleEmojiPicker = (event: Event): void => {
  event.stopPropagation(); // Empêcher la propagation à document.click
  showEmojiPicker.value = !showEmojiPicker.value;
};

/**
 * Ajoute un emoji au message
 */
const addEmoji = (emoji: string): void => {
  newMessage.value += emoji;
  showEmojiPicker.value = false;

  // Focus sur le textarea après l'ajout
  if (messageInput.value) {
    messageInput.value.focus();
  }
};

// ---------- GESTION DES RÉPONSES ----------
/**
 * Configuration d'une réponse à un message
 */
const setReplyToMessage = (message: Message) => {
  replyToMessage.value = message;
  // Focus sur le textarea pour répondre immédiatement
  if (messageInput.value) {
    messageInput.value.focus();
  }
  // Fermer le menu contextuel si ouvert
  showMessageMenu.value = false;
};

/**
 * Annule la réponse
 */
const cancelReply = () => {
  replyToMessage.value = null;
};

/**
 * Affiche le menu contextuel pour un message
 */
const showMessageOptions = (message: Message, event: MouseEvent | TouchEvent) => {
  // Positionner le menu à l'emplacement du clic/toucher
  if (event instanceof MouseEvent) {
    messageMenuPosition.value = { x: event.clientX, y: event.clientY };
  } else {
    // Pour les événements tactiles, utiliser la première touche
    const touch = event.touches[0] || event.changedTouches[0];
    messageMenuPosition.value = { x: touch.clientX, y: touch.clientY };
  }

  activeMessageForMenu.value = message;
  showMessageMenu.value = true;

  // Fermer le menu après un clic ailleurs
  const closeMenu = () => {
    showMessageMenu.value = false;
    document.removeEventListener('click', closeMenu);
  };

  // Attendre le prochain tick pour ajouter l'écouteur
  setTimeout(() => {
    document.addEventListener('click', closeMenu);
  }, 0);
};

/**
 * Fonctions pour le swipe sur mobile
 */
const startSwipe = (event: TouchEvent, message: Message) => {
  const touch = event.touches[0];
  swipeStartX.value = touch.clientX;
  swipingMessageId.value = message.id;
};

const moveSwipe = (event: TouchEvent) => {
  if (!swipingMessageId.value) return;

  const touch = event.touches[0];
  const currentX = touch.clientX;
  const diff = currentX - swipeStartX.value;

  // Si on swipe assez vers la droite (pour les deux côtés)
  if (Math.abs(diff) > SWIPE_THRESHOLD) {
    swiping.value = true;
  } else {
    swiping.value = false;
  }
};

const endSwipe = (event: TouchEvent, message: Message) => {
  if (swiping.value && swipingMessageId.value === message.id) {
    setReplyToMessage(message);
  }

  // Réinitialiser les états
  swiping.value = false;
  swipingMessageId.value = null;
};

// ---------- GESTION DES NOTES VOCALES ----------
/**
 * Démarre l'enregistrement d'une note vocale
 */
const startRecording = async () => {
  try {
    // Demander l'autorisation d'utiliser le microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Créer l'enregistreur
    mediaRecorder.value = new MediaRecorder(stream);
    audioChunks.value = [];

    // Écouter l'événement de données disponibles
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };

    // Lorsque l'enregistrement est terminé
    mediaRecorder.value.onstop = () => {
      // Créer un blob audio
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });

      // Créer un fichier à partir du blob
      const audioFile = new File(
        [audioBlob],
        `voice-note-${Date.now()}.webm`,
        { type: 'audio/webm' }
      );

      // Ajouter la note vocale aux fichiers sélectionnés
      selectedFiles.value.push(audioFile);

      // Arrêter le flux audio
      stream.getTracks().forEach(track => track.stop());

      // Réinitialiser l'interface
      isRecording.value = false;
      if (recordingTimer.value) {
        clearInterval(recordingTimer.value);
        recordingTimer.value = null;
      }
    };

    // Démarrer l'enregistrement
    mediaRecorder.value.start();
    isRecording.value = true;
    recordingStartTime.value = Date.now();

    // Mettre à jour la durée d'enregistrement
    recordingTimer.value = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - recordingStartTime.value) / 1000);
      const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
      const seconds = (elapsed % 60).toString().padStart(2, '0');
      recordingDuration.value = `${minutes}:${seconds}`;
    }, 1000);
  } catch (error) {
    console.error('Erreur lors de l\'accès au microphone:', error);
    toast.error('Impossible d\'accéder au microphone');
  }
};

const stopRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop();
  }
};

const cancelRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop();
    audioChunks.value = []; // Vider les données
  }

  isRecording.value = false;
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
    recordingTimer.value = null;
  }
};

/**
 * Vérifie si une pièce jointe est une note vocale
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isVoiceNote = (attachment: any): boolean => {
  return attachment &&
    (attachment.contentType?.startsWith('audio/') ||
    attachment.filename?.includes('voice-note') ||
    attachment.durationSeconds !== undefined);
};

/**
 * Gère la lecture/pause d'une note vocale
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toggleAudioPlayback = (attachment: any) => {
  const attachmentId = attachment.id;

  // Si aucun lecteur audio n'existe pour cette pièce jointe, en créer un
  if (!audioPlayers.value[attachmentId]) {
    const audio = new Audio(getAttachmentUrl(attachment));

    // Configurer les événements
    audio.onplay = () => {
      playingAudioId.value = attachmentId;
    };

    audio.onpause = () => {
      if (playingAudioId.value === attachmentId) {
        playingAudioId.value = null;
      }
    };

    audio.onended = () => {
      if (playingAudioId.value === attachmentId) {
        playingAudioId.value = null;
      }
      // Réinitialiser la position
      audioProgress.value[attachmentId] = 0;
      audioCurrentTime.value[attachmentId] = 0;
    };

    audio.ontimeupdate = () => {
      // Mettre à jour la progression
      const duration = audio.duration || attachment.durationSeconds || 0;
      audioProgress.value[attachmentId] = (audio.currentTime / duration) * 100;
      audioCurrentTime.value[attachmentId] = audio.currentTime;
    };

    // Stocker le lecteur
    audioPlayers.value[attachmentId] = audio;
  }

  // Lire ou mettre en pause l'audio
  const audio = audioPlayers.value[attachmentId];

  if (audio.paused) {
    // Arrêter les autres audios en cours de lecture
    if (playingAudioId.value && playingAudioId.value !== attachmentId) {
      audioPlayers.value[playingAudioId.value].pause();
    }

    audio.play().catch(error => {
      console.error('Erreur lors de la lecture audio:', error);
      toast.error('Impossible de lire cette note vocale');
    });
  } else {
    audio.pause();
  }
};

const isPlaying = (attachmentId: string): boolean => {
  return playingAudioId.value === attachmentId;
};

const getAudioProgress = (attachmentId: string): number => {
  return audioProgress.value[attachmentId] || 0;
};

const getCurrentTime = (attachmentId: string): number => {
  return audioCurrentTime.value[attachmentId] || 0;
};

const formatAudioTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
};

// ---------- GESTION DES CONVERSATIONS ----------
/**
 * Sélectionne un contact pour démarrer ou continuer une conversation
 */
const selectContact = async (contact: Contact): Promise<void> => {
  if (!contact || !contact.id) {
    console.error('Contact invalide:', contact);
    return;
  }

  try {
    activeContactId.value = contact.id;
    activeContact.value = contact;
    isLoadingMessages.value = true;

    const conversation = await chatStore.getConversation(contact.id);
    if (conversation && Array.isArray(conversation)) {
      // On garde les messages tels quels pour l'instant
      messages.value = conversation;

      console.log('Messages chargés:', messages.value);
    } else {
      messages.value = [];
      console.error('Format de conversation invalide:', conversation);
    }

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

    // Update la route si en mobile
    if (isMobileView.value) {
      router.push({ path: `/chat/${contact.id}` });
    }
  } catch (error) {
    console.error('Error loading conversation:', error);
    toast.error('Erreur lors du chargement de la conversation');
    // Réinitialiser l'état en cas d'erreur
    activeContactId.value = '';
    activeContact.value = null;
  } finally {
    isLoadingMessages.value = false;
  }
};

/**
 * Ferme la conversation active et revient à la liste des contacts
 */
const closeConversation = (): void => {
  activeContactId.value = '';
  activeContact.value = null;
  messages.value = [];
  router.push({ path: '/chat' });
};

/**
 * Envoie un message
 */
const sendMessage = async (): Promise<void> => {
  if (!canSendMessage.value) return;

  // Vérification de l'ID du destinataire
  if (!activeContactId.value) {
    toast.error('Aucun destinataire sélectionné');
    return;
  }

  try {
    // Message simple sans chiffrement
    const messageContent = newMessage.value.trim();

    const payload: ChatMessagePayload = {
      receiver: { id: activeContactId.value },
      content: messageContent
    };

    // Ajouter la référence au message si on répond à un message
    if (replyToMessage.value && replyToMessage.value.id) {
      payload.replyToMessageId = replyToMessage.value.id;
    }

    if (selectedFiles.value.length > 0) {
      // Création d'un identifiant temporaire pour le message pour l'affichage immédiat
      const tempId = Date.now().toString();
      const tempMessage: Message = {
        id: tempId,
        content: messageContent,
        sender: {
          id: userStore.user?.id || '',
          fullName: userStore.user?.fullName || '',
          profilePictureUrl: userStore.user?.profilePictureUrl
        },
        receiver: { id: activeContactId.value },
        timestamp: new Date().toISOString(),
        read: false,
        attachments: [],
        isFromCurrentUser: true, // Marquer explicitement comme envoyé par l'utilisateur actuel
        senderId: userStore.user?.id || '',
        tempSide: 'right',
        replyTo: {
          messageId: '',
          content: '',
          senderId: '',
          senderName: ''
        }
      };

      // Ajouter les informations de réponse si nécessaire
      if (replyToMessage.value) {
        tempMessage.replyTo = {
          messageId: replyToMessage.value.id || '',
          content: replyToMessage.value.content,
          senderId: replyToMessage.value.sender?.id || '',
          senderName: replyToMessage.value.sender?.fullName || ''
        };
      }

      // Ajouter le message temporaire à la conversation
      if (!chatStore.conversations[activeContactId.value]) {
        chatStore.conversations[activeContactId.value] = [];
      }
      messages.value.push(tempMessage);

      // Défiler vers le bas pour montrer le nouveau message
      await nextTick();
      scrollToBottom();

      // Désactiver l'entrée pendant l'envoi
      newMessage.value = '';
      textareaRows.value = 1;
      cancelReply(); // Effacer le message de réponse

      if (messageInput.value) {
        messageInput.value.style.height = 'auto';
      }

      // Envoyer un message avec des pièces jointes
      try {
        await chatStore.sendMessageWithAttachments(
          activeContactId.value,
          messageContent,
          selectedFiles.value,
          replyToMessage.value?.id // Passer l'ID du message auquel on répond
        );

        console.log('Message avec pièces jointes envoyé');
        selectedFiles.value = [];
      } catch (attachmentError) {
        console.error('Erreur lors de l\'envoi des pièces jointes:', attachmentError);
        toast.error('Erreur lors de l\'envoi des pièces jointes');
      }
    } else {
      // Création d'un identifiant temporaire pour le message pour l'affichage immédiat
      const tempId = Date.now().toString();
      const tempMessage: Message = {
        id: tempId,
        content: messageContent,
        sender: {
          id: userStore.user?.id || '',
          fullName: userStore.user?.fullName || '',
          profilePictureUrl: userStore.user?.profilePictureUrl
        },
        receiver: { id: activeContactId.value },
        timestamp: new Date().toISOString(),
        read: false,
        isFromCurrentUser: true, // Marquer explicitement comme envoyé par l'utilisateur actuel
        senderId: userStore.user?.id || '',
        tempSide: 'right',
        replyTo: {
          messageId: '',
          content: '',
          senderId: '',
          senderName: ''
        }
      };

      // Ajouter les informations de réponse si nécessaire
      if (replyToMessage.value) {
        tempMessage.replyTo = {
          messageId: replyToMessage.value.id || '',
          content: replyToMessage.value.content,
          senderId: replyToMessage.value.sender?.id || '',
          senderName: replyToMessage.value.sender?.fullName || ''
        };
      }

      // Ajouter le message temporaire à la conversation
      messages.value.push(tempMessage);

      // Défiler vers le bas pour montrer le nouveau message
      await nextTick();
      scrollToBottom();

      // Désactiver l'entrée pendant l'envoi
      newMessage.value = '';
      textareaRows.value = 1;
      cancelReply(); // Effacer le message de réponse

      if (messageInput.value) {
        messageInput.value.style.height = 'auto';
      }

      // Envoyer un message texte
      await chatStore.sendMessage(payload);
    }

    // Recharger les messages pour obtenir la version serveur
    const conversation = await chatStore.getConversation(activeContactId.value);
    if (conversation && Array.isArray(conversation)) {
      // Marquer tous les messages comme envoyés par l'utilisateur actuel si nécessaire
      const updatedMessages = conversation.map(msg => {
        // Si le message n'a pas d'expéditeur défini mais correspond à un de nos messages temporaires
        if (!msg.sender && messages.value.find(m => m.content === msg.content && m.isFromCurrentUser)) {
          return { ...msg, isFromCurrentUser: true, tempSide: 'right' };
        }
        return msg;
      });

      messages.value = updatedMessages;
    }

    // Défiler vers le bas
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('Error sending message:', error);
    toast.error('Erreur lors de l\'envoi du message');
  }
};

// ---------- GESTION DES FICHIERS ----------
/**
 * Ouvre le sélecteur de fichiers
 */
const openFilePicker = (): void => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

/**
 * Gère la sélection de fichiers
 */
const handleFileSelection = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  // Vérifier la taille totale des fichiers (limite à 10 Mo par fichier)
  const maxFileSize = 10 * 1024 * 1024; // 10 Mo
  const files = Array.from(target.files);

  const validFiles = files.filter(file => {
    if (file.size > maxFileSize) {
      toast.error(`Le fichier ${file.name} est trop volumineux (max: 10 Mo)`);
      return false;
    }
    return true;
  });

  selectedFiles.value = [...selectedFiles.value, ...validFiles];

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

/**
 * Supprime un fichier de la liste des fichiers sélectionnés
 */
const removeFile = (index: number): void => {
  selectedFiles.value.splice(index, 1);
};

/**
 * Vérifie si un fichier est une image
 */
const isImageAttachment = (filename: string): boolean => {
  if (!filename) return false;
  const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return extensions.some(ext => filename.toLowerCase().endsWith(ext));
};

/**
 * Obtient l'URL d'une pièce jointe
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAttachmentUrl = (attachment: any): string => {
  if (!attachment) return '';

  const baseUrl = import.meta.env.VITE_APP_API_URL || '';

  // Cas 1: L'attachement a une URL
  if (attachment.url) {
    // Si l'URL est absolue, la retourner telle quelle
    if (attachment.url.startsWith('http')) {
      return attachment.url;
    }

    // Remplacer "attachments" par "view" dans le chemin
    let correctedUrl = attachment.url;
    if (correctedUrl.includes('/files/attachments/')) {
      correctedUrl = correctedUrl.replace('/files/attachments/', '/files/view/');
    }

    // Nettoyer l'URL relative
    if (correctedUrl.startsWith('/api/') && baseUrl.endsWith('/api')) {
      correctedUrl = correctedUrl.substring(5); // Retirer "/api/" du début
    } else if (correctedUrl.startsWith('/')) {
      correctedUrl = correctedUrl.substring(1); // Retirer juste le "/" initial
    }

    return `${baseUrl}/${correctedUrl}`;
  }

  // Cas 2: Extraire le nom du fichier de l'URL ou utiliser storagePath/filename
  const filename = attachment.storagePath ||
                  (attachment.url ? attachment.url.split('/').pop() : attachment.filename);

  if (filename) {
    return `${baseUrl}/api/files/view/${filename}`;
  }

  console.error('Aucune information pour accéder au fichier');
  return '';
};

/**
 * Gère les erreurs de chargement d'images
 */
const handleImageError = (event: Event): void => {
  // Remplacer l'image par une icône de fichier si elle ne peut pas être chargée
  const imgElement = event.target as HTMLImageElement;
  const originalSrc = imgElement.src;
  console.error('Erreur de chargement d\'image:', originalSrc);

  // Utiliser une image de base64 inline (un carré gris simple) plutôt qu'une URL externe
  imgElement.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAAN0lEQVR4nO3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfgx1/gABKMQC/QAAAABJRU5ErkJggg==';
  imgElement.classList.add('file-error');

  // Ajouter un élément d'information sur l'erreur
  const parent = imgElement.parentNode;
  if (parent) {
    const errorInfo = document.createElement('div');
    errorInfo.className = 'text-xs text-red-500 mt-1';
    errorInfo.textContent = 'Impossible de charger l\'image';
    parent.appendChild(errorInfo);
  }
};

/**
 * Ouvre une pièce jointe
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const openAttachment = (attachment: any): void => {
  // Si on passe un message au lieu d'une pièce jointe
  if (attachment && attachment.attachments && Array.isArray(attachment.attachments) && attachment.attachments.length > 0) {
    // Utiliser la première pièce jointe du message
    console.log('Message détecté, ouverture de la première pièce jointe');
    return openAttachment(attachment.attachments[0]);
  }

  // Vérifier que l'attachment est valide
  if (!attachment) {
    console.warn('Pièce jointe invalide');
    return;
  }

  // Récupérer l'URL
  const url = getAttachmentUrl(attachment);

  if (!url) {
    toast.error('Impossible d\'ouvrir cette pièce jointe: URL introuvable');
    return;
  }

  console.log('Ouverture de la pièce jointe:', url);

  // Ajouter un jeton d'authentification si nécessaire
  const token = localStorage.getItem('token');
  const finalUrl = token ? `${url}?token=${token}` : url;

  // Ouvrir dans un nouvel onglet
  window.open(finalUrl, '_blank');
};

/**
 * Débogue une pièce jointe
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debugAttachments = (message: any): void => {
  if (!message) {
    console.warn('Message vide ou undefined');
    return;
  }

  console.group(`Débogage du message ${message.id || 'sans ID'}`);

  // Vérifier si le message a des pièces jointes
  if (message.attachments && Array.isArray(message.attachments) && message.attachments.length > 0) {
    console.log(`Message avec ${message.attachments.length} pièce(s) jointe(s)`);

    // Déboguer chaque pièce jointe individuellement
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message.attachments.forEach((attachment: any, index: number) => {
      console.group(`Pièce jointe #${index+1}`);
      console.log('ID:', attachment.id || 'Non défini');
      console.log('Nom de fichier:', attachment.filename || 'Non défini');
      console.log('Type de contenu:', attachment.contentType || 'Non défini');
      console.log('Taille:', attachment.size || attachment.fileSize || 'Non définie');
      console.log('StoragePath:', attachment.storagePath || 'Non défini');
      console.log('URL:', attachment.url || 'Non définie');

      // Calculer l'URL qui sera utilisée
      const url = getAttachmentUrl(attachment);
      console.log('URL calculée:', url);
      console.groupEnd();
    });
  } else {
    console.log('Message sans pièces jointes ou la propriété attachments n\'est pas un tableau');
    console.log('Propriétés du message:', Object.keys(message));
  }

  console.groupEnd();
};

// ---------- LIFECYCLE HOOKS ----------
onMounted(async () => {
  try {
    // Écouter les changements de taille d'écran
    window.addEventListener('resize', handleResize);

    // Check if userId is in route params to open chat with specific user
    const userId = route.params.userId as string;

    // Load user contacts
    await chatStore.loadContacts();
    isLoadingContacts.value = false;

    // Si userId est fourni, sélectionner ce contact
    if (userId && userId !== 'undefined') {
      const contact = contacts.value.find(c => c.id === userId);
      if (contact) {
        await selectContact(contact);
      } else if (userId) {
        // Afficher une notification et rediriger vers la page principale
        toast.error('Contact introuvable');
        router.push({ path: '/chat' });
      }
    }

    // Fermer le sélecteur d'emojis en cliquant ailleurs
    document.addEventListener('click', () => {
      if (showEmojiPicker.value) {
        showEmojiPicker.value = false;
      }
    });

    // Afficher les IDs dans la console pour le débogage
    console.log('User ID actuel:', currentUserId.value);
  } catch (error) {
    console.error('Error initializing chat:', error);
    toast.error('Erreur lors de l\'initialisation du chat');
    isLoadingContacts.value = false;
  }
});

onBeforeUnmount(() => {
  // Suppression des écouteurs d'événements
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('click', () => {});

  // Arrêter l'enregistrement si en cours
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop();
  }

  // Arrêter les timers
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
  }

  // Arrêter et nettoyer tous les lecteurs audio
  Object.values(audioPlayers.value).forEach(audio => {
    audio.pause();
    audio.src = '';
  });
});

// ---------- WATCHERS ----------
// Watch for changes in mobile/desktop view
watch(() => isMobileView.value, (newValue) => {
  if (newValue && activeContactId.value) {
    // Si on passe en vue mobile et qu'une conversation est active, mettre à jour l'URL
    router.push({ path: `/chat/${activeContactId.value}` });
  } else if (!newValue && route.path !== '/chat') {
    // Si on repasse en vue desktop, rester sur la page /chat mais garder la conversation active
    router.push({ path: '/chat' });
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

// Watch for changes in the active conversation
watch(() => route.params.userId, async (newUserId) => {
  if (newUserId && typeof newUserId === 'string' && newUserId !== 'undefined') {
    const contact = contacts.value.find(c => c.id === newUserId);
    if (contact && (!activeContactId.value || activeContactId.value !== newUserId)) {
      await selectContact(contact);
    }
  }
});

// Debug des pièces jointes et des expéditeurs lorsque les messages changent
watch(() => messages.value, (newMessages) => {
  if (!newMessages.length) return;

  // Logguer des infos sur les pièces jointes pour le débogage
  newMessages.forEach(message => {
    if (message.attachments && message.attachments.length > 0) {
      debugAttachments(message);
    }

    // Vérifier les expéditeurs des messages pour le débogage
    console.log('Message ID:', message.id);
    console.log('Message content:', message.content);
    console.log('Expéditeur:', message.sender?.id || 'undefined');
    console.log('Current User ID:', currentUserId.value);
    console.log('Receiver ID:', message.receiver?.id || 'undefined');
    console.log('Est envoyé par moi:', isSentByMe(message));
    console.log('--------------------');
  });
}, { deep: true });
</script>

<style scoped>
/* Empêcher le défilement horizontal sur tout le composant */
:deep(body),
:deep(html) {
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
}

.h-screen-minus-header {
  height: calc(100vh - 4rem);
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  position: relative;
}

/* Hauteur fixe pour la zone de messages */
.h-messages {
  height: calc(100vh - 13rem);
  max-height: calc(100vh - 13rem);
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

/* Amélioration de l'affichage des messages */
.message-bubble {
  max-width: 70%;
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.message-sent {
  background-color: var(--primary-color, #4f46e5);
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 0 !important;
  margin-left: auto;
}

.message-received {
  background-color: white;
  color: var(--text-color, #111827);
  align-self: flex-start;
  border-bottom-left-radius: 0 !important;
  margin-right: auto;
}

/* Amélioration de la responsivité */
@media (max-width: 768px) {
  .message-bubble {
    max-width: 85%;
  }

  .file-attachment {
    max-width: 100%;
  }

  /* Animation de transition pour le mode mobile */
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s ease;
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(100%);
  }

  /* Ajustements pour les petits écrans */
  .h-messages {
    height: calc(100vh - 11rem);
    width: 100%;
  }

  /* S'assurer que tous les conteneurs flex ne débordent pas */
  .flex {
    max-width: 100%;
  }
}

/* Style pour les images qui ne peuvent pas être chargées */
.file-error {
  opacity: 0.6;
  border: 1px dashed #ccc;
}

/* Amélioration des animations */
.message-enter-active, .message-leave-active {
  transition: all 0.3s;
}
.message-enter-from, .message-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Ajustements pour empêcher le défilement horizontal */
.flex {
  box-sizing: border-box;
}

/* S'assurer que les images et les pièces jointes ne débordent pas */
img,
.rounded-lg {
  max-width: 100%;
}

/* Ajuster les messages pour qu'ils restent dans le conteneur */
.w-full {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}

/* Ajouter une contrainte pour la largeur de la conversation */
.flex-1 {
  min-width: 0;
  width: 100%;
}
</style>
