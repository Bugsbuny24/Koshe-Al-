'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DealHeader } from '@/components/deals/DealHeader';
import { DealTabs } from '@/components/deals/DealTabs';
import { ActivityLogPanel } from '@/components/deals/ActivityLogPanel';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Deal, DealScopeSnapshot, DealMilestone, EscrowTransaction, DealActivityLog, DealRevision } from '@/types/deals';

type DealDetail = {
  deal: Deal;
  scope: DealScopeSnapshot | null;
  milestones: DealMilestone[];
  escrow: EscrowTransaction | null;
  activity: DealActivityLog[];
  deliveries_count: number;
  revisions_count: number;
};

const milestoneStatusVariant: Record<string, 'blue' | 'green' | 'gold' | 'red' | 'gray'> = {
  pending: 'gray', in_progress: 'blue', delivered: 'gold', revision_requested: 'red', approved: 'green',
};
const milestoneStatusLabel: Record<string, string> = {
  pending: 'Bekliyor', in_progress: 'Devam', delivered: 'Teslim', revision_requested: 'Revizyon', approved: 'Onay',
};

const escrowStatusLabel: Record<string, string> = {
  pending: 'Bekliyor', funded: 'Finanse Edildi', partially_released: 'Kısmen Serbest', released: 'Serbest Bırakıldı', cancelled: 'İptal',
};
const escrowStatusVariant: Record<string, 'blue' | 'green' | 'gold' | 'red' | 'gray'> = {
  pending: 'gray', funded: 'blue', partially_released: 'gold', released: 'green', cancelled: 'red',
};

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-lg font-bold ${accent || 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </Card>
  );
}

export default function DealDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [data, setData] = useState<DealDetail | null>(null);
  const [revisions, setRevisions] = useState<DealRevision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/deals/${id}`).then((r) => r.json()),
      fetch(`/api/deals/${id}/revisions`).then((r) => r.json()),
    ])
      .then(([d, rev]) => {
        if (d.deal) setData(d as DealDetail);
        else setError(d.error || 'Deal bulunamadı');
        if (rev.revisions) setRevisions(rev.revisions);
      })
      .catch(() => setError('Bağlantı hatası'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" /></div>;
  if (error || !data) return <div className="text-center py-16"><p className="text-slate-400">{error}</p><Link href="/deals" className="text-accent-blue text-sm mt-3 block">← Deal listesine dön</Link></div>;

  const { deal, scope, milestones, escrow, activity, deliveries_count, revisions_count } = data;

  const openRevisionCount = revisions.filter((r) => r.status === 'open').length;
  const latestDelivery = activity.find((a) => a.event_type === 'delivery_uploaded');
  const approvedCount = milestones.filter((m) => m.status === 'approved').length;

  return (
    <div className="max-w-5xl mx-auto">
      <DealHeader deal={deal} />
      <DealTabs dealId={id} />

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        <StatCard
          label="Scope"
          value={scope ? 'Kilitli 🔒' : 'Kilitlenmedi'}
          accent={scope ? 'text-green-400' : 'text-slate-400'}
        />
        <StatCard
          label="Milestones"
          value={milestones.length}
          sub={milestones.length > 0 ? `${approvedCount} onaylandı` : undefined}
        />
        <StatCard
          label="Teslim"
          value={deliveries_count}
          sub={latestDelivery ? new Date(latestDelivery.created_at).toLocaleDateString('tr-TR') : undefined}
        />
        <StatCard
          label="Açık Revizyon"
          value={openRevisionCount}
          sub={`${revisions_count} toplam`}
          accent={openRevisionCount > 0 ? 'text-pi-gold' : 'text-white'}
        />
        <StatCard
          label="Escrow"
          value={escrow ? escrowStatusLabel[escrow.status] || escrow.status : 'Bağlı değil'}
          accent={escrow ? 'text-accent-blue' : 'text-slate-400'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-5">
          {scope ? (
            <Card className="p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Son Scope</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{scope.summary}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="green">v{scope.version}</Badge>
                <span className="text-xs text-slate-600">{new Date(scope.locked_at).toLocaleDateString('tr-TR')}</span>
              </div>
            </Card>
          ) : (
            <Card className="p-5 text-center">
              <p className="text-slate-500 text-sm mb-3">Scope henüz kilitlenmedi</p>
              <Link href={`/deals/${id}/scope`} className="text-accent-blue text-sm hover:underline">Scope Kilitle →</Link>
            </Card>
          )}

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Milestones</h3>
              <Link href={`/deals/${id}/milestones`} className="text-xs text-accent-blue hover:underline">Tümünü gör →</Link>
            </div>
            {milestones.length === 0 ? (
              <p className="text-slate-500 text-sm">Milestone yok</p>
            ) : (
              <div className="space-y-2">
                {milestones.slice(0, 3).map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <Badge variant={milestoneStatusVariant[m.status] || 'gray'}>{milestoneStatusLabel[m.status] || m.status}</Badge>
                    <span className="text-sm text-slate-300 flex-1 truncate">{m.title}</span>
                    <span className="text-sm font-mono text-white">${m.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          {escrow && (
            <Card className="p-4" glow="blue">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Escrow</h3>
                <Badge variant={escrowStatusVariant[escrow.status] || 'gray'}>{escrowStatusLabel[escrow.status] || escrow.status}</Badge>
              </div>
              <p className="text-xs text-slate-400">{escrow.provider}</p>
              <p className="font-mono text-xs text-accent-blue mb-2">{escrow.external_transaction_id}</p>
              <div className="mt-2 text-xs text-slate-400 space-y-1">
                <p>Funded: <span className="text-accent-green">{escrow.currency} {escrow.funded_amount.toLocaleString()}</span></p>
                <p>Released: <span className="text-pi-gold">{escrow.currency} {escrow.released_amount.toLocaleString()}</span></p>
              </div>
              <Link href={`/deals/${id}/escrow`} className="text-xs text-accent-blue hover:underline mt-2 block">Escrow yönet →</Link>
            </Card>
          )}

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Son Aktivite</h3>
              {activity.length > 5 && (
                <span className="text-xs text-slate-600">{activity.length} toplam</span>
              )}
            </div>
            <ActivityLogPanel activity={activity.slice(0, 8)} />
          </Card>
        </div>
      </div>
    </div>
  );
}
