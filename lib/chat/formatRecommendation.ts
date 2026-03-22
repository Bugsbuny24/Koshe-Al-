import type { IntentType, RecommendedFlow } from '@/types/intake';

interface RecommendationOutput {
  visible_recommendation_title: string;
  visible_recommendation_body: string;
  cta_label: string;
}

const FLOW_COPY: Record<RecommendedFlow, { title: string; body: string; cta: string }> = {
  execution: {
    title: 'Planlama akışında başlayalım',
    body: 'Bunu execution planning akışında işleyeceğiz — önce scope ve iş planını çıkaracağız, sonra uygulamaya geçeceğiz.',
    cta: 'Planlamayı Başlat',
  },
  builder: {
    title: 'Kod üretici akışı en uygun seçenek',
    body: 'Talebini doğrudan kod üretim aracına aktaracağız; çalışır kodu hızlıca elde edersin.',
    cta: "Builder'a Geç",
  },
  mentor: {
    title: 'Öğrenme akışını açalım',
    body: 'Bu konuyu adım adım AI mentörle ele alacağız — hem öğrenecek hem de uygulamalı rehberlik alacaksın.',
    cta: 'Öğrenme Akışını Aç',
  },
};

const INTENT_SUMMARY: Partial<Record<IntentType, string>> = {
  marketing_page: 'Pazarlama / açılış sayfası',
  offer_page: 'Teklif / fiyatlandırma sayfası',
  booking_flow: 'Rezervasyon ve randevu akışı',
  simple_code_task: 'Kod geliştirme görevi',
  web_project: 'Web / uygulama projesi',
  automation_task: 'Otomasyon ve entegrasyon',
  internal_tool: 'İç araç / admin panel',
  learning_request: 'Öğrenme ve keşif',
  growth_asset: 'Büyüme varlığı / içerik',
};

/**
 * Builds user-friendly recommendation copy shown in the recommendation card.
 * Internal labels (intent type, confidence enum) are never included.
 */
export function formatRecommendation(
  intent: IntentType,
  flow: RecommendedFlow,
  businessGoal: string,
): RecommendationOutput {
  const base = FLOW_COPY[flow];
  const intentLabel = INTENT_SUMMARY[intent];

  const title = intentLabel
    ? `${intentLabel} — ${base.title}`
    : base.title;

  const body = businessGoal && businessGoal !== 'Talebin detaylı analizi tamamlanamadı.'
    ? `${businessGoal} ${base.body}`
    : base.body;

  return {
    visible_recommendation_title: title,
    visible_recommendation_body: body,
    cta_label: base.cta,
  };
}

/**
 * Returns a short, friendly summary text that replaces raw classification labels.
 */
export function formatVisibleSummary(businessGoal: string, intent: IntentType): string {
  const intentLabel = INTENT_SUMMARY[intent];
  if (businessGoal && businessGoal !== 'Talebin detaylı analizi tamamlanamadı.') {
    return `Senden şunu anladım: ${businessGoal}`;
  }
  if (intentLabel) {
    return `Senden şunu anladım: ${intentLabel} konusunda yardım istiyorsun.`;
  }
  return 'Daha net yönlendirebilmem için kısa bir detay lazım.';
}
