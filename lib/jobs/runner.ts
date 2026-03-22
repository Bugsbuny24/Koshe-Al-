/**
 * Job runner — executes background jobs step-by-step.
 * Inspired by Trigger.dev's task execution model where each task runs
 * as an isolated, observable unit with per-step status tracking.
 */

import { randomUUID } from 'crypto';
import {
  getJob,
  updateJobStatus,
  addJobStep,
  updateJobStep,
  setJobOutput,
} from './store';
import { extractRequirements } from '@/lib/execution/requirementExtractor';
import { planArchitecture } from '@/lib/execution/architecturePlanner';
import { breakdownTasks } from '@/lib/execution/taskBreakdown';
import { generateDeliveryChecklist } from '@/lib/execution/deliveryChecklist';
import type { RequirementExtractionResult, ArchitecturePlanResult, TaskBreakdownResult } from '@/types/execution';

/**
 * Run a full execution-plan job (requirements → architecture → tasks → checklist).
 * Each step is tracked individually so the SSE stream can show granular progress.
 *
 * This mirrors Trigger.dev's pattern of sub-tasks within a parent run.
 */
export async function runExecutionPlanJob(jobId: string): Promise<void> {
  const job = getJob(jobId);
  if (!job) return;

  // Register steps up-front so clients can see the full plan immediately
  const steps = [
    addJobStep(jobId, { id: randomUUID(), label: 'Gereksinim Çıkarımı' }),
    addJobStep(jobId, { id: randomUUID(), label: 'Mimari Planlama' }),
    addJobStep(jobId, { id: randomUUID(), label: 'Görev Kırılımı' }),
    addJobStep(jobId, { id: randomUUID(), label: 'Teslim Checklist' }),
  ];

  updateJobStatus(jobId, 'running');

  const brief = String(job.input.brief ?? '');
  const templateId = (job.input.templateId as string | null | undefined) ?? null;

  let requirements: RequirementExtractionResult | null = null;
  let architecture: ArchitecturePlanResult | null = null;
  let tasks: TaskBreakdownResult | null = null;

  // Step 1: Requirements
  updateJobStep(jobId, steps[0].id, { status: 'running' });
  try {
    requirements = await extractRequirements(brief, templateId);
    updateJobStep(jobId, steps[0].id, { status: 'completed' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Gereksinim çıkarımı başarısız';
    updateJobStep(jobId, steps[0].id, { status: 'failed', error: msg });
    steps.slice(1).forEach((s) => updateJobStep(jobId, s.id, { status: 'skipped' }));
    updateJobStatus(jobId, 'failed', msg);
    return;
  }

  // Step 2: Architecture
  updateJobStep(jobId, steps[1].id, { status: 'running' });
  try {
    architecture = await planArchitecture(requirements);
    updateJobStep(jobId, steps[1].id, { status: 'completed' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Mimari planlama başarısız';
    updateJobStep(jobId, steps[1].id, { status: 'failed', error: msg });
    steps.slice(2).forEach((s) => updateJobStep(jobId, s.id, { status: 'skipped' }));
    updateJobStatus(jobId, 'failed', msg);
    return;
  }

  // Step 3: Task breakdown
  updateJobStep(jobId, steps[2].id, { status: 'running' });
  try {
    tasks = await breakdownTasks(requirements, architecture);
    updateJobStep(jobId, steps[2].id, { status: 'completed' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Görev kırılımı başarısız';
    updateJobStep(jobId, steps[2].id, { status: 'failed', error: msg });
    steps.slice(3).forEach((s) => updateJobStep(jobId, s.id, { status: 'skipped' }));
    updateJobStatus(jobId, 'failed', msg);
    return;
  }

  // Step 4: Delivery checklist
  updateJobStep(jobId, steps[3].id, { status: 'running' });
  try {
    const checklist = await generateDeliveryChecklist(requirements, architecture, tasks);
    updateJobStep(jobId, steps[3].id, { status: 'completed' });

    setJobOutput(jobId, {
      requirements,
      architecture,
      tasks,
      checklist,
    });
    updateJobStatus(jobId, 'completed');
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Teslim checklist başarısız';
    updateJobStep(jobId, steps[3].id, { status: 'failed', error: msg });
    updateJobStatus(jobId, 'failed', msg);
  }
}
