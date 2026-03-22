import type { RiskCategory, RiskOverview } from '@/types/executive';

export const RISK_CATEGORY_LABELS: Record<RiskCategory, string> = {
  operational: 'Operational',
  financial: 'Financial',
  strategic: 'Strategic',
  reputational: 'Reputational',
  technical: 'Technical',
};

type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

type RiskMatrixEntry = {
  level: RiskLevel;
  label: string;
  color: string;
  description: string;
};

export const RISK_MATRIX_CONFIG: Record<RiskLevel, RiskMatrixEntry> = {
  low: {
    level: 'low',
    label: 'Low',
    color: 'green',
    description: 'Acceptable risk — monitor periodically.',
  },
  medium: {
    level: 'medium',
    label: 'Medium',
    color: 'yellow',
    description: 'Manageable risk — assign an owner and mitigation plan.',
  },
  high: {
    level: 'high',
    label: 'High',
    color: 'orange',
    description: 'Significant risk — prioritise mitigation immediately.',
  },
  critical: {
    level: 'critical',
    label: 'Critical',
    color: 'red',
    description: 'Severe risk — escalate to executive team now.',
  },
};

const RISK_LEVEL_MATRIX: Record<
  RiskOverview['likelihood'],
  Record<RiskOverview['impact'], RiskLevel>
> = {
  low: { low: 'low', medium: 'low', high: 'medium' },
  medium: { low: 'low', medium: 'medium', high: 'high' },
  high: { low: 'medium', medium: 'high', high: 'critical' },
};

export function getRiskLevel(
  likelihood: RiskOverview['likelihood'],
  impact: RiskOverview['impact'],
): RiskMatrixEntry {
  const level = RISK_LEVEL_MATRIX[likelihood][impact];
  return RISK_MATRIX_CONFIG[level];
}
