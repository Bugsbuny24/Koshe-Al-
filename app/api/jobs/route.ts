/**
 * Jobs API — GET /api/jobs, POST /api/jobs
 *
 * Inspired by Trigger.dev's /runs endpoints:
 * - GET  /api/jobs         — list recent jobs
 * - POST /api/jobs         — submit a new background job
 *
 * Jobs run asynchronously; clients can poll GET /api/jobs/[id] or
 * subscribe to real-time events via GET /api/jobs/[id]/stream (SSE).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createJob, listJobs } from '@/lib/jobs/store';
import { runExecutionPlanJob } from '@/lib/jobs/runner';
import type { CreateJobRequest } from '@/types/jobs';

export const dynamic = 'force-dynamic';

const VALID_JOB_TYPES = new Set([
  'execution_plan',
  'pipeline_run',
  'requirement_extract',
  'architecture_plan',
  'task_breakdown',
  'delivery_checklist',
]);

export async function GET() {
  const jobs = listJobs(50);
  return NextResponse.json({ jobs, total: jobs.length });
}

export async function POST(req: NextRequest) {
  let body: Partial<CreateJobRequest>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Geçersiz istek gövdesi' }, { status: 400 });
  }

  const { type, title, input, userId } = body;

  if (!type || !VALID_JOB_TYPES.has(type)) {
    return NextResponse.json(
      { success: false, error: `Geçersiz iş türü. Geçerli türler: ${[...VALID_JOB_TYPES].join(', ')}` },
      { status: 400 },
    );
  }
  if (!title?.trim()) {
    return NextResponse.json({ success: false, error: 'title gerekli' }, { status: 400 });
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return NextResponse.json({ success: false, error: 'input nesnesi gerekli' }, { status: 400 });
  }

  const job = createJob({ type, title: title.trim(), input, userId });

  // Dispatch runner asynchronously — do not await
  if (type === 'execution_plan') {
    void runExecutionPlanJob(job.id);
  }

  return NextResponse.json({ success: true, job }, { status: 201 });
}
