import type { DecisionContext } from '@/types/executive';

const DECISION_TYPE_LABELS: Record<DecisionContext['type'], string> = {
  strategic: 'Strategic',
  tactical: 'Tactical',
  operational: 'Operational',
  risk_response: 'Risk Response',
};

const RISK_COLOR: Record<'low' | 'medium' | 'high', string> = {
  low: 'text-green-400',
  medium: 'text-yellow-400',
  high: 'text-red-400',
};

interface DecisionSupportCardProps {
  decision: DecisionContext;
}

export default function DecisionSupportCard({ decision }: DecisionSupportCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-5 py-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
          {DECISION_TYPE_LABELS[decision.type]}
        </span>
        {decision.deadline && (
          <span className="text-xs text-slate-400">Due {decision.deadline}</span>
        )}
      </div>
      <p className="text-sm font-semibold text-white">{decision.title}</p>
      <p className="text-xs text-slate-400">{decision.description}</p>
      {decision.options.length > 0 && (
        <div className="space-y-2">
          {decision.options.map((opt) => (
            <div
              key={opt.id}
              className="rounded-lg border border-white/5 bg-bg-deep px-3 py-2 space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-white">{opt.title}</p>
                <span className={`text-xs font-semibold capitalize ${RISK_COLOR[opt.risk_level]}`}>
                  {opt.risk_level} risk
                </span>
              </div>
              <p className="text-xs text-slate-400">{opt.description}</p>
            </div>
          ))}
        </div>
      )}
      {decision.recommendation && (
        <p className="text-xs text-accent-blue">
          ✦ Recommendation: {decision.recommendation}
        </p>
      )}
    </div>
  );
}
