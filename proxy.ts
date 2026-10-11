import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

const protectedPagePaths = ["/dashboard", "/career-plan", "/career-paths", "/learning", "/profile", "/recommendation"];
const publicAuthApiPaths = ["/api/auth/register", "/api/auth/login"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const user = token ? await verifyAuthToken(token) : null;
  const isProtectedPage = protectedPagePaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isApiRequest = pathname.startsWith("/api/");

  if (isApiRequest && !publicAuthApiPaths.includes(pathname) && !user) {
    return NextResponse.json(
      { success: false, message: "未登录或登录状态已过期", data: null },
      { status: 401 },
    );
  }

  if (isProtectedPage && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === "/login" || pathname === "/register") && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/career-plan/:path*",
    "/career-paths/:path*",
    "/learning/:path*",
    "/profile/:path*",
    "/recommendation/:path*",
    "/api/:path*",
    "/login",
    "/register",
  ],
};
