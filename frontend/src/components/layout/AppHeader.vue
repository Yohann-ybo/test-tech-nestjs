<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <div
              class="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center"
            >
              <BaseIcon name="home" size="lg" class="text-white" />
            </div>
          </div>
          <div>
            <h1 class="text-xl font-semibold text-gray-900">My Todo List</h1>
            <p class="text-sm text-gray-500">{{ getWelcomeMessage }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div class="hidden sm:block text-right">
            <p class="text-sm font-medium text-gray-900">
              {{ displayUserName }}
            </p>
            <p class="text-xs text-gray-500">{{ user?.email }}</p>
          </div>

          <div class="relative">
            <div
              class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
            >
              <span class="text-sm font-medium text-gray-700">{{
                getUserInitial
              }}</span>
            </div>
          </div>

          <button :class="BUTTON_CLASSES.DANGER" @click="$emit('logout')">
            <BaseIcon name="logout" size="sm" class="mr-2" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseIcon from "@/components/common/BaseIcon.vue";
import type { User } from "@/types/auth";
import { BUTTON_CLASSES } from "@/constants/styles";

interface Props {
  user: User | null;
}

interface Emits {
  (e: "logout"): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

const getUserInitial = computed(() => {
  return props.user?.name?.charAt(0).toUpperCase() || "U";
});

const displayUserName = computed(() => {
  return props.user?.name || "User";
});

const getWelcomeMessage = computed(() => {
  return props.user?.name ? `Bienvenue, ${props.user.name} !` : "Bienvenue!";
});
</script>
