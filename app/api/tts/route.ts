import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { getGenAI, checkAccess, deductCredits, MODELS, logUsage } from '@/lib/gemini/client';

const SPEED_RATE: Record<string, number> = {
  slow: 0.7,
  normal: 1.0,
  fast: 1.4,
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
    const { text, voice = 'Aoede', speed = 'normal' } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Metin gerekli', code: 'INVALID_INPUT' }, { status: 400 });
    }

    if (text.length > 500) {
      return NextResponse.json({ error: 'Metin çok uzun (max 500 karakter)', code: 'TEXT_TOO_LONG' }, { status: 400 });
    }

    const access = await checkAccess(userId, 'tts');
    if (!access.allowed) {
      const msgs: Record<string, string> = {
        upgrade_required: 'TTS Starter plan ile kullanılabilir',
        insufficient_credits: 'Yetersiz kredi (0.5 kredi gerekli)',
        no_plan: 'Aktif planınız yok',
        plan_expired: 'Planınızın süresi dolmuş',
      };
      return NextResponse.json(
        { error: msgs[access.reason || ''] || 'Erişim reddedildi', code: 'ACCESS_DENIED' },
        { status: 403 }
      );
    }

    const speedRate = SPEED_RATE[speed] ?? 1.0;
    const processedText = speedRate !== 1.0
      ? `<speak><prosody rate="${speedRate}">${text}</prosody></speak>`
      : text;

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: MODELS.FLASH_TTS });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: processedText }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      } as Record<string, unknown>,
    });

    const candidate = result.response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(
      (p) => 'inlineData' in p
    ) as { inlineData: { data: string; mimeType: string } } | undefined;

    if (!audioPart?.inlineData) {
      return NextResponse.json({ error: 'Ses üretilemedi', code: 'GENERATION_FAILED' }, { status: 500 });
    }

    await deductCredits(userId, 'tts');
    await logUsage(userId, MODELS.FLASH_TTS, 0, 0, 'tts');

    const audioBuffer = Buffer.from(audioPart.inlineData.data, 'base64');

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': audioPart.inlineData.mimeType || 'audio/wav',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    console.error('TTS API error:', err);
    const message = err instanceof Error ? err.message : 'Sunucu hatası';
    return NextResponse.json({ error: message, code: 'SERVER_ERROR' }, { status: 500 });
  }
}
