<template>
  <div class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
    <div class="flex">
      <BaseIcon name="error" size="md" class="text-red-400 mr-3" />
      <div>
        <h3 class="text-sm font-medium text-red-800">Erreur</h3>
        <p class="mt-1 text-sm text-red-700">{{ message }}</p>
        <button
          v-if="retry"
          class="mt-2 text-sm text-red-600 hover:text-red-500 underline"
          @click="$emit('retry')"
        >
          Réessayer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from "../common/BaseIcon.vue";

defineProps<{
  message: string;
  retry?: boolean;
}>();

defineEmits<{
  (e: "retry"): void;
}>();
</script>
