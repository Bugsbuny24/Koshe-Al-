'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    step: '01',
    title: 'Kaydol',
    desc: 'Ücretsiz hesap oluştur, hemen başla. Kredi kartı gerekmez.',
    icon: '✉️',
  },
  {
    step: '02',
    title: 'Plan Seç',
    desc: 'İhtiyacına uygun planı seç. Starter planı sonsuza kadar ücretsiz.',
    icon: '🚀',
  },
  {
    step: '03',
    title: 'Öğren & Üret',
    desc: 'AI Mentor ile öğren, kod üret, görsel ve ses içerikler yarat.',
    icon: '🎓',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 relative" id="how-it-works">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-accent-green uppercase tracking-widest">Nasıl Çalışır?</span>
          <h2 className="text-4xl font-black text-white mt-3 mb-4">3 Adımda Başla</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Dakikalar içinde AI destekli öğrenme platformuna kavuş.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connection lines */}
          <div className="hidden md:block absolute top-16 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-accent-blue/40 to-accent-green/40" />
          <div className="hidden md:block absolute top-16 left-2/3 w-1/6 h-0.5 bg-gradient-to-r from-accent-green/40 to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="relative inline-block mb-6">
                <div className="w-16 h-16 rounded-2xl bg-bg-deep border border-white/10 flex items-center justify-center text-2xl mx-auto">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent-blue text-white text-xs font-black flex items-center justify-center">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
