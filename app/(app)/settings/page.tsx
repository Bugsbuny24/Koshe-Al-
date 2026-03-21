'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    freelancerName: '',
    brandTone: 'professional',
    deliveryStyle: 'detailed',
    niche: 'hotel',
  });

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Ayarlar</h1>
        <p className="text-slate-400 mt-1 text-sm">Freelancer profilini ve tercihlerini düzenle.</p>
      </div>

      <div className="space-y-5">
        <Card className="p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Freelancer Profili</h2>
          <Input
            label="Adın / Markan"
            placeholder="Ahmet Yılmaz veya AY Digital"
            value={form.freelancerName}
            onChange={set('freelancerName')}
          />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Niş</label>
            <select
              value={form.niche}
              onChange={set('niche')}
              className="w-full bg-bg-deep border border-white/10 rounded-lg px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-accent-blue/50"
            >
              <option value="hotel">Hotel / Konaklama</option>
              <option value="restaurant">Restoran</option>
              <option value="travel">Seyahat</option>
              <option value="other">Diğer</option>
            </select>
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">AI Tercihleri</h2>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Marka Tonu</label>
            <select
              value={form.brandTone}
              onChange={set('brandTone')}
              className="w-full bg-bg-deep border border-white/10 rounded-lg px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-accent-blue/50"
            >
              <option value="professional">Profesyonel</option>
              <option value="friendly">Samimi</option>
              <option value="luxury">Lüks / Premium</option>
              <option value="bold">Cesur / Dinamik</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Teslim Stili</label>
            <select
              value={form.deliveryStyle}
              onChange={set('deliveryStyle')}
              className="w-full bg-bg-deep border border-white/10 rounded-lg px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-accent-blue/50"
            >
              <option value="detailed">Detaylı</option>
              <option value="concise">Özlü</option>
              <option value="bullet">Madde Madde</option>
            </select>
          </div>
        </Card>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} size="sm">
            {saved ? '✓ Kaydedildi' : 'Kaydet'}
          </Button>
          <p className="text-xs text-slate-500">Ayarlar şu an tarayıcı oturumuna özeldir ve kalıcı olarak kaydedilmemektedir.</p>
        </div>
      </div>
    </div>
  );
}
