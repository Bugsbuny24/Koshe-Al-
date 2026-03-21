import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Pricing } from '@/components/landing/Pricing';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-void">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
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
            <a href="#" className="hover:text-white transition-colors">Gizlilik</a>
            <a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a>
            <a href="#" className="hover:text-white transition-colors">İletişim</a>
          </div>
          <div className="text-xs text-slate-600">
            Powered by Gemini AI
          </div>
        </div>
      </footer>
    </div>
  );
}
