import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Pricing } from '@/components/landing/Pricing';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Koschei — Yapay Zeka Destekli Dijital Üniversite',
  description: 'Geleceğin eğitimi burada. AI destekli mentor, kod üretici, ses ve görsel araçlarıyla öğrenmeyi yeniden keşfet.',
  keywords: ['yapay zeka eğitim', 'AI mentor', 'online kurs', 'kod üretici'],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-void">
      {/* Announcement Banner */}
      <div className="bg-gradient-to-r from-accent-blue/20 to-accent-green/20 border-b border-white/5 py-2.5 text-center text-sm text-white">
        🎉 Koshei v1.0 çıktı! İlk 100 kullanıcıya %50 indirim —{' '}
        <Link href="/register" className="font-bold underline hover:text-accent-blue transition-colors">
          Hemen Kaydol
        </Link>
      </div>

      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent-blue flex items-center justify-center text-white font-bold text-xs">K</div>
            <span className="font-bold text-white">Koschei</span>
            <span className="text-slate-600 text-sm ml-2">© 2024</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Gizlilik</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Kullanım Şartları</Link>
            <a href="mailto:destek@koschei.app" className="hover:text-white transition-colors">Destek</a>
            <a href="#" className="hover:text-white transition-colors">Blog</a>
          </div>
          <div className="text-xs text-slate-600">
            Powered by Gemini AI
          </div>
        </div>
      </footer>
    </div>
  );
}

