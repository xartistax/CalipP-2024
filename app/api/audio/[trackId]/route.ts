import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { auth } from "../../../../lib/auth";
import { sql } from "../../../../lib/db";
import { r2, R2_BUCKET } from "../../../../lib/r2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, { params }: { params: { trackId: string } }) {
  // 1. Benutzer authentifizieren
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Albumzugriff prüfen
  const tracks = await sql`
    SELECT t.storage_path
    FROM tracks t
    INNER JOIN user_albums ua ON ua.album_id = t.album_id
    WHERE t.id = ${params.trackId}
      AND ua.user_id = ${session.user.id}
    LIMIT 1
  `;

  if (tracks.length === 0) {
    return NextResponse.json({ error: "Track not found or access denied" }, { status: 404 });
  }

  const storagePath = tracks[0].storage_path as string;

  // 3. R2-Dateipfad validieren
  if (!/^i-thoughts-10years\/[^/\\]+\.mp3$/i.test(storagePath) || storagePath.includes("..")) {
    return NextResponse.json({ error: "Invalid audio path" }, { status: 400 });
  }

  // 4. Zeitlich begrenzte URL erstellen
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: storagePath,
  });

  const signedUrl = await getSignedUrl(r2, command, {
    expiresIn: 300, // 5 Minuten
  });

  // 5. Browser direkt zu R2 weiterleiten
  return NextResponse.redirect(signedUrl, {
    status: 307,
    headers: {
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}
