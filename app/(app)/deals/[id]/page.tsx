'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DealHeader } from '@/components/deals/DealHeader';
import { DealTabs } from '@/components/deals/DealTabs';
import { ActivityLogPanel } from '@/components/deals/ActivityLogPanel';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Deal, DealScopeSnapshot, DealMilestone, EscrowTransaction,
  DealActivityLog,
} from '@/types/deals';
import {
  MILESTONE_STATUS_LABEL,
  MILESTONE_STATUS_VARIANT,
  ESCROW_STATUS_LABEL,
  ESCROW_STATUS_VARIANT,
} from '@/lib/deals/status';

type DealDetail = {
  deal: Deal;
  scope: DealScopeSnapshot | null;
  milestones: DealMilestone[];
  escrow: EscrowTransaction | null;
  activity: DealActivityLog[];
  deliveries_count: number;
  revisions_count: number;
  open_revisions_count: number;
  approved_milestones_count: number;
  latest_delivery: { id: string; milestone_id: string; created_at: string } | null;
};

function StatCard({
  label,
  value,
  sub,
  accent,
  placeholder,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  placeholder?: boolean;
}) {
  return (
    <Card className="p-4">
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-lg font-bold ${placeholder ? 'text-slate-600' : (accent || 'text-white')}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </Card>
  );
}

export default function DealDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [data, setData] = useState<DealDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/deals/${id}`);
      const d = await res.json();
      if (!res.ok || !d.deal) {
        setError(d.error || 'Deal bulunamadı');
      } else {
        setData(d as DealDetail);
      }
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">{error}</p>
        <Link href="/deals" className="text-accent-blue text-sm mt-3 block">← Deal listesine dön</Link>
      </div>
    );
  }

  const {
    deal, scope, milestones, escrow, activity,
    deliveries_count, revisions_count, open_revisions_count,
    approved_milestones_count, latest_delivery,
  } = data;

  const latestDeliveryDate = latest_delivery
    ? new Date(latest_delivery.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="max-w-5xl mx-auto">
      <DealHeader deal={deal} />
      <DealTabs dealId={id} />

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        <StatCard
          label="Scope"
          value={scope ? '🔒 Kilitli' : 'Kilitlenmedi'}
          sub={scope ? `v${scope.version}` : undefined}
          accent={scope ? 'text-green-400' : undefined}
          placeholder={!scope}
        />
        <StatCard
          label="Milestones"
          value={milestones.length === 0 ? '—' : milestones.length}
          sub={milestones.length > 0 ? `${approved_milestones_count} onaylandı` : undefined}
          placeholder={milestones.length === 0}
        />
        <StatCard
          label="Teslim"
          value={deliveries_count === 0 ? '—' : deliveries_count}
          sub={latestDeliveryDate ?? undefined}
          placeholder={deliveries_count === 0}
        />
        <StatCard
          label="Açık Revizyon"
          value={revisions_count === 0 ? '—' : open_revisions_count}
          sub={revisions_count > 0 ? `${revisions_count} toplam` : undefined}
          accent={open_revisions_count > 0 ? 'text-pi-gold' : undefined}
          placeholder={revisions_count === 0}
        />
        <StatCard
          label="Escrow"
          value={escrow ? (ESCROW_STATUS_LABEL[escrow.status] || escrow.status) : 'Bağlı değil'}
          sub={escrow ? `${escrow.currency} ${(escrow.funded_amount ?? 0).toLocaleString()} funded` : undefined}
          accent={escrow ? 'text-accent-blue' : undefined}
          placeholder={!escrow}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-5">
          {/* Scope card */}
          {scope ? (
            <Card className="p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Kilitli Scope
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">{scope.summary}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="green">v{scope.version}</Badge>
                <span className="text-xs text-slate-600">
                  {new Date(scope.locked_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </Card>
          ) : (
            <Card className="p-5 text-center border border-dashed border-white/10">
              <p className="text-slate-500 text-sm mb-3">Scope henüz kilitlenmedi</p>
              <Link href={`/deals/${id}/scope`} className="text-accent-blue text-sm hover:underline">
                Scope Kilitle →
              </Link>
            </Card>
          )}

          {/* Milestones summary */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Milestones
              </h3>
              <Link href={`/deals/${id}/milestones`} className="text-xs text-accent-blue hover:underline">
                Tümünü gör →
              </Link>
            </div>
            {milestones.length === 0 ? (
              <p className="text-slate-500 text-sm">
                Henüz milestone yok.{' '}
                <Link href={`/deals/${id}/milestones`} className="text-accent-blue hover:underline">
                  Oluştur →
                </Link>
              </p>
            ) : (
              <div className="space-y-2">
                {milestones.slice(0, 4).map((m) => {
                  const statusVariant = MILESTONE_STATUS_VARIANT[m.status as keyof typeof MILESTONE_STATUS_VARIANT] || 'gray';
                  const statusLabel = MILESTONE_STATUS_LABEL[m.status as keyof typeof MILESTONE_STATUS_LABEL] || m.status;
                  return (
                    <div key={m.id} className="flex items-center gap-3">
                      <Badge variant={statusVariant}>{statusLabel}</Badge>
                      <span className="text-sm text-slate-300 flex-1 truncate">{m.title}</span>
                      <span className="text-sm font-mono text-white flex-shrink-0">
                        {deal.currency} {(m.amount ?? 0).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
                {milestones.length > 4 && (
                  <p className="text-xs text-slate-600 pt-1">+{milestones.length - 4} daha…</p>
                )}
              </div>
            )}
          </Card>

          {/* Quick stats row */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">Teslim</p>
              <p className={`text-xl font-bold ${deliveries_count > 0 ? 'text-white' : 'text-slate-600'}`}>
                {deliveries_count || '—'}
              </p>
              {latestDeliveryDate && <p className="text-xs text-slate-600 mt-0.5">{latestDeliveryDate}</p>}
              {!latestDeliveryDate && <p className="text-xs text-slate-600 mt-0.5">Henüz teslim yok</p>}
            </Card>
            <Card className="p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">Açık Revizyon</p>
              <p className={`text-xl font-bold ${open_revisions_count > 0 ? 'text-pi-gold' : 'text-slate-600'}`}>
                {revisions_count > 0 ? open_revisions_count : '—'}
              </p>
              {revisions_count > 0
                ? <p className="text-xs text-slate-600 mt-0.5">{revisions_count} toplam</p>
                : <p className="text-xs text-slate-600 mt-0.5">Henüz revizyon yok</p>
              }
            </Card>
            <Card className="p-3 text-center">
              <p className="text-xs text-slate-500 mb-1">Onaylanan</p>
              <p className={`text-xl font-bold ${approved_milestones_count > 0 ? 'text-green-400' : 'text-slate-600'}`}>
                {milestones.length > 0 ? `${approved_milestones_count}/${milestones.length}` : '—'}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">milestone</p>
            </Card>
          </div>
        </div>

        <div className="space-y-5">
          {/* Escrow card */}
          {escrow ? (
            <Card className="p-4" glow="blue">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Escrow</h3>
                <Badge variant={ESCROW_STATUS_VARIANT[escrow.status] || 'gray'}>
                  {ESCROW_STATUS_LABEL[escrow.status] || escrow.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">{escrow.provider}</p>
              <p className="font-mono text-xs text-accent-blue mb-3 truncate">{escrow.external_transaction_id}</p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Toplam</span>
                  <span className="text-white font-mono">{escrow.currency} {(escrow.amount ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Funded</span>
                  <span className="text-accent-green font-mono">{escrow.currency} {(escrow.funded_amount ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Released</span>
                  <span className="text-pi-gold font-mono">{escrow.currency} {(escrow.released_amount ?? 0).toLocaleString()}</span>
                </div>
                {escrow.last_synced_at && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Son sync</span>
                    <span className="text-slate-400">{new Date(escrow.last_synced_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                )}
              </div>
              <Link href={`/deals/${id}/escrow`} className="text-xs text-accent-blue hover:underline mt-3 block">
                Escrow yönet →
              </Link>
            </Card>
          ) : (
            <Card className="p-4 border border-dashed border-white/10">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Escrow</h3>
              <p className="text-slate-600 text-sm mb-2">Escrow bağlı değil</p>
              <Link href={`/deals/${id}/escrow`} className="text-xs text-accent-blue hover:underline">
                Escrow bağla →
              </Link>
            </Card>
          )}

          {/* Activity log */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Son Aktivite</h3>
              {activity.length > 5 && (
                <span className="text-xs text-slate-600">{activity.length} kayıt</span>
              )}
            </div>
            {activity.length === 0 ? (
              <p className="text-slate-600 text-xs text-center py-2">Henüz aktivite yok</p>
            ) : (
              <ActivityLogPanel activity={activity.slice(0, 5)} />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

