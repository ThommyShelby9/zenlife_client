<template>
  <div
    class="flex items-center p-3 rounded-lg cursor-pointer"
    :class="[
      active ? 'bg-primary-50 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
    ]"
    @click="$emit('click')"
  >
    <div class="relative">
      <img
        v-if="contact.profilePictureUrl"
        :src="contact.profilePictureUrl"
        alt="Profile"
        class="h-10 w-10 rounded-full object-cover"
      />
      <div
        v-else
        class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
      >
        <span class="text-primary-800 dark:text-primary-200 font-medium">
          {{ getInitials(contact.fullName) }}
        </span>
      </div>
      <div
        v-if="contact.online"
        class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"
      ></div>
    </div>
    <div class="ml-3 min-w-0 flex-1">
      <div class="flex justify-between">
        <p
          class="text-sm font-medium truncate"
          :class="active ? 'text-primary-900 dark:text-white' : 'text-gray-900 dark:text-white'"
        >
          {{ contact.fullName }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {{ formatLastMessageTime(contact.lastMessage?.timestamp) }}
        </p>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-xs truncate text-gray-500 dark:text-gray-400 max-w-[140px]">
          <span v-if="contact.lastMessage?.isLastMessageFromMe">Vous: </span>
          <span v-if="contact.isVoiceNote">🎤 Note vocale</span>
          <span v-else-if="contact.hasAttachments">📎 Pièce jointe</span>
          <span v-else>{{ contact.lastMessage?.content || 'Aucun message' }}</span>
        </p>
        <div
          v-if="contact.unreadCount > 0"
          class="flex-shrink-0 ml-2 h-5 w-5 rounded-full bg-primary-500 flex items-center justify-center"
        >
          <span class="text-xs text-white font-medium">
            {{ contact.unreadCount > 9 ? '9+' : contact.unreadCount }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useUserStore } from '@/stores/user';
import type { Contact } from '@/types/chat';

// Props
const props = defineProps<{
  contact: Contact;
  active: boolean;
}>();

// Emits
defineEmits<{
  (e: 'click'): void;
}>();

// Store
const userStore = useUserStore();

// Methods
const getInitials = (name: string): string => {
  const nameParts = name.split(' ');
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};

const formatLastMessageTime = (timestamp: string | undefined): string => {
  if (!timestamp) return '';

  try {
    const date = parseISO(timestamp);

    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: fr });
    } else if (isYesterday(date)) {
      return 'Hier';
    } else {
      return format(date, 'dd/MM', { locale: fr });
    }
  } catch (error) {
    return '';
  }
};
</script>
