import { z } from "zod";

export const taskType = z.enum([
  "COURSE",
  "PROJECT",
  "COMPETITION",
  "JOB_PREP",
  "OTHER",
]);
export const taskPriority = z.enum(["HIGH", "MEDIUM", "LOW"]);
export const taskStatus = z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]);

const subtaskSchema = z.object({
  id: z.string().cuid().optional(),
  title: z
    .string()
    .trim()
    .min(1, "请输入小任务标题")
    .max(120, "小任务标题不能超过 120 个字符"),
  completed: z.boolean().default(false),
  sortOrder: z.number().int().min(0).optional(),
});

const taskFields = {
  title: z
    .string()
    .trim()
    .min(1, "请输入任务标题")
    .max(120, "任务标题不能超过 120 个字符"),
  type: taskType.default("OTHER"),
  priority: taskPriority.default("MEDIUM"),
  // Kept for backwards-compatible API callers. The server always derives the final status.
  status: taskStatus.optional(),
  progress: z
    .number()
    .int("完成进度必须是整数")
    .min(0, "完成进度不能小于 0")
    .max(100, "完成进度不能超过 100")
    .default(0),
  deadline: z.string().optional(),
  scheduleDate: z.string().optional(),
  description: z
    .string()
    .trim()
    .max(2000, "任务说明不能超过 2000 个字符")
    .optional(),
  subtasks: z
    .array(subtaskSchema)
    .max(50, "每个任务最多包含 50 个小任务")
    .default([]),
};

export const taskSchema = z.object(taskFields);
export const taskUpdateSchema = z.object({
  title: taskFields.title.optional(),
  type: taskType.optional(),
  priority: taskPriority.optional(),
  status: taskStatus.optional(),
  progress: taskFields.progress.optional(),
  deadline: taskFields.deadline,
  scheduleDate: taskFields.scheduleDate,
  description: taskFields.description,
  subtasks: taskFields.subtasks.optional(),
});
