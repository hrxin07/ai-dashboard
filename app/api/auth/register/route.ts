import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return errorResponse("请求数据格式不正确", 400);
  }

  const parsed = registerSchema.safeParse(payload);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "参数校验失败", 400);
  }

  const username = parsed.data.username.trim();
  const email = parsed.data.email.trim().toLowerCase();

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
      select: { username: true, email: true },
    });

    if (existingUser?.username === username) {
      return errorResponse("该用户名已被使用", 409);
    }

    if (existingUser?.email === email) {
      return errorResponse("该邮箱已被注册", 409);
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return successResponse(user, "注册成功，请登录", 201);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return errorResponse("用户名或邮箱已被使用", 409);
    }

    console.error("Registration failed", error);
    return errorResponse("注册失败，请稍后重试", 500);
  }
}
