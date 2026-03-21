import type { DealRevision } from '@/types/deals';

export type RevisionFeedbackSummary = {
  revision_id: string;
  deal_id: string;
  summary: string;
  action_items: string[];
  scope_status: string;
  scope_impact: boolean;
  created_at: string;
};

/**
 * Maps a deal revision to an execution feedback summary.
 * Used to back-link revisions to an execution workspace in a future turn.
 */
export function mapDealRevisionToExecution(revision: DealRevision): RevisionFeedbackSummary {
  const parsedSummary = revision.parsed_feedback_json?.summary ?? '';
  return {
    revision_id: revision.id,
    deal_id: revision.deal_id,
    summary: parsedSummary || revision.raw_feedback,
    action_items: revision.action_items_json ?? [],
    scope_status: revision.scope_status ?? 'in_scope',
    scope_impact: revision.scope_status === 'out_of_scope' || revision.scope_status === 'partially_out_of_scope',
    created_at: revision.created_at,
  };
}
