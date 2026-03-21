export type IntentType =
  | 'landing_page'
  | 'offer_page'
  | 'whatsapp_booking_flow'
  | 'simple_code_task'
  | 'technical_web_project'
  | 'automation_task'
  | 'learning_request'
  | 'unknown';

export type RecommendedFlow = 'execution' | 'builder' | 'mentor';

export type IntakeResult = {
  raw_user_request: string;
  detected_intent: IntentType;
  business_goal: string;
  recommended_flow: RecommendedFlow;
  recommended_template: string | null;
  clarifying_questions: string[];
  auto_scope_seed: string | null;
  confidence: 'low' | 'medium' | 'high';
};
