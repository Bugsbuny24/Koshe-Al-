'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DealCard } from '@/components/deals/DealCard';
import { Button } from '@/components/ui/Button';
import { Deal, DealMilestone, EscrowTransaction } from '@/types/deals';

type DealWithRelations = Deal & {
  deal_milestones?: DealMilestone[];
  escrow_transactions?: EscrowTransaction[];
};

export default function DealsPage() {
  const [deals, setDeals] = useState<DealWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/deals')
      .then((r) => r.json())
      .then((d) => {
        if (d.deals) setDeals(d.deals);
        else setError(d.error || 'Hata oluştu');
      })
      .catch(() => setError('Bağlantı hatası'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Workspace / Jobs</h1>
          <p className="text-slate-400 text-sm mt-1">İşlerini takip et — scope, fazlar, teslim ve revizyon</p>
        </div>
        <Link href="/deals/new">
          <Button>+ Yeni İş</Button>
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && <p className="text-red-400 text-center py-8">{error}</p>}

      {!loading && !error && deals.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🗂️</div>
          <p className="text-slate-400 mb-4">Henüz aktif iş yok.</p>
          <Link href="/deals/new">
            <Button>İlk İşi Başlat</Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}
