import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Deal, DealMilestone, EscrowTransaction } from '@/types/deals';
import { DEAL_STATUS_LABEL, DEAL_STATUS_VARIANT, ESCROW_STATUS_LABEL } from '@/lib/deals/status';

type Props = {
  deal: Deal & {
    deal_milestones?: DealMilestone[];
    escrow_transactions?: EscrowTransaction[];
  };
};

export function DealCard({ deal }: Props) {
  const activeMilestone =
    deal.deal_milestones?.find((m) => m.status === 'in_progress') || deal.deal_milestones?.[0];
  const escrow = deal.escrow_transactions?.[0];

  const variant = DEAL_STATUS_VARIANT[deal.status as keyof typeof DEAL_STATUS_VARIANT] || 'gray';
  const label = DEAL_STATUS_LABEL[deal.status as keyof typeof DEAL_STATUS_LABEL] || deal.status;

  return (
    <Link href={`/deals/${deal.id}`}>
      <Card hover className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white text-sm truncate flex-1">{deal.title}</h3>
          <Badge variant={variant}>{label}</Badge>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="font-mono font-semibold text-white">
            {deal.currency} {(deal.total_amount ?? 0).toLocaleString()}
          </span>
          {activeMilestone && <span className="truncate">📍 {activeMilestone.title}</span>}
        </div>
        {escrow && (
          <div className="text-xs text-slate-500">
            Escrow: <span className="text-slate-300">{ESCROW_STATUS_LABEL[escrow.status] || escrow.status}</span>
            {(escrow.funded_amount ?? 0) > 0 && (
              <span className="ml-1">
                · {deal.currency} {(escrow.funded_amount ?? 0).toLocaleString()} funded
              </span>
            )}
          </div>
        )}
        <div className="text-xs text-slate-600">
          {new Date(deal.updated_at).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </div>
      </Card>
    </Link>
  );
}

