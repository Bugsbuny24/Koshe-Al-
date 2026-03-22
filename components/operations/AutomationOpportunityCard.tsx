import type { AutomationOpportunity } from '@/types/operations';

const LEVEL_LABEL: Record<AutomationOpportunity['level'], string> = {
  quick_win: 'Quick Win',
  medium_effort: 'Medium Effort',
  high_impact_project: 'High Impact Project',
};

const LEVEL_COLOR: Record<AutomationOpportunity['level'], string> = {
  quick_win: 'text-green-400',
  medium_effort: 'text-yellow-400',
  high_impact_project: 'text-violet-400',
};

interface AutomationOpportunityCardProps {
  opportunity: AutomationOpportunity;
}

export default function AutomationOpportunityCard({ opportunity }: AutomationOpportunityCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-5 py-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className={`text-xs font-semibold ${LEVEL_COLOR[opportunity.level]}`}>
          {LEVEL_LABEL[opportunity.level]}
        </span>
        <span className="text-xs text-slate-400">
          ~{opportunity.estimated_time_saved_hours_per_week}h/wk saved
        </span>
      </div>
      <p className="text-sm font-semibold text-white">{opportunity.title}</p>
      <p className="text-xs text-slate-400">{opportunity.description}</p>
      <p className="text-xs text-slate-500">
        Process: <span className="text-slate-300">{opportunity.affected_process}</span>
      </p>
    </div>
  );
}
