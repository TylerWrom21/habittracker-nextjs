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

	function debugThing() {
		console.log(userId);
	}

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
			// showToast((err as Error).message, 'error');
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="flex flex-col gap-5">
				<InputField
					type="text"
					value={name}
					required={true}
					onChange={setName}
					label="Habit Name"
					placeholder="Read for 15 minutes"
				/>

				<FrequencySelector
					required={true}
					frequency={frequency}
					setFrequency={setFrequency}
					days={days}
					setDays={setDays}
				/>

				<TimePicker
					required={true}
					value={time}
					onChange={setTime}
					label="Reminder Time"
				/>

				<label className="flex flex-col w-full">
					<p className="text-primary text-xl font-semibold pb-2">Description</p>
					<Textarea
						required
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="I want to be a.."
						className="w-full rounded-lg text-primary border border-muted-foreground transition hover:bg-muted/80
				        h-14 px-4 font-bold placeholder:text-ring focus:outline-none"
					/>
				</label>
				{/* {error && <p className="text-error">{error}</p>}
				{loading ? "Creating habit..." : ""} */}
				<div className="w-full flex justify-end gap-2">
					<Button
						variant="outline"
						type="submit"
						onClick={() => setSubmitAction("submit")}
					>
						Submit
					</Button>

					<Button
						type="submit"
						onClick={() => setSubmitAction("submit_new")}
					>
						Submit & Create New
					</Button>
				</div>
			</div>
			<Button
				type="button"
				onClick={() => debugThing}
			>
				Submit & Create New
			</Button>
		</form>
	);
}
