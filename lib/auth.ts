import { SignJWT, jwtVerify } from "jose";

export const AUTH_COOKIE_NAME = "ai_career_session";
const TOKEN_ISSUER = "ai-career-workbench";
const TOKEN_AUDIENCE = "ai-career-workbench-user";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET 必须配置为至少 32 个字符的随机字符串");
  }

  return new TextEncoder().encode(secret);
}

export async function createAuthToken(user: AuthUser) {
  return new SignJWT({ username: user.username, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuer(TOKEN_ISSUER)
    .setAudience(TOKEN_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    });

    if (
      typeof payload.sub !== "string" ||
      typeof payload.username !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }

    return { id: payload.sub, username: payload.username, email: payload.email };
  } catch {
    return null;
  }
}

export const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
