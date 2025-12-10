import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  points: number;
  badges: string[];
  settings: {
    timezone: string;
    theme: string;
    dateFormat: string;
  };
}

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include", // Important to send the HTTP-only cookie
        });

        if (!res.ok) {
          console.error("Failed to fetch session:", await res.text());
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Error loading session:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { user, loading };
}
