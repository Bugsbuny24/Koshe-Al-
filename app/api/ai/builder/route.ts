import { NextRequest, NextResponse } from 'next/server';
import { checkQuota, generateWithRouting } from '@/lib/gemini/client';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { prompt, techStack, userId } = await req.json();

  if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 });

  if (userId) {
    const quota = await checkQuota(userId);
    if (!quota.allowed) return NextResponse.json({ error: 'quota_exceeded' }, { status: 429 });
    if (quota.tier === 'free') return NextResponse.json({ error: 'pro_required' }, { status: 403 });
  }

  const fullPrompt = `
Kullanıcı isteği: "${prompt}"
Tech stack: ${techStack?.join(', ') ?? 'Next.js 14, TypeScript, Tailwind, Supabase, Pi SDK'}

Aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:
{
  "title": "Proje adı",
  "description": "Ne yaptığı",
  "files": [
    { "path": "app/page.tsx", "content": "tam içerik" }
  ],
  "setup_instructions": "Kurulum adımları",
  "env_variables": ["NEXT_PUBLIC_PI_APP_ID"],
  "pi_features": ["Pi Auth", "Pi Payment"]
}
`.trim();

  try {
    const { text, cached, model } = await generateWithRouting({
      prompt: fullPrompt,
      category: 'builder',
      userId,
      useCache: true,
    });

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return NextResponse.json({ error: 'Parse hatası' }, { status: 500 });

    return NextResponse.json({ ...JSON.parse(jsonMatch[0]), _meta: { cached, model } });
  } catch {
    return NextResponse.json({ error: 'Üretim başarısız' }, { status: 500 });
  }
}
