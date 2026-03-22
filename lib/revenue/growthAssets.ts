import type { GrowthAssetType, FunnelStage } from '@/types/revenue';

export const GROWTH_ASSET_TYPE_LABELS: Record<GrowthAssetType, string> = {
  landing_page: 'Landing Page',
  email_sequence: 'Email Sequence',
  social_content: 'Social Content',
  case_study: 'Case Study',
  proposal: 'Proposal',
  pitch_deck: 'Pitch Deck',
};

type GrowthAssetTemplate = {
  label: string;
  description: string;
  typical_stages: FunnelStage[];
  estimated_effort: 'low' | 'medium' | 'high';
};

export const GROWTH_ASSET_TEMPLATES: Record<GrowthAssetType, GrowthAssetTemplate> = {
  landing_page: {
    label: 'Landing Page',
    description: 'Dedicated conversion page for a specific offer or campaign.',
    typical_stages: ['awareness', 'interest', 'conversion'],
    estimated_effort: 'medium',
  },
  email_sequence: {
    label: 'Email Sequence',
    description: 'Automated series of emails to nurture and convert leads.',
    typical_stages: ['interest', 'consideration', 'intent', 'conversion'],
    estimated_effort: 'medium',
  },
  social_content: {
    label: 'Social Content',
    description: 'Platform-optimised posts, threads, or short-form video.',
    typical_stages: ['awareness', 'interest'],
    estimated_effort: 'low',
  },
  case_study: {
    label: 'Case Study',
    description: 'Proof-of-results narrative featuring a real client outcome.',
    typical_stages: ['consideration', 'intent'],
    estimated_effort: 'high',
  },
  proposal: {
    label: 'Proposal',
    description: 'Tailored document outlining scope, pricing, and value.',
    typical_stages: ['intent', 'conversion'],
    estimated_effort: 'medium',
  },
  pitch_deck: {
    label: 'Pitch Deck',
    description: 'Visual presentation for investor or enterprise sales meetings.',
    typical_stages: ['consideration', 'intent', 'conversion'],
    estimated_effort: 'high',
  },
};

export function getGrowthAssetTemplate(type: GrowthAssetType): GrowthAssetTemplate {
  return GROWTH_ASSET_TEMPLATES[type];
}
