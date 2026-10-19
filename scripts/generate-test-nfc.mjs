import { randomBytes, createHash } from "node:crypto";
import { Pool } from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
});

try {
  const code = randomBytes(32).toString("hex");

  const codeHash = createHash("sha256").update(code).digest("hex");

  const result = await pool.query(
    `
    INSERT INTO nfc_codes (album_id, code_hash)
    SELECT id, $1
    FROM albums
    WHERE slug = $2
    RETURNING id
    `,
    [codeHash, "i-thoughts-10years"],
  );

  if (result.rowCount !== 1) {
    throw new Error("Album not found.");
  }

  console.log("\nNFC test card created:");
  console.log(`http://localhost:3000/activate/${code}\n`);
} catch (error) {
  console.error("Failed to create NFC test card:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
