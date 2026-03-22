import type { HealthStatus, WorkflowHealthMetric } from '@/types/ops';

export type HealthStatusConfig = {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
};

export const HEALTH_STATUS_CONFIG: Record<HealthStatus, HealthStatusConfig> = {
  healthy: {
    label: 'Healthy',
    color: 'text-accent-green',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
  warning: {
    label: 'Warning',
    color: 'text-pi-gold',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
  critical: {
    label: 'Critical',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
  },
  unknown: {
    label: 'Unknown',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/20',
  },
};

export function getHealthStatusConfig(status: HealthStatus): HealthStatusConfig {
  return HEALTH_STATUS_CONFIG[status];
}

export function computeOverallHealth(metrics: WorkflowHealthMetric[]): HealthStatus {
  if (metrics.length === 0) return 'unknown';
  if (metrics.some((m) => m.status === 'critical')) return 'critical';
  if (metrics.some((m) => m.status === 'warning')) return 'warning';
  if (metrics.every((m) => m.status === 'healthy')) return 'healthy';
  return 'unknown';
}
