import type { IntentType, RecommendedFlow } from '@/types/intake';

const INTENT_TO_FLOW: Record<IntentType, RecommendedFlow> = {
  landing_page: 'execution',
  offer_page: 'execution',
  whatsapp_booking_flow: 'execution',
  technical_web_project: 'execution',
  automation_task: 'execution',
  simple_code_task: 'builder',
  learning_request: 'mentor',
  unknown: 'execution',
};

export function mapIntentToFlow(intent: IntentType): RecommendedFlow {
  return INTENT_TO_FLOW[intent] ?? 'execution';
}
