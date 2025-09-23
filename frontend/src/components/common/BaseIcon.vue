<template>
  <svg :class="classes" :fill="fill" :stroke="stroke" :viewBox="viewBox">
    <!-- Home Icon -->
    <path
      v-if="name === 'home'"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />

    <!-- Logout Icon -->
    <path
      v-else-if="name === 'logout'"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />

    <!-- Plus Icon -->
    <path
      v-else-if="name === 'plus'"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 4v16m8-8H4"
    />

    <!-- Check Icon -->
    <path
      v-else-if="name === 'check'"
      fill-rule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clip-rule="evenodd"
    />

    <!-- Trash Icon -->
    <path
      v-else-if="name === 'trash'"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />

    <!-- Document Icon -->
    <path
      v-else-if="name === 'document'"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />

    <!-- Error Icon -->
    <path
      v-else-if="name === 'error'"
      fill-rule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clip-rule="evenodd"
    />

    <!-- Loading Spinner -->
    <template v-else-if="name === 'spinner'">
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </template>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  name:
    | "home"
    | "logout"
    | "plus"
    | "check"
    | "trash"
    | "document"
    | "error"
    | "spinner";
  size?: "sm" | "md" | "lg" | "xl";
  classes?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  classes: "",
});

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

const classes = computed(() => {
  const baseClasses = sizeClasses[props.size];
  return props.classes ? `${baseClasses} ${props.classes}` : baseClasses;
});

const fill = computed(() => {
  return ["check", "error"].includes(props.name) ? "currentColor" : "none";
});

const stroke = computed(() => {
  return ["check", "error"].includes(props.name) ? "none" : "currentColor";
});

const viewBox = computed(() => {
  return props.name === "spinner" ? "0 0 24 24" : "0 0 20 20";
});
</script>
