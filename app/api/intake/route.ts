import { NextRequest, NextResponse } from 'next/server';
import { generateJson } from '@/lib/ai/gemini';
import { classifyIntent, getConfidence } from '@/lib/intake/classifyIntent';
import { buildClarifyingQuestions } from '@/lib/intake/buildClarifyingQuestions';
import { mapIntentToFlow } from '@/lib/intake/mapIntentToFlow';
import { mapIntentToTemplate } from '@/lib/intake/mapIntentToTemplate';
import type { IntakeResult, IntentType } from '@/types/intake';

interface AiIntakeResponse {
  business_goal: string;
  auto_scope_seed: string | null;
}

function buildIntakePrompt(message: string, intent: IntentType): string {
  return `
Sen Koschei AI operatörüsün. Kullanıcının talebini analiz edip kısa bir iş hedefi özeti ve proje tohumunu çıkar.

Kullanıcı talebi: "${message}"
Tespit edilen niyet: ${intent}

Aşağıdaki JSON formatında cevap ver:
{
  "business_goal": "string — kullanıcının iş hedefinin kısa özeti (1-2 cümle, Türkçe)",
  "auto_scope_seed": "string veya null — başlangıç kapsam/brief tohumu (1 paragraf, Türkçe) eğer yeterli bilgi yoksa null döndür"
}

Sadece JSON döndür, başka bir şey ekleme.
`.trim();
}

const FALLBACK: AiIntakeResponse = {
  business_goal: 'Talebin detaylı analizi tamamlanamadı.',
  auto_scope_seed: null,
};

function isValidAiResponse(data: unknown): data is AiIntakeResponse {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return typeof d.business_goal === 'string';
}

export async function POST(req: NextRequest) {
  try {
    let body: { message?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Geçersiz istek gövdesi' }, { status: 400 });
    }

    const { message } = body;
    if (!message?.trim()) {
      return NextResponse.json({ success: false, error: 'Mesaj gerekli' }, { status: 400 });
    }

    const trimmedMessage = message.trim();
    const detected_intent = classifyIntent(trimmedMessage);
    const confidence = getConfidence(trimmedMessage, detected_intent);
    const recommended_flow = mapIntentToFlow(detected_intent);
    const recommended_template = mapIntentToTemplate(detected_intent);
    const clarifying_questions = buildClarifyingQuestions(detected_intent);

    // Try to get AI-enhanced business goal and scope seed
    let aiData: AiIntakeResponse = FALLBACK;
    try {
      const prompt = buildIntakePrompt(trimmedMessage, detected_intent);
      const result = await generateJson<AiIntakeResponse>(prompt);
      if (isValidAiResponse(result)) {
        aiData = result;
      }
    } catch {
      // Fallback to heuristic-only result
    }

    const intakeResult: IntakeResult = {
      raw_user_request: trimmedMessage,
      detected_intent,
      business_goal: aiData.business_goal,
      recommended_flow,
      recommended_template,
      clarifying_questions,
      auto_scope_seed: aiData.auto_scope_seed,
      confidence,
    };

    return NextResponse.json({ success: true, data: intakeResult });
  } catch (err) {
    console.error('intake route error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
