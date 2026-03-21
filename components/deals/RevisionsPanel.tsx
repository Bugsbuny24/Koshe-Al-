'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DealRevision, DealMilestone } from '@/types/deals';

type Props = { dealId: string; milestones: DealMilestone[]; revisions: DealRevision[]; onUpdate: () => void };

const scopeStatusVariant: Record<string, 'green' | 'gold' | 'red'> = {
  in_scope: 'green', partially_out_of_scope: 'gold', out_of_scope: 'red',
};
const scopeStatusLabel: Record<string, string> = {
  in_scope: 'Kapsam İçi', partially_out_of_scope: 'Kısmen Dışı', out_of_scope: 'Kapsam Dışı',
};
const revisionStatusVariant: Record<string, 'gold' | 'green'> = {
  open: 'gold', resolved: 'green',
};
const revisionStatusLabel: Record<string, string> = {
  open: 'Açık', resolved: 'Kapalı',
};

export function RevisionsPanel({ dealId, milestones, revisions, onUpdate }: Props) {
  const [milestoneId, setMilestoneId] = useState('');
  const [rawFeedback, setRawFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleParse = async () => {
    if (loading) return;
    if (!rawFeedback.trim()) {
      setError('Geri bildirim gerekli');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch(`/api/deals/${dealId}/revisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId: milestoneId || undefined, rawFeedback }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Hata oluştu');
        return;
      }
      setRawFeedback('');
      setSuccess(true);
      onUpdate();
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Yeni Revizyon
        </h3>
        <p className="text-xs text-slate-600 mb-4">
          Müşteri geri bildirimini gir. AI, kapsam durumunu analiz edip aksiyon maddelerini çıkaracak.
        </p>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Milestone (opsiyonel)</label>
            <select
              value={milestoneId}
              onChange={(e) => setMilestoneId(e.target.value)}
              className="w-full px-3 py-2 bg-bg-deep border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent-blue/50"
            >
              <option value="">Genel revizyon</option>
              {milestones.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Müşteri Geri Bildirimi *</label>
            <textarea
              value={rawFeedback}
              onChange={(e) => setRawFeedback(e.target.value)}
              placeholder="Müşteri geri bildirimini buraya gir…"
              rows={5}
              className="w-full px-3 py-2 bg-bg-deep border border-white/10 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-accent-blue/50 resize-none"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && (
            <p className="text-green-400 text-sm flex items-center gap-1.5">
              <span>✓</span> Revizyon kaydedildi ve analiz tamamlandı
            </p>
          )}
          <div className="flex items-center gap-3">
            <Button onClick={handleParse} disabled={loading || !rawFeedback.trim()}>
              {loading ? '🤖 Analiz ediliyor…' : '🤖 AI ile Parse Et'}
            </Button>
            {loading && (
              <span className="text-xs text-slate-500">AI analiz ediyor, lütfen bekleyin…</span>
            )}
          </div>
        </div>
      </Card>

      {revisions.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Revizyon Geçmişi ({revisions.length})
          </h3>
          {revisions.map((r) => {
            const parsed = r.parsed_feedback_json;
            const linkedMs = milestones.find((m) => m.id === r.milestone_id);
            return (
              <Card key={r.id} className="p-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={scopeStatusVariant[r.scope_status] || 'gray'}>
                    {scopeStatusLabel[r.scope_status] || r.scope_status}
                  </Badge>
                  <Badge variant={revisionStatusVariant[r.status] || 'gray'}>
                    {revisionStatusLabel[r.status] || r.status}
                  </Badge>
                  {linkedMs ? (
                    <span className="text-xs font-medium text-slate-300 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      📋 {linkedMs.title}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      🌐 Genel revizyon
                    </span>
                  )}
                  <span className="text-xs text-slate-600 ml-auto">
                    {new Date(r.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                {parsed?.summary && <p className="text-sm text-slate-300">{parsed.summary}</p>}
                {parsed?.requested_changes && parsed.requested_changes.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">İstenen Değişiklikler</p>
                    <ul className="space-y-1">
                      {parsed.requested_changes.map((c, i) => (
                        <li key={i} className="text-xs text-slate-400">
                          • {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(r.action_items_json ?? []).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">Aksiyon Maddeleri</p>
                    <ul className="space-y-1">
                      {r.action_items_json.map((a, i) => (
                        <li key={i} className="text-xs text-accent-blue">
                          → {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-slate-500 text-sm">Henüz revizyon yok.</p>
        </Card>
      )}
    </div>
  );
}

