'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'Koschei ücretsiz mi?',
    a: 'Evet! Starter planımız sonsuza kadar ücretsizdir. 100 kredi ile AI Mentor, TTS ve temel özelliklere erişebilirsiniz.',
  },
  {
    q: 'Hangi yapay zeka modelleri kullanılıyor?',
    a: "Google'ın en gelişmiş Gemini AI modelleri kullanılıyor. Mentor için Gemini Flash, kod üretimi için Gemini Pro, görsel için Imagen 4.",
  },
  {
    q: 'Krediler nasıl çalışıyor?',
    a: 'Her özellik kullanımında kredi harcanır. Mentor Lite 0.5 kredi, Kod Üretici 5 kredi, Görsel Üretici 10 kredi kullanır. Planınıza göre aylık kredi yüklenir.',
  },
  {
    q: 'İçerikler Türkçe mi?',
    a: 'Evet, platform tamamen Türkçe tasarlanmıştır. AI modelleri Türkçe sorularınızı anlayıp Türkçe yanıt verir.',
  },
  {
    q: 'Verilerimi silmek istersem ne yapmalıyım?',
    a: 'Ayarlar sayfasından "Hesabı Sil" seçeneğini kullanabilirsiniz. Tüm verileriniz kalıcı olarak silinir.',
  },
  {
    q: 'Aboneliği iptal edebilir miyim?',
    a: 'Evet, istediğiniz zaman plan değişikliği veya iptali yapabilirsiniz. Kalan süreniz için ücret iadesi sağlanır.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-accent-blue uppercase tracking-widest">SSS</span>
          <h2 className="text-4xl font-black text-white mt-3 mb-4">Sıkça Sorulan Sorular</h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-bg-deep border border-white/8 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium text-white">{faq.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 180 : 0 }}
                  className="text-slate-400 shrink-0 ml-4"
                >
                  ▼
                </motion.span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
