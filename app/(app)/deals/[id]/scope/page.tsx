'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DealHeader } from '@/components/deals/DealHeader';
import { DealTabs } from '@/components/deals/DealTabs';
import { ScopeLockPanel } from '@/components/deals/ScopeLockPanel';
import { Deal, DealScopeSnapshot } from '@/types/deals';

export default function DealScopePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [deal, setDeal] = useState<Deal | null>(null);
  const [scope, setScope] = useState<DealScopeSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/deals/${id}`);
      const d = await res.json();
      if (d.deal) { setDeal(d.deal); setScope(d.scope); }
    } catch (err) {
      console.error('Scope page load error:', err);
      // keep deal null so error state renders
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" /></div>;
  if (!deal) return <div className="text-center py-16"><Link href="/deals" className="text-accent-blue text-sm">← Geri dön</Link></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <DealHeader deal={deal} />
      <DealTabs dealId={id} />
      <ScopeLockPanel dealId={id} scope={scope} onUpdate={load} />
    </div>
  );
}
