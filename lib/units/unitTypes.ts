import type { UnitType, UnitStatus } from '@/types/units';

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  growth: 'Growth',
  sales: 'Sales',
  operations: 'Operations',
  product: 'Product',
  support: 'Support',
};

export const UNIT_TYPE_ICONS: Record<UnitType, string> = {
  growth: '📈',
  sales: '💼',
  operations: '⚙️',
  product: '🧩',
  support: '🛟',
};

export type UnitStatusConfig = {
  label: string;
  badgeClass: string;
};

export const UNIT_STATUS_CONFIG: Record<UnitStatus, UnitStatusConfig> = {
  planned: {
    label: 'Planned',
    badgeClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
  scaffolded: {
    label: 'Scaffolded',
    badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  active: {
    label: 'Active',
    badgeClass: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  paused: {
    label: 'Paused',
    badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  },
};

export type UnitTypeConfig = {
  type: UnitType;
  label: string;
  icon: string;
};

export function getUnitTypeConfig(type: UnitType): UnitTypeConfig {
  return {
    type,
    label: UNIT_TYPE_LABELS[type],
    icon: UNIT_TYPE_ICONS[type],
  };
}
