import { bookDate, canBookDate } from "@/lib/bookings";
import nodemailer from "nodemailer";
import { format } from "date-fns";

const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NAMECHEAP_USERNAME,
    pass: process.env.NAMECHEAP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { name, email, comment, date } = await request.json();

    if (!name || !email || !date) {
      return Response.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const formatted = format(new Date(date), "yyyy-MM-dd");

    if (!canBookDate(formatted)) {
      return Response.json(
        { success: false, error: "This date is fully booked." },
        { status: 400 }
      );
    }

    // Save booking
    bookDate(formatted, name, email, comment);

    // Email content
    const mailOptions = {
      from: process.env.NAMECHEAP_USERNAME,
      to: process.env.NAMECHEAP_USERNAME,
      subject: `New Neubase Booking: ${formatted}`,
      text: `New booking for ${formatted}:\n\nName: ${name}\nEmail: ${email}\nComment: ${
        comment || "—"
      }`,
    };

    await transporter.sendMail(mailOptions);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Booking error:", error);
    return Response.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}
