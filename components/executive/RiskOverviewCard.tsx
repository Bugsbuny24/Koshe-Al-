import type { RiskOverview } from '@/types/executive';
import { RISK_CATEGORY_LABELS, getRiskLevel } from '@/lib/executive/riskModels';

const STATUS_COLOR: Record<RiskOverview['status'], string> = {
  identified: 'text-yellow-400',
  mitigating: 'text-blue-400',
  resolved: 'text-green-400',
  accepted: 'text-slate-400',
};

const RISK_LEVEL_TEXT_COLOR: Record<string, string> = {
  low: 'text-green-400',
  medium: 'text-yellow-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
};

interface RiskOverviewCardProps {
  risk: RiskOverview;
}

export default function RiskOverviewCard({ risk }: RiskOverviewCardProps) {
  const riskLevel = getRiskLevel(risk.likelihood, risk.impact);

  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-5 py-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
          {RISK_CATEGORY_LABELS[risk.category]}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${RISK_LEVEL_TEXT_COLOR[riskLevel.level]}`}>
            {riskLevel.label}
          </span>
          <span className={`text-xs font-semibold capitalize ${STATUS_COLOR[risk.status]}`}>
            {risk.status}
          </span>
        </div>
      </div>
      <p className="text-sm font-semibold text-white">{risk.title}</p>
      <p className="text-xs text-slate-400">{risk.description}</p>
      <p className="text-xs text-slate-500">
        Mitigation: <span className="text-slate-300">{risk.mitigation}</span>
      </p>
      {risk.owner && (
        <p className="text-xs text-slate-500">
          Owner: <span className="text-slate-300">{risk.owner}</span>
        </p>
      )}
    </div>
  );
}
