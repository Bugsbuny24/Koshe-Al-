import type { PatternType, PatternInsight } from '@/types/network-intelligence';

export const PATTERN_TYPE_LABELS: Record<PatternType, string> = {
  workflow_sequence: 'Workflow Sequence',
  bottleneck_location: 'Bottleneck Location',
  optimization_trigger: 'Optimisation Trigger',
  failure_mode: 'Failure Mode',
  success_pattern: 'Success Pattern',
};

export type PatternTypeConfig = {
  type: PatternType;
  label: string;
  description: string;
  icon: string;
};

export const PATTERN_TYPE_CONFIGS: Record<PatternType, PatternTypeConfig> = {
  workflow_sequence: {
    type: 'workflow_sequence',
    label: 'Workflow Sequence',
    description: 'Common ordering of steps observed across similar workflows.',
    icon: '🔗',
  },
  bottleneck_location: {
    type: 'bottleneck_location',
    label: 'Bottleneck Location',
    description: 'Steps or stages where delays frequently occur in aggregate data.',
    icon: '🚧',
  },
  optimization_trigger: {
    type: 'optimization_trigger',
    label: 'Optimisation Trigger',
    description: 'Conditions that, when present, predict faster workflow completion.',
    icon: '⚡',
  },
  failure_mode: {
    type: 'failure_mode',
    label: 'Failure Mode',
    description: 'Common patterns associated with workflow failures or rejections.',
    icon: '⚠️',
  },
  success_pattern: {
    type: 'success_pattern',
    label: 'Success Pattern',
    description: 'Patterns strongly correlated with high-quality, on-time delivery.',
    icon: '✅',
  },
};

// Placeholder — populated when V19 pattern engine is active
export const PATTERN_REGISTRY: PatternInsight[] = [];

export function getPatternTypeConfig(type: PatternType): PatternTypeConfig {
  return PATTERN_TYPE_CONFIGS[type];
}
