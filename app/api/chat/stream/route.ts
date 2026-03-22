/**
 * Streaming chat endpoint — POST /api/chat/stream
 *
 * Returns a text/event-stream response so the client can render tokens
 * as they arrive — the same streaming pattern used by Dify's chat API.
 *
 * Events emitted:
 *   data: {"type":"chunk","content":"..."}   — partial token
 *   data: {"type":"done"}                    — stream finished
 *   data: {"type":"error","message":"..."}   — fatal error
 */

import { NextRequest } from 'next/server';
import { createStreamingResponse } from '@/lib/ai/stream';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function buildStreamingPrompt(
  message: string,
  history: Array<{ role: string; content: string }>,
): string {
  const historyText = history
    .slice(-6)
    .map((m) => `${m.role === 'user' ? 'Kullanıcı' : 'Koschei'}: ${m.content}`)
    .join('\n');

  // Sanitize user message to prevent prompt injection:
  // - Remove null bytes and other control characters (except newline/tab)
  // - Escape backslashes and double-quotes
  const safeMessage = message
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/`/g, "'");

  return `Sen Koschei'sin — sıcak, yönlendirici ve profesyonel bir AI Work Operator.
Kullanıcıya doğal Türkçe ile cevap ver. Cevabın 2-4 cümle olsun.

${historyText ? `Önceki konuşma:\n${historyText}\n` : ''}
Kullanıcı: "${safeMessage}"

Koschei:`.trim();
}

export async function POST(req: NextRequest) {
  let body: { message?: string; history?: Array<{ role: string; content: string }> };
  try {
    body = await req.json();
  } catch {
    return new Response(
      `data: ${JSON.stringify({ type: 'error', message: 'Geçersiz istek gövdesi' })}\n\n`,
      { status: 400, headers: { 'Content-Type': 'text/event-stream' } },
    );
  }

  const message = body?.message?.trim();
  if (!message) {
    return new Response(
      `data: ${JSON.stringify({ type: 'error', message: 'Mesaj gerekli' })}\n\n`,
      { status: 400, headers: { 'Content-Type': 'text/event-stream' } },
    );
  }

  const history = Array.isArray(body.history) ? body.history : [];
  const prompt = buildStreamingPrompt(message, history);

  return createStreamingResponse(prompt, 0.7);
}
