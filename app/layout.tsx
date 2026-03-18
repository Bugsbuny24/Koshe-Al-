import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";

// Force all pages to be dynamically rendered so Supabase auth is evaluated
// at request time (not at build time when env vars may not be available).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Koshei AI University",
  description:
    "AI mentor eşliğinde akademik dil programları. Speaking practice, rozet, sertifika ve kredi tabanlı öğrenme.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        <div className="min-h-screen bg-app text-white">
          <div className="bg-grid" />
          <Navbar />
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
