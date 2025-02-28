// src/components/planner/MoodEmoji.vue
<template>
  <div class="flex items-center space-x-2">
    <span class="text-sm text-gray-500 dark:text-gray-400">Humeur du jour:</span>
    <div class="flex space-x-1">
      <button
        v-for="(emoji, index) in moodEmojis"
        :key="index"
        @click="updateMood(index + 1)"
        class="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none text-xl transition-all"
        :class="{ 'bg-gray-100 dark:bg-gray-700 transform scale-125': modelValue === index + 1 }"
        :title="getMoodLabel(index + 1)"
      >
        {{ emoji }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
  modelValue: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

// Émojis d'humeur, du plus triste au plus heureux
const moodEmojis = ref(['😞', '😟', '😐', '🙂', '😄']);

// Étiquettes descriptives pour chaque niveau d'humeur
const moodLabels = [
  'Très mauvaise humeur',
  'Mauvaise humeur',
  'Humeur neutre',
  'Bonne humeur',
  'Excellente humeur'
];

// Mettre à jour l'humeur sélectionnée
const updateMood = (rating: number) => {
  emit('update:modelValue', rating);
};

// Obtenir l'étiquette descriptive pour un niveau d'humeur
const getMoodLabel = (rating: number) => {
  return moodLabels[rating - 1] || '';
};
</script>
