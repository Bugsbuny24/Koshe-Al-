import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koshei V1",
  description: "Avatarless AI language teacher",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
