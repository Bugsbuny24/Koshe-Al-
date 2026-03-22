import type { UnitPerformanceMetric } from '@/types/units';

interface UnitPerformanceCardProps {
  metric: UnitPerformanceMetric;
}

const trendIcons = {
  up: '↑',
  down: '↓',
  stable: '→',
} as const;

const trendColors = {
  up: 'text-green-400',
  down: 'text-red-400',
  stable: 'text-slate-400',
} as const;

export default function UnitPerformanceCard({ metric }: UnitPerformanceCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-4 space-y-2">
      <p className="text-xs text-slate-500 uppercase tracking-widest">{metric.metric_name}</p>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold text-white">{metric.value}</p>
        <p className="text-sm text-slate-400 mb-0.5">{metric.unit_label}</p>
        <span className={`ml-auto text-sm font-semibold ${trendColors[metric.trend]}`}>
          {trendIcons[metric.trend]}
        </span>
      </div>
      <p className="text-xs text-slate-600">
        Measured {new Date(metric.measured_at).toLocaleDateString()}
      </p>
    </div>
  );
}
