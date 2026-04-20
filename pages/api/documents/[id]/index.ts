import type { NextApiRequest, NextApiResponse } from "next";
import { getDocument, toClientInsight } from "@/lib/document-store";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
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

  res.status(200).json({ document: toClientInsight(doc) });
}
