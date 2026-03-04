import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koshei AI",
  description: "Koshei AI v1 — Dil Üniversitesi"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="koshei-bg min-h-screen">
        {children}
      </body>
    </html>
  );
}
