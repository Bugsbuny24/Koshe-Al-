/**
 * In-memory job store — inspired by Trigger.dev's run management.
 *
 * In production this would be backed by Supabase (jobs table), but
 * the same interface works during development.  Trigger.dev similarly
 * uses a database-backed store with a lightweight in-process cache for
 * active runs.
 *
 * Uses a module-level singleton so the store survives across hot-reload
 * cycles in Next.js dev mode (globalThis pattern).
 */

import { randomUUID } from 'crypto';
import type { Job, JobStatus, JobStep, CreateJobRequest, JobEvent } from '@/types/jobs';

// ── Singleton store ───────────────────────────────────────────────────────────

interface JobStoreState {
  jobs: Map<string, Job>;
  subscribers: Map<string, Set<(event: JobEvent) => void>>;
}

const GLOBAL_KEY = '__koschei_job_store__';
declare const globalThis: typeof global & { [GLOBAL_KEY]?: JobStoreState };

function getStore(): JobStoreState {
  if (!globalThis[GLOBAL_KEY]) {
    globalThis[GLOBAL_KEY] = {
      jobs: new Map(),
      subscribers: new Map(),
    };
  }
  return globalThis[GLOBAL_KEY]!;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function createJob(req: CreateJobRequest): Job {
  const store = getStore();
  const now = new Date().toISOString();
  const job: Job = {
    id: randomUUID(),
    type: req.type,
    status: 'queued',
    title: req.title,
    input: req.input,
    output: null,
    steps: [],
    createdAt: now,
    userId: req.userId,
  };
  store.jobs.set(job.id, job);
  emit(job.id, { type: 'queued', jobId: job.id, timestamp: now });
  return job;
}

export function getJob(id: string): Job | undefined {
  return getStore().jobs.get(id);
}

export function listJobs(limit = 50): Job[] {
  const jobs = Array.from(getStore().jobs.values());
  // Most recent first
  return jobs.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

export function updateJobStatus(id: string, status: JobStatus, error?: string): void {
  const store = getStore();
  const job = store.jobs.get(id);
  if (!job) return;

  const now = new Date().toISOString();
  job.status = status;

  if (status === 'running' && !job.startedAt) {
    job.startedAt = now;
    emit(id, { type: 'started', jobId: id, timestamp: now });
  }

  if (status === 'completed' || status === 'failed' || status === 'cancelled') {
    job.completedAt = now;
    if (job.startedAt) {
      job.durationMs = Date.now() - new Date(job.startedAt).getTime();
    }
    if (error) job.error = error;
    emit(id, {
      type: status === 'completed' ? 'completed' : status === 'failed' ? 'failed' : 'cancelled',
      jobId: id,
      timestamp: now,
      message: error,
    });
  }
}

export function addJobStep(id: string, step: Omit<JobStep, 'status'>): JobStep {
  const store = getStore();
  const job = store.jobs.get(id);
  if (!job) throw new Error(`Job ${id} bulunamadı`);
  const newStep: JobStep = { ...step, status: 'pending' };
  job.steps.push(newStep);
  return newStep;
}

export function updateJobStep(
  jobId: string,
  stepId: string,
  updates: Partial<Pick<JobStep, 'status' | 'completedAt' | 'durationMs' | 'error'>>,
): void {
  const store = getStore();
  const job = store.jobs.get(jobId);
  if (!job) return;
  const step = job.steps.find((s) => s.id === stepId);
  if (!step) return;

  const now = new Date().toISOString();
  Object.assign(step, updates);

  if (updates.status === 'running') {
    step.startedAt = step.startedAt ?? now;
    emit(jobId, {
      type: 'step_started',
      jobId,
      stepId,
      stepLabel: step.label,
      timestamp: now,
    });
  }

  if (updates.status === 'completed') {
    step.completedAt = step.completedAt ?? now;
    if (step.startedAt) {
      step.durationMs = Date.now() - new Date(step.startedAt).getTime();
    }
    emit(jobId, {
      type: 'step_completed',
      jobId,
      stepId,
      stepLabel: step.label,
      timestamp: now,
    });
  }

  if (updates.status === 'failed') {
    emit(jobId, {
      type: 'step_failed',
      jobId,
      stepId,
      stepLabel: step.label,
      timestamp: now,
      message: updates.error,
    });
  }
}

export function setJobOutput(id: string, output: Record<string, unknown>): void {
  const store = getStore();
  const job = store.jobs.get(id);
  if (!job) return;
  job.output = output;
}

// ── SSE subscription ─────────────────────────────────────────────────────────

export function subscribe(jobId: string, cb: (event: JobEvent) => void): () => void {
  const store = getStore();
  if (!store.subscribers.has(jobId)) {
    store.subscribers.set(jobId, new Set());
  }
  store.subscribers.get(jobId)!.add(cb);

  // Return an unsubscribe function
  return () => {
    store.subscribers.get(jobId)?.delete(cb);
  };
}

function emit(jobId: string, event: JobEvent): void {
  getStore().subscribers.get(jobId)?.forEach((cb) => {
    try {
      cb(event);
    } catch {
      // Subscriber error should not break other subscribers
    }
  });
}
