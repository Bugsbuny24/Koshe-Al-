/**
 * Job SSE stream — GET /api/jobs/[id]/stream
 *
 * Opens a Server-Sent Events channel for real-time job progress events.
 * This mirrors Trigger.dev's run subscription WebSocket/SSE system where
 * a client subscribes to a run ID and receives step-level events as
 * the background task executes.
 *
 * Events follow the JobEvent schema from types/jobs.ts.
 */

import { NextRequest } from 'next/server';
import { getJob, subscribe } from '@/lib/jobs/store';
import type { JobEvent } from '@/types/jobs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// SSE keep-alive interval in milliseconds
const HEARTBEAT_MS = 15_000;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) {
    return new Response('İş bulunamadı', { status: 404 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Immediately send current job snapshot
      const snapshot = JSON.stringify({ type: 'snapshot', job });
      controller.enqueue(encoder.encode(`data: ${snapshot}\n\n`));

      // If job already terminal, close immediately
      if (['completed', 'failed', 'cancelled'].includes(job.status)) {
        controller.close();
        return;
      }

      // Heartbeat to keep the connection alive through proxies
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch {
          clearInterval(heartbeat);
        }
      }, HEARTBEAT_MS);

      // Subscribe to real-time events
      const unsubscribe = subscribe(id, (event: JobEvent) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));

          // Close stream on terminal events
          if (['completed', 'failed', 'cancelled'].includes(event.type)) {
            clearInterval(heartbeat);
            controller.close();
          }
        } catch {
          clearInterval(heartbeat);
          unsubscribe();
        }
      });

      // Clean up when client disconnects
      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
