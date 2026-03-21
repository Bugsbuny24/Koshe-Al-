import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { checkAccess, deductCredits, MODELS, getGenAI } from '@/lib/gemini/client';

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseServer();

    let userId: string | undefined;
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id;
    }

    if (!userId) {
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
      return NextResponse.json({ error: 'Kimlik doğrulaması gerekli' }, { status: 401 });
    }

    const { prompt, aspectRatio = '1:1', style } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt gerekli' }, { status: 400 });
    }

    const access = await checkAccess(userId, 'image_gen');
    if (!access.allowed) {
      const msgs: Record<string, string> = {
        upgrade_required: 'Görsel üretici Pro plan gerektirir',
        insufficient_credits: 'Yetersiz kredi (10 kredi gerekli)',
        no_plan: 'Aktif planınız yok',
      };
      return NextResponse.json(
        { error: msgs[access.reason || ''] || 'Erişim reddedildi' },
        { status: 403 }
      );
    }

    const genAI = getGenAI();
    const imageModel = genAI.getGenerativeModel({ model: MODELS.IMAGE_FAST });

    const result = await imageModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Generate an educational image: ${prompt}${style ? `. Style: ${style}` : ''}`,
            },
          ],
        },
      ],
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
      return NextResponse.json({ error: 'Görsel üretilemedi' }, { status: 500 });
    }

    await deductCredits(userId, 'image_gen');

    return NextResponse.json({
      image: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType || 'image/png',
    });
  } catch (err) {
    console.error('Image API error:', err);
    const message = err instanceof Error ? err.message : 'Sunucu hatası';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
