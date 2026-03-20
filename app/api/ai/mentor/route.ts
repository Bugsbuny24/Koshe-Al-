import { NextRequest } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { checkQuota, generateStream } from '@/lib/gemini/client';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { messages, teacherId, lessonContext, userId } = await req.json();

  if (!messages?.length) return new Response('Messages required', { status: 400 });

  if (userId) {
    const quota = await checkQuota(userId);
    if (!quota.allowed) {
      return new Response(JSON.stringify({ error: 'quota_exceeded' }), { status: 429 });
    }
  }

  const supabase = createSupabaseServer();
  const { data: teacher } = await supabase
    .from('teachers')
    .select('persona_prompt, name')
    .eq('id', teacherId || 'default')
    .maybeSingle();

  const isComplex = messages.at(-1)?.content?.length > 200;
  const category = isComplex ? 'mentor_complex' : 'mentor_simple';

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
        for await (const chunk of generateStream({
          messages: messages.map((m: { role: string; content: string }) => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.content,
          })),
          systemInstruction,
          category,
          userId,
        })) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch {
        controller.enqueue(encoder.encode('\n\n[Hata oluştu, tekrar dene.]'));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
