'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-50 glass border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-blue flex items-center justify-center text-white font-bold text-sm">
            K
          </div>
          <span className="font-display font-bold text-xl text-white tracking-tight">
            Koschei
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Özellikler</a>
          <a href="#pricing" className="hover:text-white transition-colors">Planlar</a>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2"
          >
            Giriş Yap
          </Link>
          <Link
            href="/register"
            className="text-sm bg-accent-blue hover:bg-blue-500 text-white px-5 py-2 rounded-lg transition-colors font-semibold"
          >
            Ücretsiz Başla
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
