import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";

export const metadata: Metadata = {
  title: "Koshei — AI Dil Öğretmeni",
  description: "80 dilde AI konuşma pratiği. Konuş, hata yap, düzelt.",
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
