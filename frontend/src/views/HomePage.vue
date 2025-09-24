<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader :user="user" @logout="handleLogout" />

    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Loading state -->
      <div v-if="isLoadingTodos" class="flex justify-center items-center py-12">
        <BaseIcon name="spinner" size="xl" class="animate-spin text-blue-600" />
        <span class="ml-3 text-gray-600">Chargement des tâches...</span>
      </div>

      <!-- Error state -->
      <div
        v-else-if="loadError"
        class="bg-red-50 border border-red-200 rounded-md p-4 mb-6"
      >
        <div class="flex">
          <BaseIcon name="error" size="md" class="text-red-400 mr-3" />
          <div>
            <h3 class="text-sm font-medium text-red-800">
              Erreur de chargement
            </h3>
            <p class="mt-1 text-sm text-red-700">{{ loadError }}</p>
            <button
              class="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              @click="loadTodos"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>

      <!-- Success notification -->
      <div
        v-if="successMessage"
        class="bg-green-50 border border-green-200 rounded-md p-4 mb-6"
      >
        <div class="flex">
          <BaseIcon name="check" size="md" class="text-green-400 mr-3" />
          <div class="flex-1">
            <p class="text-sm text-green-800">{{ successMessage }}</p>
          </div>
          <button
            class="text-green-400 hover:text-green-600"
            @click="successMessage = ''"
          >
            ×
          </button>
        </div>
      </div>

      <TodoList
        v-if="!isLoadingTodos && !loadError"
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
import BaseIcon from "../components/common/BaseIcon.vue";
import { useAuth } from "../composables/useAuth";
import { todoService, ApiError } from "../services";
import type { Todo, NewTodo } from "../types/todo";

const { user, logout } = useAuth();

const todos = ref<Todo[]>([]);
const isLoadingTodos = ref(false);
const loadError = ref<string>("");
const successMessage = ref<string>("");

const loadTodos = async () => {
  try {
    isLoadingTodos.value = true;
    loadError.value = "";

    const fetchedTodos = await todoService.getTodos();
    todos.value = fetchedTodos;
  } catch (error) {
    console.error("Error loading todos:", error);

    if (error instanceof ApiError) {
      if (error.statusCode === 401) {
        loadError.value = "Session expirée. Veuillez vous reconnecter.";
        setTimeout(() => handleLogout(), 2000);
      } else if (error.statusCode === 500) {
        loadError.value = "Erreur serveur. Veuillez réessayer plus tard.";
      } else {
        loadError.value = error.message || "Impossible de charger les tâches.";
      }
    } else {
      loadError.value = "Une erreur inattendue s'est produite.";
    }
  } finally {
    isLoadingTodos.value = false;
  }
};

// Add a new todo
const handleAddTodo = async (newTodo: NewTodo): Promise<void> => {
  try {
    loadError.value = "";

    const createdTodo = await todoService.createTodo(newTodo);
    todos.value.push(createdTodo);
    successMessage.value = "Tâche créée avec succès";

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    console.error("Error creating todo:", error);

    if (error instanceof ApiError) {
      if (error.message.includes("already exists")) {
        loadError.value = "Une tâche avec ce titre existe déjà";
      } else {
        loadError.value = "Impossible de créer la tâche. " + error.message;
      }
    } else {
      loadError.value = "Erreur lors de la création de la tâche";
    }
  }
};

// Toggle todo completion
const handleToggleTodo = async (id: number): Promise<void> => {
  try {
    loadError.value = "";

    const todo = todos.value.find((t) => t.id === id);
    if (!todo) throw new Error(`Todo ${id} not found!`);

    const updatedTodo = await todoService.toggleTodo(todo);

    const index = todos.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      todos.value[index] = updatedTodo;
    }

    successMessage.value =
      todo.executionDate !== null
        ? "Tâche marquée comme complétée"
        : "Tâche marquée comme non complétée";

    setTimeout(() => {
      successMessage.value = "";
    }, 2000);
  } catch (error) {
    console.error("Error toggling todo:", error);
    loadError.value = "Impossible de modifier le statut de la tâche";
  }
};

// Delete a todo
const handleDeleteTodo = async (id: number): Promise<void> => {
  try {
    loadError.value = "";

    if (!confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      return;
    }

    await todoService.deleteTodo(id);

    todos.value = todos.value.filter((t) => t.id !== id);
    successMessage.value = "Tâche supprimée avec succès";

    setTimeout(() => {
      successMessage.value = "";
    }, 2000);
  } catch (error) {
    console.error("Error deleting todo:", error);

    if (error instanceof ApiError) {
      if (error.statusCode === 404) {
        loadError.value = "Cette tâche n'existe plus";
        // Remove from local list anyway
        todos.value = todos.value.filter((t) => t.id !== id);
      } else {
        loadError.value = "Impossible de supprimer la tâche";
      }
    } else {
      loadError.value = "Erreur lors de la suppression";
    }
  }
};

const handleLogout = async (): Promise<void> => {
  await logout();
};

// Load todos on component mount
onMounted(() => {
  loadTodos();
});
</script>
