'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const TECH_STACK_OPTIONS = [
  { value: '', label: 'Belirtme' },
  { value: 'landing-page', label: 'Landing Page' },
  { value: 'social-media', label: 'Sosyal Medya İçeriği' },
  { value: 'email-campaign', label: 'E-posta Kampanyası' },
  { value: 'whatsapp-script', label: 'WhatsApp Scripti' },
  { value: 'offer-pack', label: 'Teklif Paketi' },
  { value: 'full-growth', label: 'Full Growth Paketi' },
];

interface FormData {
  title: string;
  description: string;
  tech_stack: string;
}

export function NewProjectForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    tech_stack: '',
  });

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) return setError('Proje başlığı gerekli');

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
      {/* Project Info */}
      <div className="bg-bg-card border border-white/5 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Proje Bilgileri</h2>
        <Input
          label="Proje Başlığı *"
          placeholder="Grand Hotel – Landing Page Projesi"
          value={form.title}
          onChange={set('title')}
          required
        />
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Hizmet / Tür</label>
          <select
            value={form.tech_stack}
            onChange={set('tech_stack')}
            className="w-full bg-bg-deep border border-white/10 rounded-lg px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-accent-blue/50"
          >
            {TECH_STACK_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Brief */}
      <div className="bg-bg-card border border-white/5 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Proje Brief</h2>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Ham Brief / Açıklama</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={6}
            placeholder="Müşterinin sana ilettiği mesajı, isteği veya talebi buraya yapıştır..."
            className="w-full bg-bg-deep border border-white/10 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-accent-blue/50 resize-none"
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
