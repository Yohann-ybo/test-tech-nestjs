import type { Priority, Todo } from "@/types/todo";

export const formatPriority = (priority: Priority) => {
  if (priority === "HIGH") return "HAUT";
  if (priority === "MEDIUM") return "MOYEN";
  if (priority === "LOW") return "BAS";
};

export const getPriorityClasses = (priority: Priority): string => {
  const classes = {
    HIGH: "bg-red-100 text-red-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    LOW: "bg-green-100 text-green-800",
  };
  return classes[priority];
};

export const sortTodosByPriority = (todos: Todo[]): Todo[] => {
  const priorityOrder = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  };

  return [...todos].sort((a, b) => {
    // First sort by completion status (uncompleted first)
    const aCompleted = a.executionDate !== null;
    const bCompleted = b.executionDate !== null;

    if (aCompleted !== bCompleted) {
      return aCompleted ? 1 : -1;
    }

    // Then sort by priority
    const aPriority = priorityOrder[a.priority] || 0;
    const bPriority = priorityOrder[b.priority] || 0;
    return bPriority - aPriority;
  });
};
