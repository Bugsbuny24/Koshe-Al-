import type { RunPolicy, RunPolicyType } from '@/types/autonomy';

export const DEFAULT_RUN_POLICIES: RunPolicy[] = [
  {
    id: 'policy-manual',
    name: 'Manual',
    type: 'manual',
    description: 'Runs are started manually by an operator.',
    max_retries: 0,
    retry_strategy: 'none',
    approval_required: false,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'policy-scheduled',
    name: 'Scheduled',
    type: 'scheduled',
    description: 'Runs are triggered on a defined cron schedule.',
    schedule: '0 9 * * 1-5',
    max_retries: 2,
    retry_strategy: 'exponential_backoff',
    approval_required: false,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'policy-triggered',
    name: 'Event-Triggered',
    type: 'triggered',
    description: 'Runs are triggered by external events or pipeline signals.',
    triggers: ['deal.closed', 'stage.changed', 'intake.completed'],
    max_retries: 3,
    retry_strategy: 'exponential_backoff',
    approval_required: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'policy-autonomous',
    name: 'Fully Autonomous',
    type: 'autonomous',
    description: 'Runs are self-initiated based on AI decision signals.',
    max_retries: 5,
    retry_strategy: 'exponential_backoff',
    approval_required: true,
    created_at: '2024-01-01T00:00:00Z',
  },
];

export const RUN_POLICY_LABELS: Record<RunPolicyType, string> = {
  manual: 'Manual',
  scheduled: 'Scheduled',
  triggered: 'Event-Triggered',
  autonomous: 'Fully Autonomous',
};

export function getRunPolicyConfig(type: RunPolicyType): RunPolicy | undefined {
  return DEFAULT_RUN_POLICIES.find((p) => p.type === type);
}
