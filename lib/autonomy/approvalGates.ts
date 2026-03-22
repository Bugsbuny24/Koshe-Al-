import type { ApprovalGate, ApprovalGateType } from '@/types/autonomy';

export const DEFAULT_APPROVAL_GATES: ApprovalGate[] = [
  {
    id: 'gate-pre-run',
    name: 'Pre-Run Review',
    type: 'human_review',
    stage: 'pre_run',
    description: 'A human operator reviews the run plan before execution begins.',
    timeout_minutes: 60,
    auto_approve_after_timeout: false,
  },
  {
    id: 'gate-mid-run',
    name: 'Mid-Run Quality Check',
    type: 'automated_check',
    stage: 'mid_run',
    description: 'Automated checks validate output quality at the midpoint.',
    timeout_minutes: 10,
    auto_approve_after_timeout: true,
  },
  {
    id: 'gate-post-run',
    name: 'Post-Run Approval',
    type: 'human_review',
    stage: 'post_run',
    description: 'Final human sign-off before results are committed.',
    timeout_minutes: 120,
    auto_approve_after_timeout: false,
  },
  {
    id: 'gate-none',
    name: 'No Gate',
    type: 'none',
    stage: 'bypass',
    description: 'No approval is required; run proceeds automatically.',
    auto_approve_after_timeout: true,
  },
];

export const APPROVAL_GATE_LABELS: Record<ApprovalGateType, string> = {
  human_review: 'Human Review',
  automated_check: 'Automated Check',
  none: 'No Gate',
};

export function getApprovalGateConfig(type: ApprovalGateType): ApprovalGate | undefined {
  return DEFAULT_APPROVAL_GATES.find((g) => g.type === type);
}
