/**
 * Shared flow status vocabulary for Execution → Project → Deal pipeline.
 */

// ── Execution Run Statuses ───────────────────────────────────────────────────

export const EXECUTION_STATUSES = [
  'draft',
  'analyzed',
  'planned',
  'ready_for_project',
  'ready_for_deal',
  'linked_to_project',
  'linked_to_deal',
] as const;

export type ExecutionStatus = (typeof EXECUTION_STATUSES)[number];

export const EXECUTION_STATUS_LABEL: Record<ExecutionStatus, string> = {
  draft: 'Taslak',
  analyzed: 'Analiz Edildi',
  planned: 'Planlandı',
  ready_for_project: 'Proje İçin Hazır',
  ready_for_deal: 'Deal İçin Hazır',
  linked_to_project: 'Projeye Bağlı',
  linked_to_deal: "Deal'a Bağlı",
};

export const EXECUTION_STATUS_VARIANT: Record<ExecutionStatus, 'default' | 'blue' | 'green' | 'amber' | 'gray'> = {
  draft: 'gray',
  analyzed: 'blue',
  planned: 'blue',
  ready_for_project: 'amber',
  ready_for_deal: 'amber',
  linked_to_project: 'green',
  linked_to_deal: 'green',
};

// ── Deal Statuses ────────────────────────────────────────────────────────────

export const DEAL_FLOW_STATUSES = [
  'draft',
  'scoped',
  'in_progress',
  'delivered',
  'completed',
] as const;

export type DealFlowStatus = (typeof DEAL_FLOW_STATUSES)[number];

export const DEAL_FLOW_STATUS_LABEL: Record<DealFlowStatus, string> = {
  draft: 'Taslak',
  scoped: 'Scope Kilitlendi',
  in_progress: 'Devam Ediyor',
  delivered: 'Teslim Edildi',
  completed: 'Tamamlandı',
};

// ── Source Badge Labels (for UI connectivity hints) ──────────────────────────

export type SourceBadgeType =
  | 'created_from_execution'
  | 'linked_to_deal'
  | 'linked_to_project'
  | 'template_based';

export const SOURCE_BADGE_LABEL: Record<SourceBadgeType, string> = {
  created_from_execution: 'Created from execution run',
  linked_to_deal: 'Linked to deal',
  linked_to_project: 'Linked to project',
  template_based: 'Template based',
};
