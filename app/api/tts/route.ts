import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { getGenAI, checkAccess, deductCredits, MODELS } from '@/lib/gemini/client';

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

    const { text } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Metin gerekli' }, { status: 400 });
    }

    if (text.length > 5000) {
      return NextResponse.json({ error: 'Metin çok uzun (max 5000 karakter)' }, { status: 400 });
    }

    const access = await checkAccess(userId, 'tts');
    if (!access.allowed) {
      const msgs: Record<string, string> = {
        upgrade_required: 'TTS Starter plan ile kullanılabilir',
        insufficient_credits: 'Yetersiz kredi (0.5 kredi gerekli)',
        no_plan: 'Aktif planınız yok',
      };
      return NextResponse.json(
        { error: msgs[access.reason || ''] || 'Erişim reddedildi' },
        { status: 403 }
      );
    }

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: MODELS.FLASH_TTS });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Aoede' },
          },
        },
      } as Record<string, unknown>,
    });

    const candidate = result.response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(
      (p) => 'inlineData' in p
    ) as { inlineData: { data: string; mimeType: string } } | undefined;

    if (!audioPart?.inlineData) {
      return NextResponse.json({ error: 'Ses üretilemedi' }, { status: 500 });
    }

    await deductCredits(userId, 'tts');

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
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
