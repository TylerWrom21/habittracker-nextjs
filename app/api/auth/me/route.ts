import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/jwt";

const COOKIE_NAME = "authToken";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = cookies();
    const token = (await cookieStore).get(COOKIE_NAME)?.value;

    if (!token) {
      return Response.json({ user: null });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return Response.json({ user: null });
    }

    const user = await User.findById(payload.userId).select("-password");

    if (!user) {
      return Response.json({ user: null });
    }

    return Response.json({ user });
  } catch (err) {
    return Response.json({ user: null, error: err });
  }
}
