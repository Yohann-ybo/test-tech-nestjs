<template>
  <div class="min-h-screen bg-gray-50">
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow-lg rounded-lg border border-gray-200">
        <div
          class="px-6 py-4 border-b border-gray-200 flex justify-between items-center"
        >
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              Ma Liste de Tâches
            </h3>
            <p class="text-sm text-gray-500">
              {{ todos.length }} tâche(s) au total
            </p>
          </div>
          <button
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            @click="showAddForm = !showAddForm"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            {{ showAddForm ? "Annuler" : "Nouvelle Tâche" }}
          </button>
        </div>

        <div
          v-if="showAddForm"
          class="px-6 py-4 bg-gray-50 border-b border-gray-200"
        >
          <form class="space-y-4" @submit.prevent="addTodo">
            <div>
              <label
                for="title"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Titre de la tâche
              </label>
              <input
                id="title"
                v-model="newTodo.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Entrez le titre de la tâche"
              />
            </div>

            <div>
              <label
                for="content"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="content"
                v-model="newTodo.content"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Décrivez la tâche..."
              />
            </div>

            <div>
              <label
                for="priority"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Niveau de priorité
              </label>
              <select
                id="priority"
                v-model="newTodo.priority"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Bas">Bas</option>
                <option value="Moyen">Moyen</option>
                <option value="Haut">Haut</option>
              </select>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                type="button"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                @click="resetForm"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Ajouter la tâche
              </button>
            </div>
          </form>
        </div>

        <div class="divide-y divide-gray-200">
          <div v-if="todos.length === 0" class="p-6 text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune tâche</h3>
            <p class="mt-1 text-sm text-gray-500">
              Commencez par ajouter votre première tâche.
            </p>
          </div>

          <div
            v-for="todo in sortedTodos"
            :key="todo.id"
            class="p-6 hover:bg-gray-50 transition duration-150 ease-in-out"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    :checked="todo.completed"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    @change="toggleTodo(todo.id)"
                  />
                  <h4
                    class="text-sm font-medium text-gray-900"
                    :class="{ 'line-through text-gray-500': todo.completed }"
                  >
                    {{ todo.title }}
                  </h4>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getPriorityClasses(todo.priority)"
                  >
                    {{ todo.priority }}
                  </span>
                </div>
                <p
                  v-if="todo.content"
                  class="mt-2 text-sm text-gray-600"
                  :class="{ 'line-through text-gray-400': todo.completed }"
                >
                  {{ todo.content }}
                </p>
                <p class="mt-2 text-xs text-gray-500">
                  Créé le {{ formatDate(todo.createdAt) }}
                </p>
              </div>
              <button
                class="ml-4 text-red-400 hover:text-red-600 transition duration-150 ease-in-out"
                @click="deleteTodo(todo.id)"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

type Priority = "Bas" | "Moyen" | "Haut";

interface Todo {
  id: number;
  title: string;
  content: string;
  priority: Priority;
  completed: boolean;
  createdAt: Date;
}

interface NewTodo {
  title: string;
  content: string;
  priority: Priority;
}

const showAddForm = ref<boolean>(false);
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

const newTodo = ref<NewTodo>({
  title: "",
  content: "",
  priority: "Moyen",
});

const sortedTodos = computed(() => {
  const priorityOrder = { Haut: 3, Moyen: 2, Bas: 1 };
  return [...todos.value].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
});

const getPriorityClasses = (priority: Priority): string => {
  const classes = {
    Haut: "bg-red-100 text-red-800",
    Moyen: "bg-yellow-100 text-yellow-800",
    Bas: "bg-green-100 text-green-800",
  };
  return classes[priority];
};

const addTodo = (): void => {
  if (newTodo.value.title.trim()) {
    const todo: Todo = {
      id: Date.now(),
      title: newTodo.value.title.trim(),
      content: newTodo.value.content.trim(),
      priority: newTodo.value.priority,
      completed: false,
      createdAt: new Date(),
    };

    todos.value.push(todo);
    resetForm();
  }
};

const resetForm = (): void => {
  newTodo.value = {
    title: "",
    content: "",
    priority: "Moyen",
  };
  showAddForm.value = false;
};

const toggleTodo = (id: number): void => {
  const todo = todos.value.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
};

const deleteTodo = (id: number): void => {
  todos.value = todos.value.filter((t) => t.id !== id);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};
</script>
