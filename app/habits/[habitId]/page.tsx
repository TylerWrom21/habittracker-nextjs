"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Flame, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/atoms/toast";

interface Habit {
  _id: string;
  name: string;
  frequency: string;
  days: string[];
  time: string;
  description: string;
}

interface HabitEntry {
  _id: string;
  date: string;
  count: number;
  note?: string;
}

interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastCompleted?: string;
}

export default function HabitTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const habitId = params.habitId as string;

  const [habit, setHabit] = useState<Habit | null>(null);
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [streak, setStreak] = useState<Streak>({
    currentStreak: 0,
    longestStreak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHabitData = async () => {
    try {
      const res = await fetch(`/api/habits/${habitId}/complete`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch habit data");
      }

      const data = await res.json();
      setHabit(data.habit);
      setEntries(data.entries);
      setStreak(data.streak);
      setError(null);
    } catch (err) {
      console.error("Error fetching habit data:", err);
      setError((err as Error).message);
      showToast("Failed to load habit data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabitData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitId]);

  const completeHabitForDate = async (date: string) => {
    setCompleting(true);
    try {
      const res = await fetch(`/api/habits/${habitId}/complete`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date }),
      });

      if (!res.ok) {
        if (res.status === 409) {
          showToast("Already completed for this date", "warning");
        } else {
          showToast("You cannot complete this habit today", "warning");
        }
        return;
      }

      const data = await res.json();
      setEntries([
        { _id: data.entry._id, date: data.entry.date, count: 1 },
        ...entries,
      ]);
      setStreak({
        currentStreak: data.streak.currentStreak,
        longestStreak: data.streak.longestStreak,
      });
      showToast("Habit completed! Great job!", "success");
    } catch (err) {
      console.error("Error completing habit:", err);
      showToast((err as Error).message, "error");
    } finally {
      setCompleting(false);
    }
  };

  const completeToday = () => {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];
    completeHabitForDate(todayString);
  };

  const isCompletedToday = () => {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];
    return entries.some((e) => e.date === todayString);
  };

  // Get current month calendar (Monday-based week)
  const getCurrentMonthCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const todayString = today.toISOString().split("T")[0];

    const firstDay = new Date(Date.UTC(year, month, 1));
    const lastDay = new Date(Date.UTC(year, month + 1, 0));
    const daysInMonth = lastDay.getDate();

    // Get starting day of week (0 = Sunday, so we need to adjust for Monday start)
    // For Monday start: Monday=0, Tuesday=1, ..., Sunday=6
    let startingDayOfWeek = firstDay.getDay();
    // Convert: Sunday(0)->6, Monday(1)->0, Tuesday(2)->1, etc.
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days = [];

    // Add empty cells for days before the month starts (from previous month)
    // We need to go back startingDayOfWeek days
    for (let i = startingDayOfWeek; i > 0; i--) {
      const prevDate = new Date(Date.UTC(year, month, 1 - i));
      const dateString = prevDate.toISOString().split("T")[0];
      const actualMonth = prevDate.getMonth();
      days.push({
        date: dateString,
        day: prevDate.getDate(),
        completed: false,
        isCurrentMonth: actualMonth === month,
        isToday: false,
      });
    }

    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(Date.UTC(year, month, i));
      const dateString = date.toISOString().split("T")[0];
      const completed = entries.some((e) => e.date === dateString);
      const isToday = dateString === todayString;
      const actualMonth = date.getMonth();

      days.push({
        date: dateString,
        day: i,
        completed,
        isCurrentMonth: actualMonth === month,
        isToday,
      });
    }

    // Add empty cells for days after the month ends (from next month)
    const remainingCells = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(Date.UTC(year, month + 1, i));
      const dateString = nextDate.toISOString().split("T")[0];
      const actualMonth = nextDate.getMonth();
      days.push({
        date: dateString,
        day: i,
        completed: false,
        isCurrentMonth: actualMonth === month,
        isToday: false,
      });
    }

    return days;
  };

  // Check if a date is scheduled for this habit
  const isDateScheduledForHabit = (dateString: string) => {
    if (!habit) return false;
    
    const dateObj = new Date(dateString + "T00:00:00Z");
    const dayIndex = dateObj.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = dayNames[dayIndex];
    
    if (habit.frequency === "daily") {
      return true;
    }
    
    return habit.days.includes(dayName);
  };

  // Format date responsively
  const formatDateResponsive = (dateString: string) => {
    // Full format: 2025-11-16 -> 11-16 -> 16
    const [year, month, day] = dateString.split("-");
    return { full: `${year}-${month}-${day}`, short: `${month}-${day}`, minimal: day };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary text-center">
          <div className="text-lg font-semibold mb-2">Loading habit...</div>
          <div className="text-sm text-primary/60">Please wait</div>
        </div>
      </div>
    );
  }

  if (error || !habit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              Error Loading Habit
            </CardTitle>
            <CardDescription>{error || "Habit not found"}</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <Button onClick={() => router.back()} className="w-full">
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const completedToday = isCompletedToday();
  const calendarDays = getCurrentMonthCalendar();
  const monthName = new Date().toLocaleString("en-US", { month: "long" });
  const year = new Date().getFullYear();
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/habits">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">{habit.name}</h1>
          <p className="text-primary/60 text-sm sm:text-base">{habit.description}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
        {/* Current Streak */}
        <Card className="flex flex-col gap-2 sm:gap-3">
          <CardHeader className="pb-1 sm:pb-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-xs sm:text-sm">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-orange-500 shrink-0" />
            </div>
          </CardHeader>
          <div className="px-4 sm:px-6 pb-3 sm:pb-4">
            <div className="text-2xl sm:text-3xl font-bold text-primary">{streak.currentStreak}</div>
            <p className="text-xs text-primary/60">days</p>
          </div>
        </Card>

        {/* Longest Streak */}
        <Card className="flex flex-col gap-2 sm:gap-3">
          <CardHeader className="pb-1 sm:pb-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-xs sm:text-sm">Best Streak</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
            </div>
          </CardHeader>
          <div className="px-4 sm:px-6 pb-3 sm:pb-4">
            <div className="text-2xl sm:text-3xl font-bold text-primary">{streak.longestStreak}</div>
            <p className="text-xs text-primary/60">days</p>
          </div>
        </Card>

        {/* Frequency */}
        <Card className="flex flex-col gap-2 sm:gap-3">
          <CardHeader className="pb-1 sm:pb-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-xs sm:text-sm">Frequency</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
            </div>
          </CardHeader>
          <div className="px-4 sm:px-6 pb-3 sm:pb-4">
            <div className="text-xl sm:text-2xl font-bold text-primary capitalize">{habit.frequency}</div>
            <p className="text-xs text-primary/60">{habit.days.join(", ")}</p>
          </div>
        </Card>
      </div>

      {/* Complete Today Button */}
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Task</CardTitle>
          <CardDescription>Complete your habit for today</CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          {completedToday ? (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
              <div>
                <p className="text-primary font-semibold">Great job!</p>
                <p className="text-primary/60 text-sm">You&apos;ve completed this habit today</p>
              </div>
            </div>
          ) : !isDateScheduledForHabit(todayString) ? (
            <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600 shrink-0" />
              <div>
                <p className="text-primary font-semibold">Not scheduled today</p>
                <p className="text-primary/60 text-sm">This habit is not scheduled for today</p>
              </div>
            </div>
          ) : (
            <Button
              onClick={completeToday}
              disabled={completing}
              size="lg"
              className="w-full"
            >
              {completing ? "Completing..." : "Complete Today"}
            </Button>
          )}
        </div>
      </Card>

      {/* Calendar View - Current Month */}
      <Card>
        <CardHeader>
          <CardTitle>
            {monthName} {year}
          </CardTitle>
          <CardDescription>View your habit completion history</CardDescription>
        </CardHeader>
        <div className="px-4 sm:px-6 pb-6">
          {/* Day names header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs sm:text-sm font-semibold text-primary/70">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid - Read-only view */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((day) => {
              const dateObj = formatDateResponsive(day.date);
              
              return (
                <div
                  key={`${day.date}-${day.day}`}
                  title={day.date}
                  className={`aspect-square rounded-lg flex items-center justify-center font-semibold text-xs sm:text-sm transition-colors ${
                    !day.isCurrentMonth
                      ? "bg-muted/50 border border-muted-foreground/50 text-muted-foreground/80"
                      : day.completed
                      ? "bg-green-500/20 border-2 border-green-500 text-green-600"
                      : day.isToday
                      ? "bg-blue-500/10 border-2 border-blue-500 text-primary"
                      : "bg-muted-foreground/20 border-2 border-muted-foreground/30 text-primary"
                  }`}
                >
                  {day.isCurrentMonth && day.completed ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <>
                      <span className="hidden sm:inline">{dateObj.short}</span>
                      <span className="inline sm:hidden">{dateObj.minimal}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Recent Completions */}
      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Completions</CardTitle>
            <CardDescription>Your 10 most recent completions</CardDescription>
          </CardHeader>
          <div className="px-4 sm:px-6 pb-6">
            <div className="space-y-2">
              {entries.slice(0, 10).map((entry) => (
                <div
                  key={entry._id}
                  className="flex items-center justify-between p-3 bg-muted-foreground/10 rounded-lg"
                >
                  <span className="text-primary font-medium text-sm sm:text-base">{entry.date}</span>
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* No Completions Yet */}
      {entries.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Completions Yet</CardTitle>
            <CardDescription>Start completing this habit to see your history</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <Button onClick={completeToday} disabled={completing} className="w-full">
              Complete Now
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
