import type { RiskSignalLevel } from '@/types/intelligence';

type RiskSignalConfig = {
  label: string;
  color: string;
  bgColor: string;
  description: string;
};

export const RISK_SIGNAL_LEVEL_CONFIG: Record<RiskSignalLevel, RiskSignalConfig> = {
  low: {
    label: 'Low',
    color: 'text-accent-green',
    bgColor: 'bg-green-500/10',
    description: 'Minor signal; monitor but no immediate action required.',
  },
  medium: {
    label: 'Medium',
    color: 'text-pi-gold',
    bgColor: 'bg-yellow-500/10',
    description: 'Noteworthy signal; review and plan a mitigation response.',
  },
  high: {
    label: 'High',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    description: 'Significant risk; take action in the near term.',
  },
  critical: {
    label: 'Critical',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    description: 'Immediate threat; escalate and act now.',
  },
};

export const RISK_SIGNAL_THRESHOLDS: Record<RiskSignalLevel, number> = {
  low: 0.25,
  medium: 0.5,
  high: 0.75,
  critical: 0.9,
};

export function getRiskSignalConfig(level: RiskSignalLevel): RiskSignalConfig {
  return RISK_SIGNAL_LEVEL_CONFIG[level];
}
