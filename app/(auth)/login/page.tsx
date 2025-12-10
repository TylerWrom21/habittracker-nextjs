/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    try {
      await apiClient("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-primary-foreground p-10">
      <h1 className="text-xl mb-4 font-semibold">Welcome back</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            name="email"
            type="email"
            className="w-full border border-border rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            name="password"
            type="password"
            className="w-full border border-border rounded-md px-3 py-2"
            required
          />
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-md font-medium bg-primary text-primary-foreground hover:bg-secondary-foreground cursor-pointer transition"
        >
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>

      <p className="text-sm mt-4 text-center">
        Don&apos;t have an account?{" "}
        <a
          href="/register"
          className="text-primary hover:underline"
        >
          Register
        </a>
      </p>
    </div>
  );
}
