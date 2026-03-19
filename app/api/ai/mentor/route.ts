import { NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createSupabaseServer } from '@/lib/supabase/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const { messages, teacherId, lessonContext, userId } = await req.json();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response('Messages required', { status: 400 });
  }

  const supabase = createSupabaseServer();

  // Öğretmen karakterini al
  const { data: teacher } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', teacherId || 'default')
    .single();

  // Kullanıcı kotasını kontrol et
  if (userId) {
    const { data: quota } = await supabase
      .from('user_quotas')
      .select('credits_remaining, tier')
      .eq('user_id', userId)
      .single();

    if (quota && quota.credits_remaining <= 0) {
      return new Response('Kredi yetersiz. Pro plana geç!', { status: 429 });
    }
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: `
      ${teacher?.persona_prompt || 'Sen yardımsever bir yazılım öğretmenisin.'}
      
      Görev:
      - Koshei platformunda Pioneer'lara yazılım öğretiyorsun
      - Ders konusu: ${lessonContext || 'Genel yazılım geliştirme'}
      - Pi Network ekosistemiyle bağlantı kur
      - Kullanıcının diline göre cevap ver (Türkçe/İngilizce)
      - Kısa, net, adım adım anlat
      - Kod örneklerini Pi Network projeleriyle ilişkilendir
    `,
  });

  const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history });
  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessageStream(lastMessage.content);

  // Kullanım logla (fire and forget)
  if (userId) {
    supabase.from('ai_usage').insert({
      user_id: userId,
      model: 'gemini-2.0-flash',
      input_tokens: 0,
      output_tokens: 0,
      cost: 0,
    });
  }

  // Streaming response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        controller.enqueue(encoder.encode(chunk.text()));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
