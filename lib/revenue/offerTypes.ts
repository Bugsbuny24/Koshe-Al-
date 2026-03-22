import type { OfferType } from '@/types/revenue';

export const OFFER_TYPE_LABELS: Record<OfferType, string> = {
  product: 'Product',
  service: 'Service',
  subscription: 'Subscription',
  bundle: 'Bundle',
  upsell: 'Upsell',
  cross_sell: 'Cross-sell',
};

export const OFFER_TYPE_ICONS: Record<OfferType, string> = {
  product: '📦',
  service: '🛠️',
  subscription: '🔄',
  bundle: '🎁',
  upsell: '⬆️',
  cross_sell: '↔️',
};

type OfferTypeConfigEntry = {
  label: string;
  icon: string;
  description: string;
};

export function getOfferTypeConfig(type: OfferType): OfferTypeConfigEntry {
  return {
    label: OFFER_TYPE_LABELS[type],
    icon: OFFER_TYPE_ICONS[type],
    description: OFFER_TYPE_DESCRIPTIONS[type],
  };
}

const OFFER_TYPE_DESCRIPTIONS: Record<OfferType, string> = {
  product: 'A standalone deliverable or physical/digital item.',
  service: 'A time-based or outcome-based engagement.',
  subscription: 'Recurring access to a product or service.',
  bundle: 'A curated package of multiple offerings.',
  upsell: 'A higher-tier or enhanced version of an existing purchase.',
  cross_sell: 'A complementary offering presented alongside a primary purchase.',
};
