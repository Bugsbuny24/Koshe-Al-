'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProjectRevision } from '@/types/freelancer';

interface RevisionsPanelProps {
  projectId: string;
  revisions?: ProjectRevision[];
  onUpdate?: () => void;
}

export function RevisionsPanel({ projectId, revisions: initialRevisions = [], onUpdate }: RevisionsPanelProps) {
  const [loading, setLoading] = useState(false);
  const [revisions, setRevisions] = useState<ProjectRevision[]>(initialRevisions);
  const [feedback, setFeedback] = useState('');

  const handleInterpret = async () => {
    if (!feedback.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/revisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_feedback: feedback }),
      });
      const data = await res.json();
      if (data.revision) {
        setRevisions((prev) => [data.revision, ...prev]);
        setFeedback('');
      }
      if (onUpdate) onUpdate();
    } finally {
      setLoading(false);
    }
  };

  const scopeColors = {
    in_scope: 'green' as const,
    out_of_scope: 'red' as const,
    partial: 'gold' as const,
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
        <Button
          onClick={handleInterpret}
          loading={loading}
          disabled={!feedback.trim()}
          size="sm"
        >
          🧠 Interpret Revision
        </Button>
      </div>

      {/* Revisions List */}
      {revisions.length > 0 && (
        <div className="space-y-4">
          {revisions.map((rev) => (
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
                {rev.scope_status && (
                  <Badge variant={scopeColors[rev.scope_status] ?? 'gray'}>
                    {rev.scope_status === 'in_scope' ? 'Kapsam İçi' :
                     rev.scope_status === 'out_of_scope' ? 'Kapsam Dışı' : 'Kısmi'}
                  </Badge>
                )}
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Ham Geri Bildirim</h4>
                  <p className="text-sm text-slate-300">{rev.raw_feedback}</p>
                </div>

                {rev.parsed_feedback_json && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {rev.parsed_feedback_json.in_scope.length > 0 && (
                      <div className="bg-bg-deep rounded-lg p-3">
                        <h5 className="text-xs font-semibold text-accent-green mb-2">✓ Kapsam İçi</h5>
                        <ul className="space-y-1">
                          {rev.parsed_feedback_json.in_scope.map((item, i) => (
                            <li key={i} className="text-xs text-slate-300">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {rev.parsed_feedback_json.out_of_scope.length > 0 && (
                      <div className="bg-bg-deep rounded-lg p-3">
                        <h5 className="text-xs font-semibold text-red-400 mb-2">✗ Kapsam Dışı</h5>
                        <ul className="space-y-1">
                          {rev.parsed_feedback_json.out_of_scope.map((item, i) => (
                            <li key={i} className="text-xs text-slate-300">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {rev.parsed_feedback_json.notes.length > 0 && (
                      <div className="bg-bg-deep rounded-lg p-3">
                        <h5 className="text-xs font-semibold text-slate-400 mb-2">📝 Notlar</h5>
                        <ul className="space-y-1">
                          {rev.parsed_feedback_json.notes.map((item, i) => (
                            <li key={i} className="text-xs text-slate-300">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
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
          ))}
        </div>
      )}

      {revisions.length === 0 && (
        <div className="bg-bg-card border border-white/5 rounded-xl p-6 text-center">
          <p className="text-slate-500 text-sm">Henüz revizyon kaydı yok. Yukarıdan müşteri geri bildirimini girerek başla.</p>
        </div>
      )}
    </div>
  );
}
