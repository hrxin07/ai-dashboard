import { errorResponse, successResponse } from "@/lib/api-response";
import { getCurrentAuthUser } from "@/lib/current-user";

export async function GET() {
  const user = await getCurrentAuthUser();
  if (!user) return errorResponse("未登录或登录状态已过期", 401);
  return successResponse(user, "获取当前用户成功");
}
