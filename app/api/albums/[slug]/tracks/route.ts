import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../lib/auth";
import { sql } from "../../../../../lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tracks = await sql`
    SELECT
      t.id,
      t.title,
      t.track_number
    FROM tracks t
    JOIN albums a ON a.id = t.album_id
    JOIN user_albums ua ON ua.album_id = a.id
    WHERE a.slug = ${params.slug}
      AND ua.user_id = ${session.user.id}
    ORDER BY t.track_number
  `;

  return NextResponse.json(tracks);
}
