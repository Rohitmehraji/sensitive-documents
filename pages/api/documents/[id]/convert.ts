import type { NextApiRequest, NextApiResponse } from "next";
import path from "node:path";
import { convertPdfToJpg, zipImages } from "@/lib/converter";
import { getDocument, patchDocument } from "@/lib/document-store";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const id = req.query.id as string;
  const doc = getDocument(id);

  if (!doc) {
    res.status(404).json({ message: "Document not found" });
    return;
  }

  try {
    const imagePaths = await convertPdfToJpg(doc.absolutePath, id);
    const zipPath = await zipImages(id, imagePaths);

    patchDocument(id, { imagePaths, zipPath });

    res.status(200).json({
      message: "Conversion completed",
      imageCount: imagePaths.length,
      previewImages: imagePaths.map((img) => `/api/documents/${id}/image?name=${encodeURIComponent(path.basename(img))}`)
    });
  } catch (error: any) {
    res.status(500).json({ message: error?.message ?? "Conversion failed" });
  }
}
