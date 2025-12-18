import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import HabitEntry from "@/lib/models/HabitEntry";
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

    const token = cookieHeader.split("authToken=")[1]?.split(";")[0];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get date from query parameters
    const url = new URL(req.url);
    const date = url.searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date query parameter is required" },
        { status: 400 }
      );
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    // Check if habit exists and belongs to user
    const habit = await Habit.findOne({
      _id: habitId,
      userId: payload.userId,
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // Fetch entry for the specified date
    const entry = await HabitEntry.findOne({
      habitId,
      userId: payload.userId,
      date,
    });

    return NextResponse.json({ entry: entry || null });
  } catch (err) {
    console.error("GET /api/habits/[habitId]/entries error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
