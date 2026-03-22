'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function FinalCtaSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-5">
            Tek araç değil.{' '}
            <span className="gradient-text">İş üreten sistem.</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Koschei, kullanıcı talebini anlayan, doğru üretim akışına yerleştiren
            ve çıktıyı oluşturan AI work operator&apos;dür.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center justify-center gap-2 bg-accent-blue hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 shadow-lg shadow-accent-blue/25 hover:shadow-accent-blue/40 hover:-translate-y-0.5"
          >
            Koschei ile Başla
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
