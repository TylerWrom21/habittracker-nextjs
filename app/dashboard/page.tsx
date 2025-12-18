"use client";

import { useEffect, useState } from "react";
import {
  Flame,
  CheckCircle2,
  Target,
  TrendingUp,
  Award,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Statistics {
  totalHabits: number;
  completedToday: number;
  thisWeekCompletions: number;
  longestStreak: number;
  totalStreak: number;
}

interface HabitPerformance {
  _id: string;
  name: string;
  frequency: string;
  completedDays: number;
  entries: HabitEntry[];
}

interface HabitEntry {
  habitId: string;
  userId: string;
  date: string;
  count: number;
  note?: string;
}

interface StreakData {
  habitId: string;
  habitName: string;
  currentStreak: number;
  longestStreak: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [streakData, setStreakData] = useState<StreakData[]>([]);
  const [habitPerformance, setHabitPerformance] = useState<HabitPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/analytics", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await res.json();
      setStats(data.statistics);
      setStreakData(data.streakData);
      setHabitPerformance(data.habitPerformance);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-primary text-center py-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  }

  // Get day names for the week (Monday-based)
  const today = new Date();
  const weekStart = new Date(today);
  // Get Monday of current week
  const day = weekStart.getDay();
  const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1); // Adjust if Monday is at the start
  weekStart.setDate(diff);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekDays = days.map((day, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return {
      name: day,
      date: date.toISOString().split("T")[0],
    };
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-primary/80 text-xs sm:text-sm mt-1">Welcome back! Here&apos;s your habit overview</p>
        </div>
        <Link href="/habits/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">Add New Habit</Button>
        </Link>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
        {/* Total Habits */}
        <Link href="/habits">
          <Card className="flex flex-col gap-2 sm:gap-3">
            <CardHeader className="pb-1 sm:pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Habits</CardTitle>
                <Target className="h-3 w-3 sm:h-4 sm:w-4 text-primary/80 shrink-0" />
              </div>
            </CardHeader>
            <div className="px-4 sm:px-6 pb-2 sm:pb-4">
              <div className="text-xl sm:text-2xl font-bold text-primary">{stats?.totalHabits || 0}</div>
              <p className="text-xs text-primary/80 mt-0.5 sm:mt-1">Active habits</p>
            </div>
          </Card>
        </Link>

        {/* Completed Today */}
        <Card className="flex flex-col gap-2 sm:gap-3">
          <CardHeader className="pb-1 sm:pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 shrink-0" />
            </div>
          </CardHeader>
          <div className="px-4 sm:px-6 pb-2 sm:pb-4">
            <div className="text-xl sm:text-2xl font-bold text-primary">{stats?.completedToday || 0}</div>
            <p className="text-xs text-primary/80 mt-0.5 sm:mt-1">Habits completed</p>
          </div>
        </Card>

        {/* This Week */}
        <Card className="flex flex-col gap-2 sm:gap-3">
          <CardHeader className="pb-1 sm:pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 shrink-0" />
            </div>
          </CardHeader>
          <div className="px-4 sm:px-6 pb-2 sm:pb-4">
            <div className="text-xl sm:text-2xl font-bold text-primary">{stats?.thisWeekCompletions || 0}</div>
            <p className="text-xs text-primary/80 mt-0.5 sm:mt-1">Total completions</p>
          </div>
        </Card>

        {/* Current Streak */}
        <Card className="flex flex-col gap-2 sm:gap-3">
          <CardHeader className="pb-1 sm:pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500 shrink-0" />
            </div>
          </CardHeader>
          <div className="px-4 sm:px-6 pb-2 sm:pb-4">
            <div className="text-xl sm:text-2xl font-bold text-primary">{stats?.totalStreak || 0}</div>
            <p className="text-xs text-primary/80 mt-0.5 sm:mt-1">Days maintained</p>
          </div>
        </Card>

        {/* Longest Streak */}
        <Card className="flex flex-col gap-2 sm:gap-3">
          <CardHeader className="pb-1 sm:pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium">Best Streak</CardTitle>
              <Award className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 shrink-0" />
            </div>
          </CardHeader>
          <div className="px-4 sm:px-6 pb-2 sm:pb-4">
            <div className="text-xl sm:text-2xl font-bold text-primary">{stats?.longestStreak || 0}</div>
            <p className="text-xs text-primary/80 mt-0.5 sm:mt-1">Personal record</p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Weekly Progress */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">This Week&apos;s Progress</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-primary">Your habit completion by day</CardDescription>
            </CardHeader>
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="space-y-3 sm:space-y-4">
                {habitPerformance.slice(0, 5).map((habit) => (
                  <div key={habit._id} className="space-y-1.5 sm:space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-primary font-medium text-xs sm:text-sm">{habit.name}</h3>
                        <p className="text-primary/80 text-xs">
                          {habit.completedDays} of 7 days completed
                        </p>
                      </div>
                      <span className="text-primary font-bold text-sm sm:text-base">
                        {Math.round((habit.completedDays / 7) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted-foreground/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-linear-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
                        style={{ width: `${(habit.completedDays / 7) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Active Streaks */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Active Streaks</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-primary">Your best performing habits</CardDescription>
            </CardHeader>
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="space-y-2 sm:space-y-3">
                {streakData.length > 0 ? (
                  streakData.map((streak) => (
                    <div
                      key={streak.habitId}
                      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-muted-foreground/10 rounded-lg"
                    >
                      <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-primary font-medium text-xs sm:text-sm truncate">
                          {streak.habitName}
                        </p>
                        <p className="text-primary/80 text-xs">
                          {streak.currentStreak} day streak
                        </p>
                      </div>
                      <span className="text-primary font-bold text-base sm:text-lg shrink-0">
                        {streak.currentStreak}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-primary/80 text-xs sm:text-sm">No active streaks yet. Start completing habits!</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Weekly Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Weekly Overview</CardTitle>
          <CardDescription className="text-xs sm:text-sm text-primary">Completion overview for this week</CardDescription>
        </CardHeader>
        <div className="px-2 sm:px-6 pb-4 sm:pb-6">
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {weekDays.map((day) => {
              const dayEntries = habitPerformance.reduce((total, habit) => {
                return (
                  total +
                  habit.entries.filter((entry) => entry.date === day.date).length
                );
              }, 0);
              
              // Format date responsively: 2025-11-16 -> 11-16 -> 16
              const dateParts = day.date.split("-");
              const month = dateParts[1];
              const dateNum = dateParts[2];

              return (
                <div
                  key={day.date}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="text-primary font-semibold text-xs sm:text-sm">{day.name}</span>
                  <div className="w-full aspect-square flex items-center justify-center bg-muted-foreground/20 rounded-lg border border-muted-foreground/30">
                    <span className="text-primary font-bold text-sm sm:text-lg">{dayEntries}</span>
                  </div>
                  <span className="text-primary/80 text-xs hidden sm:inline">{month}-{dateNum}</span>
                  <span className="text-primary/80 text-xs inline sm:hidden">{dateNum}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Recommendations</CardTitle>
          <CardDescription className="text-xs sm:text-sm text-primary">Tips to improve your habit tracking</CardDescription>
        </CardHeader>
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-2 sm:space-y-3">
            {stats?.completedToday === 0 && (
              <div className="flex gap-2 sm:gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-primary font-medium text-xs sm:text-sm">Complete today&apos;s habits</p>
                  <p className="text-primary/80 text-xs">You haven&apos;t completed any habits today. Start with one!</p>
                </div>
              </div>
            )}

            {habitPerformance.some((h) => h.completedDays === 0) && (
              <div className="flex gap-2 sm:gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-primary font-medium text-xs sm:text-sm">Diversify your habits</p>
                  <p className="text-primary/80 text-xs">
                    Some habits haven&apos;t been completed this week. Try to balance them out.
                  </p>
                </div>
              </div>
            )}

            {stats?.totalHabits === 0 && (
              <div className="flex gap-2 sm:gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <Target className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-primary font-medium text-xs sm:text-sm">Create your first habit</p>
                  <p className="text-primary/80 text-xs">Start building good habits today. Click &quot;Add New Habit&quot; to begin.</p>
                </div>
              </div>
            )}

            {stats && stats.totalHabits > 0 && stats.completedToday > 0 && (
              <div className="flex gap-2 sm:gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <Award className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-primary font-medium text-xs sm:text-sm">Great consistency!</p>
                  <p className="text-primary/80 text-xs">
                    Keep up the momentum. You&apos;re making great progress on your habits!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
