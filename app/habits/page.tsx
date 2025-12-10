"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { useHabits } from "@/hooks/useHabits";

export default function HabitsPage() {
  const { habits, loading, error } = useHabits();

  if (loading) {
    return <div>Loading habits...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="flex justify-between pb-2 items-center">
        <h1 className="text-primary text-xl font-semibold">Your Habits</h1>
        <Link href={"/habits/new"}>
          <Button>Create New</Button>
        </Link>
      </div>
      <div className="container mx-auto">
        <DataTable
          columns={columns}
          data={habits}
        />
      </div>
    </>
  );
}