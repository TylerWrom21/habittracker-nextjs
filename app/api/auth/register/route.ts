import { connectDB } from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { hashPassword } from "@/lib/auth/hash";
import { signToken } from "@/lib/auth/jwt";
import { getErrorResponse } from "@/lib/utils/error-handler";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json(getErrorResponse("All fields are required"), { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (trimmedPassword.length < 8) {
      return Response.json(getErrorResponse("Password must be at least 8 characters"), { status: 400 });
    }

    if (trimmedName.length > 60) {
      return Response.json(getErrorResponse("Name must be 60 characters or less"), { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return Response.json(getErrorResponse("Invalid email format"), { status: 400 });
    }

    const existing = await User.findOne({ email: trimmedEmail });
    if (existing) {
      return Response.json(getErrorResponse("Email already in use"), { status: 409 });
    }

    try {
      await User.collection.dropIndex("username_1");
    } catch {}

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
        'Set-Cookie': `authToken=${token}; Path=/; Max-Age=${60 * 60 * 24 * 7}; HttpOnly=true; SameSite=lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
      }
    });

    return response;
  } catch {
    return Response.json(getErrorResponse("Server error"), { status: 500 });
  }
}
