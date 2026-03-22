import type { OpportunityType } from '@/types/executive';

export const OPPORTUNITY_TYPE_LABELS: Record<OpportunityType, string> = {
  market: 'Market',
  product: 'Product',
  partnership: 'Partnership',
  efficiency: 'Efficiency',
  talent: 'Talent',
};

export const OPPORTUNITY_TYPE_ICONS: Record<OpportunityType, string> = {
  market: '🌍',
  product: '🛠️',
  partnership: '🤝',
  efficiency: '⚡',
  talent: '🧠',
};

type OpportunityTypeConfigEntry = {
  label: string;
  icon: string;
  description: string;
};

export function getOpportunityTypeConfig(type: OpportunityType): OpportunityTypeConfigEntry {
  return {
    label: OPPORTUNITY_TYPE_LABELS[type],
    icon: OPPORTUNITY_TYPE_ICONS[type],
    description: OPPORTUNITY_TYPE_DESCRIPTIONS[type],
  };
}

const OPPORTUNITY_TYPE_DESCRIPTIONS: Record<OpportunityType, string> = {
  market: 'An untapped or underserved segment with growth potential.',
  product: 'A capability or feature that unlocks new value for customers.',
  partnership: 'A strategic alliance that extends reach or capability.',
  efficiency: 'A process or tooling improvement that reduces cost or time.',
  talent: 'A hiring or development opportunity that strengthens the team.',
};
