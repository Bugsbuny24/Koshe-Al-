import { Badge } from '@/components/ui/Badge';
import { Deal } from '@/types/deals';

type Props = { deal: Deal };

const statusVariant: Record<string, 'blue' | 'green' | 'gold' | 'red' | 'gray'> = {
  draft: 'gray', scoped: 'blue', active: 'green', completed: 'green', cancelled: 'red',
};
const statusLabel: Record<string, string> = {
  draft: 'Taslak', scoped: 'Scope Kilitli', active: 'Aktif', completed: 'Tamamlandı', cancelled: 'İptal',
};

export function DealHeader({ deal }: Props) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold text-white">{deal.title}</h1>
        <Badge variant={statusVariant[deal.status] || 'gray'}>{statusLabel[deal.status] || deal.status}</Badge>
      </div>
      <div className="flex items-center gap-4 text-sm text-slate-400">
        <span className="font-mono font-semibold text-white">{deal.currency} {deal.total_amount.toLocaleString()}</span>
        <span>·</span>
        <span>Oluşturulma: {new Date(deal.created_at).toLocaleDateString('tr-TR')}</span>
        {deal.buyer_id && <span>· Buyer: <span className="text-slate-300 font-mono text-xs">{deal.buyer_id.slice(0, 8)}…</span></span>}
        {deal.seller_id && <span>· Seller: <span className="text-slate-300 font-mono text-xs">{deal.seller_id.slice(0, 8)}…</span></span>}
      </div>
    </div>
  );
}
