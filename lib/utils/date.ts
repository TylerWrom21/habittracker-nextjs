// Get the day name (Mon, Tue, etc.) from a Date or date string
export function getDayName(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return dayNames[dateObj.getDay()];
}

// Normalize day name to 3-letter abbreviation (Sun, Mon, Tue, etc.)
export function normalizeDayName(day: string): string {
  const dayLower = day.toLowerCase().trim();
  const dayMap: { [key: string]: string } = {
    sunday: "Sun",
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sun: "Sun",
    mon: "Mon",
    tue: "Tue",
    wed: "Wed",
    thu: "Thu",
    fri: "Fri",
    sat: "Sat",
  };
  return dayMap[dayLower] || day;
}

// Get today's date in YYYY-MM-DD format
export function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Get the next scheduled day for a habit
export function getNextScheduledDay(
  habitDays: string[] | undefined,
  today: Date = new Date()
): { day: string; daysUntil: number } {
  // Handle invalid input
  if (!habitDays || habitDays.length === 0) {
    return { day: "Sun", daysUntil: 0 };
  }

  // Normalize all habit days
  const normalizedHabitDays = habitDays.map(normalizeDayName);

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayDayIndex = today.getDay();

  // Find the next scheduled day starting from today
  for (let i = 0; i < 7; i++) {
    const checkDayIndex = (todayDayIndex + i) % 7;
    const checkDayName = dayNames[checkDayIndex];

    if (normalizedHabitDays.includes(checkDayName)) {
      return { day: checkDayName, daysUntil: i };
    }
  }

  // Fallback to first habit day if none found in loop
  const firstDay = normalizedHabitDays[0];
  const dayIndex = dayNames.indexOf(firstDay);
  return { day: firstDay, daysUntil: dayIndex >= 0 ? dayIndex : 0 };
}

// Determine habit completion status
export function getHabitStatus(
  habitDays: string[] | undefined,
  isCompletedToday: boolean,
  today: Date = new Date()
): { status: "completed-today" | "complete-now" | "complete-later"; label: string } {
  // Handle invalid input
  if (!habitDays || habitDays.length === 0) {
    return { status: "complete-later", label: "Not scheduled" };
  }

  // Normalize all habit days
  const normalizedHabitDays = habitDays.map(normalizeDayName);

  const todayDayName = getDayName(today);
  const isScheduledToday = normalizedHabitDays.includes(todayDayName);

  if (isCompletedToday) {
    return { status: "completed-today", label: "Task has been completed" };
  }

  if (isScheduledToday) {
    return { status: "complete-now", label: "Complete now" };
  }

  // Get next scheduled day
  const { day, daysUntil } = getNextScheduledDay(habitDays, today);
  const dayMap: { [key: string]: string } = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };

  // Use dayMap with fallback if day is not found
  const dayLabel = dayMap[day] || day || "future";
  return { status: "complete-later", label: `Complete on ${dayLabel}` };
}
