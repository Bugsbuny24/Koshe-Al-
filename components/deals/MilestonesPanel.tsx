'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DealMilestone, DealDelivery, DealRevision } from '@/types/deals';

type Props = {
  dealId: string;
  milestones: DealMilestone[];
  deliveries?: DealDelivery[];
  revisions?: DealRevision[];
  onUpdate: () => void;
};

const milestoneStatusVariant: Record<string, 'blue' | 'green' | 'gold' | 'red' | 'gray'> = {
  pending: 'gray', in_progress: 'blue', delivered: 'gold', revision_requested: 'red', approved: 'green',
};
const milestoneStatusLabel: Record<string, string> = {
  pending: 'Bekliyor', in_progress: 'Devam Ediyor', delivered: 'Teslim Edildi', revision_requested: 'Revizyon', approved: 'Onaylandı',
};

function ApprovalActions({ dealId, milestone, onUpdate }: { dealId: string; milestone: DealMilestone; onUpdate: () => void }) {
  const [showReject, setShowReject] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const decide = async (decision: 'approved' | 'rejected') => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/deals/${dealId}/approvals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId: milestone.id, decision, note: rejectNote }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Hata oluştu'); return; }
      setShowReject(false);
      setRejectNote('');
      onUpdate();
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  if (milestone.status === 'approved') return null;
  if (milestone.status === 'pending') return null;

  return (
    <div className="mt-3 pt-3 border-t border-white/5">
      {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
      {showReject ? (
        <div className="space-y-2">
          <textarea
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            placeholder="Red nedeni (opsiyonel)..."
            rows={2}
            className="w-full px-3 py-2 bg-bg-deep border border-white/10 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50 resize-none"
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => decide('rejected')} disabled={loading}>
              {loading ? '...' : '❌ Reddet'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setShowReject(false); setRejectNote(''); }} disabled={loading}>
              İptal
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => decide('approved')} disabled={loading}>
            {loading ? '...' : '✅ Onayla'}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowReject(true)} disabled={loading}>
            ❌ Reddet
          </Button>
        </div>
      )}
    </div>
  );
}

export function MilestonesPanel({ dealId, milestones, deliveries = [], revisions = [], onUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const create = async (mode: string) => {
    setLoading(true); setError('');
    try {
      const body = mode === 'ai' ? { mode: 'ai' } : { template: mode };
      const res = await fetch(`/api/deals/${dealId}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Hata oluştu'); return; }
      onUpdate();
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant="outline" onClick={() => create('standard')} disabled={loading}>📋 Standard (20/40/40)</Button>
        <Button size="sm" variant="outline" onClick={() => create('fast')} disabled={loading}>⚡ Fast (50/50)</Button>
        <Button size="sm" variant="outline" onClick={() => create('iterative')} disabled={loading}>🔄 Iterative (25×4)</Button>
        <Button size="sm" onClick={() => create('ai')} disabled={loading}>✨ AI Planı</Button>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {milestones.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-slate-500 text-sm">Henüz milestone yok. Yukarıdan bir şablon seç veya AI planı oluştur.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {milestones.map((m, i) => {
            const deliveryCount = deliveries.filter((d) => d.milestone_id === m.id).length;
            const revisionCount = revisions.filter((r) => r.milestone_id === m.id).length;
            return (
              <Card key={m.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-xs font-bold text-accent-blue flex-shrink-0 mt-0.5">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-white text-sm">{m.title}</p>
                      <Badge variant={milestoneStatusVariant[m.status] || 'gray'}>{milestoneStatusLabel[m.status] || m.status}</Badge>
                    </div>
                    {m.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{m.description}</p>}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-500">📦 {deliveryCount} teslim</span>
                      <span className="text-xs text-slate-500">🔄 {revisionCount} revizyon</span>
                      {m.deadline && (
                        <span className="text-xs text-slate-500">
                          📅 {new Date(m.deadline).toLocaleDateString('tr-TR')}
                        </span>
                      )}
                    </div>
                    <ApprovalActions dealId={dealId} milestone={m} onUpdate={onUpdate} />
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono font-semibold text-white text-sm">${m.amount.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
