import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocuAI",
  description: "Upload PDFs, get insights, convert to JPG, and generate AI summaries."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
