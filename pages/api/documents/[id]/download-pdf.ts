import type { NextApiRequest, NextApiResponse } from "next";
import fs from "node:fs";
import { getDocument } from "@/lib/document-store";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const id = req.query.id as string;
  const doc = getDocument(id);

  if (!doc) {
    res.status(404).json({ message: "Document not found" });
    return;
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${doc.originalName}"`);

  const stream = fs.createReadStream(doc.absolutePath);
  stream.pipe(res);
}
