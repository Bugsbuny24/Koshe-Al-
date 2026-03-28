import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { ToastProvider } from '@/components/common/toast-provider'

export const metadata: Metadata = {
  title: 'AdGenius — AI-Powered Ad Copy Generator',
  description: 'Generate high-converting ad copy for Google, Meta, and TikTok with AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <ToastProvider />
        </Providers>
      </body>
    </html>
  )
}
