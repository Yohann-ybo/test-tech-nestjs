<template>
  <div class="bg-white shadow-lg rounded-lg border border-gray-200">
    <!-- Header -->
    <div
      class="px-6 py-4 border-b border-gray-200 flex justify-between items-center"
    >
      <div>
        <h3 class="text-lg font-medium text-gray-900">Ma Liste de Tâches</h3>
        <p class="text-sm text-gray-500">{{ todoLenght }} tâche(s) au total</p>
      </div>
      <button
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        @click="toggleForm"
      >
        <BaseIcon name="plus" size="sm" classes="mr-2" />
        {{ showAddForm ? "Annuler" : "Nouvelle Tâche" }}
      </button>
    </div>

    <!-- Add Todo Form -->
    <TodoForm
      v-if="showAddForm"
      ref="todoFormRef"
      @submit="handleAddTodo"
      @cancel="handleCancelForm"
    />

    <!-- Todo Items -->
    <div class="divide-y divide-gray-200">
      <!-- Empty State -->
      <div v-if="todos.length === 0" class="p-6 text-center">
        <BaseIcon
          name="document"
          size="xl"
          classes="mx-auto text-gray-400 mb-4"
        />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune tâche</h3>
        <p class="mt-1 text-sm text-gray-500">
          Commencez par ajouter votre première tâche.
        </p>
      </div>

      <!-- Todo Items -->
      <TodoItem
        v-for="todo in sortedTodos"
        :key="todo.id"
        :todo="todo"
        @toggle="$emit('toggle', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BaseIcon from "@/components/common/BaseIcon.vue";
import TodoForm from "@/components/todo/TodoForm.vue";
import TodoItem from "@/components/todo/TodoItem.vue";
import { sortTodosByPriority } from "@/helpers/priority";
import type { Todo, NewTodo } from "@/types/todo";

interface Props {
  todos: Todo[];
}

interface Emits {
  (e: "add", todo: NewTodo): void;
  (e: "toggle", id: number): void;
  (e: "delete", id: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const showAddForm = ref(false);
const todoFormRef = ref<InstanceType<typeof TodoForm>>();

const sortedTodos = computed(() => sortTodosByPriority(props.todos));
const todoLenght = computed(() => props.todos.length);

const toggleForm = () => {
  showAddForm.value = !showAddForm.value;
  if (!showAddForm.value) {
    todoFormRef.value?.resetForm();
  }
};

const handleAddTodo = (todo: NewTodo) => {
  emit("add", todo);
  showAddForm.value = false;
};

const handleCancelForm = () => {
  showAddForm.value = false;
  todoFormRef.value?.resetForm();
};
</script>
