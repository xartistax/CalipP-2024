import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { config } from "dotenv";
import { createReadStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

config({ path: ".env.local" });

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const bucket = process.env.R2_BUCKET_NAME;

const album = "i-thoughts-10years";

const directory = path.join(process.cwd(), "private", "audio", album);

async function upload() {
  const files = (await readdir(directory)).filter((file) => file.toLowerCase().endsWith(".mp3")).sort();

  console.log(`Found ${files.length} MP3 files`);

  if (files.length !== 15) {
    throw new Error("Expected exactly 15 MP3 files");
  }

  for (const [index, filename] of files.entries()) {
    const filePath = path.join(directory, filename);
    const fileStats = await stat(filePath);

    const key = `${album}/${filename}`;

    console.log(`[${index + 1}/${files.length}] Uploading ${filename}`);

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: createReadStream(filePath),
        ContentLength: fileStats.size,
        ContentType: "audio/mpeg",
      }),
    );

    console.log(`Uploaded: ${key}`);
  }

  console.log("All 15 tracks uploaded successfully!");
}

upload().catch((error) => {
  console.error("Upload failed:", error);
  process.exitCode = 1;
});
