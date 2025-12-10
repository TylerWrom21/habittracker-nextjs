import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { setAuthCookie } from "@/lib/auth/cookies";
import { comparePassword } from "@/lib/auth/hash";
import { signToken } from "@/lib/auth/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return Response.json({ error: "Invalid credentials" }, { status: 401 });

    const isValid = await comparePassword(password, user.password);
    if (!isValid) return Response.json({ error: "Invalid credentials" }, { status: 401 });

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    setAuthCookie(token);

    return Response.json({ message: "Login successful" });
  } catch (err) {
    return Response.json({ error: "Server error", err }, { status: 500 });
  }
}
