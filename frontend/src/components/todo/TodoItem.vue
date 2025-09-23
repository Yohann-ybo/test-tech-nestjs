<template>
  <div class="p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-3">
          <input
            type="checkbox"
            :checked="todo.completed"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            @change="$emit('toggle', todo.id)"
          />
          <h4
            class="text-sm font-medium text-gray-900"
            :class="{ 'line-through text-gray-500': todo.completed }"
          >
            {{ todo.title }}
          </h4>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getPriorityClasses(todo.priority)"
          >
            {{ todo.priority }}
          </span>
        </div>
        <p
          v-if="todo.content"
          class="mt-2 text-sm text-gray-600"
          :class="{ 'line-through text-gray-400': todo.completed }"
        >
          {{ todo.content }}
        </p>
        <p class="mt-2 text-xs text-gray-500">
          Créé le {{ formatDate(todo.createdAt) }}
        </p>
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
import BaseIcon from "@/components/common/BaseIcon.vue";
import { getPriorityClasses } from "@/helpers/priority";
import { formatDate } from "@/helpers/date";
import type { Todo } from "@/types/todo";

interface Props {
  todo: Todo;
}

interface Emits {
  (e: "toggle", id: number): void;
  (e: "delete", id: number): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
