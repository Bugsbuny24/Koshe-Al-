'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DealMilestone, DealDelivery, DealRevision, DealApproval } from '@/types/deals';
import {
  MILESTONE_STATUS_LABEL,
  MILESTONE_STATUS_VARIANT,
} from '@/lib/deals/status';
import { MILESTONE_TEMPLATE_LABELS, MilestoneTemplateKey } from '@/lib/deals/milestoneTemplates';

type Props = {
  dealId: string;
  milestones: DealMilestone[];
  deliveries?: DealDelivery[];
  revisions?: DealRevision[];
  approvals?: DealApproval[];
  onUpdate: () => void;
};

const TEMPLATE_KEYS: MilestoneTemplateKey[] = ['standard', 'fast', 'iterative'];

function ApprovalActions({
  dealId,
  milestone,
  onUpdate,
}: {
  dealId: string;
  milestone: DealMilestone;
  onUpdate: () => void;
}) {
  const [showReject, setShowReject] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const decide = async (decision: 'approved' | 'rejected') => {
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/deals/${dealId}/approvals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId: milestone.id, decision, note: rejectNote }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Hata oluştu');
        return;
      }
      setShowReject(false);
      setRejectNote('');
      onUpdate();
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  if (milestone.status === 'approved' || milestone.status === 'released') return null;
  if (milestone.status === 'in_progress' || milestone.status === 'draft' || milestone.status === 'pending_funding' || milestone.status === 'funded') return null;

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
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowReject(false);
                setRejectNote('');
              }}
              disabled={loading}
            >
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

export function MilestonesPanel({
  dealId,
  milestones,
  deliveries = [],
  revisions = [],
  approvals = [],
  onUpdate,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const create = async (mode: string) => {
    if (loading) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const body = mode === 'ai' ? { mode: 'ai' } : { template: mode };
      const res = await fetch(`/api/deals/${dealId}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Hata oluştu');
        return;
      }
      const count = data.milestones?.length ?? 0;
      setSuccess(`${count} milestone oluşturuldu`);
      onUpdate();
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {milestones.length === 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Milestone Şablonu Seç
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Deal toplam tutarına göre milestone planı oluşturulacak.
          </p>
          <div className="flex gap-2 flex-wrap">
            {TEMPLATE_KEYS.map((key) => (
              <Button
                key={key}
                size="sm"
                variant="outline"
                onClick={() => create(key)}
                disabled={loading}
              >
                {loading ? '...' : MILESTONE_TEMPLATE_LABELS[key]}
              </Button>
            ))}
            <Button size="sm" onClick={() => create('ai')} disabled={loading}>
              {loading ? '⏳ Oluşturuluyor...' : '✨ AI Planı'}
            </Button>
          </div>
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
          {success && <p className="text-green-400 text-sm mt-3">✓ {success}</p>}
        </Card>
      )}

      {milestones.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">{milestones.length} milestone</p>
            <div className="flex gap-2 flex-wrap">
              {TEMPLATE_KEYS.map((key) => (
                <Button
                  key={key}
                  size="sm"
                  variant="outline"
                  onClick={() => create(key)}
                  disabled={loading}
                >
                  {MILESTONE_TEMPLATE_LABELS[key]}
                </Button>
              ))}
              <Button size="sm" onClick={() => create('ai')} disabled={loading}>
                {loading ? '⏳...' : '✨ AI Planı'}
              </Button>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">✓ {success}</p>}
        </>
      )}

      {milestones.length === 0 && !loading && !error && !success && (
        <Card className="p-8 text-center">
          <p className="text-slate-500 text-sm">Yukarıdan bir şablon seç veya AI planı oluştur.</p>
        </Card>
      )}

      {milestones.length > 0 && (
        <div className="space-y-3">
          {milestones.map((m, i) => {
            const deliveryCount = deliveries.filter((d) => d.milestone_id === m.id).length;
            const revisionCount = revisions.filter((r) => r.milestone_id === m.id).length;
            const latestApproval = approvals
              .filter((a) => a.milestone_id === m.id)
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

            const statusVariant =
              MILESTONE_STATUS_VARIANT[m.status as keyof typeof MILESTONE_STATUS_VARIANT] || 'gray';
            const statusLabel =
              MILESTONE_STATUS_LABEL[m.status as keyof typeof MILESTONE_STATUS_LABEL] || m.status;

            return (
              <Card key={m.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-xs font-bold text-accent-blue flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-white text-sm">{m.title}</p>
                      <Badge variant={statusVariant}>{statusLabel}</Badge>
                      {latestApproval && (
                        <Badge variant={latestApproval.decision === 'approved' ? 'green' : 'red'}>
                          {latestApproval.decision === 'approved' ? '✓ Onaylı' : '✗ Reddedildi'}
                        </Badge>
                      )}
                    </div>
                    {m.description && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{m.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-xs text-slate-500">
                        {(() => {
                          const awaitingApproval = deliveryCount > 0 && !['approved', 'revision_requested', 'released'].includes(m.status);
                          return awaitingApproval
                            ? `📦 ${deliveryCount} teslim · onay bekliyor`
                            : `📦 ${deliveryCount} teslim`;
                        })()}
                      </span>
                      {revisionCount > 0 && (
                        <span className="text-xs text-red-400">🔄 {revisionCount} revizyon</span>
                      )}
                      {m.deadline && (
                        <span className="text-xs text-slate-500">
                          📅 {new Date(m.deadline).toLocaleDateString('tr-TR')}
                        </span>
                      )}
                    </div>
                    <ApprovalActions dealId={dealId} milestone={m} onUpdate={onUpdate} />
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono font-semibold text-white text-sm">
                      ${(m.amount ?? 0).toLocaleString()}
                    </p>
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

