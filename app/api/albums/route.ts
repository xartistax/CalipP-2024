import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const albums = await sql`
      SELECT id, slug, title, artist, cover_url
      FROM albums
      ORDER BY created_at DESC
    `;

    return NextResponse.json(albums);
  } catch (error) {
    console.error("Failed to fetch albums:", error);

    return NextResponse.json({ error: "Failed to fetch albums" }, { status: 500 });
  }
}
