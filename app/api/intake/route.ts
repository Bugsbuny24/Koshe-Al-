import { NextRequest, NextResponse } from 'next/server';
import { generateJson } from '@/lib/ai/gemini';
import { classifyIntent, getConfidence } from '@/lib/intake/classifyIntent';
import { buildClarifyingQuestions } from '@/lib/intake/buildClarifyingQuestions';
import { mapIntentToFlow } from '@/lib/intake/mapIntentToFlow';
import { mapIntentToTemplate } from '@/lib/intake/mapIntentToTemplate';
import { generateVisibleReply } from '@/lib/intake/generateVisibleReply';
import { formatRecommendation, formatVisibleSummary } from '@/lib/intake/formatRecommendation';
import type { ChatTurnResult, IntentType, RecommendedFlow } from '@/types/intake';

interface AiChatResponse {
  assistant_visible_reply: string;
  business_goal: string;
  auto_scope_seed: string | null;
}

const VALID_INTENTS = new Set<IntentType>([
  'marketing_page', 'offer_page', 'booking_flow', 'simple_code_task',
  'web_project', 'automation_task', 'internal_tool', 'learning_request',
  'growth_asset', 'unknown',
]);

function buildConversationalPrompt(
  message: string,
  intent: IntentType,
  confidence: 'low' | 'medium' | 'high',
): string {
  // intent is always a fixed enum value from classifyIntent(); validate for safety
  const safeIntent = VALID_INTENTS.has(intent) ? intent : 'unknown';
  // Sanitize user message: escape backslashes first, then quotes (prevents prompt/JSON injection)
  const safeMessage = message.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/`/g, "'");

  const signalNote =
    confidence === 'low'
      ? 'Mesaj çok kısa ya da genel — nazikçe ne üretmek istediğini sor (max 1-2 soru).'
      : confidence === 'medium'
        ? `Mesaj kısmen anlaşıldı (kategori: ${safeIntent}) — yeterli detay yoksa bir netleştirici soru sor.`
        : `Mesaj yeterince açık (kategori: ${safeIntent}) — kısa özet + yönlendirme yap.`;

  return `
Sen Koschei'sin — sıcak, yönlendirici ve profesyonel bir AI ürün operatörü.
Kullanıcıya doğal Türkçe ile cevap ver.

Kullanıcı mesajı: "${safeMessage}"

Sinyal notu (iç kullanım — kullanıcıya söyleme): ${signalNote}

Kurallar:
- "düşük güven", "tespit edilen niyet", "genel talep", "low confidence" gibi sistem terimlerini KULLANMA
- İlk cevap daima sıcak ve konuşma diliyle başlasın
- Cevap 2-4 cümle, aşırı uzun olmasın
- Kullanıcının tonu samimiyse (kanka, nbr gibi) samimi karşılık ver ama profesyonelliği kaybetme
- Türkçe doğal konuşma dili kullan

Ayrıca kısa bir iş hedefi özeti çıkar.

Şu JSON formatında döndür:
{
  "assistant_visible_reply": "kullanıcıya gösterilecek doğal cevap",
  "business_goal": "iş hedefinin kısa özeti (1-2 cümle, Türkçe) — yeterli bilgi yoksa 'Henüz netleşmedi'",
  "auto_scope_seed": "başlangıç kapsam tohumu (1 paragraf) ya da null"
}

Sadece JSON döndür.
`.trim();
}

const FALLBACK_AI: AiChatResponse = {
  assistant_visible_reply: '',
  business_goal: 'Talebin detaylı analizi tamamlanamadı.',
  auto_scope_seed: null,
};

function isValidAiResponse(data: unknown): data is AiChatResponse {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return typeof d.assistant_visible_reply === 'string' && typeof d.business_goal === 'string';
}

function buildCtaHref(
  flow: RecommendedFlow,
  message: string,
  businessGoal: string,
  autoScopeSeed: string | null,
  intent: IntentType,
  template: string | null,
): string {
  if (flow === 'execution') {
    const params = new URLSearchParams({
      brief: autoScopeSeed ?? message,
      intakeIntent: intent,
      suggestedTitle: businessGoal.slice(0, 80),
      ...(template ? { template } : {}),
    });
    return `/execution/new?${params.toString()}`;
  }
  if (flow === 'builder') {
    const params = new URLSearchParams({ prompt: message, source: 'chat' });
    return `/builder?${params.toString()}`;
  }
  // mentor
  const params = new URLSearchParams({ topic: message, source: 'chat' });
  return `/mentor?${params.toString()}`;
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

    // Hidden routing layer — runs in background, results NOT shown raw to user
    const hidden_intent = classifyIntent(trimmedMessage);
    const hidden_confidence = getConfidence(trimmedMessage, hidden_intent);
    const hidden_recommended_flow = mapIntentToFlow(hidden_intent);
    const recommended_template = mapIntentToTemplate(hidden_intent);
    const allClarifyingQuestions = buildClarifyingQuestions(hidden_intent);

    // Show at most 2 clarifying questions (only when confidence is low/medium)
    const clarifying_questions =
      hidden_confidence === 'high' ? [] : allClarifyingQuestions.slice(0, 2);

    // Try to get AI-generated conversational reply
    let aiData: AiChatResponse = FALLBACK_AI;
    try {
      const prompt = buildConversationalPrompt(trimmedMessage, hidden_intent, hidden_confidence);
      const result = await generateJson<AiChatResponse>(prompt);
      if (isValidAiResponse(result)) {
        aiData = result;
      }
    } catch {
      // Fallback to heuristic reply
    }

    // Use heuristic fallback for visible reply if AI failed
    const assistant_visible_reply =
      aiData.assistant_visible_reply ||
      generateVisibleReply(trimmedMessage, hidden_intent, hidden_confidence, hidden_recommended_flow);

    const hidden_summary = aiData.business_goal;

    // Only surface the summary/recommendation card when signal is sufficient
    const showCard = hidden_confidence === 'medium' || hidden_confidence === 'high';

    const { visible_recommendation_title, visible_recommendation_body, cta_label } =
      formatRecommendation(hidden_intent, hidden_recommended_flow, hidden_summary);

    const result: ChatTurnResult = {
      assistant_visible_reply,
      hidden_intent,
      hidden_confidence,
      hidden_recommended_flow,
      hidden_summary,
      visible_summary: showCard ? formatVisibleSummary(hidden_summary, hidden_intent) : null,
      visible_recommendation_title: showCard ? visible_recommendation_title : null,
      visible_recommendation_body: showCard ? visible_recommendation_body : null,
      clarifying_questions,
      cta: showCard
        ? {
            label: cta_label,
            href: buildCtaHref(
              hidden_recommended_flow,
              trimmedMessage,
              hidden_summary,
              aiData.auto_scope_seed,
              hidden_intent,
              recommended_template,
            ),
          }
        : null,
    };

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error('intake route error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}

