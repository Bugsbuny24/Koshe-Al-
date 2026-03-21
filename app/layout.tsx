import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Koschei — Yapay Zeka Destekli Dijital Üniversite',
  description: 'Geleceğin eğitimi burada. AI destekli mentor, kod üretici, ses ve görsel araçlarıyla öğrenmeyi yeniden keşfet.',
  keywords: 'yapay zeka, eğitim, AI mentor, kod üretici, dijital üniversite',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Koschei — Yapay Zeka Destekli Dijital Üniversite',
    description: 'Geleceğin eğitimi burada.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-bg-void text-slate-100 font-display">
        {children}
      </body>
    </html>
  );
}
