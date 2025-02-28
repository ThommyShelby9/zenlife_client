<template>
  <li
    class="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
    :class="[
      task.priority === 'high' ? 'border-l-4 border-l-red-500' :
      task.priority === 'medium' ? 'border-l-4 border-l-yellow-500' :
      'border-l-4 border-l-blue-500'
    ]"
  >
    <div class="flex items-start space-x-3">
      <div class="flex-shrink-0 pt-1">
        <input
          type="checkbox"
          :checked="task.completed"
          @change="$emit('toggle-completion', task)"
          class="h-5 w-5 rounded border-gray-300 dark:border-gray-700 text-primary-600 focus:ring-primary-500 dark:bg-gray-700"
        />
      </div>
      <div>
        <p
          class="text-sm font-medium mb-1"
          :class="[
            task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
          ]"
        >
          {{ task.title }}
          <span
            v-if="task.dueTime"
            class="ml-2 text-xs font-normal rounded-full px-2 py-0.5"
            :class="[
              isOverdue ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
              'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            ]"
          >
            {{ task.dueTime }}
          </span>
        </p>
        <p
          v-if="task.notes"
          class="text-xs text-gray-500 dark:text-gray-400 whitespace-pre-line"
          :class="{ 'line-through': task.completed }"
        >
          {{ task.notes }}
        </p>
      </div>
    </div>
    <div class="flex space-x-2">
      <button
        @click="$emit('edit', task)"
        class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
      >
        <PencilIcon class="h-4 w-4" />
      </button>
      <button
        @click="confirmDelete"
        class="text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none"
      >
        <TrashIcon class="h-4 w-4" />
      </button>
    </div>

    <!-- Delete confirmation modal -->
    <TransitionRoot appear :show="showDeleteModal" as="template">
      <Dialog as="div" @close="showDeleteModal = false" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Confirmer la suppression
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.
                  </p>
                </div>

                <div class="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    @click="showDeleteModal = false"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    @click="handleDelete"
                  >
                    Supprimer
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </li>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';
import {
  PencilIcon,
  TrashIcon,
} from '@heroicons/vue/outline';
import type { PlannerTask } from '@/types/planner';

// Props and emits
const props = defineProps<{
  task: PlannerTask;
}>();

const emit = defineEmits<{
  'toggle-completion': [task: PlannerTask];
  'edit': [task: PlannerTask];
  'delete': [task: PlannerTask];
}>();

// Component state
const showDeleteModal = ref(false);

// Computed properties
const isOverdue = computed(() => {
  if (!props.task.dueTime || props.task.completed) return false;

  const now = new Date();
  const [hours, minutes] = props.task.dueTime.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes)) return false;

  return now.getHours() > hours || (now.getHours() === hours && now.getMinutes() > minutes);
});

// Methods
const confirmDelete = () => {
  showDeleteModal.value = true;
};

const handleDelete = () => {
  emit('delete', props.task);
  showDeleteModal.value = false;
};
</script>
