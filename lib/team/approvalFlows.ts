import type { ApprovalFlow, ApprovalFlowStatus } from '@/types/team';

type ApprovalFlowStatusConfig = {
  label: string;
  color: string;
  description: string;
};

export const DEFAULT_APPROVAL_FLOWS: ApprovalFlow[] = [
  {
    id: 'flow-single-approver',
    name: 'Single Approver',
    description: 'One manager must approve before the action proceeds.',
    stages: [
      {
        id: 'stage-sa-1',
        flow_id: 'flow-single-approver',
        name: 'Manager Review',
        approver_role: 'manager',
        sequence: 1,
        timeout_hours: 24,
      },
    ],
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'flow-two-stage',
    name: 'Two-Stage Review',
    description: 'Manager approves first, then an admin signs off.',
    stages: [
      {
        id: 'stage-ts-1',
        flow_id: 'flow-two-stage',
        name: 'Manager Approval',
        approver_role: 'manager',
        sequence: 1,
        timeout_hours: 24,
      },
      {
        id: 'stage-ts-2',
        flow_id: 'flow-two-stage',
        name: 'Admin Sign-off',
        approver_role: 'admin',
        sequence: 2,
        timeout_hours: 48,
      },
    ],
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'flow-owner-only',
    name: 'Owner Only',
    description: 'Only the workspace owner can approve.',
    stages: [
      {
        id: 'stage-oo-1',
        flow_id: 'flow-owner-only',
        name: 'Owner Approval',
        approver_role: 'owner',
        sequence: 1,
      },
    ],
    created_at: '2024-01-01T00:00:00Z',
  },
];

export const APPROVAL_FLOW_STATUS_CONFIG: Record<ApprovalFlowStatus, ApprovalFlowStatusConfig> = {
  pending: {
    label: 'Pending',
    color: 'text-yellow-400',
    description: 'Awaiting review from the designated approver.',
  },
  approved: {
    label: 'Approved',
    color: 'text-accent-green',
    description: 'All stages have been approved.',
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-400',
    description: 'Rejected at one or more approval stages.',
  },
  escalated: {
    label: 'Escalated',
    color: 'text-orange-400',
    description: 'Escalated to a higher authority due to timeout or exception.',
  },
};

export function getApprovalFlowStatusConfig(status: ApprovalFlowStatus): ApprovalFlowStatusConfig {
  return APPROVAL_FLOW_STATUS_CONFIG[status];
}
