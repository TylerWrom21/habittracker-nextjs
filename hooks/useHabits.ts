import { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSessions";
import { showToast } from "@/components/atoms/toast";
import { getTodayString } from "@/lib/utils/date";

interface HabitEntry {
  _id: string;
  habitId: string;
  userId: string;
  date: string;
  count: number;
  note?: string;
}

interface Habit {
  _id: string;
  userId: string;
  name: string;
  frequency: string;
  days: string[];
  time: string;
  description: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  todayEntry?: HabitEntry | null;
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useSession().user?._id;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchHabits() {
      try {
        const res = await fetch("/api/habits", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch habits");
        }

        const data = await res.json();
        const today = getTodayString();

        // Fetch entries for today to check completion status
        const habitsWithStatus = await Promise.all(
          data.habits.map(async (habit: Habit) => {
            try {
              const entryRes = await fetch(
                `/api/habits/${habit._id}/entries?date=${today}`,
                {
                  credentials: "include",
                }
              );

              if (entryRes.ok) {
                const entryData = await entryRes.json();
                return {
                  ...habit,
                  todayEntry: entryData.entry || null,
                };
              }
            } catch (err) {
              console.error(`Error fetching entry for habit ${habit._id}:`, err);
            }

            return habit;
          })
        );

        setHabits(habitsWithStatus);
      } catch (err) {
        console.error("Error fetching habits:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchHabits();
  }, [user]);

  const deleteHabit = async (habitId: string, habitName: string) => {
    try {
      const res = await fetch(`/api/habits/${habitId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete habit");
      }

      setHabits((prev) => prev.filter((habit) => habit._id !== habitId));
      showToast(`Habit "${habitName}" deleted successfully.`, "success");
    } catch (err) {
      console.error("Error deleting habit:", err);
      showToast("Failed to delete habit.", "error");
    }
  };

  const deleteMultiple = async (habitIds: string[]) => {
    try {
      const promises = habitIds.map((habitId) =>
        fetch(`/api/habits/${habitId}`, {
          method: "DELETE",
          credentials: "include",
        })
      );

      const results = await Promise.all(promises);

      for (const res of results) {
        if (!res.ok) {
          throw new Error("Failed to delete one or more habits");
        }
      }

      setHabits((prev) => prev.filter((habit) => !habitIds.includes(habit._id)));
      showToast(`${habitIds.length} habit(s) deleted successfully.`, "success");
    } catch (err) {
      console.error("Error deleting habits:", err);
      showToast("Failed to delete selected habits.", "error");
    }
  };

  return { habits, loading, error, deleteHabit, deleteMultiple };
}