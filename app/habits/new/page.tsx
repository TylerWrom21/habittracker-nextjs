"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FrequencySelector from "@/components/atoms/frequencyselector";
import InputField from "@/components/atoms/inputfield";
import TimePicker from "@/components/atoms/timepicker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/apiClient";
import { useSession } from "@/hooks/useSessions";
import { showToast } from "@/components/atoms/toast";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewHabits() {
	const router = useRouter();
	const userId = useSession().user?._id;
	const [name, setName] = useState("");
	const [frequency, setFrequency] = useState("");
	const [days, setDays] = useState<string[]>([]);
	const [time, setTime] = useState("");
	const [description, setDescription] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [submitAction, setSubmitAction] = useState<"submit" | "submit_new">("submit");

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError("");

		if (!days || days.length === 0) {
			showToast("Warning: No days selected. Please select at least one day.", 'warning');
		}
		if (!frequency) {
			showToast("Warning: No frequency selected. Please select a frequency.", 'warning');
		}
		if (!time) {
			showToast("Warning: No time selected. Please select a time.", 'warning');
		}

		try {
			await apiClient("/api/habits", {
				method: "POST",
				body: JSON.stringify({ userId, name, frequency, days, time, description }),
			});
			if (submitAction === "submit_new") {
				setName("");
				setFrequency("");
				setDays([]);
				setTime("");
				setDescription("");
				router.push("/habits/new");
				showToast('Habit created successfully', 'success');
			} else {
				router.push("/habits");
				showToast('Habit created successfully', 'success');
			}
		} catch (err: unknown) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
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
					<h1 className="text-2xl sm:text-3xl font-bold text-primary">Create New Habit</h1>
					<p className="text-primary/80 text-sm mt-1">Build a new habit and start your journey</p>
				</div>
			</div>

			{/* Form Card */}
			<Card>
				<CardHeader>
					<CardTitle>Habit Details</CardTitle>
					<CardDescription>Fill in the information about your new habit</CardDescription>
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
							placeholder="e.g., Read for 15 minutes, Exercise, Meditate"
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
								placeholder="Why do you want to develop this habit? What are your goals?"
								className="w-full rounded-lg text-primary border border-muted-foreground transition hover:bg-muted/80
						        h-24 sm:h-32 px-4 py-2 sm:py-3 font-normal placeholder:text-ring focus:outline-none focus:ring-2 focus:ring-primary/50"
							/>
						</div>

						{/* Error Message */}
						{error && (
							<div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
								<p className="text-red-600 text-sm">{error}</p>
							</div>
						)}

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-muted-foreground/20">
							<Link href="/habits" className="w-full sm:w-auto">
								<Button
									variant="outline"
									type="button"
									className="w-full"
								>
									Cancel
								</Button>
							</Link>

							<Button
								variant="outline"
								type="submit"
								onClick={() => setSubmitAction("submit_new")}
								className="w-full sm:w-auto"
								disabled={loading}
							>
								{loading ? "Creating..." : "Submit & Create New"}
							</Button>

							<Button
								type="submit"
								onClick={() => setSubmitAction("submit")}
								className="w-full sm:w-auto"
								disabled={loading}
							>
								{loading ? "Creating..." : "Submit"}
							</Button>
						</div>
					</div>
				</form>
			</Card>

			{/* Info Card */}
			<Card className="bg-blue-500/10 border-blue-500/30">
				<CardHeader>
					<CardTitle className="text-lg">Tips for Success</CardTitle>
				</CardHeader>
				<div className="px-6 pb-6 space-y-2 text-sm text-primary/80">
					<p>✓ Start small - don&apos;t aim for perfection</p>
					<p>✓ Choose a specific time to complete your habit</p>
					<p>✓ Track consistently to see progress</p>
					<p>✓ Be patient - habits take time to build</p>
				</div>
			</Card>
		</div>
	);
}
