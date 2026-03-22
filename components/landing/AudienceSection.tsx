'use client';

import { motion } from 'framer-motion';
import { AudienceCard } from './AudienceCard';

const audiences = [
  'Hizmet işletmeleri',
  'Küçük ve orta ölçekli ekipler',
  'Dijital ürün sahipleri',
  'Ajans operasyonları',
  'Otomasyon ve kod ihtiyacı olan girişimler',
];

export function AudienceSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
            Kimler için uygun?
          </h2>
          <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
            Koschei tek bir sektöre sıkışmaz. Hizmet işletmeleri, dijital ürün sahipleri,
            küçük ekipler, ajans tipi üretim yapan yapılar ve otomasyon ihtiyacı olan
            girişimler için uygundur.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
        >
          {audiences.map((aud, i) => (
            <motion.div
              key={aud}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <AudienceCard label={aud} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
