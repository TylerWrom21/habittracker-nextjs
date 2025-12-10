// "use client";

// import { useState } from "react";

// export default function FrequencySelector() {
// 	const options = ["daily", "weekly", "custom"];
// 	const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// 	const [selected, setSelected] = useState("daily");
// 	const [selectedDays, setSelectedDays] = useState<string[]>(weekdays);

// 	const handleDayToggle = (day: string) => {
// 		if (selected === "daily") {
// 			setSelectedDays([...weekdays]);
// 		} else if (selected === "weekly") {
// 			setSelectedDays([day]);
// 		} else {
// 			if (selectedDays.includes(day)) {
// 				setSelectedDays(selectedDays.filter((d) => d !== day));
// 			} else {
// 				setSelectedDays([...selectedDays, day]);
// 			}
// 		}
// 	};

// 	const handleFrequencyChange = (opt: string) => {
// 		setSelected(opt);
// 		if (opt === "daily") setSelectedDays([...weekdays]);
// 		else if (opt === "weekly") setSelectedDays([]);
// 		else setSelectedDays([]);
// 	};

// 	return (
// 		<div className="flex flex-col gap-3">
// 			<div>
// 				<h2 className="text-primary text-xl font-semibold pb-2">Frequency</h2>
// 				<div className="flex h-12 items-center rounded-lg bg-muted p-1 border border-muted-foreground gap-1">
// 					{options.map((opt) => (
// 						<label
// 							key={opt}
// 							className={`flex cursor-pointer h-full grow items-center justify-center rounded-md px-2 text-sm font-medium transition
//                 ${
// 									selected === opt
// 										? "bg-muted-foreground text-primary font-semibold"
// 										: "text-primary hover:bg-muted-foreground/50 hover:font-semibold"
// 								}`}
// 						>
// 							<span>{opt}</span>
// 							<input
// 								type="radio"
// 								name="frequency"
// 								className="hidden"
// 								value={opt}
// 								checked={selected === opt}
// 								onChange={() => handleFrequencyChange(opt)}
// 							/>
// 						</label>
// 					))}
// 				</div>
// 			</div>

// 			<div>
// 				<h2 className="text-primary text-xl font-semibold pb-2">Select Days</h2>
// 				<div className="flex h-10 items-center rounded-lg bg-muted p-1 border border-muted-foreground gap-1">
// 					{weekdays.map((day) => {
// 						const isSelected =
// 							selected === "daily" ? true : selectedDays.includes(day);
// 						return (
// 							<button
// 								key={day}
// 								type="button"
// 								onClick={() => handleDayToggle(day)}
// 								disabled={selected === "daily"}
// 								className={`flex items-center justify-center px-1 md:px-3 rounded-md text-sm font-medium h-full cursor-pointer w-full transition
//                   ${
// 										isSelected
// 											? "bg-muted-foreground text-primary font-semibold"
// 											: "text-primary hover:bg-muted-foreground/50 hover:font-semibold"
// 									}`}
// 							>
//                 <span className="sm:hidden inline">{day[0]}</span>
//                 <span className="sm:inline hidden lg:hidden">{day[0]}{day[1]}{day[2]}</span>
//                 <span className="lg:inline hidden">{day}</span>
// 							</button>
// 						);
// 					})}
// 				</div>
// 			</div>
// 			<input type="hidden" name="days" value={JSON.stringify(selectedDays)} />
// 		</div>
// 	);
// }
"use client";

interface FrequencySelectorProps {
  required?: boolean;
  frequency: string;
  setFrequency: (value: string) => void;
  days: string[];
  setDays: (days: string[]) => void;
}

export default function FrequencySelector({
	required,
  frequency,
  setFrequency,
  days,
  setDays
}: FrequencySelectorProps) {
  const options = ["daily", "weekly", "custom"];
  const weekdays = [
    "Sunday","Monday","Tuesday","Wednesday",
    "Thursday","Friday","Saturday"
  ];

  const handleDayToggle = (day: string) => {
    if (frequency === "daily") {
      setDays([...weekdays]);
    } else if (frequency === "weekly") {
      setDays([day]);
    } else {
      if (days.includes(day)) {
        setDays(days.filter((d) => d !== day));
      } else {
        setDays([...days, day]);
      }
    }
  };

  const handleFrequencyChange = (opt: string) => {
    setFrequency(opt);

    if (opt === "daily") setDays([...weekdays]);
    else setDays([]); // weekly or custom both start empty
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Frequency Toggle */}
      <div>
        <h2 className="text-primary text-xl font-semibold pb-2">Frequency</h2>
        <div className="flex h-12 items-center rounded-lg bg-muted p-1 border border-muted-foreground gap-1">
          {options.map((opt) => (
            <label
              key={opt}
              className={`flex cursor-pointer h-full grow items-center justify-center rounded-md px-2 text-sm font-medium transition uppercase
                ${
                  frequency === opt
                    ? "bg-muted-foreground text-primary font-semibold"
                    : "text-primary hover:bg-muted-foreground/50 hover:font-semibold"
                }`}
            >
              <span>{opt}</span>
              <input
								required={required}
                type="radio"
                className="hidden"
                value={opt}
                checked={frequency === opt}
                onChange={() => handleFrequencyChange(opt)}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Day Selector */}
      <div>
        <h2 className="text-primary text-xl font-semibold pb-2">Select Days</h2>
        <div className="flex h-10 items-center rounded-lg bg-muted p-1 border border-muted-foreground gap-1">
          {weekdays.map((day) => {
            const isSelected = frequency === "daily" ? true : days.includes(day);

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDayToggle(day)}
                disabled={frequency === "daily"}
                className={`flex items-center justify-center px-1 md:px-3 rounded-md text-sm font-medium h-full cursor-pointer w-full transition
                  ${
                    isSelected
                      ? "bg-muted-foreground text-primary font-semibold"
                      : "text-primary hover:bg-muted-foreground/50 hover:font-semibold"
                  }`}
              >
                <span className="sm:hidden inline">{day[0]}</span>
                <span className="sm:inline hidden lg:hidden">{day.slice(0,3)}</span>
                <span className="lg:inline hidden">{day}</span>
              </button>
            );
          })}
        </div>
      </div>

      <input type="hidden" required={required} name="days" value={JSON.stringify(days)} />
    </div>
  );
}
