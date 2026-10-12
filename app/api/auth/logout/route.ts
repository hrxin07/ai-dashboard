import { NextRequest, NextResponse } from "next/server";
import { successResponse } from "@/lib/api-response";
import { AUTH_COOKIE_NAME, getAuthCookieOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const response = successResponse(null, "已退出登录");
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    ...getAuthCookieOptions(request),
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}

export async function GET() {
  return NextResponse.json(
    { success: false, message: "请使用 POST 方法退出登录", data: null },
    { status: 405, headers: { Allow: "POST" } },
  );
}
