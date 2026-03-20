import type { Metadata } from 'next';
import './globals.css';

const isPiSandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === 'true';

export const metadata: Metadata = {
  title: 'Koshei — Learn. Build. Earn.',
  description: "Pi Network's AI Operating System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />

        <script src="https://sdk.minepi.com/pi-sdk.js" defer></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var attempts = 0;

                function initPi() {
                  if (window.Pi && typeof window.Pi.init === 'function') {
                    window.Pi.init({
                      version: "2.0",
                      sandbox: ${isPiSandbox ? 'true' : 'false'}
                    });
                    return;
                  }

                  if (attempts < 40) {
                    attempts += 1;
                    setTimeout(initPi, 250);
                  }
                }

                initPi();
              })();
            `,
          }}
        />
      </head>
      <body style={{ fontFamily: "'Syne', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
