export type Priority = "HIGH" | "MEDIUM" | "LOW";

export interface Todo {
  id: number;
  title: string;
  content: string;
  priority: Priority;
  executionDate: Date | null; // null means not completed
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
}

export interface NewTodo {
  title: string;
  content: string;
  priority: Priority;
  executionDate?: Date | null;
}

export interface TodoFormErrors {
  title: string;
  content: string;
  priority: string;
}

export interface Option {
  value: string;
  label: string;
}

export function isTodoCompleted(todo: Todo): boolean {
  return todo.executionDate !== null;
}
