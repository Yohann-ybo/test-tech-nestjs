<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader :user="user" @logout="handleLogout" />

    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <TodoList
        :todos="todos"
        @add="handleAddTodo"
        @toggle="handleToggleTodo"
        @delete="handleDeleteTodo"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import AppHeader from "../components/layout/AppHeader.vue";
import TodoList from "../components/todo/TodoList.vue";
import { useAuth } from "../composables/useAuth";
import type { Todo, NewTodo } from "../types/todo";

const { user, logout, requireAuth, initializeAuth } = useAuth();

const todos = ref<Todo[]>([
  {
    id: 1,
    title: "Finaliser le projet Vue.js",
    content: "Terminer l'implémentation des composants et tester l'application",
    priority: "Haut",
    completed: false,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    title: "Réunion équipe",
    content: "Point hebdomadaire avec l'équipe de développement",
    priority: "Moyen",
    completed: true,
    createdAt: new Date("2024-01-14"),
  },
  {
    id: 3,
    title: "Mise à jour documentation",
    content: "",
    priority: "Bas",
    completed: false,
    createdAt: new Date("2024-01-13"),
  },
]);

const handleAddTodo = (newTodo: NewTodo): void => {
  const todo: Todo = {
    id: Date.now(),
    title: newTodo.title.trim(),
    content: newTodo.content.trim(),
    priority: newTodo.priority,
    completed: false,
    createdAt: new Date(),
  };

  todos.value.push(todo);
};

const handleToggleTodo = (id: number): void => {
  const todo = todos.value.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
};

const handleDeleteTodo = (id: number): void => {
  todos.value = todos.value.filter((t) => t.id !== id);
};

const handleLogout = async (): Promise<void> => {
  await logout();
};

onMounted(() => {
  initializeAuth();

  if (!requireAuth()) {
    return;
  }
});
</script>
