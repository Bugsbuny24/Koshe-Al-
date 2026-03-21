'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ProjectScope, AiScopeResult } from '@/types/freelancer';

interface ScopePanelProps {
  projectId: string;
  scope?: ProjectScope | null;
  onUpdate?: () => void;
}

export function ScopePanel({ projectId, scope: initialScope, onUpdate }: ScopePanelProps) {
  const [loading, setLoading] = useState(false);
  const [scope, setScope] = useState<ProjectScope | null>(initialScope ?? null);
  const [result, setResult] = useState<AiScopeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBuild = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/scope`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        if (data.data?.scope) setScope(data.data.scope);
        if (data.data?.result) setResult(data.data.result);
      } else {
        setError(data.error ?? 'Bilinmeyen hata');
      }
      if (onUpdate) onUpdate();
    } finally {
      setLoading(false);
    }
  };

  if (!scope && !result) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Proje Scope</h2>
        </div>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
        <div className="bg-bg-card border border-white/5 rounded-xl p-8 text-center">
          <p className="text-slate-500 text-sm mb-4">Henüz scope oluşturulmamış.</p>
          <Button onClick={handleBuild} loading={loading} size="sm">
            🏗️ Build Scope
          </Button>
        </div>
      </div>
    );
  }

  // Prefer AI result for display, fall back to DB scope
  const summary = result?.summary ?? scope?.summary;
  const objectives = result?.objectives ?? scope?.objectives ?? [];
  const deliverables = result?.deliverables ?? (scope?.deliverables_json ?? []);
  const exclusions = result?.exclusions ?? (scope?.exclusions_json ?? []);
  const risks = result?.risks ?? (scope?.risks_json ?? []);
  const questions = result?.questions ?? (scope?.questions_json ?? []);
  const estimatedTimeline = result?.estimated_timeline ?? (
    scope?.estimated_timeline_json
      ? Array.isArray(scope.estimated_timeline_json)
        ? scope.estimated_timeline_json
        : Object.entries(scope.estimated_timeline_json).map(([k, v]) => `${k}: ${v}`)
      : []
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Proje Scope</h2>
        <Button onClick={handleBuild} loading={loading} size="sm" variant="outline">
          🔄 Rebuild Scope
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {summary && (
        <div className="bg-bg-card border border-accent-blue/20 rounded-xl p-5">
          <h3 className="text-xs font-semibold text-accent-blue uppercase tracking-wider mb-3">Özet</h3>
          <p className="text-sm text-slate-200 leading-relaxed">{summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {objectives.length > 0 && (
          <ScopeSection title="Objectives" color="green" items={objectives} icon="✓" />
        )}
        {deliverables.length > 0 && (
          <ScopeSection title="Deliverables" color="gold" items={deliverables} icon="→" />
        )}
        {exclusions.length > 0 && (
          <ScopeSection title="Exclusions" color="red" items={exclusions} icon="✗" />
        )}
        {risks.length > 0 && (
          <ScopeSection title="Riskler" color="red" items={risks} icon="!" />
        )}
        {questions.length > 0 && (
          <ScopeSection title="Açık Sorular" color="blue" items={questions} icon="?" />
        )}
      </div>

      {estimatedTimeline.length > 0 && (
        <div className="bg-bg-card border border-white/5 rounded-xl p-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Tahmini Zaman Çizelgesi</h3>
          <div className="space-y-2">
            {estimatedTimeline.map((item, i) => {
              const colonIdx = typeof item === 'string' ? item.indexOf(':') : -1;
              const phase = colonIdx >= 0 ? item.slice(0, colonIdx).trim() : item;
              const time = colonIdx >= 0 ? item.slice(colonIdx + 1).trim() : '';
              return (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-sm text-slate-300">{phase}</span>
                  {time && <span className="text-sm font-medium text-accent-green">{time}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const COLOR_CLASSES = {
  blue: { border: 'border-accent-blue/20', text: 'text-accent-blue' },
  green: { border: 'border-accent-green/20', text: 'text-accent-green' },
  gold: { border: 'border-pi-gold/20', text: 'text-pi-gold' },
  red: { border: 'border-red-500/20', text: 'text-red-400' },
};

function ScopeSection({
  title,
  color,
  items,
  icon,
}: {
  title: string;
  color: 'blue' | 'green' | 'gold' | 'red';
  items: string[];
  icon: string;
}) {
  const { border, text } = COLOR_CLASSES[color];
  return (
    <div className={`bg-bg-card border rounded-xl p-4 ${border}`}>
      <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${text}`}>{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
            <span className={`mt-0.5 ${text}`}>{icon}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
