import type { IntentType, RecommendedFlow } from '@/types/intake';

const INTENT_TO_FLOW: Record<IntentType, RecommendedFlow> = {
  marketing_page: 'execution',
  offer_page: 'execution',
  booking_flow: 'execution',
  web_project: 'execution',
  automation_task: 'execution',
  internal_tool: 'execution',
  growth_asset: 'execution',
  simple_code_task: 'builder',
  learning_request: 'mentor',
  unknown: 'execution',
};

export function mapIntentToFlow(intent: IntentType): RecommendedFlow {
  return INTENT_TO_FLOW[intent] ?? 'execution';
}
