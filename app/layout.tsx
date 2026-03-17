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
        <Navbar />
        {children}
      </body>
    </html>
  );
}
