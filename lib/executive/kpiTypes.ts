import type { KPICategory, ExecutiveKPI } from '@/types/executive';

export const KPI_CATEGORY_LABELS: Record<KPICategory, string> = {
  revenue: 'Revenue',
  operations: 'Operations',
  growth: 'Growth',
  team: 'Team',
  product: 'Product',
  customer: 'Customer',
};

type KPIStatusConfigEntry = {
  label: string;
  color: string;
  description: string;
};

export const KPI_STATUS_CONFIG: Record<ExecutiveKPI['status'], KPIStatusConfigEntry> = {
  on_track: {
    label: 'On Track',
    color: 'green',
    description: 'KPI is progressing within acceptable thresholds.',
  },
  at_risk: {
    label: 'At Risk',
    color: 'yellow',
    description: 'KPI is trending toward missing its target.',
  },
  off_track: {
    label: 'Off Track',
    color: 'red',
    description: 'KPI has missed or is significantly below target.',
  },
};

export function getKPIStatusConfig(status: ExecutiveKPI['status']): KPIStatusConfigEntry {
  return KPI_STATUS_CONFIG[status];
}
