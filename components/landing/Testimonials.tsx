'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Ahmet Y.',
    role: 'Yazılım Geliştirici',
    avatar: 'A',
    text: 'Koschei ile Python öğrenmek inanılmaz kolay oldu. AI Mentor sorularımı anında yanıtlıyor, sanki yanımda bir öğretmen var gibi.',
    stars: 5,
  },
  {
    name: 'Zeynep K.',
    role: 'Öğrenci',
    avatar: 'Z',
    text: 'Görsel üretici özelliği projelerim için mükemmel. Artık tasarımcı olmadan da kaliteli görseller üretebiliyorum.',
    stars: 5,
  },
  {
    name: 'Emre D.',
    role: 'Freelance Developer',
    avatar: 'E',
    text: 'Kod üretici özelliği çalışma hızımı 3 katına çıkardı. Üstelik Türkçe açıklamalarla geliyor!',
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-bg-deep/30" id="testimonials">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-pi-gold uppercase tracking-widest">Kullanıcı Yorumları</span>
          <h2 className="text-4xl font-black text-white mt-3 mb-4">Öğrencilerimiz Ne Diyor?</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-bg-deep border border-white/8 rounded-2xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, si) => (
                  <span key={si} className="text-pi-gold text-sm">★</span>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center font-bold text-accent-blue">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
