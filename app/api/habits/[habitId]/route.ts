import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Habit from "@/lib/models/Habit";
import { verifyToken } from "@/lib/auth/jwt";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ habitId: string }> }
) {
  try {
    await connectDB();
    const { habitId } = await params;

    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = cookieHeader.split("session_token=")[1]?.split(";")[0];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const habit = await Habit.findOne({
      _id: habitId,
      userId: payload.userId,
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json({ habit });
  } catch (err) {
    console.error("GET /api/habits/[habitId] error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ habitId: string }> }
) {
  try {
    await connectDB();
    const { habitId } = await params;
    const body = await req.json();

    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = cookieHeader.split("session_token=")[1]?.split(";")[0];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updated = await Habit.findOneAndUpdate(
      { _id: habitId, userId: payload.userId },
      body,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ habit: updated });
  } catch (err) {
    console.error("PATCH /api/habits/[habitId] error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ habitId: string }> }
) {
  try {
    await connectDB();
    const { habitId } = await params;

    const cookieHeader = req.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = cookieHeader.split("session_token=")[1]?.split(";")[0];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await Habit.findOneAndDelete({
      _id: habitId,
      userId: payload.userId,
    });

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/habits/[habitId] error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
