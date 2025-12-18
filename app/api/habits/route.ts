import { connectDB } from "@/lib/db/mongodb";
import Habit from "@/lib/models/Habit";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

export async function GET(req: Request) {
  await connectDB();
  try {

    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = cookieHeader.split("authToken=")[1]?.split(";")[0];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const habits = await Habit.find({ userId: payload.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ habits });
  } catch (err) {
    console.error("GET /api/habits error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = cookieHeader.split("authToken=")[1]?.split(";")[0];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, frequency, days, time, description, archived } = await req.json();

    const habit = await Habit.create({ userId: payload.userId, name, frequency, days, time, description, archived });

    await habit.validate();
    await habit.save();

    return NextResponse.json({ message: "Habit saved", habit });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.name === "ValidationError") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const messages = Object.values(err.errors).map((e: any) => e.message);
        return NextResponse.json({ error: messages.join(", ") }, { status: 400 });
      }

      return NextResponse.json({ error: "Something went wrong", err }, { status: 500 });
  }
}