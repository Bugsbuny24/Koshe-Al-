import type { ExecutiveKPI } from '@/types/executive';
import { KPI_CATEGORY_LABELS, KPI_STATUS_CONFIG } from '@/lib/executive/kpiTypes';

interface ExecutiveKpiCardProps {
  kpi: ExecutiveKPI;
}

const TREND_ICON: Record<ExecutiveKPI['trend'], string> = {
  up: '↑',
  down: '↓',
  stable: '→',
};

export default function ExecutiveKpiCard({ kpi }: ExecutiveKpiCardProps) {
  const statusConfig = KPI_STATUS_CONFIG[kpi.status];

  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-5 py-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
          {KPI_CATEGORY_LABELS[kpi.category]}
        </span>
        <span className={`text-xs font-semibold text-${statusConfig.color}-400`}>
          {statusConfig.label}
        </span>
      </div>
      <p className="text-sm font-medium text-white">{kpi.name}</p>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold text-white">
          {kpi.value.toLocaleString()}
          <span className="ml-1 text-sm font-normal text-slate-400">{kpi.unit}</span>
        </p>
        <span className="mb-0.5 text-xs text-slate-400">
          {TREND_ICON[kpi.trend]} target {kpi.target.toLocaleString()} {kpi.unit}
        </span>
      </div>
      <p className="text-xs text-slate-500">{kpi.period}</p>
    </div>
  );
}
