"use client";

import { useSession } from "@/hooks/useSessions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { user, loading } = useSession();
	useEffect(() => {
		if (!loading && user) {
			router.push("/dashboard");
		}
	}, [loading, user, router]);

	if (loading) {
		return <div>Loading...</div>;
	}
	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			<div className="w-full max-w-md shadow-lg rounded-lg p-8">
				{children}
			</div>
		</div>
	);
}
