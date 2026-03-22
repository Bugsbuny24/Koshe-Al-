/**
 * Pipeline run endpoint — POST /api/pipeline/run
 *
 * Executes a pipeline synchronously and returns the full result.
 * For long pipelines, consider submitting as a background Job instead.
 *
 * Inspired by Dify's POST /workflows/run endpoint.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPipelineById } from '@/lib/pipeline/templates';
import { runPipeline } from '@/lib/pipeline/runner';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: { pipelineId?: string; input?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Geçersiz istek gövdesi' }, { status: 400 });
  }

  const { pipelineId, input } = body;

  if (!pipelineId) {
    return NextResponse.json({ success: false, error: 'pipelineId gerekli' }, { status: 400 });
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return NextResponse.json({ success: false, error: 'input nesnesi gerekli' }, { status: 400 });
  }

  const pipeline = getPipelineById(pipelineId);
  if (!pipeline) {
    return NextResponse.json({ success: false, error: 'Pipeline bulunamadı' }, { status: 404 });
  }

  try {
    const run = await runPipeline(pipeline, input);
    return NextResponse.json({ success: true, run });
  } catch (err) {
    console.error('pipeline/run error:', err);
    return NextResponse.json({ success: false, error: 'Pipeline çalıştırma hatası' }, { status: 500 });
  }
}
