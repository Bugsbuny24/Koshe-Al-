'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { createSupabaseClient } from '@/lib/supabase/client';

const quickActions = [
  {
    href: '/mentor',
    icon: '🧠',
    title: 'AI Mentor',
    desc: 'Soru sor, öğren',
    color: 'blue' as const,
    cost: '0.5 kredi',
  },
  {
    href: '/builder',
    icon: '⚡',
    title: 'Kod Üretici',
    desc: 'Kod yaz, çalıştır',
    color: 'green' as const,
    cost: '5 kredi',
  },
  {
    href: '/create',
    icon: '✨',
    title: 'Oluştur',
    desc: 'Görsel, ses, video',
    color: 'gold' as const,
    cost: '10+ kredi',
  },
  {
    href: '/plans',
    icon: '🚀',
    title: 'Planları Gör',
    desc: "Pro'ya geç",
    color: 'gold' as const,
    cost: '',
  },
];

const planInfo: Record<string, { label: string; color: 'blue' | 'green' | 'gold' }> = {
  starter: { label: 'Starter', color: 'blue' },
  growth: { label: 'Growth', color: 'green' },
  pro: { label: 'Pro', color: 'blue' },
  prestige: { label: 'Prestige', color: 'gold' },
  ultra: { label: 'Ultra', color: 'gold' },
};

export default function DashboardPage() {
  const { profile, quota } = useStore();
  const plan = planInfo[quota?.plan_id || 'starter'];

  const credits = quota?.credits_remaining ?? 0;
  const planMax = quota?.plan_id === 'prestige' || quota?.plan_id === 'ultra' ? 5000 : quota?.plan_id === 'pro' ? 1000 : quota?.plan_id === 'growth' ? 500 : 100;
  const creditPercent = Math.min(100, (credits / planMax) * 100);

  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    // Fetch announcement
    fetch('/api/admin/announcement')
      .then((r) => r.json())
      .then((d) => setAnnouncement(d.announcement))
      .catch(() => {});

    // Check onboarding and streak
    const checkUserData = async () => {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      if (profileData && !profileData.onboarding_completed) {
        setShowWelcome(true);
      }

      // Load streak
      const { data: streakData } = await supabase
        .from('user_streaks')
        .select('streak_days')
        .eq('user_id', user.id)
        .single();

      if (streakData) setStreakDays(streakData.streak_days || 0);

      // Update streak on dashboard visit
      try { await supabase.rpc('update_user_streak' as never, { uid: user.id } as never); } catch { /* ignore */ }
    };
    checkUserData();
  }, []);

  const handleDismissWelcome = async () => {
    setShowWelcome(false);
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({ onboarding_completed: true }).eq('id', user.id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70"
              onClick={handleDismissWelcome}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-bg-deep border border-white/10 rounded-2xl p-8 max-w-md w-full z-10 text-center"
            >
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-black text-white mb-2">Hoş Geldin!</h2>
              <p className="text-slate-400 mb-6">
                Koschei&apos;e katıldığın için teşekkürler. AI Mentor, Kod Üretici ve daha fazlası seni bekliyor!
              </p>
              <button
                onClick={handleDismissWelcome}
                className="w-full bg-accent-blue hover:bg-accent-blue/80 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Başlayalım! 🚀
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Announcement Banner */}
      {announcement && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-accent-blue/10 border border-accent-blue/20 rounded-xl px-4 py-3 flex items-center justify-between gap-4"
        >
          <p className="text-sm text-slate-200">📢 {announcement}</p>
          <button onClick={() => setAnnouncement(null)} className="text-slate-500 hover:text-white text-xs shrink-0">✕</button>
        </motion.div>
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white">
          Merhaba, {profile?.full_name?.split(' ')[0] || 'Öğrenci'} 👋
        </h1>
        <p className="text-slate-400 mt-1">Bugün ne öğrenmek istiyorsun?</p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Credits Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card glow="blue" className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Krediler</p>
                <p className="text-3xl font-black text-white">{Math.floor(credits)}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-accent-blue/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="h-1.5 bg-bg-deep rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-blue to-accent-green rounded-full"
                style={{ width: `${creditPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">{credits.toFixed(1)} / {planMax} kredi</p>
          </Card>
        </motion.div>

        {/* Plan Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card glow="green" className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Plan</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-black text-white">{plan?.label}</p>
                  <Badge variant={plan?.color}>{quota?.is_active ? 'Aktif' : 'Pasif'}</Badge>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-accent-green/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
            <Link href="/plans" className="text-xs text-accent-blue hover:underline">
              Planı yükselt →
            </Link>
          </Card>
        </motion.div>

        {/* Streak Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card glow="gold" className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Seri</p>
                <p className="text-2xl font-black text-white">{streakDays} gün</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-pi-gold/15 flex items-center justify-center text-xl">
                🔥
              </div>
            </div>
            <p className="text-xs text-slate-500">Üst üste aktif gün sayısı</p>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-lg font-bold text-white mb-4">Hızlı Başlat</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <motion.div key={action.href + i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
              <Link href={action.href}>
                <Card hover glow={action.color} className="p-5 group">
                  <div className="text-3xl mb-3">{action.icon}</div>
                  <h3 className="font-bold text-white group-hover:text-accent-blue transition-colors">{action.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{action.desc}</p>
                  {action.cost && (
                    <div className="mt-3 text-xs text-slate-600">{action.cost}</div>
                  )}
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features available */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-8">
        <h2 className="text-lg font-bold text-white mb-4">Planındaki Özellikler</h2>
        <Card className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: 'mentor_lite', label: 'Mentor Lite', cost: '0.5' },
              { key: 'mentor_flash', label: 'Mentor Flash', cost: '1.0' },
              { key: 'tts', label: 'Metin → Ses', cost: '0.5' },
              { key: 'builder', label: 'Kod Üretici', cost: '5.0' },
              { key: 'image_gen', label: 'Görsel Üretici', cost: '10.0' },
              { key: 'video_15s', label: 'Video Üretici', cost: '50.0' },
            ].map((f) => {
              const planFeatures: Record<string, string[]> = {
                starter: ['mentor_lite', 'mentor_flash', 'tts'],
                growth: ['mentor_lite', 'mentor_flash', 'tts', 'builder'],
                pro: ['mentor_lite', 'mentor_flash', 'tts', 'builder', 'image_gen', 'live_audio'],
                prestige: ['mentor_lite', 'mentor_flash', 'tts', 'builder', 'image_gen', 'live_audio', 'video_15s'],
                ultra: ['mentor_lite', 'mentor_flash', 'tts', 'builder', 'image_gen', 'live_audio', 'video_15s'],
              };
              const available = planFeatures[quota?.plan_id || 'starter']?.includes(f.key);
              return (
                <div key={f.key} className={`flex items-center gap-2.5 p-3 rounded-lg ${available ? 'bg-accent-green/5 border border-accent-green/15' : 'bg-white/3 border border-white/5 opacity-50'}`}>
                  <div className={`w-2 h-2 rounded-full ${available ? 'bg-accent-green' : 'bg-slate-600'}`} />
                  <div>
                    <p className={`text-xs font-medium ${available ? 'text-white' : 'text-slate-500'}`}>{f.label}</p>
                    <p className="text-xs text-slate-600">{f.cost} kredi</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
