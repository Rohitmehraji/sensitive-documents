import type { NextApiRequest, NextApiResponse } from "next";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { analyzePdf } from "@/lib/pdf";
import { summarizeText } from "@/lib/nlp";
import { saveDocument, toClientInsight } from "@/lib/document-store";
import { upload } from "../_upload";

export const config = {
  api: { bodyParser: false }
};

type NextApiRequestWithFile = NextApiRequest & {
  file?: Express.Multer.File;
};

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) =>
  new Promise<void>((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        reject(result);
        return;
      }
      resolve();
    });
  });

export default async function handler(req: NextApiRequestWithFile, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    await runMiddleware(req, res, upload.single("file"));

    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const fileBuffer = await fs.readFile(req.file.path);
    const insight = await analyzePdf(fileBuffer);
    const { summary, keySentences } = summarizeText(insight.extractedText);

    const storedDocument = {
      fileId: randomUUID(),
      storedName: req.file.filename,
      absolutePath: req.file.path,
      originalName: req.file.originalname,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
      ...insight,
      summary,
      keySentences
    };

    saveDocument(storedDocument);

    res.status(200).json({ document: toClientInsight(storedDocument) });
  } catch (error: any) {
    res.status(500).json({ message: error?.message ?? "Upload failed" });
  }
}
