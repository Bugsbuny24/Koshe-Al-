import { NextRequest, NextResponse } from 'next/server';
import { checkAccess, generateText } from '@/lib/gemini/client';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { prompt, techStack, userId } = await req.json();

  if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
  if (!userId) return NextResponse.json({ error: 'Auth required' }, { status: 401 });

  const access = await checkAccess(userId, 'builder');
  if (!access.allowed) {
    return NextResponse.json({
      error: access.reason,
      plan: access.plan,
      credits_remaining: access.credits_remaining,
    }, { status: access.reason === 'upgrade_required' ? 403 : 429 });
  }

  const fullPrompt = `
Kullanıcı isteği: "${prompt}"
Tech stack: ${techStack?.join(', ') ?? 'Next.js 14, TypeScript, Tailwind CSS, Supabase, Pi SDK'}

KURALLAR:
- Pi Network SDK entegre et (Pi Auth + Pi Payment)
- Next.js 14 App Router kullan
- TypeScript, any kullanma
- Tailwind CSS ile stil ver

SADECE şu JSON formatında yanıt ver:
{
  "title": "Proje adı",
  "description": "Ne yaptığı",
  "files": [{ "path": "app/page.tsx", "content": "tam içerik" }],
  "setup_instructions": "Kurulum adımları",
  "env_variables": ["NEXT_PUBLIC_PI_APP_ID"],
  "pi_features": ["Pi Auth", "Pi Payment"]
}
`.trim();

  try {
    const { text, cached } = await generateText({
      prompt: fullPrompt,
      feature: 'builder',
      userId,
      useCache: true,
    });

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: 'Parse hatası' }, { status: 500 });

    return NextResponse.json({ ...JSON.parse(jsonMatch[0]), _meta: { cached } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Üretim başarısız';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
