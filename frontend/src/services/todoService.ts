import { authenticatedRequest } from "./apiClient";
import type { Todo, NewTodo } from "@/types/todo";

export async function getTodos(): Promise<Todo[]> {
  return authenticatedRequest<Todo[]>("/todos");
}

export async function createTodo(todo: NewTodo): Promise<Todo> {
  return authenticatedRequest<Todo>("/todos", {
    method: "POST",
    body: JSON.stringify(todo),
  });
}

export async function deleteTodo(id: number): Promise<void> {
  await authenticatedRequest<void>(`/todos/${id}`, {
    method: "DELETE",
  });
}

export async function toggleTodo(todo: Todo): Promise<Todo> {
  if (todo.executionDate != null) {
    return uncompleteTodo(todo.id);
  }
  return completeTodo(todo.id);
}

async function completeTodo(id: number): Promise<Todo> {
  return updateTodo(id, { executionDate: new Date() });
}

async function uncompleteTodo(id: number): Promise<Todo> {
  return updateTodo(id, { executionDate: null });
}

async function updateTodo(id: number, updates: Partial<Todo>): Promise<Todo> {
  return authenticatedRequest<Todo>(`/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}
