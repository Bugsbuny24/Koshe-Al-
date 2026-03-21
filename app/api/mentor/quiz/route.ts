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

    const { conversationHistory } = await req.json();
    if (!Array.isArray(conversationHistory) || conversationHistory.length === 0) {
      return NextResponse.json({ error: 'Sohbet geçmişi gerekli', code: 'INVALID_INPUT' }, { status: 400 });
    }

    const conversationText = conversationHistory
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'Öğrenci' : 'Mentor'}: ${m.content}`)
      .join('\n');

    const prompt = `Aşağıdaki sohbet içeriğine dayanarak 5 adet çoktan seçmeli soru oluştur.

Sohbet:
${conversationText.slice(0, 3000)}

JSON formatında yanıt ver (başka hiçbir şey ekleme):
{
  "questions": [
    {
      "question": "Soru metni",
      "options": ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği"],
      "correctIndex": 0
    }
  ]
}

Sorular sohbet içeriğiyle ilgili olmalı, Türkçe yazılmalı.`;

    const result = await generateText({
      prompt,
      feature: 'mentor_lite',
      userId,
      useCache: false,
    });

    const jsonMatch = result.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Quiz oluşturulamadı', code: 'GENERATION_FAILED' }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ questions: parsed.questions || [] });
  } catch (err) {
    console.error('Quiz generation error:', err);
    return NextResponse.json({ error: 'Sunucu hatası', code: 'SERVER_ERROR' }, { status: 500 });
  }
}
