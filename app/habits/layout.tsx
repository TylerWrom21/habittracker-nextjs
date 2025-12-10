"use client";

import Sidebar from "@/components/atoms/sidebar";
import Navbar from "@/components/layouts/navbar.layout";
import { useSession } from "@/hooks/useSessions";
import { Dumbbell, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLoading from "../dashboard/loading";

export default function HabitsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { user, loading } = useSession();
	useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		}
	}, [loading, user, router]);

	return (
		<div className="min-h-screen">
			<Navbar />
			<Sidebar
				items={[
					{
						icon: <User size={16} />,
						link: "/dashboard",
						label: "Dashboard",
					},
					{
						icon: <Settings size={16} />,
						link: "/settings",
						label: "Settings",
					},
					{
						icon: <Dumbbell size={16} />,
						link: "/habits",
						label: "Habits",
					},
				]}
			/>
			<div className="pt-16 md:pl-[20vw]">
				<div className="p-4 sm:p-6">{loading ? <DashboardLoading /> : children}</div>
			</div>
		</div>
	);
}
