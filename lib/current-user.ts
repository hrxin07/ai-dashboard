import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME, type AuthUser, verifyAuthToken } from "@/lib/auth";

/**
 * Read and verify the authenticated user from the request cookie in a
 * Server Component, Route Handler, or Server Action.
 */
export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifyAuthToken(token);
}

/**
 * Require an authenticated user in server-side application code.
 * Route handlers can catch the error and return a 401 response when needed.
 */
export async function requireCurrentUser(): Promise<AuthUser> {
  const user = await getCurrentAuthUser();

  if (!user) {
    throw new Error("未登录或登录状态已过期");
  }

  return user;
}
