<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full text-center">
      <div class="mb-8">
        <div class="relative">
          <h1 class="text-9xl font-bold text-gray-200 select-none">404</h1>

          <div class="absolute inset-0 flex items-center justify-center">
            <BaseIcon name="error" size="xl" class="text-gray-400" />
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Page introuvable</h2>
        <p class="text-gray-600 mb-2">
          Désolé, la page que vous recherchez n'existe pas.
        </p>
        <p class="text-sm text-gray-500">test</p>
      </div>

      <div class="space-y-4">
        <button :class="BUTTON_CLASSES.SECONDARY" @click="goHome">
          Aller au tableau de bord
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import BaseIcon from "@/components/common/BaseIcon.vue";
import { BUTTON_CLASSES } from "@/constants/styles";
import { ROUTE_NAMES } from "@/types/route";

const router = useRouter();

const goHome = (): void => {
  router.push({ name: ROUTE_NAMES.HOME });
};
</script>
