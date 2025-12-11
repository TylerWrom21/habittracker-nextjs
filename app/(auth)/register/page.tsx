"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/atoms/toast";

export default function RegisterPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError("");

		const form = new FormData(e as unknown as HTMLFormElement);
		const name = form.get("name");
		const email = form.get("email");
		const password = form.get("password");

		try {
			await apiClient("/api/auth/register", {
				method: "POST",
				body: JSON.stringify({ name, email, password }),
			});
			router.push("/dashboard");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
			showToast(err instanceof Error ? err.message : "Unknown error", 'error');
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			{/* <FormField label="Habit Category">
				<Select>
					<SelectTrigger>
						<SelectValue placeholder="Choose category" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="health">Health</SelectItem>
						<SelectItem value="work">Work</SelectItem>
						<SelectItem value="study">Study</SelectItem>
						<SelectItem value="custom">Custom</SelectItem>
					</SelectContent>
				</Select>
			</FormField> */}

			<div>
				<h1 className="text-xl mb-4 font-semibold">Create your account</h1>

				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<div>
						<label className="block text-sm mb-1">Name</label>
						<input
							name="name"
							type="text"
							className="w-full border border-border rounded-md px-3 py-2"
							required
						/>
					</div>

					<div>
						<label className="block text-sm mb-1">Email</label>
						<input
							name="email"
							type="email"
							className="w-full border border-border rounded-md px-3 py-2"
							required
						/>
					</div>

					<div>
						<label className="block text-sm mb-1">Password</label>
						<input
							name="password"
							type="password"
							className="w-full border border-border rounded-md px-3 py-2"
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full py-2 rounded-md font-medium bg-primary text-background hover:bg-primary-hover transition"
					>
						{loading ? "Creating account…" : "Register"}
					</button>
				</form>

				<p className="text-sm mt-4 text-center">
					Already have an account?{" "}
					<a href="/login" className="text-primary hover:underline">
						Login
					</a>
				</p>
			</div>
		</>
	);
}
