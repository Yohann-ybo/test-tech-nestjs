<template>
  <div>
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
    </label>

    <select
      :id="id"
      :value="modelValue"
      :class="selectClasses"
      @change="handleChange"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

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

interface Option {
  value: string;
  label: string;
}

interface Props {
  id?: string;
  label?: string;
  modelValue?: string;
  options: Option[];
  error?: string;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  id: "",
  label: "",
  modelValue: "",
  error: "",
});
const emit = defineEmits<Emits>();

const selectClasses = computed(() => {
  const stateClass = props.error
    ? FORM_INPUT_CLASSES.ERROR
    : FORM_INPUT_CLASSES.NORMAL;
  return `${FORM_INPUT_CLASSES.BASE} ${stateClass}`;
});

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:modelValue", target.value);
};
</script>
