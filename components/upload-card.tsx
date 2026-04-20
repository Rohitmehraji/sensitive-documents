"use client";

import { motion } from "framer-motion";
import { FileUp } from "lucide-react";
import { useRef, useState } from "react";
import { DocumentInsight } from "@/types/document";

type Props = {
  onUploaded: (document: DocumentInsight) => void;
};

export const UploadCard = ({ onUploaded }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }

    setError("");
    setLoading(true);
    setProgress(2);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/documents/upload");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const pct = Math.round((event.loaded / event.total) * 100);
      setProgress(pct);
    };

    xhr.onload = () => {
      setLoading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        const payload = JSON.parse(xhr.responseText);
        onUploaded(payload.document);
        setProgress(100);
        return;
      }
      setError("Upload failed. Please try again.");
    };

    xhr.onerror = () => {
      setLoading(false);
      setError("Network error while uploading.");
    };

    xhr.send(formData);
  };

  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file) uploadFile(file);
        }}
        className="rounded-2xl border-2 border-dashed border-slate-300/70 p-10 text-center dark:border-slate-700"
      >
        <FileUp className="mx-auto mb-3 h-10 w-10 text-cyan-500" />
        <h2 className="mb-2 text-xl font-semibold">Drop your PDF here</h2>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">or click to browse from your computer</p>
        <button
          className="rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:opacity-90 dark:bg-cyan-500 dark:text-slate-950"
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          Upload PDF
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
          }}
        />
      </div>

      {loading || progress > 0 ? (
        <div className="mt-4">
          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">Upload progress: {progress}%</p>
        </div>
      ) : null}
      {error ? <p className="mt-3 text-sm text-rose-500">{error}</p> : null}
    </motion.section>
  );
};
