export type Slot = {
  date: string; // format: 'YYYY-MM-DD'
  user: {
    name: string;
    email: string;
    comment?: string;
  };
};

// Hardcoded fake bookings
const bookings: Slot[] = [
  //   {
  //     date: "2025-04-10",
  //     user: { name: "Alice", email: "alice@example.com" },
  //   },
  //   {
  //     date: "2025-04-10",
  //     user: { name: "Bob", email: "bob@example.com" },
  //   },
  //   {
  //     date: "2025-04-11",
  //     user: { name: "Charlie", email: "charlie@example.com" },
  //   },
];

export function getBookings(): Slot[] {
  return bookings;
}

export function getBookingsForDate(date: string): Slot[] {
  return bookings.filter((b) => b.date === date);
}

export function canBookDate(date: string): boolean {
  return getBookingsForDate(date).length < 2;
}

export function bookDate(
  date: string,
  name: string,
  email: string,
  comment?: string
) {
  if (!canBookDate(date)) throw new Error("This date is fully booked.");
  bookings.push({ date, user: { name, email, comment } });
}
