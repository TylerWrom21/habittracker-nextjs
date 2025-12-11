"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHabits } from "@/hooks/useHabits";
import { Flame, Calendar, Clock, Edit2, Trash2, Plus, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";

interface Habit {
  _id: string;
  name: string;
  frequency: string;
  days: string[];
  time: string;
  description: string;
}

export default function HabitsPage() {
  const router = useRouter();
  const { habits, loading, error, deleteHabit } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-primary text-lg font-semibold mb-2">Loading habits...</div>
          <div className="text-primary/60 text-sm">Please wait</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md border-red-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              Error Loading Habits
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleDelete = (habitId: string) => {
    setSelectedHabitId(habitId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedHabitId) {
      const habit = habits.find((h) => h._id === selectedHabitId);
      deleteHabit(selectedHabitId, habit?.name || "Habit");
      setIsModalOpen(false);
      setSelectedHabitId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Your Habits</h1>
          <p className="text-primary/60 text-sm mt-1">Track and manage all your daily habits</p>
        </div>
        <Link href="/habits/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto gap-2">
            <Plus className="h-4 w-4" />
            Create New
          </Button>
        </Link>
      </div>

      {/* Habits Grid */}
      {habits.length === 0 ? (
        <Card className="col-span-full">
          <CardHeader className="text-center">
            <CardTitle>No Habits Yet</CardTitle>
            <CardDescription>Create your first habit to get started</CardDescription>
          </CardHeader>
          <div className="flex justify-center pb-6">
            <Link href="/habits/new">
              <Button>Create First Habit</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {habits.map((habit: Habit) => (
            <div key={habit._id} className="h-full">
              <Card
                className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                onClick={() => router.push(`/habits/${habit._id}`)}
              >
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg sm:text-xl truncate">
                        {habit.name}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm line-clamp-2 mt-1">
                        {habit.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <div className="px-6 pb-4 sm:pb-6 flex-1 space-y-3 sm:space-y-4">
                  {/* Frequency Badge */}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
                    <div>
                      <p className="text-xs text-primary/60">Frequency</p>
                      <p className="text-sm font-semibold text-primary capitalize">
                        {habit.frequency}
                      </p>
                    </div>
                  </div>

                  {/* Days */}
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500 shrink-0" />
                    <div>
                      <p className="text-xs text-primary/60">Days</p>
                      <p className="text-sm font-semibold text-primary">
                        {habit.days.join(", ")}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500 shrink-0" />
                    <div>
                      <p className="text-xs text-primary/60">Time</p>
                      <p className="text-sm font-semibold text-primary">{habit.time}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-4 sm:pb-6 border-t border-muted-foreground/20 pt-4 flex gap-2 mt-auto">
                  <Link href={`/habits/${habit._id}/edit`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(habit._id);
                    }}
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Habit"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-primary/80">
            Are you sure you want to delete this habit? This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}