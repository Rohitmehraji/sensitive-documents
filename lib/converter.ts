import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import archiver from "archiver";
import sharp from "sharp";
import { createCanvas } from "canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { OUTPUT_DIR } from "./storage";

export const convertPdfToJpg = async (pdfPath: string, fileId: string) => {
  const pdfBuffer = await fsPromises.readFile(pdfPath);
  const loadingTask = getDocument({ data: new Uint8Array(pdfBuffer) });
  const pdf = await loadingTask.promise;

  const outDir = path.join(OUTPUT_DIR, fileId);
  await fsPromises.mkdir(outDir, { recursive: true });

  const imagePaths: string[] = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.2 });

    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const context = canvas.getContext("2d");

    await page.render({
      canvasContext: context as any,
      viewport
    }).promise;

    const jpgBuffer = await sharp(canvas.toBuffer("image/png")).jpeg({ quality: 92 }).toBuffer();
    const imagePath = path.join(outDir, `page-${pageNum}.jpg`);
    await fsPromises.writeFile(imagePath, jpgBuffer);
    imagePaths.push(imagePath);
  }

  return imagePaths;
};

export const zipImages = async (fileId: string, imagePaths: string[]) => {
  const zipPath = path.join(OUTPUT_DIR, `${fileId}.zip`);

  await new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve());
    archive.on("error", reject);

    archive.pipe(output);

    imagePaths.forEach((imagePath) => {
      archive.file(imagePath, { name: path.basename(imagePath) });
    });

    archive.finalize();
  });

  return zipPath;
};
