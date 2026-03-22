/**
 * Streaming Gemini support — inspired by Dify's streaming mode.
 *
 * Dify streams LLM token chunks to the client via SSE, so users see
 * partial responses as they arrive rather than waiting for the full
 * completion.  This module wraps the Gemini streaming endpoint and
 * exposes helpers for both server-side accumulation and SSE push.
 */

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY env değişkeni eksik');
  return key;
}

/**
 * Stream a Gemini completion and call `onChunk` for every text delta.
 * Returns the full accumulated text once the stream is exhausted.
 */
export async function streamText(
  prompt: string,
  onChunk: (chunk: string) => void,
  temperature = 0.3,
): Promise<string> {
  const key = getApiKey();
  const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${key}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`Gemini Streaming API hatası: ${response.status} ${errBody}`);
  }

  if (!response.body) {
    throw new Error('Gemini Streaming API yanıt gövdesi boş');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE lines are separated by \n\n; parse each data: line
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const jsonStr = line.slice(5).trim();
      if (!jsonStr || jsonStr === '[DONE]') continue;

      try {
        const parsed = JSON.parse(jsonStr);
        const chunk: string | undefined =
          parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (chunk) {
          accumulated += chunk;
          onChunk(chunk);
        }
      } catch {
        // Ignore malformed SSE chunks
      }
    }
  }

  // Flush any remaining buffer content
  if (buffer) {
    const trimmed = buffer.trim();
    if (trimmed.startsWith('data:')) {
      const jsonStr = trimmed.slice(5).trim();
      if (jsonStr && jsonStr !== '[DONE]') {
        try {
          const parsed = JSON.parse(jsonStr);
          const chunk: string | undefined =
            parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (chunk) {
            accumulated += chunk;
            onChunk(chunk);
          }
        } catch {
          // Ignore
        }
      }
    }
  }

  return accumulated;
}

/**
 * Build a ReadableStream that emits SSE-formatted events for each token chunk.
 * Suitable for returning directly from a Next.js Route Handler as a
 * `text/event-stream` response — the same streaming pattern used by Dify.
 */
export function createStreamingResponse(prompt: string, temperature = 0.7): Response {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        await streamText(
          prompt,
          (chunk) => {
            const data = JSON.stringify({ type: 'chunk', content: chunk });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          },
          temperature,
        );
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Bilinmeyen hata';
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', message: msg })}\n\n`),
        );
      } finally {
        controller.close();
      }
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
