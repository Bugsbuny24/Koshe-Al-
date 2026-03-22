import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteClient } from '@/lib/supabase/server';
import { generateText, checkAccess } from '@/lib/common/gemini-client';

function extractCode(text: string, language: string): string {
  // Try to extract code block from markdown
  const codeBlockRegex = new RegExp(`\`\`\`(?:${language}|\\w+)?\\n([\\s\\S]*?)\`\`\``, 'i');
  const match = text.match(codeBlockRegex);
  if (match) return match[1].trim();

  // If no code block, return as-is
  return text.trim();
}

export async function POST(req: NextRequest) {
  try {
    const supabaseAuth = await createSupabaseRouteClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor. Lütfen giriş yapın.' }, { status: 401 });
    }

    const { prompt, language = 'python' } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt gerekli' }, { status: 400 });
    }

    // Check access
    const access = await checkAccess(userId, 'builder');
    if (!access.allowed) {
      const msgs: Record<string, string> = {
        upgrade_required: 'Kod üretici Pro plan gerektirir',
        insufficient_credits: 'Yetersiz kredi (5 kredi gerekli)',
        no_plan: 'Aktif planınız yok',
      };
      return NextResponse.json(
        { error: msgs[access.reason || ''] || 'Erişim reddedildi' },
        { status: 403 }
      );
    }

    const systemPrompt = `Sen uzman bir yazılım geliştiricisin. Sadece ${language} kodu üret.
Kurallar:
- Temiz, okunabilir ve iyi yorumlanmış kod yaz
- Sadece kod döndür, fazladan açıklama ekleme
- Kodu \`\`\`${language} kod bloğu içine al
- Türkçe yorum satırları kullan
- Best practice'lere uy
- Hata yönetimi ekle`;

    const result = await generateText({
      prompt: `${language} dilinde şunu yaz: ${prompt}`,
      systemInstruction: systemPrompt,
      feature: 'builder',
      userId,
      useCache: false,
    });

    const code = extractCode(result.text, language);

    return NextResponse.json({ code, cached: result.cached });
  } catch (err) {
    console.error('Builder API error:', err);
    const message = err instanceof Error ? err.message : 'Sunucu hatası';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
