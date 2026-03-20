import { NextRequest } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { checkAccess, streamText } from '@/lib/gemini/client';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { messages, teacherId, lessonContext, userId } = await req.json();

  if (!messages?.length) return new Response('Messages required', { status: 400 });
  if (!userId) return new Response('Auth required', { status: 401 });

  const isComplex = messages.at(-1)?.content?.length > 200;
  const feature = isComplex ? 'mentor_flash' : 'mentor_lite';

  const access = await checkAccess(userId, feature);
  if (!access.allowed) {
    return new Response(JSON.stringify({
      error: access.reason,
      credits_remaining: access.credits_remaining,
    }), { status: 429, headers: { 'Content-Type': 'application/json' } });
  }

  const supabase = createSupabaseServer();
  const { data: teacher } = await supabase
    .from('teachers')
    .select('persona_prompt, name')
    .eq('id', teacherId || 'default')
    .maybeSingle();

  const systemInstruction = `
${teacher?.persona_prompt ?? 'Sen yardımsever, sabırlı bir yazılım öğretmenisin.'}
- Koshei platformunda Pioneer'lara yazılım öğretiyorsun
- Ders konusu: ${lessonContext ?? 'Genel yazılım geliştirme'}
- Pi Network ekosistemiyle örnekler kur
- Kullanıcının diline uy (Türkçe/İngilizce)
- Kod bloklarını markdown formatında yaz
`.trim();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamText({
          messages: messages.map((m: { role: string; content: string }) => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.content,
          })),
          systemInstruction,
          feature,
          userId,
        })) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Hata oluştu';
        controller.enqueue(encoder.encode(`\n\n[${msg}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
