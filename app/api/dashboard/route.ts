import { errorResponse, successResponse } from "@/lib/api-response";
import { getCurrentAuthUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentAuthUser();
  if (!user) return errorResponse("未登录或登录状态已过期", 401);

  try {
    const [plan, allTasks, upcoming] = await Promise.all([
      prisma.careerPlan.findUnique({
        where: { userId: user.id },
        select: { targetDirection: true, targetPosition: true },
      }),
      prisma.learningTask.findMany({
        where: { userId: user.id },
        select: { status: true, progress: true },
      }),
      prisma.learningTask.findMany({
        where: { userId: user.id, status: { not: "COMPLETED" } },
        orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          progress: true,
          deadline: true,
          priority: true,
          subtasks: { select: { completed: true } },
        },
      }),
    ]);
    const total = allTasks.length;
    const completed = allTasks.filter(
      (task) => task.status === "COMPLETED",
    ).length;
    const inProgress = allTasks.filter(
      (task) => task.status === "IN_PROGRESS",
    ).length;
    const learningProgress = total
      ? Math.round(
          allTasks.reduce((sum, task) => sum + task.progress, 0) / total,
        )
      : 0;
    return successResponse(
      {
        username: user.username,
        plan,
        tasks: upcoming,
        total,
        completed,
        inProgress,
        // 学习进度取所有任务实际进度的平均值，而非仅统计完全完成的任务数量。
        learningProgress,
        completionRate: learningProgress,
      },
      "获取工作台成功",
    );
  } catch (error) {
    console.error(error);
    return errorResponse("工作台数据读取失败", 500);
  }
}
