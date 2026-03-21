'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const NICHE_OPTIONS = [
  { value: 'hotel', label: 'Hotel / Konaklama' },
  { value: 'restaurant', label: 'Restoran / F&B' },
  { value: 'spa', label: 'SPA / Wellness' },
  { value: 'travel', label: 'Seyahat Acentesi' },
  { value: 'other', label: 'Diğer' },
];

const SERVICE_OPTIONS = [
  { value: 'landing-page', label: 'Landing Page Kopya' },
  { value: 'social-media', label: 'Sosyal Medya İçeriği' },
  { value: 'email-campaign', label: 'E-posta Kampanyası' },
  { value: 'whatsapp-script', label: 'WhatsApp Scripti' },
  { value: 'offer-pack', label: 'Teklif Paketi' },
  { value: 'full-growth', label: 'Full Growth Paketi' },
];

interface FormData {
  clientName: string;
  brandName: string;
  niche: string;
  serviceType: string;
  rawBrief: string;
  budget: string;
  deadline: string;
}

export function NewProjectForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormData>({
    clientName: '',
    brandName: '',
    niche: 'hotel',
    serviceType: 'landing-page',
    rawBrief: '',
    budget: '',
    deadline: '',
  });

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.clientName.trim()) return setError('Müşteri adı gerekli');
    if (!form.rawBrief.trim()) return setError('Proje brief\'i gerekli');

    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Proje oluşturulamadı');
      router.push(`/projects/${data.project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      {/* Client Info */}
      <div className="bg-bg-card border border-white/5 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Müşteri Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Müşteri Adı *"
            placeholder="Ahmet Yılmaz"
            value={form.clientName}
            onChange={set('clientName')}
            required
          />
          <Input
            label="Marka Adı"
            placeholder="Grand Hotel Bosphorus"
            value={form.brandName}
            onChange={set('brandName')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Niş</label>
            <select
              value={form.niche}
              onChange={set('niche')}
              className="w-full bg-bg-deep border border-white/10 rounded-lg px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-accent-blue/50"
            >
              {NICHE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Hizmet Tipi</label>
            <select
              value={form.serviceType}
              onChange={set('serviceType')}
              className="w-full bg-bg-deep border border-white/10 rounded-lg px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-accent-blue/50"
            >
              {SERVICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Brief */}
      <div className="bg-bg-card border border-white/5 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Proje Brief</h2>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Ham Brief *</label>
          <textarea
            value={form.rawBrief}
            onChange={set('rawBrief')}
            rows={6}
            placeholder="Müşterinin sana ilettiği mesajı, isteği veya talebi buraya yapıştır..."
            className="w-full bg-bg-deep border border-white/10 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-accent-blue/50 resize-none"
            required
          />
        </div>
      </div>

      {/* Budget & Deadline */}
      <div className="bg-bg-card border border-white/5 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Proje Detayları</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Bütçe"
            placeholder="₺5.000"
            value={form.budget}
            onChange={set('budget')}
          />
          <Input
            label="Deadline"
            type="date"
            value={form.deadline}
            onChange={set('deadline')}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <Button type="submit" loading={loading} size="lg" className="w-full md:w-auto">
        ⚡ Create Project with Koschei
      </Button>
    </form>
  );
}
