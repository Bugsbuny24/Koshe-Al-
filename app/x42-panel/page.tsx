'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createSupabaseClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = 'koshei_admin_2024';

const PLAN_CREDITS: Record<string, number> = {
  starter: 100,
  growth: 300,
  pro: 1000,
  prestige: 3000,
};

const PLAN_DURATION_DAYS = 30;

interface UserRow {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  quota: {
    plan_id: string;
    credits_remaining: number;
    is_active: boolean;
    plan_expires_at: string | null;
  } | null;
}

interface Stats {
  totalUsers: number;
  activePlans: number;
  totalCredits: number;
}

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, activePlans: 0, totalCredits: 0 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const [selectedPlans, setSelectedPlans] = useState<Record<string, string>>({});

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const supabase = createSupabaseClient();
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at')
        .order('created_at', { ascending: false });

      if (!profiles) return;

      const { data: quotas } = await supabase
        .from('user_quotas')
        .select('user_id, plan_id, credits_remaining, is_active, plan_expires_at');

      const quotaMap: Record<string, UserRow['quota']> = {};
      (quotas || []).forEach((q) => {
        quotaMap[q.user_id] = {
          plan_id: q.plan_id,
          credits_remaining: q.credits_remaining,
          is_active: q.is_active,
          plan_expires_at: q.plan_expires_at,
        };
      });

      const rows: UserRow[] = profiles.map((p) => ({
        id: p.id,
        email: p.email,
        full_name: p.full_name,
        created_at: p.created_at,
        quota: quotaMap[p.id] || null,
      }));

      setUsers(rows);

      const activePlans = rows.filter((r) => r.quota?.is_active).length;
      const totalCredits = rows.reduce((sum, r) => sum + (r.quota?.credits_remaining || 0), 0);
      setStats({ totalUsers: rows.length, activePlans, totalCredits: Math.round(totalCredits) });

      const initPlans: Record<string, string> = {};
      rows.forEach((r) => { initPlans[r.id] = r.quota?.plan_id || 'starter'; });
      setSelectedPlans((prev) => ({ ...initPlans, ...prev }));
    } catch (err) {
      console.error('fetchUsers error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const activatePlan = async (userId: string) => {
    const plan = selectedPlans[userId] || 'starter';
    const credits = PLAN_CREDITS[plan] ?? 100;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + PLAN_DURATION_DAYS * 24 * 60 * 60 * 1000);
    const supabase = createSupabaseClient();

    const { error } = await supabase.from('user_quotas').upsert(
      {
        user_id: userId,
        plan_id: plan,
        credits_remaining: credits,
        credits_total: credits,
        is_active: true,
        plan_started_at: now.toISOString(),
        plan_expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString(),
      },
      { onConflict: 'user_id' }
    );

    if (!error) {
      setSaveMsg(`Plan aktifleştirildi: ${plan}`);
      setTimeout(() => setSaveMsg(''), 3000);
      fetchUsers();
    }
  };

  const addCredits = async (userId: string, amount: number) => {
    const user = users.find((u) => u.id === userId);
    const current = user?.quota?.credits_remaining || 0;
    const supabase = createSupabaseClient();

    const { error } = await supabase
      .from('user_quotas')
      .update({ credits_remaining: current + amount, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (!error) {
      setSaveMsg(`+${amount} kredi eklendi`);
      setTimeout(() => setSaveMsg(''), 3000);
      fetchUsers();
    }
  };

  useEffect(() => {
    if (authenticated) fetchUsers();
  }, [authenticated, fetchUsers]);

  const handleLogin = () => {
    setPasswordError('');
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      setPasswordError('Geçersiz şifre');
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.full_name || '').toLowerCase().includes(q)
    );
  });

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center p-4">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-64 bg-red-500/5 rounded-full blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-black text-white">Admin Paneli</h1>
            <p className="text-slate-500 text-sm mt-1">Yetkili erişim gereklidir</p>
          </div>

          <div className="bg-[#111116] border border-white/8 rounded-2xl p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-400 mb-2">Admin Şifresi</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••••••"
                className="w-full bg-[#0C0C10] border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-red-500/40 text-sm transition-all"
              />
              {passwordError && <p className="text-red-400 text-xs mt-2">{passwordError}</p>}
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-lg transition-colors text-sm"
            >
              Giriş Yap
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060608] text-white p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Admin Paneli</h1>
          <p className="text-slate-500 text-sm">x42-panel · Kullanıcı Yönetimi</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchUsers()}
            className="text-xs text-slate-500 hover:text-white bg-white/5 px-3 py-1.5 rounded-lg transition-colors"
          >
            Yenile
          </button>
          <button
            onClick={() => { setAuthenticated(false); setPassword(''); }}
            className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            Çıkış
          </button>
        </div>
      </div>

      <AnimatePresence>
        {saveMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 text-green-400 text-sm"
          >
            ✓ {saveMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Toplam Kullanıcı', value: stats.totalUsers, icon: '👥' },
          { label: 'Aktif Plan', value: stats.activePlans, icon: '✅' },
          { label: 'Toplam Kredi', value: stats.totalCredits.toLocaleString(), icon: '💎' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#111116] border border-white/8 rounded-xl p-5">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-black text-white">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="İsim veya e-posta ile ara..."
          className="w-full max-w-sm bg-[#111116] border border-white/8 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-white/20 text-sm transition-all"
        />
      </div>

      {/* Users Table */}
      <div className="bg-[#111116] border border-white/8 rounded-xl overflow-x-auto">
        {loading ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm p-6">
            <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
            Yükleniyor...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Kullanıcı</th>
                <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Mevcut Plan</th>
                <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Kalan Kredi</th>
                <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Plan Aktifleştir</th>
                <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Kredi Ekle</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-white/3 hover:bg-white/2">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{u.full_name || '—'}</div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      u.quota?.plan_id === 'prestige' ? 'bg-yellow-500/20 text-yellow-400' :
                      u.quota?.plan_id === 'pro' ? 'bg-blue-500/20 text-blue-400' :
                      u.quota?.plan_id === 'growth' ? 'bg-green-500/20 text-green-400' :
                      'bg-white/10 text-slate-400'
                    }`}>
                      {(u.quota?.plan_id || 'starter').toUpperCase()}
                    </span>
                    {u.quota?.is_active && (
                      <span className="ml-1 text-xs text-green-500">●</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {(u.quota?.credits_remaining ?? 0).toFixed(0)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedPlans[u.id] || 'starter'}
                        onChange={(e) => setSelectedPlans((prev) => ({ ...prev, [u.id]: e.target.value }))}
                        className="bg-[#0C0C10] border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none"
                      >
                        <option value="starter">Starter (100)</option>
                        <option value="growth">Growth (300)</option>
                        <option value="pro">Pro (1000)</option>
                        <option value="prestige">Prestige (3000)</option>
                      </select>
                      <button
                        onClick={() => activatePlan(u.id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Aktifleştir
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {[50, 100, 300].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => addCredits(u.id, amt)}
                          className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold px-2 py-1.5 rounded-lg transition-colors"
                        >
                          +{amt}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-slate-600 py-8 text-sm">
                    {search ? 'Sonuç bulunamadı' : 'Henüz kullanıcı yok'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
