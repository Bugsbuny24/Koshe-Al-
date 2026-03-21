'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProjectDraft } from '@/types/freelancer';

const DRAFT_TYPE_LABELS: Record<string, string> = {
  'landing-page-copy': '🏨 Landing Page',
  'headlines': '📢 Headlines',
  'cta-map': '🎯 CTA Map',
  'whatsapp-script': '💬 WhatsApp Script',
  'email-campaign': '📧 E-posta',
  'social-media': '📱 Sosyal Medya',
};

interface DraftsPanelProps {
  projectId: string;
  drafts?: ProjectDraft[];
  onUpdate?: () => void;
}

export function DraftsPanel({ projectId, drafts: initialDrafts = [], onUpdate }: DraftsPanelProps) {
  const [loading, setLoading] = useState(false);
  const [drafts, setDrafts] = useState<ProjectDraft[]>(initialDrafts);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/drafts`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        if (data.data?.drafts) setDrafts(data.data.drafts);
      } else {
        setError(data.error ?? 'Bilinmeyen hata');
      }
      if (onUpdate) onUpdate();
    } finally {
      setLoading(false);
    }
  };

  // Group drafts by type
  const grouped = drafts.reduce<Record<string, ProjectDraft[]>>((acc, d) => {
    if (!acc[d.draft_type]) acc[d.draft_type] = [];
    acc[d.draft_type].push(d);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Taslaklar</h2>
        <Button onClick={handleGenerate} loading={loading} size="sm" variant="outline">
          ✨ Generate Drafts
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {drafts.length === 0 ? (
        <div className="bg-bg-card border border-white/5 rounded-xl p-8 text-center">
          <p className="text-slate-500 text-sm mb-4">Henüz taslak oluşturulmamış.</p>
          <Button onClick={handleGenerate} loading={loading} size="sm">
            ✨ Taslak Oluştur
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type} className="bg-bg-card border border-white/5 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
                <span className="font-semibold text-white text-sm">
                  {DRAFT_TYPE_LABELS[type] || type}
                </span>
                <Badge variant="gray">{items.length} taslak</Badge>
              </div>
              <div className="divide-y divide-white/5">
                {items.map((draft) => (
                  <div key={draft.id}>
                    <button
                      onClick={() => setExpanded(expanded === draft.id ? null : draft.id)}
                      className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-white/3 transition-colors"
                    >
                      <span className="text-sm text-slate-300 font-medium">{draft.title}</span>
                      <span className="text-xs text-slate-600 flex items-center gap-2">
                        v{draft.version}
                        <span className={`transition-transform ${expanded === draft.id ? 'rotate-180' : ''}`}>▾</span>
                      </span>
                    </button>
                    {expanded === draft.id && (
                      <div className="px-5 pb-4">
                        <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed bg-bg-deep rounded-lg p-4">
                          {draft.content}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
