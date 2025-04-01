import { prisma } from "@/lib/db";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

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
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    const formattedDate = new Date(date).toISOString().split("T")[0];

    const existing = await prisma.booking.count({
      where: {
        date: new Date(formattedDate),
      },
    });

    if (existing >= 2) {
      return NextResponse.json(
        { success: false, error: "This date is fully booked." },
        { status: 400 }
      );
    }

    await prisma.booking.create({
      data: {
        name,
        email,
        comment,
        date: new Date(formattedDate),
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.NAMECHEAP_USERNAME,
      to: process.env.NAMECHEAP_USERNAME,
      subject: `New Neubase Booking: ${formattedDate}`,
      text: `New booking for ${formattedDate}:\n\nName: ${name}\nEmail: ${email}\nComment: ${
        comment || "—"
      }`,
    };

    //await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { error: "Could not fetch bookings" },
      { status: 500 }
    );
  }
}
