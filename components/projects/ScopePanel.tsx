'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ProjectScope } from '@/types/freelancer';

interface ScopePanelProps {
  projectId: string;
  scope?: ProjectScope | null;
  onUpdate?: () => void;
}

export function ScopePanel({ projectId, scope: initialScope, onUpdate }: ScopePanelProps) {
  const [loading, setLoading] = useState(false);
  const [scope, setScope] = useState<ProjectScope | null>(initialScope ?? null);

  const handleBuild = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/scope`, { method: 'POST' });
      const data = await res.json();
      if (data.scope) setScope(data.scope);
      if (onUpdate) onUpdate();
    } finally {
      setLoading(false);
    }
  };

  if (!scope) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Proje Scope</h2>
        </div>
        <div className="bg-bg-card border border-white/5 rounded-xl p-8 text-center">
          <p className="text-slate-500 text-sm mb-4">Henüz scope oluşturulmamış.</p>
          <Button onClick={handleBuild} loading={loading} size="sm">
            🏗️ Build Scope
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Proje Scope</h2>
        <Button onClick={handleBuild} loading={loading} size="sm" variant="outline">
          🔄 Rebuild Scope
        </Button>
      </div>

      {scope.summary && (
        <div className="bg-bg-card border border-accent-blue/20 rounded-xl p-5">
          <h3 className="text-xs font-semibold text-accent-blue uppercase tracking-wider mb-3">Özet</h3>
          <p className="text-sm text-slate-200 leading-relaxed">{scope.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scope.objectives && scope.objectives.length > 0 && (
          <ScopeSection title="Objectives" color="green" items={scope.objectives} icon="✓" />
        )}
        {scope.deliverables_json && scope.deliverables_json.length > 0 && (
          <ScopeSection title="Deliverables" color="gold" items={scope.deliverables_json} icon="→" />
        )}
        {scope.exclusions_json && scope.exclusions_json.length > 0 && (
          <ScopeSection title="Exclusions" color="red" items={scope.exclusions_json} icon="✗" />
        )}
        {scope.questions_json && scope.questions_json.length > 0 && (
          <ScopeSection title="Açık Sorular" color="blue" items={scope.questions_json} icon="?" />
        )}
      </div>

      {scope.estimated_timeline_json && Object.keys(scope.estimated_timeline_json).length > 0 && (
        <div className="bg-bg-card border border-white/5 rounded-xl p-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Tahmini Zaman Çizelgesi</h3>
          <div className="space-y-2">
            {Object.entries(scope.estimated_timeline_json).map(([phase, time]) => (
              <div key={phase} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                <span className="text-sm text-slate-300">{phase}</span>
                <span className="text-sm font-medium text-accent-green">{time}</span>
              </div>
            ))}
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
