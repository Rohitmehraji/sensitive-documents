import type { NextApiRequest, NextApiResponse } from "next";
import fs from "node:fs";
import path from "node:path";
import { getDocument } from "@/lib/document-store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const id = req.query.id as string;
  const name = req.query.name as string;
  const doc = getDocument(id);

  if (!doc || !doc.imagePaths) {
    res.status(404).json({ message: "Images not found" });
    return;
  }

  const target = doc.imagePaths.find((imagePath) => path.basename(imagePath) === name);
  if (!target) {
    res.status(404).json({ message: "Image not found" });
    return;
  }

  res.setHeader("Content-Type", "image/jpeg");
  fs.createReadStream(target).pipe(res);
}
