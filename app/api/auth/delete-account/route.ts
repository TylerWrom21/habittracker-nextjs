import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import User from "@/lib/models/User";
import Habit from "@/lib/models/Habit";
import HabitEntry from "@/lib/models/HabitEntry";
import Streak from "@/lib/models/Streak";
import { connectDB } from "@/lib/db/mongodb";
import { getErrorResponse } from "@/lib/utils/error-handler";

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get("authToken")?.value;
    if (!token) {
      return NextResponse.json(
        getErrorResponse("Unauthorized"),
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        getErrorResponse("Invalid token"),
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    const userId = decoded.userId;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        getErrorResponse("User not found"),
        { status: 404 }
      );
    }

    // Delete all related data in the following order:
    // 1. Delete all habit entries for user's habits
    // 2. Delete all streaks for user's habits
    // 3. Delete all habits for user
    // 4. Delete user account

    // Get all habit IDs for this user
    const habits = await Habit.find({ userId });
    const habitIds = habits.map((habit) => habit._id);

    // Delete habit entries
    if (habitIds.length > 0) {
      await HabitEntry.deleteMany({ habitId: { $in: habitIds } });

      // Delete streaks
      await Streak.deleteMany({ habitId: { $in: habitIds } });

      // Delete habits
      await Habit.deleteMany({ userId });
    }

    // Delete user account
    await User.findByIdAndDelete(userId);

    // Clear auth cookie
    const response = NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );

    response.cookies.set({
      name: "authToken",
      value: "",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch {
    return NextResponse.json(
      getErrorResponse("Server error"),
      { status: 500 }
    );
  }
}
