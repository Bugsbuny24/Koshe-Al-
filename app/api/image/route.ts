import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { checkAccess, deductCredits, MODELS, getGenAI, logUsage } from '@/lib/gemini/client';

const STYLE_PROMPTS: Record<string, string> = {
  'realistic': 'photorealistic, highly detailed, professional photography',
  'anime': 'anime style, vibrant colors, manga art',
  'digital-art': 'digital art, concept art, artstation trending',
  'oil-painting': 'oil painting, impressionist, textured brushstrokes',
  'minimalist': 'minimalist design, clean lines, simple composition',
};

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

    const body = await req.json();
    const { prompt, style = 'realistic', aspectRatio = '1:1' } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt gerekli', code: 'INVALID_INPUT' }, { status: 400 });
    }

    const access = await checkAccess(userId, 'image_gen');
    if (!access.allowed) {
      const msgs: Record<string, string> = {
        upgrade_required: 'Görsel üretici Pro veya Prestige plan gerektirir',
        insufficient_credits: 'Yetersiz kredi (10 kredi gerekli)',
        no_plan: 'Aktif planınız yok',
        plan_expired: 'Planınızın süresi dolmuş',
      };
      return NextResponse.json(
        { error: msgs[access.reason || ''] || 'Erişim reddedildi', code: 'ACCESS_DENIED' },
        { status: 403 }
      );
    }

    const styleDesc = STYLE_PROMPTS[style] || STYLE_PROMPTS['realistic'];
    const enhancedPrompt = `${prompt.trim()}, ${styleDesc}, high quality, detailed`;

    const genAI = getGenAI();
    const imageModel = genAI.getGenerativeModel({ model: MODELS.IMAGE_FAST });

    const result = await imageModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: enhancedPrompt }] }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        ...(aspectRatio && { aspectRatio }),
      } as Record<string, unknown>,
    });

    const candidate = result.response.candidates?.[0];
    const imagePart = candidate?.content?.parts?.find(
      (p) => 'inlineData' in p
    ) as { inlineData: { data: string; mimeType: string } } | undefined;

    if (!imagePart?.inlineData) {
      return NextResponse.json({ error: 'Görsel üretilemedi', code: 'GENERATION_FAILED' }, { status: 500 });
    }

    await deductCredits(userId, 'image_gen');
    await logUsage(userId, MODELS.IMAGE_FAST, 0, 0, 'image_gen');

    return NextResponse.json({
      image: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType || 'image/png',
    });
  } catch (err) {
    console.error('Image API error:', err);
    const message = err instanceof Error ? err.message : 'Sunucu hatası';
    return NextResponse.json({ error: message, code: 'SERVER_ERROR' }, { status: 500 });
  }
}
