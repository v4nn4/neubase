"use client";

import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import { Matcher } from "react-day-picker";

type CalendarProps = {
  disabledDays?: Date[];
  bookedDays?: Date[];
  lowAvailabilityDays?: Date[];
  onSelect: (date: Date | undefined) => void;
};

export function Calendar({
  disabledDays = [],
  bookedDays = [],
  lowAvailabilityDays = [],
  onSelect,
}: CalendarProps) {
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <div className="w-fit p-2">
      <ShadCalendar
        mode="single"
        onSelect={onSelect}
        disabled={[...disabledDays, isWeekend, ...bookedDays]}
        modifiers={{
          lowAvailability: lowAvailabilityDays as Matcher[],
        }}
        modifiersClassNames={{
          disabled: "opacity-50 cursor-not-allowed",
          lowAvailability:
            "bg-orange-100 text-orange-800 font-semibold rounded-full",
        }}
        weekStartsOn={1}
      />
    </div>
  );
}
