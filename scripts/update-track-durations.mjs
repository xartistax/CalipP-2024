import { config } from "dotenv";
import { Pool } from "pg";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { parseBuffer } from "music-metadata";

config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function updateDurations() {
  const { rows: tracks } = await pool.query(`
    SELECT t.id, t.title, t.storage_path
    FROM tracks t
    JOIN albums a ON a.id = t.album_id
    WHERE a.slug = 'i-thoughts-10years'
    ORDER BY t.track_number
  `);

  console.log(`Found ${tracks.length} tracks`);

  for (const track of tracks) {
    const response = await r2.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: track.storage_path,
      }),
    );

    const bytes = await response.Body.transformToByteArray();

    const metadata = await parseBuffer(Buffer.from(bytes), { mimeType: "audio/mpeg" }, { duration: true });

    if (!Number.isFinite(metadata.format.duration)) {
      throw new Error(`Could not read duration: ${track.title}`);
    }

    const seconds = Math.round(metadata.format.duration);

    await pool.query("UPDATE tracks SET duration = $1 WHERE id = $2", [seconds, track.id]);

    const minutes = Math.floor(seconds / 60);
    const remaining = String(seconds % 60).padStart(2, "0");

    console.log(`${track.title}: ${minutes}:${remaining}`);
  }

  console.log("All durations updated!");
}

updateDurations()
  .then(() => {
    console.log("Script finished successfully.");
  })
  .catch((error) => {
    console.error("Error updating durations:", error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
