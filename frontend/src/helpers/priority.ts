import type { Priority, Todo } from "@/types/todo";

export const getPriorityClasses = (priority: Priority): string => {
  const classes = {
    Haut: "bg-red-100 text-red-800",
    Moyen: "bg-yellow-100 text-yellow-800",
    Bas: "bg-green-100 text-green-800",
  };
  return classes[priority];
};

export const sortTodosByPriority = (todos: Todo[]): Todo[] => {
  const priorityOrder = { Haut: 3, Moyen: 2, Bas: 1 };

  return [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};
