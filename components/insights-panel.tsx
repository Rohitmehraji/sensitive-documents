"use client";

import { motion } from "framer-motion";
import { FileText, Files, ImageDown, ScanText } from "lucide-react";
import { ReactNode, useState } from "react";
import { DocumentInsight } from "@/types/document";

type Props = {
  document: DocumentInsight;
};

export const InsightsPanel = ({ document }: Props) => {
  const [converting, setConverting] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const runConvert = async () => {
    setConverting(true);
    const response = await fetch(`/api/documents/${document.fileId}/convert`, { method: "POST" });
    const payload = await response.json();
    setConverting(false);
    if (response.ok) {
      setPreviews(payload.previewImages ?? []);
    }
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Document Insights</h2>
        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">Ready</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Stat icon={<Files className="h-4 w-4" />} label="File" value={document.originalName} />
        <Stat icon={<FileText className="h-4 w-4" />} label="Size" value={`${(document.size / 1024 / 1024).toFixed(2)} MB`} />
        <Stat icon={<ScanText className="h-4 w-4" />} label="Pages" value={String(document.pageCount)} />
        <Stat label="Words" value={String(document.wordCount)} />
        <Stat label="Characters" value={String(document.charCount)} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl bg-white/40 p-4 dark:bg-white/5">
          <h3 className="mb-2 text-sm font-semibold">Text Preview</h3>
          <p className="max-h-48 overflow-y-auto text-sm text-slate-700 dark:text-slate-300">{document.textPreview || "No text extracted."}</p>
        </article>
        <article className="rounded-2xl bg-white/40 p-4 dark:bg-white/5">
          <h3 className="mb-2 text-sm font-semibold">AI Summary</h3>
          <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">{document.summary}</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-400">
            {document.keySentences.map((sentence, idx) => (
              <li key={`${sentence}-${idx}`}>{sentence}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={runConvert} disabled={converting} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500 disabled:opacity-60">
          <ImageDown className="mr-2 inline-block h-4 w-4" />
          {converting ? "Converting..." : "Convert PDF → JPG"}
        </button>
        <a href={`/api/documents/${document.fileId}/download-jpg`} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-slate-700">
          Download JPG ZIP
        </a>
        <a href={`/api/documents/${document.fileId}/download-pdf`} className="rounded-xl border border-slate-400/60 px-4 py-2 text-sm font-medium transition hover:bg-white/50 dark:border-slate-600 dark:hover:bg-slate-900/30">
          Download Original PDF
        </a>
      </div>

      {previews.length ? (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-semibold">Image Preview</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {previews.map((src) => (
              <img key={src} src={src} alt="converted page" className="h-48 w-full rounded-xl object-cover" />
            ))}
          </div>
        </div>
      ) : null}
    </motion.section>
  );
};

const Stat = ({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) => (
  <div className="rounded-2xl bg-white/40 p-4 dark:bg-white/5">
    <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{icon} {label}</p>
    <p className="line-clamp-1 text-sm font-semibold">{value}</p>
  </div>
);
