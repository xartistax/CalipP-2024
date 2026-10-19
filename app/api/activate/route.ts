import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { auth, pool } from "../../../lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // 1. Authenticate user
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  // 2. Read request
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const code = typeof body === "object" && body !== null && "code" in body && typeof body.code === "string" ? body.code.trim() : "";

  // 3. Validate code
  if (!/^[a-f0-9]{64}$/i.test(code)) {
    return NextResponse.json({ error: "Invalid activation code." }, { status: 400 });
  }

  const codeHash = createHash("sha256").update(code).digest("hex");

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Serialize activation requests for the same user.
    await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [session.user.id]);

    // 4. Find NFC code and lock it
    const result = await client.query(
      `
      SELECT
        nc.id,
        nc.album_id,
        nc.redeemed_by,
        nc.redeemed_at,
        a.slug
      FROM nfc_codes nc
      JOIN albums a ON a.id = nc.album_id
      WHERE nc.code_hash = $1
      FOR UPDATE OF nc
      `,
      [codeHash],
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");

      return NextResponse.json({ error: "Activation code not found." }, { status: 404 });
    }

    const nfcCode = result.rows[0];

    // 5. Check whether this card was already redeemed
    if (nfcCode.redeemed_at) {
      await client.query("ROLLBACK");

      if (nfcCode.redeemed_by === session.user.id) {
        return NextResponse.json({
          success: true,
          alreadyActivated: true,
          slug: nfcCode.slug,
        });
      }

      return NextResponse.json({ error: "This card has already been activated." }, { status: 409 });
    }

    // 6. Check whether user already owns the album
    const ownership = await client.query(
      `
      SELECT 1
      FROM user_albums
      WHERE user_id = $1
        AND album_id = $2
      LIMIT 1
      `,
      [session.user.id, nfcCode.album_id],
    );

    if (ownership.rows.length > 0) {
      await client.query("ROLLBACK");

      return NextResponse.json({
        success: true,
        alreadyOwned: true,
        slug: nfcCode.slug,
      });
    }

    // 7. Redeem NFC code
    await client.query(
      `
      UPDATE nfc_codes
      SET
        redeemed_by = $1,
        redeemed_at = NOW()
      WHERE id = $2
      `,
      [session.user.id, nfcCode.id],
    );

    // 8. Grant album access
    await client.query(
      `
      INSERT INTO user_albums (
        user_id,
        album_id
      )
      VALUES ($1, $2)
      `,
      [session.user.id, nfcCode.album_id],
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      alreadyActivated: false,
      slug: nfcCode.slug,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("NFC activation failed:", error);

    return NextResponse.json({ error: "Activation failed." }, { status: 500 });
  } finally {
    client.release();
  }
}
