/**
 * Pipeline list endpoint — GET /api/pipeline
 *
 * Returns the list of available pipeline templates.
 * Inspired by Dify's workflow template library endpoint.
 */

import { NextResponse } from 'next/server';
import { PIPELINE_TEMPLATES } from '@/lib/pipeline/templates';

export const dynamic = 'force-dynamic';

export async function GET() {
  const templates = PIPELINE_TEMPLATES.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    nodeCount: p.nodes.length,
    createdAt: p.createdAt,
  }));
  return NextResponse.json({ templates });
}
