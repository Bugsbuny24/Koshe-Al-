import type { OfferDefinition } from '@/types/revenue';
import { OFFER_TYPE_LABELS, OFFER_TYPE_ICONS } from '@/lib/revenue/offerTypes';

const STATUS_COLOR: Record<OfferDefinition['status'], string> = {
  draft: 'text-yellow-400',
  active: 'text-green-400',
  archived: 'text-slate-500',
};

interface OfferSystemCardProps {
  offer: OfferDefinition;
}

export default function OfferSystemCard({ offer }: OfferSystemCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-5 py-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-base">
          {OFFER_TYPE_ICONS[offer.type]}{' '}
          <span className="text-xs font-medium text-slate-400">
            {OFFER_TYPE_LABELS[offer.type]}
          </span>
        </span>
        <span className={`text-xs font-semibold capitalize ${STATUS_COLOR[offer.status]}`}>
          {offer.status}
        </span>
      </div>
      <p className="text-sm font-semibold text-white">{offer.name}</p>
      <p className="text-xs text-slate-400">{offer.value_proposition}</p>
      <p className="text-xs text-slate-500">
        Segment: <span className="text-slate-300">{offer.target_segment}</span>
        {offer.price_range && (
          <> · <span className="text-slate-300">{offer.price_range}</span></>
        )}
      </p>
    </div>
  );
}
