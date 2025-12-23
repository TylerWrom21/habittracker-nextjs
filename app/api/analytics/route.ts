import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Habit from "@/lib/models/Habit";
import HabitEntry from "@/lib/models/HabitEntry";
import Streak from "@/lib/models/Streak";
import { verifyToken } from "@/lib/auth/jwt";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET(req: Request) {
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

    const userId = payload.userId;

    // Get all habits
    const habits = await Habit.find({ userId, archived: false }).lean();

    // Get today's date
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    // Get this week's entries (Sunday to Saturday)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const weekStartString = weekStart.toISOString().split("T")[0];
    const weekEndString = weekEnd.toISOString().split("T")[0];

    // Get entries for this week
    const weekEntries = await HabitEntry.find({
      userId,
      date: {
        $gte: weekStartString,
        $lte: weekEndString,
      },
    }).lean();

    // Get all streaks
    const streaks = await Streak.find({ userId }).lean();

    // Calculate statistics
    const totalHabits = habits.length;
    const completedToday = weekEntries.filter((e) => e.date === todayString).length;
    const thisWeekCompletions = weekEntries.length;

    const longestStreak = streaks.length > 0 ? Math.max(...streaks.map((s) => s.longestStreak)) : 0;
    const totalStreak = streaks.length > 0 ? Math.max(...streaks.map((s) => s.currentStreak)) : 0;

    // Get habit performance this week
    const habitPerformance = habits.map((habit: any) => {
      const habitEntries = weekEntries.filter(
        (e) => e.habitId.toString() === habit._id.toString()
      );
      
      // Calculate max completions based on frequency
      let maxCompletions = 7; // default for daily
      if (habit.frequency === "weekly") {
        maxCompletions = 1; // weekly habits can be completed max 1 time per week
      } else if (habit.frequency === "custom") {
        maxCompletions = habit.days.length; // custom habits - max is the number of selected days
      }
      
      return {
        _id: habit._id,
        name: habit.name,
        frequency: habit.frequency,
        completedDays: habitEntries.length,
        maxDays: maxCompletions,
        entries: habitEntries,
      };
    });

    // Get top habits (most completed this week)
    const topHabits = habitPerformance
      .sort((a, b) => b.completedDays - a.completedDays)
      .slice(0, 5);

    // Get streaks with habit info
    const streakData = streaks
      .filter((s) => s.currentStreak > 0)
      .sort((a, b) => b.currentStreak - a.currentStreak)
      .slice(0, 5);

    const streakWithHabits = streakData.map((streak: any) => {
      const habit = habits.find((h: any) => h._id.toString() === streak.habitId.toString());
      return {
        ...streak,
        habitName: habit?.name || "Unknown",
      };
    });

    return NextResponse.json({
      statistics: {
        totalHabits,
        completedToday,
        thisWeekCompletions,
        longestStreak,
        totalStreak,
      },
      habitPerformance,
      topHabits,
      streakData: streakWithHabits,
    });
  } catch (err) {
    console.error("GET /api/analytics error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
