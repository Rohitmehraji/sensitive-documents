import fs from "node:fs/promises";
import path from "node:path";

export const UPLOAD_DIR = path.join(process.cwd(), "tmp/uploads");
export const OUTPUT_DIR = path.join(process.cwd(), "tmp/processed");

export const ensureDirs = async () => {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
};
