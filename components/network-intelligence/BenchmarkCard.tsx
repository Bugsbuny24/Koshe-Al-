import type { BenchmarkMetric } from '@/types/network-intelligence';
import { BENCHMARK_METRIC_TYPE_LABELS } from '@/lib/network-intelligence/benchmarkTypes';
import { PRIVACY_LEVEL_LABELS } from '@/lib/network-intelligence/privacyRules';

interface BenchmarkCardProps {
  metric: BenchmarkMetric;
}

export default function BenchmarkCard({ metric }: BenchmarkCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{metric.name}</p>
          <p className="text-xs text-slate-500">{BENCHMARK_METRIC_TYPE_LABELS[metric.type]}</p>
        </div>
        <span className="shrink-0 rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-xs text-blue-400">
          {PRIVACY_LEVEL_LABELS[metric.privacy_level]}
        </span>
      </div>
      <p className="text-xs text-slate-400">{metric.description}</p>
      <div className="flex items-end gap-2">
        <p className="text-xl font-bold text-white">{metric.aggregate_value}</p>
        <p className="text-xs text-slate-400 mb-0.5">{metric.unit}</p>
      </div>
      <p className="text-xs text-slate-600">
        Sample: {metric.sample_size_range} · {metric.period}
      </p>
      {/* Privacy-first notice */}
      <p className="text-xs text-slate-600 border-t border-white/5 pt-2">
        🔒 Fully anonymized aggregate — no individual attribution
      </p>
    </div>
  );
}
