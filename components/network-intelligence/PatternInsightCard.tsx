import type { PatternInsight } from '@/types/network-intelligence';
import { PATTERN_TYPE_CONFIGS } from '@/lib/network-intelligence/patternTypes';
import { PRIVACY_LEVEL_LABELS } from '@/lib/network-intelligence/privacyRules';

interface PatternInsightCardProps {
  insight: PatternInsight;
}

export default function PatternInsightCard({ insight }: PatternInsightCardProps) {
  const config = PATTERN_TYPE_CONFIGS[insight.type];

  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-4 space-y-3">
      <div className="flex items-start gap-2">
        <span className="text-base">{config.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-white">{insight.title}</p>
            <span className="shrink-0 rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-xs text-blue-400">
              {PRIVACY_LEVEL_LABELS[insight.privacy_level]}
            </span>
          </div>
          <p className="text-xs text-slate-500">{config.label}</p>
        </div>
      </div>
      <p className="text-xs text-slate-400">{insight.description}</p>
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
        <span>{insight.sample_description}</span>
      </div>
      <p className="text-xs text-slate-600 border-t border-white/5 pt-2">
        🔒 {insight.sample_description}
      </p>
    </div>
  );
}
