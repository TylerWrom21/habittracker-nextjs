import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/models/User";
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

    const response = new Response(JSON.stringify({ message: "Login successful" }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `authToken=${token}; Path=/; Max-Age=${60 * 60 * 24 * 7}; HttpOnly=true; SameSite=lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
      }
    });

    return response;
  } catch (err) {
    return Response.json({ error: "Server error", err }, { status: 500 });
  }
}
