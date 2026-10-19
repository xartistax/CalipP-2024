import { randomBytes, createHash } from "node:crypto";
import { writeFile, mkdir } from "node:fs/promises";
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const ALBUM_SLUG = "i-thoughts-10years";
const BASE_URL = "https://calipmusic.com";
const COUNT = 500;

async function generate() {
  const client = await pool.connect();

  try {
    // Album suchen
    const albumResult = await client.query("SELECT id FROM albums WHERE slug = $1", [ALBUM_SLUG]);

    if (albumResult.rows.length === 0) {
      throw new Error("Album not found");
    }

    const albumId = albumResult.rows[0].id;

    const rows = [];
    const codes = new Set();

    // 500 eindeutige Codes erzeugen
    while (rows.length < COUNT) {
      const code = randomBytes(32).toString("hex");

      if (codes.has(code)) continue;

      codes.add(code);

      const hash = createHash("sha256").update(code).digest("hex");

      rows.push({
        code,
        hash,
        url: `${BASE_URL}/activate/${code}`,
      });
    }

    // Alle Codes in einer Transaktion speichern
    await client.query("BEGIN");

    for (const row of rows) {
      await client.query(
        `INSERT INTO nfc_codes (album_id, code_hash)
         VALUES ($1, $2)`,
        [albumId, row.hash],
      );
    }

    await client.query("COMMIT");

    // CSV erstellen
    await mkdir("exports", { recursive: true });

    const csv = ["number,activation_url", ...rows.map((row, index) => `${index + 1},${row.url}`)].join("\n");

    const filename = `exports/nfc-codes-${ALBUM_SLUG}.csv`;

    await writeFile(filename, csv, {
      encoding: "utf8",
      flag: "wx",
    });

    console.log(`Generated ${COUNT} NFC codes`);
    console.log(`Saved to Neon database`);
    console.log(`CSV: ${filename}`);
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error(error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

generate();
