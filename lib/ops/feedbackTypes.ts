import type { FeedbackCategory } from '@/types/ops';

export const FEEDBACK_CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  quality: 'Quality',
  speed: 'Speed',
  communication: 'Communication',
  scope: 'Scope',
  other: 'Other',
};

export const FEEDBACK_CATEGORY_ICONS: Record<FeedbackCategory, string> = {
  quality: '✅',
  speed: '⚡',
  communication: '💬',
  scope: '🎯',
  other: '📌',
};

export type FeedbackCategoryConfig = {
  label: string;
  icon: string;
  color: string;
};

export function getFeedbackCategoryConfig(category: FeedbackCategory): FeedbackCategoryConfig {
  const colorMap: Record<FeedbackCategory, string> = {
    quality: 'text-accent-green',
    speed: 'text-pi-gold',
    communication: 'text-accent-blue',
    scope: 'text-slate-400',
    other: 'text-slate-500',
  };

  return {
    label: FEEDBACK_CATEGORY_LABELS[category],
    icon: FEEDBACK_CATEGORY_ICONS[category],
    color: colorMap[category],
  };
}
