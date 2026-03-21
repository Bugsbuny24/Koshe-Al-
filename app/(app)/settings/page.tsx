'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useStore } from '@/store/useStore';
import { createSupabaseClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { profile, clearMessages } = useStore();
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteStep, setDeleteStep] = useState(0);
  const [emailNotif, setEmailNotif] = useState(true);
  const [browserNotif, setBrowserNotif] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const showMsg = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleDeleteConversations = async () => {
    if (!confirm('Tüm sohbet geçmişiniz silinecek. Emin misiniz?')) return;
    clearMessages();
    try {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('chat_sessions').delete().eq('user_id', user.id);
      }
    } catch {
      // ignore
    }
    showMsg('Sohbet geçmişi silindi.');
  };

  const handleExportData = async () => {
    setSaving(true);
    try {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, usageRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('ai_usage').select('*').eq('user_id', user.id).limit(500),
      ]);

      const exportData = {
        profile: profileRes.data,
        usage: usageRes.data,
        exportedAt: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `koschei-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showMsg('Dışa aktarma başarısız.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteStep === 0) {
      setDeleteStep(1);
      return;
    }
    if (deleteStep === 1) {
      if (deleteConfirm !== 'SİL') {
        showMsg('Lütfen "SİL" yazın.');
        return;
      }
      setDeleteStep(2);
      try {
        const supabase = createSupabaseClient();
        await supabase.auth.signOut();
        router.push('/');
      } catch {
        showMsg('Hesap silinirken hata oluştu.');
        setDeleteStep(0);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white">⚙️ Ayarlar</h1>
        <p className="text-slate-400 mt-1">Hesap ve uygulama ayarlarınızı yönetin</p>
      </motion.div>

      {msg && (
        <div className="mb-4 bg-accent-green/10 border border-accent-green/20 rounded-xl px-4 py-3 text-accent-green text-sm">
          ✓ {msg}
        </div>
      )}

      <div className="space-y-6">
        {/* Language */}
        <Card className="p-5">
          <h3 className="font-bold text-white mb-4">🌐 Dil Tercihi</h3>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg bg-accent-blue text-white text-sm font-medium">
              Türkçe
            </button>
            <button className="px-4 py-2 rounded-lg bg-bg-deep border border-white/10 text-slate-400 text-sm font-medium opacity-50 cursor-not-allowed" disabled>
              English <span className="text-xs ml-1">(Yakında)</span>
            </button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-5">
          <h3 className="font-bold text-white mb-4">🔔 Bildirim Tercihleri</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Email Bildirimleri</p>
                <p className="text-xs text-slate-500">Önemli güncellemeler ve haberler</p>
              </div>
              <button
                onClick={() => setEmailNotif(!emailNotif)}
                className={`w-10 h-6 rounded-full transition-all ${emailNotif ? 'bg-accent-blue' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-all mx-1 ${emailNotif ? 'translate-x-4' : ''}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Tarayıcı Bildirimleri</p>
                <p className="text-xs text-slate-500">Anlık bildirimler</p>
              </div>
              <button
                onClick={() => setBrowserNotif(!browserNotif)}
                className={`w-10 h-6 rounded-full transition-all ${browserNotif ? 'bg-accent-blue' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-all mx-1 ${browserNotif ? 'translate-x-4' : ''}`} />
              </button>
            </div>
          </div>
        </Card>

        {/* Theme */}
        <Card className="p-5">
          <h3 className="font-bold text-white mb-4">🎨 Tema</h3>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg bg-accent-blue text-white text-sm font-medium flex items-center gap-2">
              🌙 Koyu
            </button>
            <button className="px-4 py-2 rounded-lg bg-bg-deep border border-white/10 text-slate-400 text-sm font-medium opacity-50 cursor-not-allowed flex items-center gap-2" disabled>
              ☀️ Açık <Badge variant="gold">Yakında</Badge>
            </button>
          </div>
        </Card>

        {/* Data */}
        <Card className="p-5">
          <h3 className="font-bold text-white mb-4">📦 Verilerim</h3>
          <div className="space-y-3">
            <Button onClick={handleDeleteConversations} variant="secondary" className="w-full">
              🗑 Tüm Sohbetleri Sil
            </Button>
            <Button onClick={handleExportData} loading={saving} variant="secondary" className="w-full">
              ⬇ Verilerimi Dışa Aktar (JSON)
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-5 border-red-500/20">
          <h3 className="font-bold text-red-400 mb-4">⚠️ Tehlikeli Bölge</h3>
          <p className="text-sm text-slate-400 mb-4">
            Hesabınızı silerseniz tüm verileriniz kalıcı olarak silinir. Bu işlem geri alınamaz.
          </p>
          {deleteStep === 0 && (
            <Button onClick={handleDeleteAccount} variant="secondary" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
              Hesabı Sil
            </Button>
          )}
          {deleteStep === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-red-400 font-medium">Onaylamak için aşağıya &quot;SİL&quot; yazın:</p>
              <input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder='SİL'
                className="w-full bg-bg-deep border border-red-500/30 rounded-lg px-4 py-2 text-white text-sm focus:outline-none"
              />
              <div className="flex gap-2">
                <Button onClick={handleDeleteAccount} variant="secondary" className="border-red-500/40 text-red-400 hover:bg-red-500/10 flex-1">
                  Kalıcı Olarak Sil
                </Button>
                <Button onClick={() => { setDeleteStep(0); setDeleteConfirm(''); }} variant="secondary" className="flex-1">
                  İptal
                </Button>
              </div>
            </div>
          )}
          <p className="text-xs text-slate-600 mt-3">
            Hesap: <span className="text-slate-500">{profile?.email}</span>
          </p>
        </Card>
      </div>
    </div>
  );
}
