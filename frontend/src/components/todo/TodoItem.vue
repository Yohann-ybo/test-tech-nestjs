<template>
  <div class="p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-3">
          <input
            type="checkbox"
            :checked="isCompleted"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            @change="$emit('toggle', todo.id)"
          />
          <h4
            class="text-sm font-medium text-gray-900"
            :class="{ 'line-through text-gray-500': isCompleted }"
          >
            {{ todo.title }}
          </h4>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getPriorityClasses(todo.priority)"
          >
            {{ formatPriority(todo.priority) }}
          </span>
        </div>
        <p
          v-if="todo.content"
          class="mt-2 text-sm text-gray-600"
          :class="{ 'line-through text-gray-400': isCompleted }"
        >
          {{ todo.content }}
        </p>
        <div class="mt-2 text-xs text-gray-500 space-y-1">
          <p>Créé le {{ formatDate(todo.createdAt) }}</p>
          <p v-if="todo.executionDate" class="text-green-600">
            ✓ Complété le {{ formatDateTime(todo.executionDate) }}
          </p>
        </div>
      </div>
      <button
        class="ml-4 text-red-400 hover:text-red-600 transition duration-150 ease-in-out"
        @click="$emit('delete', todo.id)"
      >
        <BaseIcon name="trash" size="md" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseIcon from "@/components/common/BaseIcon.vue";
import { getPriorityClasses, formatPriority } from "@/helpers/priority";
import { formatDate, formatDateTime } from "@/helpers/date";
import type { Todo } from "@/types/todo";

interface Props {
  todo: Todo;
}

interface Emits {
  (e: "toggle", id: number): void;
  (e: "delete", id: number): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

const isCompleted = computed(() => props.todo.executionDate !== null);
</script>
