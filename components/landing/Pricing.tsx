'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Ücretsiz',
    period: '',
    desc: 'AI operator\'ı keşfetmek için',
    credits: '100 kredi/ay',
    color: 'slate',
    features: [
      'AI Intake Chat',
      'AI Mentor (Lite & Flash)',
      'Templates erişimi',
      '100 aylık kredi',
      'Temel özellikler',
    ],
    cta: 'Ücretsiz Başla',
    href: '/register',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₺299',
    period: '/ay',
    desc: 'Aktif iş üretenler için',
    credits: '1.000 kredi/ay',
    color: 'blue',
    features: [
      'Tüm Starter özellikleri',
      'Execution Core (planlama motoru)',
      'Builder — Kod Üretici',
      'Workspace / Jobs yönetimi',
      '1.000 aylık kredi',
      'Öncelikli destek',
    ],
    cta: "Pro'ya Geç",
    href: '/register?plan=pro',
    highlight: true,
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: '₺799',
    period: '/ay',
    desc: 'Tam kapasite AI operator',
    credits: '5.000 kredi/ay',
    color: 'gold',
    features: [
      'Tüm Pro özellikleri',
      'Gelişmiş üretim pipeline\'ları',
      '5.000 aylık kredi',
      'API erişimi',
      '7/24 öncelikli destek',
      'Özel onboarding ve danışmanlık',
    ],
    cta: "Ultra'ya Geç",
    href: '/register?plan=ultra',
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-28 relative">
      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] bg-accent-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent-blue text-sm font-semibold tracking-widest uppercase mb-3 block">
            Fiyatlandırma
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Sana uygun plan
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Ücretsiz başla, büyüdükçe yükselt. İptal etmek her zaman kolay.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-7 transition-all duration-300 ${
                plan.highlight
                  ? 'bg-gradient-to-b from-accent-blue/20 to-bg-card border-2 border-accent-blue/40 shadow-2xl shadow-accent-blue/20 scale-105'
                  : 'bg-bg-card border border-white/8 hover:border-white/15'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-accent-blue text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    En Popüler
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-black text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{plan.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  {plan.period && <span className="text-slate-400 text-sm">{plan.period}</span>}
                </div>
                <div className="mt-2 text-xs text-slate-500">{plan.credits}</div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-accent-green mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full text-center font-bold py-3.5 rounded-xl transition-all duration-200 ${
                  plan.highlight
                    ? 'bg-accent-blue hover:bg-blue-500 text-white shadow-lg shadow-accent-blue/30'
                    : 'bg-white/8 hover:bg-white/12 text-white border border-white/10'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
