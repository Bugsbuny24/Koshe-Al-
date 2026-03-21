'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DealHeader } from '@/components/deals/DealHeader';
import { DealTabs } from '@/components/deals/DealTabs';
import { RevisionsPanel } from '@/components/deals/RevisionsPanel';
import { Deal, DealMilestone, DealRevision } from '@/types/deals';

export default function DealRevisionsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [deal, setDeal] = useState<Deal | null>(null);
  const [milestones, setMilestones] = useState<DealMilestone[]>([]);
  const [revisions, setRevisions] = useState<DealRevision[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    const [dealRes, revisionsRes] = await Promise.all([
      fetch(`/api/deals/${id}`).then((r) => r.json()),
      fetch(`/api/deals/${id}/revisions`).then((r) => r.json()),
    ]);
    if (dealRes.deal) { setDeal(dealRes.deal); setMilestones(dealRes.milestones || []); }
    if (revisionsRes.revisions) setRevisions(revisionsRes.revisions);
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" /></div>;
  if (!deal) return <div className="text-center py-16"><Link href="/deals" className="text-accent-blue text-sm">← Geri dön</Link></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <DealHeader deal={deal} />
      <DealTabs dealId={id} />
      <RevisionsPanel dealId={id} milestones={milestones} revisions={revisions} onUpdate={load} />
    </div>
  );
}
