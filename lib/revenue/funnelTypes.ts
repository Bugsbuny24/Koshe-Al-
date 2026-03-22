import type { FunnelStage } from '@/types/revenue';

export const FUNNEL_STAGE_LABELS: Record<FunnelStage, string> = {
  awareness: 'Awareness',
  interest: 'Interest',
  consideration: 'Consideration',
  intent: 'Intent',
  conversion: 'Conversion',
  retention: 'Retention',
};

type FunnelStageConfigEntry = {
  label: string;
  description: string;
  color: string;
  order: number;
};

export const FUNNEL_STAGE_CONFIG: Record<FunnelStage, FunnelStageConfigEntry> = {
  awareness: {
    label: 'Awareness',
    description: 'Prospect becomes aware of your brand or solution.',
    color: 'blue',
    order: 1,
  },
  interest: {
    label: 'Interest',
    description: 'Prospect shows interest and engages with content.',
    color: 'indigo',
    order: 2,
  },
  consideration: {
    label: 'Consideration',
    description: 'Prospect evaluates your offering against alternatives.',
    color: 'violet',
    order: 3,
  },
  intent: {
    label: 'Intent',
    description: 'Prospect signals purchase intent.',
    color: 'purple',
    order: 4,
  },
  conversion: {
    label: 'Conversion',
    description: 'Prospect becomes a paying customer.',
    color: 'green',
    order: 5,
  },
  retention: {
    label: 'Retention',
    description: 'Customer remains engaged and renews or expands.',
    color: 'emerald',
    order: 6,
  },
};

export function getFunnelStageConfig(stage: FunnelStage): FunnelStageConfigEntry {
  return FUNNEL_STAGE_CONFIG[stage];
}
