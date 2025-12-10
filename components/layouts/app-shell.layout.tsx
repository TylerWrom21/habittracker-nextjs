"use client";

import React from "react";
import Navbar from "./navbar.layout";
import { cn } from "@/components/utils";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export default function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface text-textPrimary flex flex-col">
      <Navbar />

      <main
        className={cn(
          "flex-1 w-full max-w-5xl mx-auto px-4 py-6",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
}
