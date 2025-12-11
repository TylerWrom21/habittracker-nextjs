"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSessions";
import { Skeleton } from "../ui/skeleton";
import { LogOut } from "lucide-react";
import { showToast } from "./toast";
import { apiClient } from "@/lib/apiClient";
import { useState } from "react";

type SidebarItem = {
	icon: React.ReactNode;
	label: string;
	link: string;
	active?: boolean;
};

type SidebarProps = {
	items: SidebarItem[];
};

export default function Sidebar({ items }: SidebarProps) {
	const router = useRouter();
	const pathname = usePathname();
	const { loading } = useSession();
	const [logoutLoading, setLogoutLoading] = useState(false);

	async function handleLogout() {
		setLogoutLoading(true);
		try {
			await apiClient("/api/auth/logout", {
				method: "POST",
			});
			showToast("Logged out successfully", 'success');
			router.push("/login");
		} catch (err) {
			showToast(err instanceof Error ? err.message : "Logout failed", 'error');
		} finally {
			setLogoutLoading(false);
		}
	}

	return (
		<aside className="md:block hidden w-1/5 border-r border-muted-foreground fixed top-0 left-0 bg-background">
			<div className="flex h-full min-h-screen flex-col justify-between p-4 sticky top-24">
				<div className="flex flex-col gap-2 pt-16">
					{loading ? (
						<>
							<Skeleton className="w-full h-10" />
							<Skeleton className="w-full h-10" />
							<Skeleton className="w-full h-10" />
							<Skeleton className="w-full h-10" />
						</>
					) : (
						items.map((item, index) => (
							<SidebarItem
								key={index}
								active={pathname.startsWith(item.link)}
								icon={item.icon}
								label={item.label}
								link={item.link}
							/>
						))
					)}
				</div>
				<div className="flex flex-col gap-2 pt-16">
					{loading ? (
						<Skeleton className="w-full h-10" />
					) : (	
						<button
							onClick={handleLogout}
							disabled={logoutLoading}
							className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition hover:bg-muted text-primary hover:text-red-500 disabled:opacity-50"
						>
							<span className="material-symbols-outlined"><LogOut /></span>
							<p className="text-sm lg:text-lg">{logoutLoading ? "Logging out..." : "Logout"}</p>
						</button>
					)}
				</div>
			</div>
		</aside>
	);
}

function SidebarItem({ icon, link, label, active }: SidebarItem) {
	return (
		<a
			href={link}
			className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition
      ${
				active
					? "bg-muted-foreground text-primary"
					: "hover:bg-muted text-primary"
			}`}
		>
			<span className="material-symbols-outlined">{icon}</span>
			<p className="text-sm lg:text-lg">{label}</p>
		</a>
	);
}
