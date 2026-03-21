export type Deal = {
  id: string;
  title: string;
  buyer_id: string | null;
  seller_id: string | null;
  total_amount: number;
  currency: string;
  status: string; // 'draft' | 'scoped' | 'active' | 'completed' | 'cancelled'
  created_at: string;
  updated_at: string;
};

export type DealScopeSnapshot = {
  id: string;
  deal_id: string;
  version: number;
  summary: string;
  deliverables_json: string[];
  exclusions_json: string[];
  revision_policy_json: string[];
  acceptance_criteria_json: string[];
  locked_by: string | null;
  locked_at: string;
};

export type DealMilestone = {
  id: string;
  deal_id: string;
  title: string;
  description: string;
  amount: number;
  sort_order: number;
  deadline: string | null;
  status: string; // 'pending' | 'in_progress' | 'delivered' | 'revision_requested' | 'approved'
  created_at: string;
  updated_at: string;
};

export type DealDelivery = {
  id: string;
  deal_id: string;
  milestone_id: string;
  delivery_type: string; // 'figma_link' | 'zip_link' | 'live_url' | 'doc' | 'other'
  asset_url: string;
  note: string;
  version: number;
  uploaded_by: string | null;
  created_at: string;
};

export type DealRevision = {
  id: string;
  deal_id: string;
  milestone_id: string | null;
  raw_feedback: string;
  parsed_feedback_json: AiRevisionParseResult | null;
  scope_status: string;
  action_items_json: string[];
  status: string; // 'open' | 'resolved'
  created_at: string;
};

export type DealApproval = {
  id: string;
  deal_id: string;
  milestone_id: string;
  approved_by: string | null;
  decision: string; // 'approved' | 'rejected'
  note: string;
  created_at: string;
};

export type EscrowTransaction = {
  id: string;
  deal_id: string;
  provider: string;
  external_transaction_id: string;
  amount: number;
  currency: string;
  status: string; // 'pending' | 'funded' | 'partially_released' | 'released' | 'cancelled'
  funded_amount: number;
  released_amount: number;
  created_at: string;
  updated_at: string;
};

export type EscrowEvent = {
  id: string;
  escrow_transaction_id: string;
  external_event_type: string;
  payload_json: Record<string, unknown>;
  created_at: string;
};

export type DealActivityLog = {
  id: string;
  deal_id: string;
  actor_id: string | null;
  actor_type: string;
  event_type: string;
  payload_json: Record<string, unknown>;
  created_at: string;
};

export type AiScopeLockResult = {
  summary: string;
  deliverables: string[];
  exclusions: string[];
  revision_policy: string[];
  acceptance_criteria: string[];
};

export type AiMilestonePlanResult = {
  milestones: {
    title: string;
    description: string;
    amount: number;
    sort_order: number;
  }[];
};

export type AiRevisionParseResult = {
  summary: string;
  scope_status: 'in_scope' | 'partially_out_of_scope' | 'out_of_scope';
  requested_changes: string[];
  action_items: string[];
};

export type AiDeliverySummaryResult = {
  delivery_summary: string;
  client_message: string;
  evidence_points: string[];
};
