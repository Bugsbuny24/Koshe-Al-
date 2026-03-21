import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://koschei.app'),
  title: {
    default: 'Koschei — Yapay Zeka Destekli Dijital Üniversite',
    template: 'Koschei | %s',
  },
  description: 'Geleceğin eğitimi burada. AI destekli mentor, kod üretici, ses ve görsel araçlarıyla öğrenmeyi yeniden keşfet.',
  keywords: ['yapay zeka', 'eğitim', 'AI mentor', 'kod üretici', 'dijital üniversite', 'online öğrenme', 'Koschei'],
  icons: { icon: '/favicon.ico', apple: '/icon.png' },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Koschei — Yapay Zeka Destekli Dijital Üniversite',
    description: 'Geleceğin eğitimi burada. AI destekli mentor, kod üretici ve daha fazlası.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Koschei',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Koschei — Yapay Zeka Destekli Dijital Üniversite',
    description: 'Geleceğin eğitimi burada.',
  },
};

export const viewport: Viewport = {
  themeColor: '#060608',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Koschei',
              description: 'Yapay Zeka Destekli Dijital Üniversite',
              url: 'https://koschei.app',
            }),
          }}
        />
      </head>
      <body className="antialiased bg-bg-void text-slate-100 font-display">
        {children}
      </body>
    </html>
  );
}

