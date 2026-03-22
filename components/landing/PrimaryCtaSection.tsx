'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function PrimaryCtaSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-bg-deep border border-white/5 rounded-2xl p-10 md:p-14 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
            Bugün ne üretmek istiyorsun?
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto mb-8 leading-relaxed">
            İşini chat ile anlat, execution planı çıkar, builder ile üret veya
            workspace&apos;te mevcut işlerini yönet.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/chat"
              className="inline-flex items-center justify-center gap-2 bg-accent-blue hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-accent-blue/20 hover:-translate-y-0.5"
            >
              Chat&apos;i Aç
            </Link>
            <Link
              href="/execution/new"
              className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5"
            >
              Execution Başlat
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
