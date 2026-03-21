'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Badge } from '@/components/ui/Badge';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Ücretsiz',
    period: '',
    credits: '100 kredi/ay',
    features: [
      { label: 'AI Mentor Lite', available: true, cost: '0.5 kredi' },
      { label: 'AI Mentor Flash', available: true, cost: '1.0 kredi' },
      { label: 'Metin → Ses', available: true, cost: '0.5 kredi' },
      { label: 'Kod Üretici', available: false, cost: '5.0 kredi' },
      { label: 'Görsel Üretici', available: false, cost: '10.0 kredi' },
      { label: 'Canlı Ses AI', available: false, cost: '2.0 kredi' },
      { label: 'Video Üretici', available: false, cost: '50.0 kredi' },
    ],
    highlight: false,
    badge: null,
    cta: 'Mevcut Plan',
    ctaDisabled: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₺299',
    period: '/ay',
    credits: '1.000 kredi/ay',
    features: [
      { label: 'AI Mentor Lite', available: true, cost: '0.5 kredi' },
      { label: 'AI Mentor Flash', available: true, cost: '1.0 kredi' },
      { label: 'Metin → Ses', available: true, cost: '0.5 kredi' },
      { label: 'Kod Üretici', available: true, cost: '5.0 kredi' },
      { label: 'Görsel Üretici', available: true, cost: '10.0 kredi' },
      { label: 'Canlı Ses AI', available: true, cost: '2.0 kredi' },
      { label: 'Video Üretici', available: false, cost: '50.0 kredi' },
    ],
    highlight: true,
    badge: 'En Popüler',
    cta: "Pro'ya Geç",
    ctaDisabled: false,
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: '₺799',
    period: '/ay',
    credits: '5.000 kredi/ay',
    features: [
      { label: 'AI Mentor Lite', available: true, cost: '0.5 kredi' },
      { label: 'AI Mentor Flash', available: true, cost: '1.0 kredi' },
      { label: 'Metin → Ses', available: true, cost: '0.5 kredi' },
      { label: 'Kod Üretici', available: true, cost: '5.0 kredi' },
      { label: 'Görsel Üretici', available: true, cost: '10.0 kredi' },
      { label: 'Canlı Ses AI', available: true, cost: '2.0 kredi' },
      { label: 'Video Üretici', available: true, cost: '50.0 kredi' },
    ],
    highlight: false,
    badge: 'Tam Güç',
    cta: "Ultra'ya Geç",
    ctaDisabled: false,
  },
];

export default function PlansPage() {
  const { quota } = useStore();
  const currentPlan = quota?.plan_id || 'starter';

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <h1 className="text-3xl font-black text-white mb-2">Planını Seç</h1>
        <p className="text-slate-400">İhtiyacına göre planını yükselt, daha fazla AI gücü kullan.</p>
        {currentPlan && (
          <div className="mt-3 inline-flex items-center gap-2">
            <span className="text-sm text-slate-500">Mevcut planın:</span>
            <Badge variant={currentPlan === 'ultra' ? 'gold' : currentPlan === 'pro' ? 'blue' : 'gray'}>
              {currentPlan.toUpperCase()}
            </Badge>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-6 transition-all duration-300 ${
                plan.highlight
                  ? 'bg-gradient-to-b from-accent-blue/15 to-bg-card border-2 border-accent-blue/40 shadow-2xl shadow-accent-blue/15 scale-[1.02]'
                  : 'bg-bg-card border border-white/8'
              }`}
            >
              {/* Badges */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-xl font-black text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{plan.credits}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {plan.badge && (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      plan.id === 'pro' ? 'bg-accent-blue text-white' : 'bg-pi-gold/20 text-pi-gold'
                    }`}>
                      {plan.badge}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-green/15 text-accent-green">
                      Aktif
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black text-white">{plan.price}</span>
                {plan.period && <span className="text-slate-400 text-sm">{plan.period}</span>}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-7">
                {plan.features.map((f) => (
                  <li key={f.label} className={`flex items-center justify-between text-xs ${f.available ? 'text-slate-300' : 'text-slate-600'}`}>
                    <div className="flex items-center gap-2">
                      {f.available ? (
                        <svg className="w-3.5 h-3.5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      {f.label}
                    </div>
                    <span className="text-slate-600">{f.cost}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="block w-full text-center font-bold py-3 rounded-xl bg-white/5 text-slate-500 text-sm border border-white/5">
                  Mevcut Plan
                </div>
              ) : (
                <Link
                  href={`/register?plan=${plan.id}`}
                  className={`block w-full text-center font-bold py-3 rounded-xl transition-all text-sm ${
                    plan.highlight
                      ? 'bg-accent-blue hover:bg-blue-500 text-white shadow-lg shadow-accent-blue/25'
                      : 'bg-white/8 hover:bg-white/12 text-white border border-white/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* FAQ */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12 text-center">
        <p className="text-slate-500 text-sm">
          Sorularınız mı var?{' '}
          <a href="mailto:support@koshei.ai" className="text-accent-blue hover:underline">
            Bize yazın
          </a>
        </p>
      </motion.div>
    </div>
  );
}
