'use client';

import { motion } from 'framer-motion';
import { UseCaseCard } from './UseCaseCard';

const useCases = [
  'Landing page ve teklif sayfası',
  'WhatsApp rezervasyon veya lead toplama akışı',
  'Küçük web proje ve mikro site',
  'İç araç ve mini dashboard',
  'Script ve otomasyon işleri',
  'Teknik kod çıktıları',
  'Eğitim ve uygulama yol haritası',
];

export function UseCasesSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Koschei ile neler üretebilirsin?
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
        >
          {useCases.map((uc, i) => (
            <motion.div
              key={uc}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <UseCaseCard label={uc} />
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="text-slate-500 text-sm"
        >
          Koschei her talebi aynı şekilde çözmez. İşi tanır ve doğru modüle yollar.
        </motion.p>
      </div>
    </section>
  );
}
