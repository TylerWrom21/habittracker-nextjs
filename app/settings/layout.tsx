"use client";

import Sidebar from "@/components/atoms/sidebar";
import Navbar from "@/components/layouts/navbar.layout";
import { useSession } from "@/hooks/useSessions";
import { Dumbbell, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLoading from "@/app/dashboard/loading";
import { showToast } from "@/components/atoms/toast";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useSession();
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
			showToast("Please login first.", 'error');
    }
  }, [loading, user, router]);

	return (
		<div className="min-h-screen">
	     <Navbar />
			 <Sidebar items={[
					{
						icon: <User size={16} />,
						link: "/dashboard",
						label: 'Dashboard',
					},
					{
						icon: <Dumbbell size={16} />,
						link: "/habits",
						label: 'Habits',
					},
					{
						icon: <Settings size={16} />,
						link: "/settings",
						label: 'Settings',
					},
				]} />
	     <div className="pt-16 md:pl-[20vw]">
					<div className="p-6">
						{loading ? (
							<DashboardLoading />
						) : (
							children
						)}
					</div>
	     </div>
		</div>
	);
}
