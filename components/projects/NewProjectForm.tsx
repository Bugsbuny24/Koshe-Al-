'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

const TEMPLATE_PRESETS: Record<string, FormData> = {
  'hotel-landing': {
    title: 'Hotel Landing Page Pack',
    description: 'Rezervasyon odaklı landing page için hazır kopya yapısı, CTA haritası ve başlık seti. Misafirleri rezervasyona yönlendiren ikna edici sayfa içeriği oluştur.',
    tech_stack: 'landing-page',
  },
  'hotel-whatsapp': {
    title: 'Hotel WhatsApp Booking Pack',
    description: 'WhatsApp üzerinden rezervasyon dönüşümü için script ve takip mesajları. Potansiyel misafirlerle etkili iletişim kurarak rezervasyona dönüştür.',
    tech_stack: 'whatsapp-script',
  },
  'hotel-offer': {
    title: 'Hotel Offer Pack',
    description: 'Özel teklif ve kampanya sayfaları için metin şablonları ve aciliyet kopyaları. Sezonluk kampanyalar ve özel paketler için ikna edici içerik üret.',
    tech_stack: 'offer-pack',
  },
};

export function NewProjectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [linkWarning, setLinkWarning] = useState('');
  const [fromTemplate, setFromTemplate] = useState('');
  const [fromExecution, setFromExecution] = useState(false);
  const [executionRunId, setExecutionRunId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    tech_stack: '',
  });

  useEffect(() => {
    // Check for execution run params first (higher priority)
    const execTitle = searchParams.get('title');
    const execDescription = searchParams.get('description');
    const execTechStack = searchParams.get('tech_stack');
    const execRunId = searchParams.get('executionRunId');

    if (execRunId) {
      setExecutionRunId(execRunId);
      setFromExecution(true);
      setForm({
        title: execTitle ?? '',
        description: execDescription ?? '',
        tech_stack: execTechStack ?? '',
      });
      return;
    }

    // Fall back to template preset
    const templateId = searchParams.get('template');
    if (templateId && TEMPLATE_PRESETS[templateId]) {
      setForm(TEMPLATE_PRESETS[templateId]);
      setFromTemplate(templateId);
    }
  }, [searchParams]);

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

      const projectId: string = data.project.id;

      // Back-link execution run to this project (non-blocking)
      if (executionRunId) {
        try {
          const linkRes = await fetch(`/api/execution/runs/${executionRunId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: projectId, status: 'linked_to_project' }),
          });
          if (!linkRes.ok) {
            const linkData = await linkRes.json().catch(() => ({}));
            console.warn('execution run back-link failed:', linkData?.error);
            setLinkWarning('Execution run projeye bağlanamadı, ancak proje oluşturuldu.');
          }
        } catch (linkErr) {
          console.error('execution run back-link failed:', linkErr);
          setLinkWarning('Execution run bağlantısı kurulamadı, ancak proje oluşturuldu.');
        }
      }

      router.push(`/projects/${projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      {/* Execution source badge */}
      {fromExecution && (
        <div className="flex items-start gap-3 bg-accent-green/10 border border-accent-green/20 rounded-xl px-4 py-3">
          <span className="text-lg shrink-0">⚡</span>
          <div>
            <p className="text-sm font-semibold text-accent-green">Execution&apos;dan Yüklendi</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Form alanları execution run sonuçlarından dolduruldu. İstediğin gibi düzenleyebilirsin.
            </p>
          </div>
        </div>
      )}

      {/* Template banner */}
      {fromTemplate && !fromExecution && (
        <div className="flex items-start gap-3 bg-accent-blue/10 border border-accent-blue/20 rounded-xl px-4 py-3">
          <span className="text-lg shrink-0">📋</span>
          <div>
            <p className="text-sm font-semibold text-accent-blue">Şablondan Yüklendi</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Form alanları <strong className="text-slate-300">{TEMPLATE_PRESETS[fromTemplate]?.title}</strong> şablonuna göre dolduruldu. İstediğin gibi düzenleyebilirsin.
            </p>
          </div>
        </div>
      )}

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

      {linkWarning && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3 text-sm text-amber-400">
          ⚠️ {linkWarning}
        </div>
      )}

      <Button type="submit" loading={loading} size="lg" className="w-full md:w-auto">
        ⚡ Create Project with Koschei
      </Button>
    </form>
  );
}
