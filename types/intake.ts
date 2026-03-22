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

/** A single message in the chat conversation history. */
export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

/**
 * The result of one chat turn.
 * - visible_* fields are shown to the user in a natural way.
 * - hidden_* fields are used internally for routing; never displayed raw.
 */
export type ChatTurnResult = {
  /** Natural conversational reply shown to the user as a chat bubble. */
  assistant_visible_reply: string;

  /** Hidden: raw classified intent — never show this label directly. */
  hidden_intent: IntentType;
  /** Hidden: confidence level — never display "düşük güven" etc. directly. */
  hidden_confidence: 'low' | 'medium' | 'high';
  /** Hidden: routing decision for the backend. */
  hidden_recommended_flow: RecommendedFlow;
  /** Hidden: internal summary text. */
  hidden_summary: string;

  /** User-friendly summary shown only when there is enough signal. */
  visible_summary?: string | null;
  /** Short title of the recommendation card (shown after the summary). */
  visible_recommendation_title?: string | null;
  /** Body text of the recommendation card. */
  visible_recommendation_body?: string | null;

  /** At most 2 clarifying questions shown naturally in the chat. */
  clarifying_questions?: string[];

  /** Primary CTA rendered as a button below the recommendation card. */
  cta?: {
    label: string;
    href: string;
  } | null;
};
