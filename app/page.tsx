"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/Calendar";
import { BookingModal } from "@/components/BookingModal";
import Image from "next/image";
import { eachDayOfInterval } from "date-fns";
import { Slot } from "@/lib/types";

// Vacation days: April 13–24
const UNAVAILABLE_RANGE = eachDayOfInterval({
  start: new Date("2025-04-13"),
  end: new Date("2025-04-24"),
});

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookings, setBookings] = useState<Slot[]>([]);

  useEffect(() => {
    fetch("/api/book")
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, []);

  const refreshBookings = () => {
    fetch("/api/book")
      .then((res) => res.json())
      .then((data) => setBookings(data));
  };

  const dateCountMap = new Map<string, number>();
  bookings.forEach((b) => {
    dateCountMap.set(b.date, (dateCountMap.get(b.date) || 0) + 1);
  });

  const lowAvailabilityDays = Array.from(dateCountMap.entries())
    .filter(([, count]) => count === 1)
    .map(([date]) => new Date(date));

  const bookedDays = Array.from(dateCountMap.entries())
    .filter(([, count]) => count >= 2)
    .map(([date]) => new Date(date));

  return (
    <main className="max-w-5xl mx-auto py-10 px-4 lg:mt-30">
      <div className="flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
        {/* Left side: Image */}
        <div className="w-full md:w-5xl aspect-video relative rounded-md overflow-hidden shadow-md">
          <Image
            src="/neubau.png"
            alt="Neubau"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right side: Title, Subtitle, Calendar */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
          <h1 className="text-4xl mb-1 font-bold font-[var(--font-title)]">
            The Neubase
          </h1>
          <p className="text-lg font-light mb-4">
            Come work from <s>home</s> Neubau!
          </p>
          <Calendar
            disabledDays={[...UNAVAILABLE_RANGE]}
            bookedDays={bookedDays}
            lowAvailabilityDays={lowAvailabilityDays}
            onSelect={(date) => {
              if (date) setSelectedDate(date);
            }}
          />
        </div>
      </div>

      {selectedDate && (
        <BookingModal
          date={selectedDate}
          onClose={() => {
            setSelectedDate(null);
            refreshBookings();
          }}
        />
      )}
    </main>
  );
}
