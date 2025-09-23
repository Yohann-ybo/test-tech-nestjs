<template>
  <div>
    <div
      v-if="label || showCounter"
      class="flex justify-between items-center mb-1"
    >
      <label
        v-if="label"
        :for="id"
        class="block text-sm font-medium text-gray-700"
      >
        {{ label }}
      </label>
      <span v-if="showCounter" class="text-xs text-gray-500">
        {{ modelValue?.length || 0 }}/{{ maxlength }}
      </span>
    </div>

    <component
      :is="type === 'textarea' ? 'textarea' : 'input'"
      :id="id"
      :type="type !== 'textarea' ? type : undefined"
      :value="modelValue"
      :required="required"
      :maxlength="maxlength"
      :rows="type === 'textarea' ? rows : undefined"
      :placeholder="placeholder"
      :class="inputClasses"
      @input="handleInput"
    />

    <div v-if="error" class="mt-1 text-sm text-red-600 flex items-center">
      <BaseIcon name="error" size="sm" classes="mr-1" />
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseIcon from "@/components/common/BaseIcon.vue";
import { FORM_INPUT_CLASSES } from "@/constants/styles";

interface Props {
  id: string;
  label?: string;
  type?: "text" | "email" | "password" | "textarea";
  modelValue?: string;
  placeholder?: string;
  required?: boolean;
  maxlength?: number;
  rows?: number;
  error?: string;
  showCounter?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  type: "text",
  modelValue: "",
  placeholder: "",
  required: false,
  maxlength: undefined,
  rows: 3,
  error: "",
  showCounter: false,
});

const emit = defineEmits<Emits>();

const inputClasses = computed(() => {
  const stateClass = props.error
    ? FORM_INPUT_CLASSES.ERROR
    : FORM_INPUT_CLASSES.NORMAL;
  return `${FORM_INPUT_CLASSES.BASE} ${stateClass}`;
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  emit("update:modelValue", target.value);
};
</script>
