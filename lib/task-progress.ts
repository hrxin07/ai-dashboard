import { TaskStatus } from "@prisma/client";

export function getTaskProgress(
  subtasks: Array<{ completed: boolean }>,
  manualProgress: number,
) {
  if (!subtasks.length) return manualProgress;
  return Math.round(
    (subtasks.filter((subtask) => subtask.completed).length / subtasks.length) *
      100,
  );
}

export function getTaskStatus(progress: number): TaskStatus {
  if (progress >= 100) return TaskStatus.COMPLETED;
  if (progress > 0) return TaskStatus.IN_PROGRESS;
  return TaskStatus.TODO;
}
