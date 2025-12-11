import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import HabitEntry from "@/lib/models/HabitEntry";
import Streak from "@/lib/models/Streak";
import Habit from "@/lib/models/Habit";
import { verifyToken } from "@/lib/auth/jwt";

export async function POST(
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

    const body = await req.json();
    const { date, note } = body;

    // Validate date format
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
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

    // Validate day of week for weekly and custom habits
    const dateObj = new Date(date + "T00:00:00Z");
    const dayIndex = dateObj.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = dayNames[dayIndex];

    if (habit.frequency === "weekly" || habit.frequency === "custom") {
      if (!habit.days.includes(dayName)) {
        return NextResponse.json(
          { error: `This habit is not scheduled for ${dayName}` },
          { status: 400 }
        );
      }
    }

    // Check if entry already exists for this date
    const existingEntry = await HabitEntry.findOne({
      habitId,
      userId: payload.userId,
      date,
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: "Habit already completed for this date" },
        { status: 409 }
      );
    }

    // Create new entry
    const entry = await HabitEntry.create({
      habitId,
      userId: payload.userId,
      date,
      count: 1,
      note: note || undefined,
    });

    // Update streak
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split("T")[0];

    let streak = await Streak.findOne({
      habitId,
      userId: payload.userId,
    });

    if (!streak) {
      streak = await Streak.create({
        habitId,
        userId: payload.userId,
        currentStreak: 1,
        longestStreak: 1,
        lastCompleted: date,
      });
    } else {
      // Check if completing today or yesterday
      if (date === todayString) {
        streak.currentStreak += 1;
        streak.lastCompleted = date;
      } else if (date === yesterdayString && streak.lastCompleted === yesterdayString) {
        streak.currentStreak += 1;
        streak.lastCompleted = date;
      } else if (date !== yesterdayString && date !== todayString) {
        // Reset streak if not consecutive
        streak.currentStreak = 1;
        streak.lastCompleted = date;
      } else {
        // Start new streak
        streak.currentStreak = 1;
        streak.lastCompleted = date;
      }

      // Update longest streak
      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }

      await streak.save();
    }

    return NextResponse.json({
      message: "Habit completed successfully",
      entry,
      streak: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
      },
    });
  } catch (err) {
    console.error("POST /api/habits/[habitId]/complete error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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

    // Get habit with entries and streak
    const habit = await Habit.findOne({
      _id: habitId,
      userId: payload.userId,
    }).lean();

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const entries = await HabitEntry.find({
      habitId,
      userId: payload.userId,
    })
      .sort({ date: -1 })
      .lean();

    const streak = await Streak.findOne({
      habitId,
      userId: payload.userId,
    }).lean();

    return NextResponse.json({
      habit,
      entries,
      streak: streak || {
        currentStreak: 0,
        longestStreak: 0,
        lastCompleted: null,
      },
    });
  } catch (err) {
    console.error("GET /api/habits/[habitId]/complete error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
