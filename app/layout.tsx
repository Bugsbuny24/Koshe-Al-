import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Koshei — Learn. Build. Earn.',
  description: "Pi Network's AI Operating System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
        <script src="https://sdk.minepi.com/pi-sdk.js" async></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('load', function() {
              if (window.Pi) {
                window.Pi.init({ version: "2.0", sandbox: true });
              }
            });
          `
        }} />
      </head>
      <body style={{ fontFamily: "'Syne', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
