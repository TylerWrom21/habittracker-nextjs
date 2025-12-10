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

    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ error: "Email already exists" }, { status: 409 });
    }

    const hashed = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    setAuthCookie(token);

    return Response.json(
      { message: "Registered successfully" },
      { status: 201 }
    );
  } catch (err) {
    return Response.json({ error: "Server error", err }, { status: 500 });
  }
}
