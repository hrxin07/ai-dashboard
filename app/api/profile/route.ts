import { errorResponse, successResponse } from "@/lib/api-response";
import { getCurrentAuthUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations/profile";

const profileSelect = {
  id: true,
  userId: true,
  realName: true,
  major: true,
  grade: true,
  school: true,
  skills: true,
  interests: true,
  bio: true,
  createdAt: true,
  updatedAt: true,
} as const;

function presentProfile(profile: {
  id: string;
  userId: string;
  realName: string | null;
  major: string;
  grade: string | null;
  school: string | null;
  skills: string | null;
  interests: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
} | null, userId: string) {
  return profile ?? {
    id: null,
    userId,
    realName: null,
    major: "人工智能",
    grade: null,
    school: null,
    skills: null,
    interests: null,
    bio: null,
    createdAt: null,
    updatedAt: null,
  };
}

export async function GET() {
  const user = await getCurrentAuthUser();
  if (!user) return errorResponse("未登录或登录状态已过期", 401);

  try {
    const profile = await prisma.profile.findUnique({ where: { userId: user.id }, select: profileSelect });
    return successResponse(presentProfile(profile, user.id), "获取个人资料成功");
  } catch (error) {
    console.error("Profile read failed", error);
    return errorResponse("个人资料读取失败，请稍后重试", 500);
  }
}

export async function PUT(request: Request) {
  const user = await getCurrentAuthUser();
  if (!user) return errorResponse("未登录或登录状态已过期", 401);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("请求数据格式不正确", 400);
  }

  const parsed = profileSchema.safeParse(payload);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "资料格式不正确", 400);
  }

  const data = {
    realName: parsed.data.realName || null,
    major: parsed.data.major || "人工智能",
    grade: parsed.data.grade || null,
    school: parsed.data.school || null,
    skills: parsed.data.skills || null,
    interests: parsed.data.interests || null,
    bio: parsed.data.bio || null,
  };

  try {
    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...data },
      update: data,
      select: profileSelect,
    });
    return successResponse(profile, "个人资料已保存");
  } catch (error) {
    console.error("Profile update failed", error);
    return errorResponse("个人资料保存失败，请稍后重试", 500);
  }
}
