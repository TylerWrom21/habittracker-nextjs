import { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSessions";

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
        setHabits(data.habits);
      } catch (err) {
        console.error("Error fetching habits:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchHabits();
  }, [user]);

  return { habits, loading, error };
}