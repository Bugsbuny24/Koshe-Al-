import type { GrowthAsset } from '@/types/revenue';
import { GROWTH_ASSET_TYPE_LABELS } from '@/lib/revenue/growthAssets';
import { FUNNEL_STAGE_LABELS } from '@/lib/revenue/funnelTypes';

const STATUS_COLOR: Record<GrowthAsset['status'], string> = {
  planned: 'text-yellow-400',
  in_progress: 'text-blue-400',
  ready: 'text-violet-400',
  deployed: 'text-green-400',
};

interface GrowthAssetCardProps {
  asset: GrowthAsset;
}

export default function GrowthAssetCard({ asset }: GrowthAssetCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-5 py-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
          {GROWTH_ASSET_TYPE_LABELS[asset.type]}
        </span>
        <span className={`text-xs font-semibold capitalize ${STATUS_COLOR[asset.status]}`}>
          {asset.status.replace(/_/g, ' ')}
        </span>
      </div>
      <p className="text-sm font-semibold text-white">{asset.name}</p>
      <p className="text-xs text-slate-400">{asset.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {asset.funnel_stages.map((stage) => (
          <span
            key={stage}
            className="rounded-md border border-white/5 bg-bg-deep px-2 py-0.5 text-xs text-slate-400"
          >
            {FUNNEL_STAGE_LABELS[stage]}
          </span>
        ))}
      </div>
    </div>
  );
}
