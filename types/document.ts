export type DocumentInsight = {
  fileId: string;
  originalName: string;
  size: number;
  pageCount: number;
  textPreview: string;
  extractedText: string;
  wordCount: number;
  charCount: number;
  summary: string;
  keySentences: string[];
  uploadedAt: string;
};
