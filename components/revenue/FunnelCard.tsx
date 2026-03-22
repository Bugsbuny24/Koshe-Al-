import type { FunnelDefinition } from '@/types/revenue';
import { FUNNEL_STAGE_LABELS } from '@/lib/revenue/funnelTypes';

interface FunnelCardProps {
  funnel: FunnelDefinition;
}

export default function FunnelCard({ funnel }: FunnelCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-5 py-4 space-y-3">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-white">{funnel.name}</p>
        <p className="text-xs text-slate-400">{funnel.description}</p>
      </div>
      <p className="text-xs text-slate-500">
        Audience: <span className="text-slate-300">{funnel.target_audience}</span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {funnel.stages.map((s) => (
          <span
            key={s.stage}
            className="rounded-md border border-white/5 bg-bg-deep px-2 py-0.5 text-xs text-slate-400"
          >
            {FUNNEL_STAGE_LABELS[s.stage]}
          </span>
        ))}
      </div>
    </div>
  );
}
