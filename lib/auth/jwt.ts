import jwt from "jsonwebtoken";
import { getAuthCookie } from "./cookies";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "7d";

export interface AuthTokenPayload {
  userId: string;
  email: string;
}

export function signToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch (err) {
    console.log("JWT verify error:", err);
    return null;
  }
}

export async function verifyAuth(): Promise<AuthTokenPayload | null> {
  const token = await getAuthCookie(cookies());
  if (!token) return null;
  return verifyToken(token);
}