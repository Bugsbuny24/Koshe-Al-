import type { UnitGoalType, UnitGoal } from '@/types/units';

export const UNIT_GOAL_TYPE_LABELS: Record<UnitGoalType, string> = {
  revenue: 'Revenue',
  efficiency: 'Efficiency',
  quality: 'Quality',
  growth: 'Growth',
  cost_reduction: 'Cost Reduction',
};

export type UnitGoalConfig = {
  type: UnitGoalType;
  label: string;
  icon: string;
  defaultUnitLabel: string;
};

export const UNIT_GOAL_TYPE_CONFIGS: Record<UnitGoalType, UnitGoalConfig> = {
  revenue: {
    type: 'revenue',
    label: 'Revenue',
    icon: '💰',
    defaultUnitLabel: 'USD',
  },
  efficiency: {
    type: 'efficiency',
    label: 'Efficiency',
    icon: '⚡',
    defaultUnitLabel: '%',
  },
  quality: {
    type: 'quality',
    label: 'Quality',
    icon: '✅',
    defaultUnitLabel: 'score',
  },
  growth: {
    type: 'growth',
    label: 'Growth',
    icon: '📈',
    defaultUnitLabel: '%',
  },
  cost_reduction: {
    type: 'cost_reduction',
    label: 'Cost Reduction',
    icon: '📉',
    defaultUnitLabel: 'USD',
  },
};

export const DEFAULT_UNIT_GOALS: Omit<UnitGoal, 'id' | 'unit_id'>[] = [
  {
    type: 'efficiency',
    title: 'Improve Task Completion Rate',
    description: 'Increase the percentage of tasks completed on time.',
    target_value: 90,
    current_value: 0,
    unit_label: '%',
  },
  {
    type: 'quality',
    title: 'Maintain Output Quality Score',
    description: 'Keep average output quality score above target threshold.',
    target_value: 80,
    current_value: 0,
    unit_label: 'score',
  },
  {
    type: 'growth',
    title: 'Expand Unit Capacity',
    description: 'Grow unit throughput by the target percentage.',
    target_value: 25,
    current_value: 0,
    unit_label: '%',
  },
];

export function getUnitGoalConfig(type: UnitGoalType): UnitGoalConfig {
  return UNIT_GOAL_TYPE_CONFIGS[type];
}
