export type Priority = "Bas" | "Moyen" | "Haut";

export interface Todo {
  id: number;
  title: string;
  content: string;
  priority: Priority;
  completed: boolean;
  createdAt: Date;
}

export interface NewTodo {
  title: string;
  content: string;
  priority: Priority;
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
