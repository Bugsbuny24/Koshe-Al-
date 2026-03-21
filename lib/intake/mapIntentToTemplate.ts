import type { IntentType } from '@/types/intake';

const INTENT_TO_TEMPLATE: Record<IntentType, string | null> = {
  landing_page: 'hotel-landing',
  offer_page: 'hotel-offer',
  whatsapp_booking_flow: 'hotel-whatsapp',
  technical_web_project: null,
  automation_task: null,
  simple_code_task: null,
  learning_request: null,
  unknown: null,
};

export function mapIntentToTemplate(intent: IntentType): string | null {
  return INTENT_TO_TEMPLATE[intent] ?? null;
}
