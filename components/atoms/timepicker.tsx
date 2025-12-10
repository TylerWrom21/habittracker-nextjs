"use client";

import { useState, useMemo } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface TimePickerProps {
  required?: boolean;
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function TimePicker({ required, value, onChange, label = "Time" }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [validationError, setValidationError] = useState("");

  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [period, setPeriod] = useState("");

  const parsedTime = useMemo(() => {
    if (value && value.includes(":")) {
      const [hours, mins] = value.split(":");
      const hour24 = parseInt(hours);
      const isPM = hour24 >= 12;
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;

      return {
        hour: hour12.toString(),
        minute: mins,
        period: isPM ? "PM" : "AM"
      };
    }
    return {
      hour: "",
      minute: "",
      period: ""
    };
  }, [value]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setHour(parsedTime.hour);
      setMinute(parsedTime.minute);
      setPeriod(parsedTime.period);
      setValidationError("");
    }
    setIsOpen(open);
  };

  const formatDisplayTime = () => {
    if (!parsedTime.hour || !parsedTime.minute || !parsedTime.period) {
      return "Select time";
    }
    return `${parsedTime.hour}:${parsedTime.minute} ${parsedTime.period}`;
  };

  const isValidTime = () => {
    return hour && minute && period;
  };

  const handleConfirm = () => {
    if (!isValidTime()) {
      setValidationError("Please select hour, minute, and AM/PM");
      return;
    }

    setValidationError("");
    const hour24 = period === "PM"
      ? (parseInt(hour) === 12 ? 12 : parseInt(hour) + 12)
      : (parseInt(hour) === 12 ? 0 : parseInt(hour));

    const timeString = `${hour24.toString().padStart(2, "0")}:${minute}`;
    onChange(timeString);
    setIsOpen(false);
  };

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  return (
    <label className="flex flex-col w-full">
      <p className="text-primary text-xl font-semibold pb-2">{label}</p>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <button
            type="button"
            className={`w-full rounded-lg text-primary border border-muted-foreground transition cursor-pointer
            h-14 px-4 text-left font-bold focus:outline-none hover:bg-muted/80 
            ${
              !isValidTime()
              ? "text-ring"
              : ""
            }
            `}
          >
            {formatDisplayTime()}
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Time</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center gap-4 py-4">
            <Select
              value={hour}
              onValueChange={(value) => {
                setHour(value);
                setValidationError("");
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hours.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-lg font-bold">:</span>
            <Select
              value={minute}
              onValueChange={(value) => {
                setMinute(value);
                setValidationError("");
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {minutes.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={period}
              onValueChange={(value) => {
                setPeriod(value);
                setValidationError("");
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {validationError && (
            <div className="text-sm text-destructive text-center py-2">
              {validationError}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={!isValidTime()}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <input type="hidden" name="time" required={required} value={value} />
   </label>
 );
}
