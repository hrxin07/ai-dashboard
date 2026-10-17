import type { Prisma } from "@prisma/client";
import { TaskPriority, TaskStatus, TaskType } from "@prisma/client";
import { getTaskProgress, getTaskStatus } from "@/lib/task-progress";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getCurrentAuthUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import {
  taskPriority,
  taskSchema,
  taskStatus,
  taskType,
} from "@/lib/validations/task";

export const taskSelect = {
  id: true,
  title: true,
  type: true,
  priority: true,
  status: true,
  progress: true,
  deadline: true,
  scheduleDate: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  subtasks: { orderBy: { sortOrder: "asc" } },
} satisfies Prisma.LearningTaskSelect;

export async function GET(request: Request) {
  const user = await getCurrentAuthUser();
  if (!user) return errorResponse("未登录或登录状态已过期", 401);

  const query = new URL(request.url).searchParams;
  const filters: Prisma.LearningTaskWhereInput = { userId: user.id };
  const status = query.get("status");
  const type = query.get("type");
  const priority = query.get("priority");

  if (status) {
    const parsed = taskStatus.safeParse(status);
    if (!parsed.success) return errorResponse("无效的状态筛选条件", 400);
    filters.status = status as TaskStatus;
  }
  if (type) {
    const parsed = taskType.safeParse(type);
    if (!parsed.success) return errorResponse("无效的类型筛选条件", 400);
    filters.type = type as TaskType;
  }
  if (priority) {
    const parsed = taskPriority.safeParse(priority);
    if (!parsed.success) return errorResponse("无效的优先级筛选条件", 400);
    filters.priority = priority as TaskPriority;
  }

  try {
    const tasks = await prisma.learningTask.findMany({
      where: filters,
      orderBy: [{ status: "asc" }, { deadline: "asc" }, { createdAt: "desc" }],
      select: taskSelect,
    });
    return successResponse(tasks, "获取学习任务成功");
  } catch (error) {
    console.error(error);
    return errorResponse("学习任务读取失败", 500);
  }
}

export async function POST(request: Request) {
  const user = await getCurrentAuthUser();
  if (!user) return errorResponse("未登录或登录状态已过期", 401);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("请求数据格式不正确", 400);
  }
  const parsed = taskSchema.safeParse(payload);
  if (!parsed.success)
    return errorResponse(
      parsed.error.issues[0]?.message ?? "任务格式不正确",
      400,
    );

  const deadline = parsed.data.deadline ? new Date(parsed.data.deadline) : null;
  const scheduleDate = parsed.data.scheduleDate
    ? new Date(parsed.data.scheduleDate)
    : null;
  if (deadline && Number.isNaN(deadline.getTime()))
    return errorResponse("截止日期格式不正确", 400);
  if (scheduleDate && Number.isNaN(scheduleDate.getTime()))
    return errorResponse("安排日期格式不正确", 400);

  const progress = getTaskProgress(parsed.data.subtasks, parsed.data.progress);
  try {
    const task = await prisma.learningTask.create({
      data: {
        userId: user.id,
        title: parsed.data.title,
        type: parsed.data.type,
        priority: parsed.data.priority,
        status: getTaskStatus(progress),
        progress,
        deadline,
        scheduleDate,
        description: parsed.data.description || null,
        subtasks: {
          create: parsed.data.subtasks.map((subtask, index) => ({
            title: subtask.title,
            completed: subtask.completed,
            sortOrder: subtask.sortOrder ?? index,
          })),
        },
      },
      select: taskSelect,
    });
    return successResponse(task, "任务已创建", 201);
  } catch (error) {
    console.error(error);
    return errorResponse("任务创建失败", 500);
  }
}
