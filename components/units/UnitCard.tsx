import type { BusinessUnit } from '@/types/units';
import { UNIT_TYPE_LABELS, UNIT_TYPE_ICONS, UNIT_STATUS_CONFIG } from '@/lib/units/unitTypes';

interface UnitCardProps {
  unit: BusinessUnit;
}

export default function UnitCard({ unit }: UnitCardProps) {
  const statusConfig = UNIT_STATUS_CONFIG[unit.status];

  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{UNIT_TYPE_ICONS[unit.type]}</span>
          <div>
            <p className="text-sm font-semibold text-white">{unit.name}</p>
            <p className="text-xs text-slate-500">{UNIT_TYPE_LABELS[unit.type]}</p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium ${statusConfig.badgeClass}`}
        >
          {statusConfig.label}
        </span>
      </div>
      <p className="text-xs text-slate-400">{unit.description}</p>
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>{unit.goals.length} goals</span>
        <span>{unit.routing_rules.length} routing rules</span>
      </div>
    </div>
  );
}
