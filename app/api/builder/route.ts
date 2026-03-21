import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { generateText, checkAccess } from '@/lib/gemini/client';

function extractCode(text: string, language: string): string {
  // Try to extract code block from markdown
  const codeBlockRegex = new RegExp(`\`\`\`(?:${language}|\\w+)?\\n([\\s\\S]*?)\`\`\``, 'i');
  const match = text.match(codeBlockRegex);
  if (match) return match[1].trim();

  // If no code block, return as-is
  return text.trim();
}

function isImageRequest(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return lower.includes('görsel') || lower.includes('resim') || lower.includes('image') || lower.includes('fotoğraf');
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseServer();
    
    // Auth check
    let userId: string | undefined;
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id;
    }

    if (!userId) {
      // Try via service role with cookies
      const cookieHeader = req.headers.get('cookie') || '';
      const tokenMatch = cookieHeader.match(/sb-[^-]+-auth-token=([^;]+)/);
      if (tokenMatch) {
        try {
          const decoded = JSON.parse(decodeURIComponent(tokenMatch[1]));
          const { data: { user: u } } = await supabase.auth.getUser(decoded?.access_token);
          userId = u?.id;
        } catch {
          // ignore
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor', code: 'UNAUTHENTICATED' }, { status: 401 });
    }

    const { prompt, language = 'python' } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt gerekli', code: 'INVALID_INPUT' }, { status: 400 });
    }

    // Route image generation requests
    if (isImageRequest(prompt)) {
      const access = await checkAccess(userId, 'image_gen');
      if (!access.allowed) {
        return NextResponse.json(
          { error: 'Görsel üretici için Pro veya Prestige plan gereklidir', code: 'ACCESS_DENIED' },
          { status: 403 }
        );
      }
      // Forward to image API
      const imageRes = await fetch(new URL('/api/image', req.url), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(authHeader ? { Authorization: authHeader } : {}) },
        body: JSON.stringify({ prompt, style: 'realistic' }),
      });
      const imageData = await imageRes.json();
      return NextResponse.json({ ...imageData, type: 'image' }, { status: imageRes.status });
    }

    // Check access for code builder
    const access = await checkAccess(userId, 'builder');
    if (!access.allowed) {
      const msgs: Record<string, string> = {
        upgrade_required: 'Kod üretici Pro plan gerektirir',
        insufficient_credits: 'Yetersiz kredi (5 kredi gerekli)',
        no_plan: 'Aktif planınız yok',
      };
      return NextResponse.json(
        { error: msgs[access.reason || ''] || 'Erişim reddedildi', code: 'ACCESS_DENIED' },
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
    return NextResponse.json({ error: message, code: 'SERVER_ERROR' }, { status: 500 });
  }
}
