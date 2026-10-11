import { errorResponse, successResponse } from "@/lib/api-response";
import { getCurrentAuthUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { careerPlanSchema } from "@/lib/validations/career-plan";

const select = { id: true, userId: true, targetDirection: true, targetPosition: true, targetCity: true, targetDate: true, skillFoundation: true, strengths: true, weaknesses: true, planContent: true, createdAt: true, updatedAt: true } as const;
const output = (plan: unknown) => plan;
export async function GET() {
  const user = await getCurrentAuthUser(); if (!user) return errorResponse("未登录或登录状态已过期", 401);
  try { return successResponse(output(await prisma.careerPlan.findUnique({ where: { userId: user.id }, select })), "获取职业规划成功"); }
  catch (error) { console.error(error); return errorResponse("职业规划读取失败，请稍后重试", 500); }
}
export async function POST(request: Request) { return save(request); }
export async function PUT(request: Request) { return save(request); }
async function save(request: Request) {
  const user = await getCurrentAuthUser(); if (!user) return errorResponse("未登录或登录状态已过期", 401);
  let payload: unknown; try { payload = await request.json(); } catch { return errorResponse("请求数据格式不正确", 400); }
  const parsed = careerPlanSchema.safeParse(payload); if (!parsed.success) return errorResponse(parsed.error.issues[0]?.message ?? "规划格式不正确", 400);
  const date = parsed.data.targetDate ? new Date(parsed.data.targetDate) : null;
  if (date && Number.isNaN(date.getTime())) return errorResponse("目标日期格式不正确", 400);
  const data = { targetDirection: parsed.data.targetDirection, targetPosition: parsed.data.targetPosition, targetCity: parsed.data.targetCity || null, targetDate: date, skillFoundation: parsed.data.skillFoundation || null, strengths: parsed.data.strengths || null, weaknesses: parsed.data.weaknesses || null, planContent: parsed.data.planContent };
  try { const plan = await prisma.careerPlan.upsert({ where: { userId: user.id }, create: { userId: user.id, ...data }, update: data, select }); return successResponse(plan, "职业规划已保存"); }
  catch (error) { console.error(error); return errorResponse("职业规划保存失败，请稍后重试", 500); }
}
