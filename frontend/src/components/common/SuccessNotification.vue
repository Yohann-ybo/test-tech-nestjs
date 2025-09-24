<template>
  <div
    v-if="visible"
    class="bg-green-50 border border-green-200 rounded-md p-4 mb-6"
  >
    <div class="flex">
      <BaseIcon name="check" size="md" class="text-green-400 mr-3" />
      <div class="flex-1">
        <p class="text-sm text-green-800">{{ message }}</p>
      </div>
      <button class="text-green-400 hover:text-green-600" @click="close">
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import BaseIcon from "../common/BaseIcon.vue";

const props = defineProps<{
  message: string;
  duration?: number;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const visible = ref(true);
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const close = () => {
  visible.value = false;
  emit("close");
};

watch(
  () => props.message,
  (newMessage) => {
    if (newMessage) {
      visible.value = true;
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        close();
      }, props.duration ?? 3000);
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (timeoutId) clearTimeout(timeoutId);
});
</script>
