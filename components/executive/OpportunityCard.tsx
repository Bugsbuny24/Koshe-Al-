import type { OpportunitySignal } from '@/types/executive';
import { OPPORTUNITY_TYPE_LABELS, OPPORTUNITY_TYPE_ICONS } from '@/lib/executive/opportunitySignals';

const TIME_SENSITIVITY_COLOR: Record<OpportunitySignal['time_sensitivity'], string> = {
  immediate: 'text-red-400',
  short_term: 'text-yellow-400',
  long_term: 'text-slate-400',
};

const TIME_SENSITIVITY_LABELS: Record<OpportunitySignal['time_sensitivity'], string> = {
  immediate: 'Immediate',
  short_term: 'Short-term',
  long_term: 'Long-term',
};

interface OpportunityCardProps {
  opportunity: OpportunitySignal;
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-5 py-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-base">
          {OPPORTUNITY_TYPE_ICONS[opportunity.type]}{' '}
          <span className="text-xs font-medium text-slate-400">
            {OPPORTUNITY_TYPE_LABELS[opportunity.type]}
          </span>
        </span>
        <span className={`text-xs font-semibold ${TIME_SENSITIVITY_COLOR[opportunity.time_sensitivity]}`}>
          {TIME_SENSITIVITY_LABELS[opportunity.time_sensitivity]}
        </span>
      </div>
      <p className="text-sm font-semibold text-white">{opportunity.title}</p>
      <p className="text-xs text-slate-400">{opportunity.description}</p>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span>Impact: <span className="text-slate-300">{opportunity.potential_impact}</span></span>
        <span>·</span>
        <span>Confidence: <span className="text-slate-300">{opportunity.confidence}%</span></span>
      </div>
    </div>
  );
}
