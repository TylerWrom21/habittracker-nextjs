import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { setAuthCookie } from "@/lib/auth/cookies";
import { hashPassword } from "@/lib/auth/hash";
import { signToken } from "@/lib/auth/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (trimmedPassword.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    if (trimmedName.length > 60) {
      return Response.json({ error: "Name must be 60 characters or less" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    const existing = await User.findOne({ email: trimmedEmail });
    if (existing) {
      return Response.json({ error: "Email already exists" }, { status: 409 });
    }

    try {
      await User.collection.dropIndex("username_1");
    } catch (err) {
    }

    const hashed = await hashPassword(trimmedPassword);

    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashed,
    });

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const response = new Response(JSON.stringify({ message: "Registered successfully" }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `session_token=${token}; Path=/; Domain=localhost; Max-Age=${60 * 60 * 24 * 7}; HttpOnly=false; SameSite=lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
      }
    });

    return response;
  } catch (err) {
    return Response.json({ error: "Server error", err }, { status: 500 });
  }
}
