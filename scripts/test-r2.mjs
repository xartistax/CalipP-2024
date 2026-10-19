import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,

  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function test() {
  try {
    const result = await client.send(
      new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
        MaxKeys: 10,
      }),
    );

    console.log("R2 connection successful!");
    console.log("Objects:", result.Contents?.length ?? 0);
  } catch (error) {
    console.error("R2 connection failed:", error);
    process.exitCode = 1;
  }
}

test();
