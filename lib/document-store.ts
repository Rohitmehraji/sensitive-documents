import path from "node:path";
import { DocumentInsight } from "@/types/document";
import { OUTPUT_DIR, UPLOAD_DIR } from "./storage";

type StoredDocument = DocumentInsight & {
  storedName: string;
  absolutePath: string;
  zipPath?: string;
  imagePaths?: string[];
};

const store = new Map<string, StoredDocument>();

export const saveDocument = (data: StoredDocument) => {
  store.set(data.fileId, data);
};

export const getDocument = (fileId: string) => store.get(fileId);

export const patchDocument = (fileId: string, updates: Partial<StoredDocument>) => {
  const current = store.get(fileId);
  if (!current) return;
  store.set(fileId, { ...current, ...updates });
};

export const toClientInsight = (doc: StoredDocument): DocumentInsight => ({
  fileId: doc.fileId,
  originalName: doc.originalName,
  size: doc.size,
  pageCount: doc.pageCount,
  textPreview: doc.textPreview,
  extractedText: doc.extractedText,
  wordCount: doc.wordCount,
  charCount: doc.charCount,
  summary: doc.summary,
  keySentences: doc.keySentences,
  uploadedAt: doc.uploadedAt
});

export const resolveUploadPath = (storedName: string) => path.join(UPLOAD_DIR, storedName);
export const resolveOutputPath = (fileName: string) => path.join(OUTPUT_DIR, fileName);
