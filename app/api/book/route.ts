import { bookDate } from "@/lib/booking";

export async function POST(req: Request) {
  const { date, name, email } = await req.json();
  if (!date || !name || !email) {
    return Response.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    bookDate(date, name, email);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json(
      { success: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}
