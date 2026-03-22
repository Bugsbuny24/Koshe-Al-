import type { RoutingRule } from '@/types/units';
import { ROUTING_RULE_CONFIGS } from '@/lib/units/unitRoutes';

interface UnitRoutingCardProps {
  rule: RoutingRule;
}

export default function UnitRoutingCard({ rule }: UnitRoutingCardProps) {
  const config = ROUTING_RULE_CONFIGS[rule.type];

  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-4 space-y-2">
      <div className="flex items-start gap-2">
        <span className="text-base">{config.icon}</span>
        <div>
          <p className="text-sm font-semibold text-white">{rule.name}</p>
          <p className="text-xs text-slate-500">{config.label}</p>
        </div>
      </div>
      <p className="text-xs text-slate-400">{rule.description}</p>
      <p className="text-xs text-slate-600">Priority: {rule.priority}</p>
    </div>
  );
}
