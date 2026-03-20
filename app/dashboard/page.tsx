'use client';

import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const user = useUserStore((s) => s.user);
  const [credits, setCredits] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    // Kredi bilgisini çek
    fetch('/api/user/quota')
      .then((r) => r.json())
      .then((d) => { if (d.credits_remaining) setCredits(d.credits_remaining); })
      .catch(() => {});

    // Streak bilgisini çek
    fetch('/api/user/streak')
      .then((r) => r.json())
      .then((d) => { if (d.current_streak) setStreak(d.current_streak); })
      .catch(() => {});
  }, [user?.id]);

  const planLabel: Record<string, string> = {
    starter: 'Starter',
    pro: 'Pro',
    ultra: 'Ultra',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0EDE6]">
            Hoş geldin, {user?.username ?? 'Pioneer'} 👋
          </h1>
          <p className="text-[#8A8680]">Learn. Build. Earn.</p>
        </div>
        {user?.plan_id && (
          <span className="inline-flex items-center rounded-full border border-[rgba(240,165,0,0.35)] px-3 py-1 text-xs text-[#F0A500] font-semibold">
            {planLabel[user.plan_id] ?? user.plan_id}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Streak', value: `${streak} gün`, icon: '🔥' },
          { label: 'Krediler', value: credits.toString(), icon: '⚡' },
          { label: 'Plan', value: planLabel[user?.plan_id ?? ''] ?? 'Yok', icon: '🟣' },
          { label: 'Kurslar', value: '5', icon: '📚' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-4"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-xs text-[#8A8680]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: '/dashboard/learn', icon: '📚', title: 'Öğren', desc: 'Kurs ve programlara göz at' },
          { href: '/dashboard/build', icon: '🤖', title: 'Üret', desc: 'AI ile uygulama oluştur' },
          { href: '/dashboard/earn', icon: '💰', title: 'Kazan', desc: 'Pi kazan ve harca' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-5 hover:bg-[#16161E] hover:border-[rgba(240,165,0,0.35)] transition-all"
          >
            <div className="text-3xl mb-2">{action.icon}</div>
            <div className="font-semibold mb-1">{action.title}</div>
            <div className="text-sm text-[#8A8680]">{action.desc}</div>
          </Link>
        ))}
      </div>

      {/* Plan yoksa uyarı */}
      {!user?.plan_id && (
        <div className="rounded-xl border border-[rgba(240,165,0,0.35)] bg-[rgba(240,165,0,0.05)] p-5 flex items-center justify-between">
          <div>
            <div className="font-semibold text-[#F0A500]">Plan seçmedin</div>
            <div className="text-sm text-[#8A8680]">Tüm özelliklere erişmek için bir plan seç</div>
          </div>
          <Link
            href="/plans"
            className="rounded-xl bg-[#F0A500] px-4 py-2 text-sm font-bold text-[#060608]"
          >
            Plan Seç
          </Link>
        </div>
      )}
    </div>
  );
}
