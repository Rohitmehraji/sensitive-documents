# DocuAI

DocuAI is a production-ready Next.js application for uploading PDF files, extracting insights, generating AI summaries, and converting PDF pages to JPG images.

## Features

- Drag & drop PDF uploads with progress
- Document insights:
  - File name, size, page count
  - Extracted text preview
  - Word and character count
- AI summary + key sentence highlights
- PDF → JPG conversion for each page
- Download all JPG pages as ZIP
- Download original PDF
- Glassmorphism, animated, responsive UI with dark/light mode

## Tech Stack

- **Frontend**: Next.js App Router, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API routes (Node runtime)
- **PDF/Text**: `pdf-lib`, `pdfjs-dist`
- **Uploads**: `multer`
- **Image Processing**: `sharp`
- **OCR (optional dependency)**: `tesseract.js`

## Project Structure

```txt
app/
  layout.tsx
  page.tsx
  globals.css
components/
  theme-toggle.tsx
  upload-card.tsx
  insights-panel.tsx
lib/
  converter.ts
  pdf.ts
  nlp.ts
  storage.ts
  document-store.ts
pages/api/
  _upload.ts
  documents/upload.ts
  documents/[id]/index.ts
  documents/[id]/convert.ts
  documents/[id]/download-pdf.ts
  documents/[id]/download-jpg.ts
  documents/[id]/image.ts
types/
  document.ts
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run dev server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)
4. Upload your `doc.pdf` via drag-and-drop or file picker.

> Files are stored temporarily in `tmp/uploads` and `tmp/processed`.

## Deployment (Vercel)

1. Push your repo to GitHub.
2. Import the project in Vercel.
3. Framework preset: **Next.js**.
4. Add build command: `npm run build` and output defaults.
5. Deploy.

### Notes for Vercel

- This MVP uses ephemeral local filesystem storage (`tmp/*`).
- For production persistence, switch to object storage (e.g., S3, R2, Supabase Storage).
- Ensure serverless function memory/time is sufficient for large PDFs.
