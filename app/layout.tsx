import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koshei AI",
  description: "Koshei AI — The First AI-Native Digital Language University"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-black text-white" style={{
        background: "radial-gradient(1200px 600px at 20% 10%, rgba(99,102,241,0.28), transparent 55%), radial-gradient(900px 500px at 80% 20%, rgba(34,211,238,0.22), transparent 55%), radial-gradient(900px 700px at 50% 90%, rgba(168,85,247,0.18), transparent 60%), linear-gradient(to bottom, #05060a, #000)"
      }}>
        {children}
      </body>
    </html>
  );
}
