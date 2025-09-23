<template>
  <div
    class="route-loading fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75"
  >
    <div class="text-center">
      <BaseIcon
        name="spinner"
        size="xl"
        class="animate-spin text-blue-600 mx-auto mb-4"
      />
      <p class="text-gray-600">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from "./BaseIcon.vue";

interface Props {
  message?: string;
}

withDefaults(defineProps<Props>(), {
  message: "Chargement...",
});
</script>
