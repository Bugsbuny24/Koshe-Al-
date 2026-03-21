'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Badge } from '@/components/ui/Badge';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 100,
    creditsLabel: '100 Kredi',
    shopierUrl: 'https://www.shopier.com/TradeVisual/45362316',
    highlight: false,
    badge: null,
    color: 'gray' as const,
    accentClass: 'border-white/8',
    btnClass: 'bg-white/8 hover:bg-white/12 text-white border border-white/10',
    features: [
      'AI Mentor Lite erişimi',
      'AI Mentor Flash erişimi',
      'Metin → Ses dönüşümü',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    credits: 300,
    creditsLabel: '300 Kredi',
    shopierUrl: 'https://www.shopier.com/TradeVisual/45362403',
    highlight: false,
    badge: null,
    color: 'green' as const,
    accentClass: 'border-accent-green/30',
    btnClass: 'bg-accent-green hover:bg-green-400 text-white shadow-lg shadow-accent-green/20',
    features: [
      'AI Mentor Lite erişimi',
      'AI Mentor Flash erişimi',
      'Metin → Ses dönüşümü',
      'Kod Üretici erişimi',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 1000,
    creditsLabel: '1.000 Kredi',
    shopierUrl: 'https://www.shopier.com/TradeVisual/45362552',
    highlight: true,
    badge: 'En Popüler',
    color: 'blue' as const,
    accentClass: 'border-accent-blue/40',
    btnClass: 'bg-accent-blue hover:bg-blue-500 text-white shadow-lg shadow-accent-blue/25',
    features: [
      'AI Mentor Lite erişimi',
      'AI Mentor Flash erişimi',
      'Metin → Ses dönüşümü',
      'Kod Üretici erişimi',
      'Görsel Üretici erişimi',
      'Canlı Ses AI erişimi',
    ],
  },
  {
    id: 'prestige',
    name: 'Prestige',
    credits: 3000,
    creditsLabel: '3.000 Kredi',
    shopierUrl: 'https://www.shopier.com/TradeVisual/45362662',
    highlight: false,
    badge: 'Tam Güç',
    color: 'gold' as const,
    accentClass: 'border-pi-gold/30',
    btnClass: 'bg-pi-gold hover:bg-yellow-400 text-black font-black shadow-lg shadow-pi-gold/20',
    features: [
      'AI Mentor Lite erişimi',
      'AI Mentor Flash erişimi',
      'Metin → Ses dönüşümü',
      'Kod Üretici erişimi',
      'Görsel Üretici erişimi',
      'Canlı Ses AI erişimi',
      'Video Üretici erişimi',
    ],
  },
];

export default function PlansPage() {
  const { quota, profile } = useStore();
  const currentPlan = quota?.plan_id || 'starter';

  const buildShopierUrl = (baseUrl: string) => {
    if (!profile) return baseUrl;
    const params = new URLSearchParams({
      user_id: profile.id,
      email: profile.email,
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <h1 className="text-3xl font-black text-white mb-2">Kredi Paketi Seç</h1>
        <p className="text-slate-400">İhtiyacına göre kredi paketi satın al, daha fazla AI gücü kullan.</p>
        {currentPlan && (
          <div className="mt-3 inline-flex items-center gap-2">
            <span className="text-sm text-slate-500">Mevcut planın:</span>
            <Badge variant={currentPlan === 'prestige' ? 'gold' : currentPlan === 'pro' ? 'blue' : currentPlan === 'growth' ? 'green' : 'gray'}>
              {currentPlan.toUpperCase()}
            </Badge>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                  ? `bg-gradient-to-b from-accent-blue/15 to-bg-card border-2 ${plan.accentClass} shadow-2xl shadow-accent-blue/15 scale-[1.02]`
                  : `bg-bg-card border ${plan.accentClass}`
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-white">{plan.name}</h3>
                  <p className="text-sm font-bold mt-1" style={{
                    color: plan.color === 'gold' ? '#F0A500' :
                           plan.color === 'blue' ? '#3D7BFF' :
                           plan.color === 'green' ? '#00D16C' : '#94a3b8'
                  }}>
                    {plan.creditsLabel}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {plan.badge && (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      plan.color === 'gold' ? 'bg-pi-gold/20 text-pi-gold' :
                      plan.color === 'blue' ? 'bg-accent-blue/20 text-accent-blue' :
                      'bg-white/10 text-slate-400'
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

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                    <svg className="w-3.5 h-3.5 text-accent-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={buildShopierUrl(plan.shopierUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full text-center font-bold py-3 rounded-xl transition-all text-sm ${plan.btnClass}`}
              >
                Satın Al
              </a>
            </motion.div>
          );
        })}
      </div>

      {/* Footer note */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 text-center">
        <p className="text-slate-500 text-sm">
          Ödeme Shopier üzerinden güvenli şekilde gerçekleştirilir.{' '}
          <a href="mailto:support@koshei.ai" className="text-accent-blue hover:underline">
            Sorularınız için bize yazın
          </a>
        </p>
      </motion.div>
    </div>
  );
}
