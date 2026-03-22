import type { IntentType } from '@/types/intake';

const INTENT_TO_TEMPLATE: Record<IntentType, string | null> = {
  marketing_page: 'hotel-landing',
  offer_page: 'hotel-offer',
  booking_flow: 'hotel-whatsapp',
  web_project: null,
  automation_task: null,
  internal_tool: null,
  simple_code_task: null,
  learning_request: null,
  growth_asset: null,
  unknown: null,
};

export function mapIntentToTemplate(intent: IntentType): string | null {
  return INTENT_TO_TEMPLATE[intent] ?? null;
}
