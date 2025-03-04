
<template>
  <div class="relative" :class="[sizeClasses, {'group': editable}]">
    <div
      v-if="loading && imageUrl && !error"
      class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full"
    >
      <svg class="animate-spin h-1/3 w-1/3 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <img
      v-if="imageUrl && !error"
      :src="getFullImageUrl(imageUrl)"
      :alt="alt"
      class="rounded-full object-cover w-full h-full"
      @error="handleError"
      @load="handleLoad"
    />

    <div
      v-else
      class="rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center w-full h-full"
    >
      <span class="font-medium text-primary-800 dark:text-primary-200" :class="initialsClasses">
        {{ initials }}
      </span>
    </div>

    <div
      v-if="editable"
      class="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
      @click="$emit('edit')"
    >
      <slot name="edit-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-1/4 w-1/4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  imageUrl: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: 'Avatar'
  },
  initials: {
    type: String,
    default: 'U'
  },
  size: {
    type: String,
    default: 'md' // xs, sm, md, lg, xl
  },
  editable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['edit', 'error', 'load']);

const error = ref(false);
const loading = ref(true);

// Classe CSS selon la taille
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'h-8 w-8';
    case 'sm': return 'h-10 w-10';
    case 'md': return 'h-12 w-12';
    case 'lg': return 'h-16 w-16';
    case 'xl': return 'h-24 w-24';
    case '2xl': return 'h-32 w-32';
    default: return 'h-12 w-12';
  }
});

// Classe CSS pour la taille du texte des initiales
const initialsClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'text-xs';
    case 'sm': return 'text-sm';
    case 'md': return 'text-base';
    case 'lg': return 'text-lg';
    case 'xl': return 'text-2xl';
    case '2xl': return 'text-3xl';
    default: return 'text-base';
  }
});

// Fonction pour obtenir l'URL complète de l'image
const getFullImageUrl = (url: string): string => {
  if (!url) {
    return '/img/default-profile.png';
  }

  // Si l'URL est déjà complète (http ou https), l'utiliser telle quelle
  if (url.startsWith('http')) {
    return url;
  }

  // Sinon, préfixer avec l'URL de l'API (pour les anciens avatars)
  return `${import.meta.env.VITE_APP_API_URL.replace(/\/api$/, '')}${url}`;
};

const handleError = () => {
  error.value = true;
  loading.value = false;
  emit('error');
};

const handleLoad = () => {
  loading.value = false;
  emit('load');
};

onMounted(() => {
  // Si pas d'URL d'image, ne pas attendre le chargement
  if (!props.imageUrl) {
    loading.value = false;
  }
});
</script>
