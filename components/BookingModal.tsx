"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { format } from "date-fns";

import { Callout } from "./Callout";

type BookingModalProps = {
  date: Date;
  onClose: () => void;
};

export function BookingModal({ date, onClose }: BookingModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingSlots, setRemainingSlots] = useState<number | null>(null);

  useEffect(() => {
    const loadRemainingSlots = async () => {
      try {
        const res = await fetch("/api/book");
        const bookings = await res.json();

        const targetDate = format(date, "yyyy-MM-dd");

        const count = bookings.filter(
          (b: { date: string }) => b.date && b.date.startsWith(targetDate)
        ).length;

        setRemainingSlots(2 - count);
      } catch (err) {
        console.error("Failed to load slots", err);
        setRemainingSlots(null);
      }
    };

    loadRemainingSlots();
  }, [date]);

  const submitBooking = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        body: JSON.stringify({
          date: format(date, "yyyy-MM-dd"),
          name,
          email,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Booking failed");
      }

      setConfirmed(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book for {format(date, "PPP")}</DialogTitle>
        </DialogHeader>

        {confirmed ? (
          <div className="text-green-600 font-medium">
            ✅ Booking confirmed! We&apos;ll see you then.
          </div>
        ) : (
          <form
            className="space-y-4 mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              submitBooking();
            }}
          >
            {remainingSlots === 1 && (
              <Callout variant="warning">
                There&apos;s only 1 slot left for this date. Better book it
                quick!
              </Callout>
            )}

            <Input
              placeholder="Your name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Your email"
              value={email}
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <Textarea
              placeholder="Leave a short comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />

            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}

            <Button
              disabled={loading || !name || !email}
              type="submit"
              className="w-full"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
