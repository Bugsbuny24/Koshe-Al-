export type RunPolicyType = 'manual' | 'scheduled' | 'triggered' | 'autonomous';
export type ApprovalGateType = 'human_review' | 'automated_check' | 'none';
export type AutonomousRunStatus = 'idle' | 'waiting_approval' | 'running' | 'paused' | 'completed' | 'failed' | 'rejected';
export type RetryStrategy = 'none' | 'immediate' | 'exponential_backoff' | 'manual';

export type RunPolicy = {
  id: string;
  name: string;
  type: RunPolicyType;
  description: string;
  triggers?: string[];
  schedule?: string;
  max_retries: number;
  retry_strategy: RetryStrategy;
  approval_required: boolean;
  created_at: string;
};

export type ApprovalGate = {
  id: string;
  name: string;
  type: ApprovalGateType;
  stage: string;
  description: string;
  timeout_minutes?: number;
  auto_approve_after_timeout: boolean;
};

export type AutonomousRun = {
  id: string;
  policy_id: string;
  production_run_id?: string;
  status: AutonomousRunStatus;
  current_gate?: string;
  retry_count: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
};

export type AutonomousPhase = {
  id: string;
  name: string;
  description: string;
  gates: ApprovalGate[];
  sequence: number;
};
