"use client";

import { BookOpen, Dumbbell, LogIn, Menu, Settings, User, X } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
import { useSession } from "@/hooks/useSessions";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { user, loading } = useSession();
	const pathname = usePathname();
	return (
		<>
		<header className="flex bg-background items-center justify-between border-b border-muted-foreground px-4 md:px-16 py-3 text-primary fixed w-full top-0 left-0 z-50">
			<Link href={"/"} className="flex items-center gap-3">
				<BookOpen className="w-6 h-6" />
				<h2 className="text-lg font-bold tracking-tight">Discipline</h2>
			</Link>

			<div className="flex gap-2 items-center">
				<ThemeToggle />
				{ user && 
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 px-0 cursor-pointer flex md:hidden"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						{
							isMenuOpen
							? <X />
							: <Menu />
						}
					</Button>
				}
				{loading ? (
					<div className="flex items-center space-x-2">
						<Skeleton className="h-10 w-10 rounded-full" />
						<div className="space-y-2 hidden md:block">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-16" />
						</div>
					</div>
				) : user ? (
					<a href="/dashboard">
						<button className="h-8 w-8 md:w-auto md:h-10 md:px-4 rounded-lg bg-muted transition hover:bg-muted-foreground text-primary font-bold text-sm tracking-wide flex justify-center items-center gap-1 cursor-pointer">
							<User size={16} />
							<p className="hidden md:block">{user.name}</p>
						</button>
					</a>
				) : (
					<a href="/login">
						<button className="h-10 px-4 rounded-lg bg-muted transition hover:bg-muted-foreground text-primary font-bold text-sm tracking-wide flex items-center gap-1 cursor-pointer">
							<LogIn size={16} />
							Log In
						</button>
					</a>
				)}
			</div>
			{ user &&
				<div className={`md:hidden bg-background border-b border-muted-foreground px-4 py-2 fixed left-0 right-0 z-40 transition
					${
						isMenuOpen
						? "top-14"
						: "-top-full"
					}
					`}>
					<div className="flex flex-col gap-2">
						<Link
							href="/dashboard"
							className={`flex items-center gap-3 px-2 py-3 rounded-lg cursor-pointer transition ${
								pathname.startsWith("/dashboard")
									? "bg-muted-foreground text-primary"
									: "hover:bg-muted text-primary"
							}`}
							onClick={() => setIsMenuOpen(false)}
						>
							<span className="material-symbols-outlined"><User /></span>
							<p className="text-sm">Dashboard</p>
						</Link>
						<Link
							href="/settings"
							className={`flex items-center gap-3 px-2 py-3 rounded-lg cursor-pointer transition ${
								pathname.startsWith("/settings")
									? "bg-muted-foreground text-primary"
									: "hover:bg-muted text-primary"
							}`}
							onClick={() => setIsMenuOpen(false)}
						>
							<span className="material-symbols-outlined"><Settings /></span>
							<p className="text-sm">Settings</p>
						</Link>
						<Link
							href="/habits"
							className={`flex items-center gap-3 px-2 py-3 rounded-lg cursor-pointer transition ${
								pathname.startsWith("/habits")
									? "bg-muted-foreground text-primary"
									: "hover:bg-muted text-primary"
							}`}
							onClick={() => setIsMenuOpen(false)}
						>
							<span className="material-symbols-outlined"><Dumbbell /></span>
							<p className="text-sm">Habits</p>
						</Link>
					</div>
				</div>
			}
		</header>
		</>
	);
}
