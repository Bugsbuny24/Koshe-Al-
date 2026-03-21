import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { streamText, checkAccess } from '@/lib/gemini/client';
import type { FeatureKey } from '@/lib/gemini/client';

const SYSTEM_INSTRUCTION = `Sen Koschei AI - yapay zeka destekli bir eğitim platformunun akıllı mentörüsün.

Görevin:
- Öğrencilere her konuda yardım etmek
- Açık, anlaşılır ve özlü yanıtlar vermek
- Kod örnekleri, diyagramlar ve adım adım açıklamalar kullanmak
- Türkçe sormayan kullanıcılara da Türkçe yanıt vermek (kullanıcı dil tercihine göre)
- Eğitici, sabırlı ve destekleyici bir ton kullanmak
- Markdown formatını kullanmak (başlıklar, listeler, kod blokları)

Koschei hakkında: Modern bir AI eğitim platformu. Gemini AI teknolojisi kullanır.`;

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser(
      req.headers.get('authorization')?.replace('Bearer ', '') || ''
    );

    // Try cookie-based auth as fallback
    let userId = user?.id;
    if (!userId) {
      // Get user from cookie session via service role
      const authHeader = req.headers.get('cookie') || '';
      const tokenMatch = authHeader.match(/sb-[^-]+-auth-token=([^;]+)/);
      if (tokenMatch) {
        try {
          const decoded = JSON.parse(decodeURIComponent(tokenMatch[1]));
          const { data: { user: u } } = await supabase.auth.getUser(decoded?.access_token);
          userId = u?.id;
        } catch {
          // ignore parse errors
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Kimlik doğrulaması gerekli' }, { status: 401 });
    }

    const body = await req.json();
    const { messages, feature = 'mentor_lite', sessionId } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Mesajlar gerekli' }, { status: 400 });
    }

    const validFeatures: FeatureKey[] = ['mentor_lite', 'mentor_flash'];
    const selectedFeature: FeatureKey = validFeatures.includes(feature) ? feature : 'mentor_lite';

    // Check access
    const access = await checkAccess(userId, selectedFeature);
    if (!access.allowed) {
      const errorMessages: Record<string, string> = {
        no_plan: 'Aktif planınız yok',
        plan_expired: 'Planınızın süresi dolmuş',
        upgrade_required: 'Bu özellik için planınızı yükseltmeniz gerekiyor',
        insufficient_credits: 'Yetersiz kredi',
      };
      return NextResponse.json(
        { error: errorMessages[access.reason || ''] || 'Erişim reddedildi' },
        { status: 403 }
      );
    }

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const generator = streamText({
            messages,
            systemInstruction: SYSTEM_INSTRUCTION,
            feature: selectedFeature,
            userId,
          });

          let fullResponse = '';
          for await (const chunk of generator) {
            controller.enqueue(new TextEncoder().encode(chunk));
            fullResponse += chunk;
          }

          // Save both user message and AI response to DB
          if (sessionId) {
            const lastUserMsg = messages[messages.length - 1];
            await supabase.from('chat_messages').insert([
              {
                user_id: userId,
                session_id: sessionId,
                role: 'user',
                content: lastUserMsg.content,
                feature: selectedFeature,
              },
              {
                user_id: userId,
                session_id: sessionId,
                role: 'model',
                content: fullResponse,
                feature: selectedFeature,
              },
            ]);
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Bilinmeyen hata';
          controller.enqueue(new TextEncoder().encode(`❌ Hata: ${msg}`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    console.error('Mentor API error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
