/**
 * Job status endpoint — GET /api/jobs/[id]
 *
 * Returns the current state of a single job including its step logs.
 * Mirrors Trigger.dev's GET /api/v1/runs/:runId endpoint.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getJob } from '@/lib/jobs/store';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) {
    return NextResponse.json({ success: false, error: 'İş bulunamadı' }, { status: 404 });
  }
  return NextResponse.json({ success: true, job });
}
