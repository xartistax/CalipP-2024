import { readFile, writeFile } from "node:fs/promises";

const input = "exports/nfc-codes-i-thoughts-10years.csv";
const output = "exports/nfc-codes-i-thoughts-10years.txt";

const csv = await readFile(input, "utf8");

const lines = csv.trim().split(/\r?\n/).slice(1);

const content = [
  "CALI P – iThoughts 10 Years",
  "NFC Activation Links",
  "",
  ...lines.flatMap((line) => {
    const [number, url] = line.split(",");

    return [`Card ${number.padStart(3, "0")}`, url, ""];
  }),
].join("\n");

await writeFile(output, content, "utf8");

console.log(`Created ${output} with ${lines.length} codes`);
