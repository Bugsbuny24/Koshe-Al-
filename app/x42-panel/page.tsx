'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserData {
  id: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  created_at: string;
  quota: {
    plan_id: string;
    credits_remaining: number;
    is_active: boolean;
  } | null;
}

interface Stats {
  totalUsers: number;
  totalAPICalls: number;
  totalCredits: number;
  recentUsage: Array<{
    id: string;
    user_id: string;
    model: string;
    feature: string;
    input_tokens: number;
    output_tokens: number;
    created_at: string;
  }>;
}

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'usage'>('dashboard');
  const [editUser, setEditUser] = useState<{ id: string; plan: string; credits: number } | null>(null);
  const [saveMsg, setSaveMsg] = useState('');

  const fetchData = useCallback(async (key: string) => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { 'x-admin-key': key } }),
        fetch('/api/admin/users', { headers: { 'x-admin-key': key } }),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) {
        const { users: u } = await usersRes.json();
        setUsers(u || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = async () => {
    setPasswordError('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setAuthenticated(true);
        setAdminKey(data.token);
      } else {
        setPasswordError(data.error || 'Geçersiz şifre');
      }
    } catch {
      setPasswordError('Bağlantı hatası');
    }
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({
        userId: editUser.id,
        plan_id: editUser.plan,
        credits_remaining: editUser.credits,
      }),
    });
    if (res.ok) {
      setSaveMsg('Kaydedildi!');
      setEditUser(null);
      fetchData(adminKey);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  useEffect(() => {
    if (authenticated && adminKey) {
      fetchData(adminKey);
    }
  }, [authenticated, adminKey, fetchData]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#060608] flex items-center justify-center p-4">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-64 bg-red-500/5 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
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
              {passwordError && (
                <p className="text-red-400 text-xs mt-2">{passwordError}</p>
              )}
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
    <div className="min-h-screen bg-[#060608] text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-56 bg-[#0C0C10] border-r border-white/5 flex flex-col">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <span className="text-red-400 text-xs font-bold">A</span>
            </div>
            <span className="font-bold text-sm">Admin Panel</span>
          </div>
          <p className="text-xs text-slate-600 mt-1">x42-panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {(['dashboard', 'users', 'usage'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                activeTab === tab
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab === 'dashboard' ? '📊 Dashboard' : tab === 'users' ? '👥 Kullanıcılar' : '📝 Kullanım Logları'}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <button
            onClick={() => { setAuthenticated(false); setPassword(''); setAdminKey(''); }}
            className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-600 hover:text-red-400 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 p-8">
        {loading && (
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
            <div className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
            Yükleniyor...
          </div>
        )}

        {saveMsg && (
          <div className="mb-4 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 text-green-400 text-sm">
            ✓ {saveMsg}
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-2xl font-black mb-6">Dashboard</h1>
            <div className="grid grid-cols-3 gap-5 mb-8">
              {[
                { label: 'Toplam Kullanıcı', value: stats.totalUsers, icon: '👥' },
                { label: 'Toplam API Çağrısı', value: stats.totalAPICalls, icon: '⚡' },
                { label: 'Dağıtılan Kredi', value: stats.totalCredits, icon: '💎' },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#111116] border border-white/8 rounded-xl p-5">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-black text-white">{stat.value.toLocaleString()}</div>
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-bold mb-4">Son Kullanımlar</h2>
            <div className="bg-[#111116] border border-white/8 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Feature</th>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Model</th>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Tokens</th>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsage.slice(0, 10).map((usage) => (
                    <tr key={usage.id} className="border-b border-white/3 hover:bg-white/3">
                      <td className="px-4 py-2.5 text-slate-300">{usage.feature}</td>
                      <td className="px-4 py-2.5 text-slate-500 font-mono text-xs">{usage.model?.slice(0, 20)}</td>
                      <td className="px-4 py-2.5 text-slate-400">{(usage.input_tokens || 0) + (usage.output_tokens || 0)}</td>
                      <td className="px-4 py-2.5 text-slate-500 text-xs">{new Date(usage.created_at).toLocaleString('tr-TR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black">Kullanıcılar ({users.length})</h1>
              <button
                onClick={() => fetchData(adminKey)}
                className="text-xs text-slate-500 hover:text-white bg-white/5 px-3 py-1.5 rounded-lg transition-colors"
              >
                Yenile
              </button>
            </div>

            <div className="bg-[#111116] border border-white/8 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Kullanıcı</th>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Plan</th>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Kredi</th>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Kayıt</th>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-white/3 hover:bg-white/3">
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{u.full_name || '-'}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          u.quota?.plan_id === 'ultra' ? 'bg-yellow-500/20 text-yellow-400' :
                          u.quota?.plan_id === 'pro' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-white/10 text-slate-400'
                        }`}>
                          {u.quota?.plan_id?.toUpperCase() || 'STARTER'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{u.quota?.credits_remaining?.toFixed(1) || '0'}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{new Date(u.created_at).toLocaleDateString('tr-TR')}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setEditUser({ id: u.id, plan: u.quota?.plan_id || 'starter', credits: u.quota?.credits_remaining || 0 })}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Düzenle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && stats && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-2xl font-black mb-6">Kullanım Logları</h1>
            <div className="bg-[#111116] border border-white/8 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Kullanıcı ID</th>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Feature</th>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Model</th>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Input Tokens</th>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Output Tokens</th>
                    <th className="text-left px-4 py-3 text-xs text-slate-500 font-semibold">Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsage.map((usage) => (
                    <tr key={usage.id} className="border-b border-white/3 hover:bg-white/3">
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{usage.user_id?.slice(0, 12)}...</td>
                      <td className="px-4 py-2.5 text-slate-300">{usage.feature}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{usage.model?.slice(0, 25)}</td>
                      <td className="px-4 py-2.5 text-slate-400">{usage.input_tokens || 0}</td>
                      <td className="px-4 py-2.5 text-slate-400">{usage.output_tokens || 0}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-500">{new Date(usage.created_at).toLocaleString('tr-TR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {editUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70"
              onClick={() => setEditUser(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#111116] border border-white/10 rounded-2xl p-6 w-full max-w-sm z-10"
            >
              <h3 className="font-bold text-white mb-4">Kullanıcı Düzenle</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Plan</label>
                  <select
                    value={editUser.plan}
                    onChange={(e) => setEditUser({ ...editUser, plan: e.target.value })}
                    className="w-full bg-[#0C0C10] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                  >
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="ultra">Ultra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Kredi</label>
                  <input
                    type="number"
                    value={editUser.credits}
                    onChange={(e) => setEditUser({ ...editUser, credits: Number(e.target.value) })}
                    className="w-full bg-[#0C0C10] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdateUser}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-sm transition-colors"
                >
                  Kaydet
                </button>
                <button
                  onClick={() => setEditUser(null)}
                  className="flex-1 bg-white/5 hover:bg-white/8 text-slate-300 font-bold py-2 rounded-lg text-sm transition-colors"
                >
                  İptal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
