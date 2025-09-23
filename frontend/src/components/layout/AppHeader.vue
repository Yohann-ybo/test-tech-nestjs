<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo/Title -->
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0">
            <div
              class="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center"
            >
              <BaseIcon name="home" size="lg" class="text-white" />
            </div>
          </div>
          <div>
            <h1 class="text-xl font-semibold text-gray-900">Dashboard</h1>
            <p class="text-sm text-gray-500">{{ welcomeMessage }}</p>
          </div>
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <!-- User Info -->
          <div class="hidden sm:block text-right">
            <p class="text-sm font-medium text-gray-900">
              {{ displayUserName }}
            </p>
            <p class="text-xs text-gray-500">{{ user?.email }}</p>
          </div>

          <!-- User Avatar -->
          <div class="relative">
            <div
              class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
            >
              <span class="text-sm font-medium text-gray-700">{{
                userInitial
              }}</span>
            </div>
          </div>

          <!-- Logout Button -->
          <button
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
            @click="$emit('logout')"
          >
            <BaseIcon name="logout" size="sm" class="mr-2" />
            Logout
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

interface Props {
  user: User | null;
}

interface Emits {
  (e: "logout"): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

const welcomeMessage = computed(() => {
  return props.user?.name ? `Welcome, ${props.user.name}!` : "Welcome!";
});

const displayUserName = computed(() => {
  return props.user?.name || "User";
});

const userInitial = computed(() => {
  return props.user?.name?.charAt(0).toUpperCase() || "U";
});
</script>
