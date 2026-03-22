import type { InsightType } from '@/types/intelligence';

type InsightTypeConfig = {
  label: string;
  icon: string;
  color: string;
  description: string;
};

export const INSIGHT_TYPE_LABELS: Record<InsightType, string> = {
  pattern: 'Pattern',
  anomaly: 'Anomaly',
  trend: 'Trend',
  opportunity: 'Opportunity',
  risk: 'Risk',
};

export const INSIGHT_TYPE_ICONS: Record<InsightType, string> = {
  pattern: '🔁',
  anomaly: '⚠️',
  trend: '📈',
  opportunity: '💡',
  risk: '🚨',
};

export function getInsightTypeConfig(type: InsightType): InsightTypeConfig {
  const colors: Record<InsightType, string> = {
    pattern: 'text-accent-blue',
    anomaly: 'text-orange-400',
    trend: 'text-accent-green',
    opportunity: 'text-pi-gold',
    risk: 'text-red-400',
  };
  const descriptions: Record<InsightType, string> = {
    pattern: 'A recurring pattern detected across data points.',
    anomaly: 'An unusual deviation from expected behaviour.',
    trend: 'A directional movement observed over time.',
    opportunity: 'A detected opening for growth or improvement.',
    risk: 'A potential threat or failure point identified.',
  };
  return {
    label: INSIGHT_TYPE_LABELS[type],
    icon: INSIGHT_TYPE_ICONS[type],
    color: colors[type],
    description: descriptions[type],
  };
}
