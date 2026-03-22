'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function PricingTeaserSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-white/5 pt-12"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
              Basit bir istekten tam iş akışına kadar ölçeklenir
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
              Koschei; tek ekranlık üretimlerden planlı ve teslim odaklı iş akışlarına
              kadar modüler şekilde çalışır.
            </p>
          </div>
          <Link
            href="/plans"
            className="shrink-0 inline-flex items-center justify-center gap-2 border border-accent-blue/40 text-accent-blue hover:bg-accent-blue/10 font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200"
          >
            Paketleri Gör
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
