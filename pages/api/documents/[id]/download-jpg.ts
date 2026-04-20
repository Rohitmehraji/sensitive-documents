import type { NextApiRequest, NextApiResponse } from "next";
import fs from "node:fs";
import { getDocument } from "@/lib/document-store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const id = req.query.id as string;
  const doc = getDocument(id);

  if (!doc || !doc.zipPath) {
    res.status(404).json({ message: "JPG zip not found. Run conversion first." });
    return;
  }

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="${doc.originalName.replace(/\.pdf$/i, "")}-images.zip"`);
  fs.createReadStream(doc.zipPath).pipe(res);
}
