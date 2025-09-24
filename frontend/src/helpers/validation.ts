import type { Priority, NewTodo, TodoFormErrors } from "@/types/todo";

export const ALLOWED_PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH"];

export const VALIDATION_LIMITS = {
  TITLE_MAX_LENGTH: 50,
  CONTENT_MAX_LENGTH: 256,
} as const;

export class TodoValidator {
  static validateTitle(title: string): string {
    if (!title.trim()) {
      return "Le titre est requis";
    }

    if (title.length > VALIDATION_LIMITS.TITLE_MAX_LENGTH) {
      return `Le titre ne peut pas dépasser ${VALIDATION_LIMITS.TITLE_MAX_LENGTH} caractères`;
    }

    return "";
  }

  static validateContent(content: string): string {
    if (content.length > VALIDATION_LIMITS.CONTENT_MAX_LENGTH) {
      return `La description ne peut pas dépasser ${VALIDATION_LIMITS.CONTENT_MAX_LENGTH} caractères`;
    }

    return "";
  }

  static validatePriority(priority: Priority): string {
    if (!ALLOWED_PRIORITIES.includes(priority)) {
      return "La priorité doit être 'Bas', 'Moyen' ou 'Haut'";
    }

    return "";
  }

  static validateForm(todo: NewTodo): TodoFormErrors {
    return {
      title: this.validateTitle(todo.title),
      content: this.validateContent(todo.content),
      priority: this.validatePriority(todo.priority),
    };
  }

  static hasErrors(errors: TodoFormErrors): boolean {
    return Object.values(errors).some((error) => error !== "");
  }
}
