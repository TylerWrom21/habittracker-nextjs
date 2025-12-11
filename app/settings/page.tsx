"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/atoms/toast";
import { ArrowLeft, Save, Eye, EyeOff, Lock, Mail, User as UserIcon, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";

interface UserSettings {
  name: string;
  email: string;
  timezone: string;
  theme: "light" | "dark" | "system";
  dateFormat: string;
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: "",
    email: "",
    timezone: "UTC",
    theme: "system",
    dateFormat: "YYYY-MM-DD",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordChange>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordChanging, setPasswordChanging] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();
        setUserSettings({
          name: data.user.name,
          email: data.user.email,
          timezone: data.user.settings?.timezone || "UTC",
          theme: data.user.settings?.theme || "system",
          dateFormat: data.user.settings?.dateFormat || "YYYY-MM-DD",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        showToast("Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSettingsChange = (field: keyof UserSettings, value: string) => {
    setUserSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userSettings.name,
          email: userSettings.email,
          settings: {
            timezone: userSettings.timezone,
            theme: userSettings.theme,
            dateFormat: userSettings.dateFormat,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      showToast("Profile updated successfully", "success");
    } catch (err) {
      console.error("Error updating profile:", err);
      showToast((err as Error).message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }

    setPasswordChanging(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to change password");
      }

      showToast("Password changed successfully", "success");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error changing password:", err);
      showToast((err as Error).message, "error");
    } finally {
      setPasswordChanging(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-primary text-lg font-semibold mb-2">Loading settings...</div>
          <div className="text-primary/60 text-sm">Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Settings</h1>
          <p className="text-primary/60 text-sm mt-1">Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-blue-500" />
            <div>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-primary">
              Full Name
            </label>
            <Input
              type="text"
              value={userSettings.name}
              onChange={(e) => handleSettingsChange("name", e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-lg text-primary border border-muted-foreground transition hover:bg-muted/80 px-4 py-2 sm:py-3 font-normal placeholder:text-ring focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-primary/60">Maximum 60 characters</p>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-primary">
              Email Address
            </label>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary/60 shrink-0" />
              <Input
                type="email"
                value={userSettings.email}
                onChange={(e) => handleSettingsChange("email", e.target.value)}
                placeholder="your.email@example.com"
                className="flex-1 rounded-lg text-primary border border-muted-foreground transition hover:bg-muted/80 px-4 py-2 sm:py-3 font-normal placeholder:text-ring focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <p className="text-xs text-primary/60">Used for login and notifications</p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-muted-foreground/20">
            <Button
              onClick={handleSaveSettings}
              disabled={saving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Password Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-500" />
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-primary">
              Current Password
            </label>
            <div className="flex items-center gap-2 border border-muted-foreground rounded-lg focus-within:ring-2 focus-within:ring-primary/50 transition">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                placeholder="Enter current password"
                className="flex-1 bg-transparent text-primary px-4 py-2 sm:py-3 font-normal placeholder:text-ring focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
                className="pr-4 text-primary/60 hover:text-primary transition"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-primary">
              New Password
            </label>
            <div className="flex items-center gap-2 border border-muted-foreground rounded-lg focus-within:ring-2 focus-within:ring-primary/50 transition">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                placeholder="Enter new password"
                className="flex-1 bg-transparent text-primary px-4 py-2 sm:py-3 font-normal placeholder:text-ring focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    new: !prev.new,
                  }))
                }
                className="pr-4 text-primary/60 hover:text-primary transition"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-primary/60">Minimum 8 characters</p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-primary">
              Confirm New Password
            </label>
            <div className="flex items-center gap-2 border border-muted-foreground rounded-lg focus-within:ring-2 focus-within:ring-primary/50 transition">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="Confirm new password"
                className="flex-1 bg-transparent text-primary px-4 py-2 sm:py-3 font-normal placeholder:text-ring focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                className="pr-4 text-primary/60 hover:text-primary transition"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Change Password Button */}
          <div className="flex justify-end pt-4 border-t border-muted-foreground/20">
            <Button
              onClick={handlePasswordChange}
              disabled={passwordChanging || !passwordForm.currentPassword || !passwordForm.newPassword}
              variant="destructive"
              className="gap-2"
            >
              <Lock className="h-4 w-4" />
              {passwordChanging ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </div>
      </Card>

      
    </div>
  );
}