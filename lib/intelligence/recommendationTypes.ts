import type { RecommendationType } from '@/types/intelligence';

type RecommendationConfig = {
  label: string;
  color: string;
  description: string;
};

export const RECOMMENDATION_TYPE_LABELS: Record<RecommendationType, string> = {
  workflow_optimization: 'Workflow Optimization',
  resource_allocation: 'Resource Allocation',
  process_improvement: 'Process Improvement',
  risk_mitigation: 'Risk Mitigation',
  growth_action: 'Growth Action',
};

export const RECOMMENDATION_IMPACT_COLORS: Record<'low' | 'medium' | 'high', string> = {
  low: 'text-slate-400',
  medium: 'text-pi-gold',
  high: 'text-accent-green',
};

export function getRecommendationConfig(type: RecommendationType): RecommendationConfig {
  const colors: Record<RecommendationType, string> = {
    workflow_optimization: 'text-accent-blue',
    resource_allocation: 'text-pi-gold',
    process_improvement: 'text-accent-green',
    risk_mitigation: 'text-red-400',
    growth_action: 'text-accent-green',
  };
  const descriptions: Record<RecommendationType, string> = {
    workflow_optimization: 'Suggestions to streamline or automate workflows.',
    resource_allocation: 'Guidance on distributing people, budget, or compute.',
    process_improvement: 'Tactical changes to improve quality or throughput.',
    risk_mitigation: 'Actions to reduce or eliminate detected risks.',
    growth_action: 'Steps to capture identified growth opportunities.',
  };
  return {
    label: RECOMMENDATION_TYPE_LABELS[type],
    color: colors[type],
    description: descriptions[type],
  };
}
