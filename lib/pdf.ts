import { PDFDocument } from "pdf-lib";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export const analyzePdf = async (buffer: Buffer) => {
  const pdfDoc = await PDFDocument.load(buffer);
  const pageCount = pdfDoc.getPageCount();

  const loadingTask = getDocument({ data: new Uint8Array(buffer) });
  const pdf = await loadingTask.promise;

  let extractedText = "";
  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ");
    extractedText += `${pageText}\n`;
  }

  const cleaned = extractedText.trim().replace(/\s+/g, " ");
  const textPreview = cleaned.slice(0, 700);
  const words = cleaned.match(/\b\w+\b/g) ?? [];

  return {
    pageCount,
    extractedText: cleaned,
    textPreview,
    wordCount: words.length,
    charCount: cleaned.length
  };
};
