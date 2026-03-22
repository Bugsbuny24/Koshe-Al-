import type { Recommendation } from '@/types/intelligence';
import { getRecommendationConfig, RECOMMENDATION_IMPACT_COLORS } from '@/lib/intelligence/recommendationTypes';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const config = getRecommendationConfig(recommendation.type);
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-3">
      <p className={`text-sm font-medium ${config.color}`}>{recommendation.title}</p>
      <p className="mt-1 text-xs text-slate-400">{recommendation.description}</p>
      <p className="mt-1 text-xs text-slate-500">
        Impact:{' '}
        <span className={RECOMMENDATION_IMPACT_COLORS[recommendation.impact_level]}>
          {recommendation.impact_level}
        </span>{' '}
        · Effort: {recommendation.effort_level}
      </p>
    </div>
  );
}
