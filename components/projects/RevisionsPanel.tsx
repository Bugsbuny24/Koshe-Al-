'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProjectRevision, AiRevisionResult } from '@/types/freelancer';

interface RevisionsPanelProps {
  projectId: string;
  revisions?: ProjectRevision[];
  onUpdate?: () => void;
}

const SCOPE_STATUS_LABEL: Record<string, string> = {
  in_scope: 'Kapsam İçi',
  partially_out_of_scope: 'Kısmi Kapsam Dışı',
  out_of_scope: 'Kapsam Dışı',
};

const SCOPE_STATUS_COLOR: Record<string, 'green' | 'gold' | 'red'> = {
  in_scope: 'green',
  partially_out_of_scope: 'gold',
  out_of_scope: 'red',
};

export function RevisionsPanel({ projectId, revisions: initialRevisions = [], onUpdate }: RevisionsPanelProps) {
  const [loading, setLoading] = useState(false);
  const [revisions, setRevisions] = useState<ProjectRevision[]>(initialRevisions);
  const [feedback, setFeedback] = useState('');
  const [latestResult, setLatestResult] = useState<AiRevisionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInterpret = async () => {
    if (!feedback.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/revisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_feedback: feedback }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.data?.revision) {
          setRevisions((prev) => [data.data.revision, ...prev]);
        }
        if (data.data?.result) {
          setLatestResult(data.data.result);
        }
        setFeedback('');
      } else {
        setError(data.error ?? 'Bilinmeyen hata');
      }
      if (onUpdate) onUpdate();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Revizyon Yönetimi</h2>
      </div>

      {/* Input */}
      <div className="bg-bg-card border border-white/5 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-400">Müşteri Geri Bildirimi</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={5}
          placeholder="Müşterinin revizyon isteğini veya geri bildirimini buraya yapıştır..."
          className="w-full bg-bg-deep border border-white/10 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-accent-blue/50 resize-none"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button
          onClick={handleInterpret}
          loading={loading}
          disabled={!feedback.trim()}
          size="sm"
        >
          🧠 Interpret Revision
        </Button>
      </div>

      {/* Latest AI Result */}
      {latestResult && (
        <div className="bg-bg-card border border-accent-blue/20 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Analiz Sonucu</h3>
            <Badge variant={SCOPE_STATUS_COLOR[latestResult.scope_status] ?? 'gray'}>
              {SCOPE_STATUS_LABEL[latestResult.scope_status] ?? latestResult.scope_status}
            </Badge>
          </div>

          {latestResult.summary && (
            <p className="text-sm text-slate-300">{latestResult.summary}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {latestResult.requested_changes.length > 0 && (
              <div className="bg-bg-deep rounded-lg p-3">
                <h5 className="text-xs font-semibold text-pi-gold mb-2">İstenen Değişiklikler</h5>
                <ul className="space-y-1">
                  {latestResult.requested_changes.map((item, i) => (
                    <li key={i} className="text-xs text-slate-300">• {item}</li>
                  ))}
                </ul>
              </div>
            )}
            {latestResult.affected_sections.length > 0 && (
              <div className="bg-bg-deep rounded-lg p-3">
                <h5 className="text-xs font-semibold text-accent-blue mb-2">Etkilenen Bölümler</h5>
                <ul className="space-y-1">
                  {latestResult.affected_sections.map((item, i) => (
                    <li key={i} className="text-xs text-slate-300">• {item}</li>
                  ))}
                </ul>
              </div>
            )}
            {latestResult.action_items.length > 0 && (
              <div className="bg-bg-deep rounded-lg p-3">
                <h5 className="text-xs font-semibold text-accent-green mb-2">Action Items</h5>
                <ul className="space-y-1">
                  {latestResult.action_items.map((item, i) => (
                    <li key={i} className="text-xs text-slate-300">→ {item}</li>
                  ))}
                </ul>
              </div>
            )}
            {latestResult.client_reply_suggestion && (
              <div className="bg-bg-deep rounded-lg p-3">
                <h5 className="text-xs font-semibold text-slate-400 mb-2">Önerilen Yanıt</h5>
                <p className="text-xs text-slate-300 whitespace-pre-wrap">{latestResult.client_reply_suggestion}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(latestResult.client_reply_suggestion).catch(() => {})}
                  className="mt-2 text-xs text-accent-blue hover:underline"
                >
                  📋 Kopyala
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Revisions History */}
      {revisions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400">Geçmiş Revizyonlar</h3>
          {revisions.map((rev) => {
            const parsed = rev.parsed_feedback_json as AiRevisionResult | undefined;
            const statusKey = rev.scope_status ?? parsed?.scope_status;
            return (
              <div key={rev.id} className="bg-bg-card border border-white/5 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                  <span className="text-xs text-slate-500">
                    {new Date(rev.created_at).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {statusKey && (
                    <Badge variant={SCOPE_STATUS_COLOR[statusKey] ?? 'gray'}>
                      {SCOPE_STATUS_LABEL[statusKey] ?? statusKey}
                    </Badge>
                  )}
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Ham Geri Bildirim</h4>
                    <p className="text-sm text-slate-300">{rev.raw_feedback}</p>
                  </div>
                  {parsed?.summary && (
                    <p className="text-sm text-slate-400 italic">{parsed.summary}</p>
                  )}
                  {rev.action_items_json && rev.action_items_json.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-pi-gold uppercase mb-2">Action Items</h4>
                      <ul className="space-y-1">
                        {rev.action_items_json.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-pi-gold mt-0.5">→</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {revisions.length === 0 && !latestResult && (
        <div className="bg-bg-card border border-white/5 rounded-xl p-6 text-center">
          <p className="text-slate-500 text-sm">Henüz revizyon kaydı yok. Yukarıdan müşteri geri bildirimini girerek başla.</p>
        </div>
      )}
    </div>
  );
}
