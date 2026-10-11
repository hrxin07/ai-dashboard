import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { AUTH_COOKIE_NAME, authCookieOptions, createAuthToken } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return errorResponse("请求数据格式不正确", 400);
  }

  const parsed = loginSchema.safeParse(payload);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "参数校验失败", 400);
  }

  const account = parsed.data.account.trim();
  const normalizedEmail = account.toLowerCase();

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: account }, { email: normalizedEmail }],
      },
      select: { id: true, username: true, email: true, passwordHash: true },
    });

    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return errorResponse("账号或密码错误", 401);
    }

    const token = await createAuthToken(user);
    const response = successResponse(
      { id: user.id, username: user.username, email: user.email },
      "登录成功",
    );
    response.cookies.set(AUTH_COOKIE_NAME, token, authCookieOptions);
    return response;
  } catch (error) {
    console.error("Login failed", error);
    return errorResponse("登录失败，请稍后重试", 500);
  }
}
