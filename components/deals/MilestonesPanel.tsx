'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DealMilestone } from '@/types/deals';

type Props = { dealId: string; milestones: DealMilestone[]; onUpdate: () => void };

const milestoneStatusVariant: Record<string, 'blue' | 'green' | 'gold' | 'red' | 'gray'> = {
  pending: 'gray', in_progress: 'blue', delivered: 'gold', revision_requested: 'red', approved: 'green',
};
const milestoneStatusLabel: Record<string, string> = {
  pending: 'Bekliyor', in_progress: 'Devam Ediyor', delivered: 'Teslim Edildi', revision_requested: 'Revizyon', approved: 'Onaylandı',
};

export function MilestonesPanel({ dealId, milestones, onUpdate }: Props) {
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
          {milestones.map((m, i) => (
            <Card key={m.id} className="p-4 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-xs font-bold text-accent-blue flex-shrink-0">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white text-sm">{m.title}</p>
                  <Badge variant={milestoneStatusVariant[m.status] || 'gray'}>{milestoneStatusLabel[m.status] || m.status}</Badge>
                </div>
                {m.description && <p className="text-xs text-slate-400 mt-0.5 truncate">{m.description}</p>}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-mono font-semibold text-white text-sm">${m.amount.toLocaleString()}</p>
                {m.deadline && <p className="text-xs text-slate-500">{new Date(m.deadline).toLocaleDateString('tr-TR')}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
