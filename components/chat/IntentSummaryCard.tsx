'use client';

import { cn } from '@/lib/utils';
import type { IntakeResult, RecommendedFlow } from '@/types/intake';

const FLOW_LABELS: Record<RecommendedFlow, { label: string; icon: string; color: string }> = {
  execution: {
    label: 'Execution Planning',
    icon: '⚙️',
    color: 'border-accent-blue/30 bg-accent-blue/5',
  },
  builder: {
    label: 'Kod Üretici',
    icon: '💻',
    color: 'border-accent-green/30 bg-accent-green/5',
  },
  mentor: {
    label: 'AI Mentor',
    icon: '🧠',
    color: 'border-purple-500/30 bg-purple-500/5',
  },
};

const INTENT_LABELS: Record<string, string> = {
  landing_page: 'Açılış Sayfası',
  offer_page: 'Teklif Sayfası',
  whatsapp_booking_flow: 'WhatsApp Rezervasyon',
  simple_code_task: 'Kod Görevi',
  technical_web_project: 'Web Projesi',
  automation_task: 'Otomasyon',
  learning_request: 'Öğrenme Talebi',
  unknown: 'Genel Talep',
};

const CONFIDENCE_LABELS: Record<string, { label: string; color: string }> = {
  low: { label: 'Düşük Güven', color: 'text-orange-400' },
  medium: { label: 'Orta Güven', color: 'text-yellow-400' },
  high: { label: 'Yüksek Güven', color: 'text-accent-green' },
};

interface IntentSummaryCardProps {
  result: IntakeResult;
  className?: string;
}

export function IntentSummaryCard({ result, className }: IntentSummaryCardProps) {
  const flow = FLOW_LABELS[result.recommended_flow];
  const confidence = CONFIDENCE_LABELS[result.confidence];

  return (
    <div className={cn('rounded-2xl border border-white/10 bg-bg-card p-4 space-y-3', className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
            Tespit Edilen Niyet
          </p>
          <p className="text-sm font-semibold text-white">
            {INTENT_LABELS[result.detected_intent] ?? result.detected_intent}
          </p>
        </div>
        <span className={cn('text-xs font-semibold', confidence.color)}>
          {confidence.label}
        </span>
      </div>

      {/* Business goal */}
      {result.business_goal && (
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
            İş Hedefi
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">{result.business_goal}</p>
        </div>
      )}

      {/* Recommended flow badge */}
      <div className={cn('flex items-center gap-2 rounded-xl border px-3 py-2', flow.color)}>
        <span className="text-base">{flow.icon}</span>
        <div>
          <p className="text-xs text-slate-400">Önerilen Akış</p>
          <p className="text-sm font-semibold text-white">{flow.label}</p>
        </div>
        {result.recommended_template && (
          <span className="ml-auto text-xs text-slate-500 bg-bg-deep rounded-lg px-2 py-0.5">
            {result.recommended_template}
          </span>
        )}
      </div>
    </div>
  );
}
