"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import FrequencySelector from "@/components/atoms/frequencyselector";
import InputField from "@/components/atoms/inputfield";
import TimePicker from "@/components/atoms/timepicker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/atoms/toast";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

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

export default function EditHabit() {
  const router = useRouter();
  const params = useParams();
  const habitId = params.habitId as string;

  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch the habit data on mount
  useEffect(() => {
    async function fetchHabit() {
      try {
        const res = await fetch(`/api/habits/${habitId}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch habit");
        }

        const data = await res.json();
        const habit: Habit = data.habit;

        setName(habit.name);
        setFrequency(habit.frequency);
        setDays(habit.days);
        setTime(habit.time);
        setDescription(habit.description);
      } catch (err) {
        console.error("Error fetching habit:", err);
        setError((err as Error).message);
        showToast("Failed to fetch habit details", "error");
      } finally {
        setLoading(false);
      }
    }

    if (habitId) {
      fetchHabit();
    }
  }, [habitId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    if (!days || days.length === 0) {
      showToast("Warning: No days selected. Please select at least one day.", "warning");
      setSubmitLoading(false);
      return;
    }
    if (!frequency) {
      showToast("Warning: No frequency selected. Please select a frequency.", "warning");
      setSubmitLoading(false);
      return;
    }
    if (!time) {
      showToast("Warning: No time selected. Please select a time.", "warning");
      setSubmitLoading(false);
      return;
    }

    try {
      await fetch(`/api/habits/${habitId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, frequency, days, time, description }),
      });

      router.push("/habits");
      showToast("Habit updated successfully", "success");
    } catch (err: unknown) {
      setError((err as Error).message);
      showToast("Failed to update habit", "error");
    } finally {
      setSubmitLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-primary text-lg font-semibold mb-2">Loading habit...</div>
          <div className="text-primary/80 text-sm">Please wait</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/habits">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Edit Habit</h1>
          <p className="text-primary/80 text-sm mt-1">Update your habit settings</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-600 font-medium text-sm">Error</p>
            <p className="text-red-600/80 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Habit Details</CardTitle>
          <CardDescription>Modify your habit information</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="space-y-6">
            {/* Habit Name */}
            <InputField
              type="text"
              value={name}
              required={true}
              onChange={setName}
              label="Habit Name"
              placeholder="Read for 15 minutes"
            />

            {/* Frequency Selector */}
            <FrequencySelector
              required={true}
              frequency={frequency}
              setFrequency={setFrequency}
              days={days}
              setDays={setDays}
            />

            {/* Time Picker */}
            <TimePicker
              required={true}
              value={time}
              onChange={setTime}
              label="Reminder Time"
            />

            {/* Description */}
            <div className="flex flex-col w-full">
              <label className="block text-primary text-sm font-semibold mb-2">
                Description
              </label>
              <Textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Update your habit description..."
                className="w-full rounded-lg text-primary border border-muted-foreground transition hover:bg-muted/80
                          h-24 sm:h-32 px-4 py-2 sm:py-3 font-normal placeholder:text-ring focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-muted-foreground/20">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={submitLoading}
                className="w-full sm:w-auto"
              >
                {submitLoading ? "Updating..." : "Update Habit"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
