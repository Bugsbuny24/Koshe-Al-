'use client';

import { motion } from 'framer-motion';

const points = [
  'Önce scope çıkarır',
  'Sonra plan kurar',
  'Doğru modüle yönlendirir',
  'Teslim ve revizyon akışı taşır',
  'İş tipine göre hareket eder',
];

export function WhyKoscheiSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
              Neden sadece bir AI aracı değil?
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Cevap üretmek kolaydır. Doğru akış kurmak fark yaratır.
            </p>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            {points.map((point, i) => (
              <motion.li
                key={point}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className="flex items-center gap-3 text-slate-300 text-sm"
              >
                <span className="w-5 h-5 rounded-full bg-accent-green/10 border border-accent-green/30 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {point}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
