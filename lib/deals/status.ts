// Centralized deal and milestone status definitions for V1
// All status strings, labels, and badge variants live here – never scatter raw strings across the codebase.

// ─── Deal statuses ────────────────────────────────────────────────────────────
export const DEAL_STATUSES = [
  'draft',
  'scoped',
  'in_progress',
  'delivered',
  'completed',
  'on_hold',
] as const;

export type DealStatus = (typeof DEAL_STATUSES)[number];

export const DEAL_STATUS_LABEL: Record<DealStatus, string> = {
  draft: 'Taslak',
  scoped: 'Scope Kilitli',
  in_progress: 'Devam Ediyor',
  delivered: 'Teslim Edildi',
  completed: 'Tamamlandı',
  on_hold: 'Beklemede',
};

export const DEAL_STATUS_VARIANT: Record<DealStatus, 'blue' | 'green' | 'gold' | 'red' | 'gray'> = {
  draft: 'gray',
  scoped: 'blue',
  in_progress: 'gold',
  delivered: 'blue',
  completed: 'green',
  on_hold: 'red',
};

// ─── Milestone statuses ───────────────────────────────────────────────────────
export const MILESTONE_STATUSES = [
  'draft',
  'pending_funding',
  'funded',
  'in_progress',
  'delivered',
  'revision_requested',
  'approved',
  'released',
] as const;

export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number];

export const MILESTONE_STATUS_LABEL: Record<MilestoneStatus, string> = {
  draft: 'Taslak',
  pending_funding: 'Fon Bekleniyor',
  funded: 'Finanse Edildi',
  in_progress: 'Devam Ediyor',
  delivered: 'Teslim Edildi',
  revision_requested: 'Revizyon',
  approved: 'Onaylandı',
  released: 'Serbest Bırakıldı',
};

export const MILESTONE_STATUS_VARIANT: Record<MilestoneStatus, 'blue' | 'green' | 'gold' | 'red' | 'gray'> = {
  draft: 'gray',
  pending_funding: 'gray',
  funded: 'blue',
  in_progress: 'blue',
  delivered: 'gold',
  revision_requested: 'red',
  approved: 'green',
  released: 'green',
};

// ─── Escrow statuses ──────────────────────────────────────────────────────────
export const ESCROW_STATUS_LABEL: Record<string, string> = {
  pending: 'Bekliyor',
  funded: 'Finanse Edildi',
  partially_released: 'Kısmen Serbest',
  released: 'Serbest Bırakıldı',
  cancelled: 'İptal',
};

export const ESCROW_STATUS_VARIANT: Record<string, 'blue' | 'green' | 'gold' | 'red' | 'gray'> = {
  pending: 'gray',
  funded: 'blue',
  partially_released: 'gold',
  released: 'green',
  cancelled: 'red',
};

// ─── Activity event labels (human-readable with payload context) ──────────────
export const EVENT_ICON: Record<string, string> = {
  deal_created: '🎯',
  scope_locked: '🔒',
  milestones_created: '📋',
  milestone_updated: '✏️',
  delivery_uploaded: '📦',
  revision_requested: '🔄',
  milestone_approved: '✅',
  milestone_rejected: '❌',
  escrow_linked: '🔗',
  escrow_synced: '⚡',
  approval_added: '🗳️',
};

/** Produce a human-readable label for an activity event using its payload for extra context. */
export function getEventLabel(
  eventType: string,
  payload: Record<string, unknown> = {}
): string {
  switch (eventType) {
    case 'deal_created':
      return 'Deal oluşturuldu';
    case 'scope_locked':
      return payload.version ? `Scope kilitlendi (v${payload.version})` : 'Scope kilitlendi';
    case 'milestones_created':
      return payload.count ? `${payload.count} milestone oluşturuldu` : "Milestone'lar oluşturuldu";
    case 'milestone_updated':
      return 'Milestone güncellendi';
    case 'delivery_uploaded':
      return payload.version ? `Teslim eklendi (v${payload.version})` : 'Teslim eklendi';
    case 'revision_requested':
      return 'Revizyon kaydı oluşturuldu';
    case 'milestone_approved':
      return 'Milestone onaylandı';
    case 'milestone_rejected':
      return 'Milestone revizyona döndü';
    case 'approval_added': {
      const decision = payload.decision as string | undefined;
      if (decision === 'approved') return 'Milestone onaylandı';
      if (decision === 'rejected') return 'Milestone revizyona döndü';
      return 'Onay kararı verildi';
    }
    case 'escrow_linked':
      return 'Escrow transaction bağlandı';
    case 'escrow_synced': {
      const status = payload.status as string | undefined;
      return status
        ? `Escrow durumu güncellendi → ${ESCROW_STATUS_LABEL[status] || status}`
        : 'Escrow durumu güncellendi';
    }
    default:
      return eventType.replace(/_/g, ' ');
  }
}
