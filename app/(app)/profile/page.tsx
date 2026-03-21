'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createSupabaseClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const { profile, quota, setProfile } = useStore();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const supabase = createSupabaseClient();
      const { data } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', profile.id)
        .select()
        .single();
      if (data) setProfile(data);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const planBadge = {
    starter: { label: 'Starter', variant: 'gray' as const },
    pro: { label: 'Pro', variant: 'blue' as const },
    ultra: { label: 'Ultra', variant: 'gold' as const },
  };
  const planInfo = planBadge[quota?.plan_id as keyof typeof planBadge] || planBadge.starter;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-black text-white">Profilim</h1>
        <p className="text-slate-500 text-sm">Hesap bilgilerini yönet</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card glow="blue" className="p-6 mb-5">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="relative">
              <img
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile?.id}`}
                alt="Avatar"
                className="w-20 h-20 rounded-2xl border-2 border-accent-blue/30"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent-green rounded-full border-2 border-bg-void flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <Input
                    label="Ad Soyad"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" loading={saving} onClick={handleSave}>Kaydet</Button>
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setFullName(profile?.full_name || ''); }}>
                      İptal
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white">{profile?.full_name || 'Kullanıcı'}</h2>
                    <Badge variant={planInfo.variant}>{planInfo.label}</Badge>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{profile?.email}</p>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs text-accent-blue hover:underline"
                  >
                    Düzenle
                  </button>
                </>
              )}
            </div>
          </div>

          {success && (
            <div className="mt-4 bg-accent-green/10 border border-accent-green/20 rounded-lg px-3 py-2 text-accent-green text-sm">
              ✓ Profil güncellendi
            </div>
          )}
        </Card>
      </motion.div>

      {/* Plan & Credits */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6 mb-5">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Plan & Krediler</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Mevcut Plan</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white capitalize">{quota?.plan_id || 'starter'}</span>
                {quota?.is_active && <span className="text-xs text-accent-green">● Aktif</span>}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Kalan Kredi</p>
              <span className="text-2xl font-black text-white">{quota?.credits_remaining?.toFixed(1) || '0'}</span>
            </div>
          </div>

          {/* Credit bar */}
          <div className="mt-4">
            <div className="h-2 bg-bg-deep rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-blue to-accent-green rounded-full transition-all"
                style={{
                  width: `${Math.min(100, ((quota?.credits_remaining || 0) / (
                    quota?.plan_id === 'ultra' ? 5000 :
                    quota?.plan_id === 'pro' ? 1000 : 100
                  )) * 100)}%`
                }}
              />
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {quota?.credits_remaining?.toFixed(1)} / {
                quota?.plan_id === 'ultra' ? '5.000' :
                quota?.plan_id === 'pro' ? '1.000' : '100'
              } kredi kaldı
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Account Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Hesap Bilgileri</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-slate-500">E-posta</span>
              <span className="text-sm text-slate-300">{profile?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-slate-500">Kayıt Tarihi</span>
              <span className="text-sm text-slate-300">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('tr-TR') : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-500">Kullanıcı ID</span>
              <span className="text-xs text-slate-600 font-mono">{profile?.id?.slice(0, 16)}...</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
