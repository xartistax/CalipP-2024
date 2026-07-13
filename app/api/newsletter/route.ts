import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
      await sql`
        INSERT INTO newsletter_subscribers (email)
        VALUES (${normalizedEmail})
      `;
    } catch {
      return NextResponse.json({ error: "You are already subscribed." }, { status: 409 });
    }

    return NextResponse.json({
      message: "Successfully subscribed!",
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
