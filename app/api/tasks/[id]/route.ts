import type { Prisma } from "@prisma/client";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getCurrentAuthUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { getTaskProgress, getTaskStatus } from "@/lib/task-progress";
import { taskUpdateSchema } from "@/lib/validations/task";

const taskSelect = {
  id: true,
  title: true,
  type: true,
  priority: true,
  status: true,
  progress: true,
  deadline: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  subtasks: { orderBy: { sortOrder: "asc" } },
} satisfies Prisma.LearningTaskSelect;

function progressFromLegacyStatus(
  status: "TODO" | "IN_PROGRESS" | "COMPLETED",
  current: number,
) {
  if (status === "TODO") return 0;
  if (status === "COMPLETED") return 100;
  return current === 0 || current === 100 ? 1 : current;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentAuthUser();
  if (!user) return errorResponse("未登录或登录状态已过期", 401);

  const { id } = await params;
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("请求数据格式不正确", 400);
  }
  const parsed = taskUpdateSchema.safeParse(payload);
  if (!parsed.success)
    return errorResponse(
      parsed.error.issues[0]?.message ?? "任务格式不正确",
      400,
    );

  try {
    const task = await prisma.$transaction(async (transaction) => {
      const existing = await transaction.learningTask.findFirst({
        where: { id, userId: user.id },
        include: { subtasks: { orderBy: { sortOrder: "asc" } } },
      });
      if (!existing) return null;

      const deadline =
        parsed.data.deadline === undefined
          ? existing.deadline
          : parsed.data.deadline
            ? new Date(parsed.data.deadline)
            : null;
      if (deadline && Number.isNaN(deadline.getTime()))
        throw new Error("INVALID_DEADLINE");

      const subtasks = parsed.data.subtasks ?? existing.subtasks;
      const requestedProgress =
        parsed.data.progress ??
        (parsed.data.status
          ? progressFromLegacyStatus(parsed.data.status, existing.progress)
          : existing.progress);
      const progress = getTaskProgress(subtasks, requestedProgress);

      if (parsed.data.subtasks !== undefined) {
        await transaction.learningSubtask.deleteMany({ where: { taskId: id } });
      }

      return transaction.learningTask.update({
        where: { id },
        data: {
          ...(parsed.data.title !== undefined
            ? { title: parsed.data.title }
            : {}),
          ...(parsed.data.type !== undefined ? { type: parsed.data.type } : {}),
          ...(parsed.data.priority !== undefined
            ? { priority: parsed.data.priority }
            : {}),
          deadline,
          description:
            parsed.data.description === undefined
              ? existing.description
              : parsed.data.description || null,
          progress,
          status: getTaskStatus(progress),
          ...(parsed.data.subtasks !== undefined
            ? {
                subtasks: {
                  create: parsed.data.subtasks.map((subtask, index) => ({
                    title: subtask.title,
                    completed: subtask.completed,
                    sortOrder: subtask.sortOrder ?? index,
                  })),
                },
              }
            : {}),
        },
        select: taskSelect,
      });
    });

    if (!task) return errorResponse("任务不存在或无权访问", 404);
    return successResponse(task, "任务已更新");
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_DEADLINE")
      return errorResponse("截止日期格式不正确", 400);
    console.error(error);
    return errorResponse("任务更新失败", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentAuthUser();
  if (!user) return errorResponse("未登录或登录状态已过期", 401);
  const { id } = await params;
  const result = await prisma.learningTask.deleteMany({
    where: { id, userId: user.id },
  });
  if (!result.count) return errorResponse("任务不存在或无权访问", 404);
  return successResponse(null, "任务已删除");
}
