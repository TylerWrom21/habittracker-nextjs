import { cookies } from "next/headers";

const COOKIE_NAME = "session_token";

export async function getAuthCookie(cookieStore: ReturnType<typeof cookies>) {
  return (await cookieStore).get(COOKIE_NAME)?.value || null;
}

export async function setAuthCookie(token: string) {
  const cookieStore = cookies();
  (await cookieStore).set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    domain: "localhost",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAuthCookie() {
  const cookieStore = cookies();
  (await cookieStore).set({
    name: COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
  });
}
