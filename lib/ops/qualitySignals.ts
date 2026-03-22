import type { QualitySignalType } from '@/types/ops';

export const QUALITY_SIGNAL_LABELS: Record<QualitySignalType, string> = {
  completion_rate: 'Completion Rate',
  revision_rate: 'Revision Rate',
  approval_rate: 'Approval Rate',
  error_rate: 'Error Rate',
  satisfaction_score: 'Satisfaction Score',
};

export const SIGNAL_THRESHOLDS: Record<QualitySignalType, { good: number; warning: number }> = {
  completion_rate: { good: 90, warning: 75 },
  revision_rate: { good: 10, warning: 25 },
  approval_rate: { good: 85, warning: 70 },
  error_rate: { good: 5, warning: 15 },
  satisfaction_score: { good: 80, warning: 60 },
};

export type QualitySignalConfig = {
  label: string;
  thresholds: { good: number; warning: number };
  higherIsBetter: boolean;
};

export function getQualitySignalConfig(type: QualitySignalType): QualitySignalConfig {
  const higherIsBetter: Record<QualitySignalType, boolean> = {
    completion_rate: true,
    revision_rate: false,
    approval_rate: true,
    error_rate: false,
    satisfaction_score: true,
  };

  return {
    label: QUALITY_SIGNAL_LABELS[type],
    thresholds: SIGNAL_THRESHOLDS[type],
    higherIsBetter: higherIsBetter[type],
  };
}
