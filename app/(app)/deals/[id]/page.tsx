'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DealHeader } from '@/components/deals/DealHeader';
import { DealTabs } from '@/components/deals/DealTabs';
import { ActivityLogPanel } from '@/components/deals/ActivityLogPanel';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Deal, DealScopeSnapshot, DealMilestone, EscrowTransaction, DealActivityLog } from '@/types/deals';

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

export default function DealDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [data, setData] = useState<DealDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/deals/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.deal) setData(d as DealDetail);
        else setError(d.error || 'Deal bulunamadı');
      })
      .catch(() => setError('Bağlantı hatası'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" /></div>;
  if (error || !data) return <div className="text-center py-16"><p className="text-slate-400">{error}</p><Link href="/deals" className="text-accent-blue text-sm mt-3 block">← Deal listesine dön</Link></div>;

  const { deal, scope, milestones, escrow, activity, deliveries_count, revisions_count } = data;

  return (
    <div className="max-w-5xl mx-auto">
      <DealHeader deal={deal} />
      <DealTabs dealId={id} />

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

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-accent-blue">{deliveries_count}</p>
              <p className="text-xs text-slate-400 mt-1">Teslim</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-pi-gold">{revisions_count}</p>
              <p className="text-xs text-slate-400 mt-1">Revizyon</p>
            </Card>
          </div>
        </div>

        <div className="space-y-5">
          {escrow && (
            <Card className="p-4" glow="blue">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Escrow</h3>
              <p className="text-xs text-slate-400">{escrow.provider}</p>
              <p className="font-mono text-xs text-accent-blue mb-2">{escrow.external_transaction_id}</p>
              <Badge variant="blue">{escrow.status}</Badge>
              <div className="mt-2 text-xs text-slate-400 space-y-1">
                <p>Funded: <span className="text-accent-green">{escrow.currency} {escrow.funded_amount.toLocaleString()}</span></p>
                <p>Released: <span className="text-pi-gold">{escrow.currency} {escrow.released_amount.toLocaleString()}</span></p>
              </div>
            </Card>
          )}

          <Card className="p-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Son Aktivite</h3>
            <ActivityLogPanel activity={activity.slice(0, 5)} />
          </Card>
        </div>
      </div>
    </div>
  );
}
