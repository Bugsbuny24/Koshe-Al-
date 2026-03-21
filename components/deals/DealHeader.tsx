import { Badge } from '@/components/ui/Badge';
import { Deal } from '@/types/deals';
import { DEAL_STATUS_LABEL, DEAL_STATUS_VARIANT } from '@/lib/deals/status';

type Props = { deal: Deal };

export function DealHeader({ deal }: Props) {
  const variant = DEAL_STATUS_VARIANT[deal.status as keyof typeof DEAL_STATUS_VARIANT] || 'gray';
  const label = DEAL_STATUS_LABEL[deal.status as keyof typeof DEAL_STATUS_LABEL] || deal.status;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold text-white">{deal.title}</h1>
        <Badge variant={variant}>{label}</Badge>
      </div>
      <div className="flex items-center gap-4 text-sm text-slate-400">
        <span className="font-mono font-semibold text-white">
          {deal.currency} {(deal.total_amount ?? 0).toLocaleString()}
        </span>
        <span>·</span>
        <span>Oluşturulma: {new Date(deal.created_at).toLocaleDateString('tr-TR')}</span>
      </div>
    </div>
  );
}

