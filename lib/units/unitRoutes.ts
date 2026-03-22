import type { RoutingRuleType, RoutingRule } from '@/types/units';

export const ROUTING_RULE_TYPE_LABELS: Record<RoutingRuleType, string> = {
  round_robin: 'Round Robin',
  skill_match: 'Skill Match',
  load_balanced: 'Load Balanced',
  priority: 'Priority',
  manual: 'Manual',
};

export type RoutingRuleConfig = {
  type: RoutingRuleType;
  label: string;
  description: string;
  icon: string;
};

export const ROUTING_RULE_CONFIGS: Record<RoutingRuleType, RoutingRuleConfig> = {
  round_robin: {
    type: 'round_robin',
    label: 'Round Robin',
    description: 'Distribute tasks evenly across all available members in sequence.',
    icon: '🔄',
  },
  skill_match: {
    type: 'skill_match',
    label: 'Skill Match',
    description: 'Route tasks to the member whose skills best match the task requirements.',
    icon: '🎯',
  },
  load_balanced: {
    type: 'load_balanced',
    label: 'Load Balanced',
    description: 'Route tasks to the member with the lowest current workload.',
    icon: '⚖️',
  },
  priority: {
    type: 'priority',
    label: 'Priority',
    description: 'Route tasks based on predefined priority rules and conditions.',
    icon: '🏆',
  },
  manual: {
    type: 'manual',
    label: 'Manual',
    description: 'Tasks are manually assigned by a unit manager.',
    icon: '🙋',
  },
};

export const ROUTING_RULE_DEFAULTS: Omit<RoutingRule, 'id' | 'unit_id'>[] = [
  {
    type: 'round_robin',
    name: 'Default Round Robin',
    description: 'Even distribution of incoming tasks across all active members.',
    conditions: {},
    priority: 1,
  },
  {
    type: 'skill_match',
    name: 'Skill-Based Routing',
    description: 'Match tasks to members based on declared skills.',
    conditions: { requires_skill_tags: true },
    priority: 2,
  },
];

export function getRoutingRuleConfig(type: RoutingRuleType): RoutingRuleConfig {
  return ROUTING_RULE_CONFIGS[type];
}
