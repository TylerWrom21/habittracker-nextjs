"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/atoms/toast";
import { Mail, Lock, LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        showToast(data.error || "Login failed", "error");
        return;
      }

      showToast("Login successful! Redirecting...", "success");
      setTimeout(() => router.push("/dashboard"), 500);
    } catch {
      showToast("An unexpected error occurred", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted/50 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <LogIn className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary">
                Email Address
              </label>
              <div className="flex items-center gap-3 border border-muted-foreground rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent text-primary placeholder:text-muted-foreground focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-primary">
                Password
              </label>
              <div className="flex items-center gap-3 border border-muted-foreground rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-primary placeholder:text-muted-foreground focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-semibold text-base bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-semibold hover:underline transition"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Protected by secure authentication
        </p>
      </div>
    </div>
  );
}
