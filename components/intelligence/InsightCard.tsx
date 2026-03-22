import type { Insight } from '@/types/intelligence';
import { getInsightTypeConfig } from '@/lib/intelligence/insightTypes';

interface InsightCardProps {
  insight: Insight;
}

export default function InsightCard({ insight }: InsightCardProps) {
  const config = getInsightTypeConfig(insight.type);
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-3">
      <div className="flex items-center gap-2">
        <span>{config.icon}</span>
        <p className={`text-sm font-medium ${config.color}`}>{insight.title}</p>
      </div>
      <p className="mt-1 text-xs text-slate-400">{insight.description}</p>
      <p className="mt-1 text-xs text-slate-500">
        Confidence: {Math.round(insight.confidence * 100)}% · {insight.data_points} data points
      </p>
    </div>
  );
}
