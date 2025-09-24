<template>
  <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <BaseInput
        id="todo-title"
        v-model="form.title"
        label="Titre de la tâche"
        :maxlength="VALIDATION_LIMITS.TITLE_MAX_LENGTH"
        :show-counter="true"
        :error="errors.title"
        placeholder="Entrez le titre de la tâche"
        required
      />

      <BaseInput
        id="todo-content"
        v-model="form.content"
        label="Description"
        type="textarea"
        :maxlength="VALIDATION_LIMITS.CONTENT_MAX_LENGTH"
        :show-counter="true"
        :error="errors.content"
        placeholder="Décrivez la tâche..."
        :rows="3"
      />

      <BaseSelect
        id="todo-priority"
        v-model="form.priority"
        label="Niveau de priorité"
        :options="priorityOptions"
        :error="errors.priority"
      />

      <div class="flex justify-end space-x-3">
        <button
          type="button"
          :class="BUTTON_CLASSES.SECONDARY"
          @click="$emit('cancel')"
        >
          Annuler
        </button>
        <button
          type="submit"
          :disabled="isFormEmpty"
          :class="submitButtonClasses"
        >
          Ajouter la tâche
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import BaseInput from "@/components/common/BaseInput.vue";
import BaseSelect from "@/components/common/BaseSelect.vue";
import {
  TodoValidator,
  VALIDATION_LIMITS,
  ALLOWED_PRIORITIES,
} from "@/helpers/validation";
import type { NewTodo, TodoFormErrors, Priority } from "@/types/todo";
import { BUTTON_CLASSES } from "@/constants/styles";

interface Emits {
  (e: "submit", todo: NewTodo): void;
  (e: "cancel"): void;
}

const emit = defineEmits<Emits>();

const form = reactive<NewTodo>({
  title: "",
  content: "",
  priority: "MEDIUM",
  executionDate: null, // New todos are not completed
});

const errors = reactive<TodoFormErrors>({
  title: "",
  content: "",
  priority: "",
});

const isFormEmpty = computed(() => {
  return !form.title.trim();
});

const submitButtonClasses = computed(() => {
  const baseClasses = BUTTON_CLASSES.PRIMARY;
  const disabledClasses = isFormEmpty.value ? BUTTON_CLASSES.DISABLED : "";
  return `${baseClasses} ${disabledClasses}`;
});

const priorityOptions = ALLOWED_PRIORITIES.map((priority) => ({
  value: priority,
  label: priority,
}));

watch(
  () => form.title,
  (newTitle) => {
    errors.title = TodoValidator.validateTitle(newTitle);
  }
);

watch(
  () => form.content,
  (newContent) => {
    errors.content = TodoValidator.validateContent(newContent);
  }
);

watch(
  () => form.priority,
  (newPriority) => {
    errors.priority = TodoValidator.validatePriority(newPriority as Priority);
  }
);

const handleSubmit = () => {
  const formErrors = TodoValidator.validateForm(form);
  Object.assign(errors, formErrors);

  if (!TodoValidator.hasErrors(formErrors)) {
    emit("submit", { ...form });
    resetForm();
  }
};

const resetForm = () => {
  form.title = "";
  form.content = "";
  form.priority = "MEDIUM";
  form.executionDate = null;
  errors.title = "";
  errors.content = "";
  errors.priority = "";
};

defineExpose({ resetForm });
</script>
