"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { InsightsPanel } from "@/components/insights-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { UploadCard } from "@/components/upload-card";
import { DocumentInsight } from "@/types/document";

export default function HomePage() {
  const [document, setDocument] = useState<DocumentInsight | null>(null);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 md:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold md:text-5xl">
            <span className="gradient-text">DocuAI</span> Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Upload PDFs, unlock insights, convert pages to JPG, and summarize instantly.</p>
        </motion.div>
        <ThemeToggle />
      </header>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <UploadCard onUploaded={setDocument} />
        {document ? (
          <InsightsPanel document={document} />
        ) : (
          <section className="glass flex min-h-[360px] items-center justify-center rounded-3xl p-6 text-center text-slate-500 dark:text-slate-400">
            Upload a PDF to view insights and AI summary.
          </section>
        )}
      </div>
    </main>
  );
}
