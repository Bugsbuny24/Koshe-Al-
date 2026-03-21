import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { generateText } from '@/lib/gemini/client';

async function resolveUserId(req: NextRequest): Promise<string | undefined> {
  const supabase = createSupabaseServer();
  const authHeader = req.headers.get('authorization');
  if (authHeader) {
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (user?.id) return user.id;
  }
  const cookieHeader = req.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/sb-[^-]+-auth-token=([^;]+)/);
  if (tokenMatch) {
    try {
      const decoded = JSON.parse(decodeURIComponent(tokenMatch[1]));
      const { data: { user: u } } = await supabase.auth.getUser(decoded?.access_token);
      if (u?.id) return u.id;
    } catch {
      // ignore
    }
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await resolveUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor', code: 'UNAUTHENTICATED' }, { status: 401 });
    }

    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Mesajlar gerekli', code: 'INVALID_INPUT' }, { status: 400 });
    }

    const conversationText = messages
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'Öğrenci' : 'Mentor'}: ${m.content}`)
      .join('\n');

    const prompt = `Aşağıdaki sohbeti özetle ve ana noktaları çıkar.

Sohbet:
${conversationText.slice(0, 4000)}

JSON formatında yanıt ver (başka hiçbir şey ekleme):
{
  "summary": "Kısa özet metni",
  "keyPoints": ["Ana nokta 1", "Ana nokta 2", "Ana nokta 3"],
  "nextSteps": ["Sonraki adım 1", "Sonraki adım 2"]
}

Tüm içerik Türkçe olmalı.`;

    const result = await generateText({
      prompt,
      feature: 'mentor_lite',
      userId,
      useCache: false,
    });

    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Özet oluşturulamadı', code: 'GENERATION_FAILED' }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json({
      summary: parsed.summary || '',
      keyPoints: parsed.keyPoints || [],
      nextSteps: parsed.nextSteps || [],
    });
  } catch (err) {
    console.error('Summary generation error:', err);
    return NextResponse.json({ error: 'Sunucu hatası', code: 'SERVER_ERROR' }, { status: 500 });
  }
}
