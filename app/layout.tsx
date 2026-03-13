import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Koshei AI",
  description: "AI speaking teacher for real language practice",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>
        {children}
        <Script
          src="https://sdk.minepi.com/pi-sdk.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
