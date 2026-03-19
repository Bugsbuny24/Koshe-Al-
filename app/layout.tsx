import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Koshei — Learn. Build. Earn.',
  description: "Pi Network's AI Operating System",
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://sdk.minepi.com/pi-sdk.js" />
      </head>
      <body className="bg-[#060608] text-[#F0EDE6] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
