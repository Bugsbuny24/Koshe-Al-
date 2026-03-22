/**
 * Background job system — inspired by Trigger.dev.
 *
 * Long-running AI operations (execution planning, pipeline runs, batch
 * processing) are submitted as Jobs and tracked asynchronously.  Clients
 * can poll the REST endpoint or open an SSE stream to receive real-time
 * progress events — exactly the pattern used by Trigger.dev's run
 * subscription system.
 */

// ── Job types ─────────────────────────────────────────────────────────────────

export type JobType =
  | 'execution_plan'      // Full execution planning (requirements → architecture → tasks → checklist)
  | 'pipeline_run'        // Run a named pipeline
  | 'requirement_extract' // Single-step requirement extraction
  | 'architecture_plan'   // Single-step architecture planning
  | 'task_breakdown'      // Single-step task breakdown
  | 'delivery_checklist'; // Single-step checklist generation

// ── Job status — mirrors Trigger.dev run statuses ────────────────────────────

export type JobStatus =
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

// ── Step (sub-task within a job) — Trigger.dev "tasks" concept ───────────────

export interface JobStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  error?: string;
}

// ── Job event — streamed over SSE ────────────────────────────────────────────

export type JobEventType =
  | 'queued'
  | 'started'
  | 'step_started'
  | 'step_completed'
  | 'step_failed'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface JobEvent {
  type: JobEventType;
  jobId: string;
  timestamp: string;
  stepId?: string;
  stepLabel?: string;
  message?: string;
  data?: Record<string, unknown>;
}

// ── Job definition ────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  type: JobType;
  status: JobStatus;
  title: string;
  /** Input payload for the job */
  input: Record<string, unknown>;
  /** Output payload when status === 'completed' */
  output: Record<string, unknown> | null;
  steps: JobStep[];
  error?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  /** User ID who submitted this job (optional for anonymous execution) */
  userId?: string;
}

// ── Create job request ────────────────────────────────────────────────────────

export interface CreateJobRequest {
  type: JobType;
  title: string;
  input: Record<string, unknown>;
  userId?: string;
}

// ── Job list response ─────────────────────────────────────────────────────────

export interface JobListResponse {
  jobs: Job[];
  total: number;
}
