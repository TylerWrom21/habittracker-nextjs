import { getAuthCookie } from "@/lib/auth/cookies";
import { verifyToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";

export async function authGuard() {
  const token = await getAuthCookie(cookies());
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  return payload;
}
