import type { IntentType } from '@/types/intake';

const INTENT_KEYWORDS: Record<IntentType, string[]> = {
  marketing_page: [
    'landing', 'landing page', 'açılış sayfası', 'tanıtım sayfası', 'promo page',
    'pazarlama sayfası', 'kampanya sayfası', 'web sitesi', 'website', 'tanıtım sitesi',
    'marketing', 'satış sayfası', 'promosyon',
  ],
  offer_page: [
    'teklif', 'fiyat', 'offer', 'quote', 'öneri sayfası', 'paket', 'fiyatlandırma',
    'pricing', 'teklifim', 'hizmet paketi',
  ],
  booking_flow: [
    'whatsapp', 'rezervasyon', 'randevu', 'booking', 'rezerve', 'mesaj botu',
    'chatbot', 'whatsapp botu', 'otomasyon botu', 'appointment', 'form doldur',
    'müşteri al', 'lead toplama',
  ],
  simple_code_task: [
    'kod yaz', 'fonksiyon', 'algoritma', 'script', 'python', 'javascript', 'typescript',
    'rust', 'go', 'java', 'c++', 'sql', 'sorgu', 'query', 'snippet', 'helper',
    'basit kod', 'küçük kod', 'kısa kod',
  ],
  web_project: [
    'web projesi', 'uygulama yap', 'full stack', 'frontend', 'backend', 'api',
    'dashboard', 'panel', 'platform', 'sistem kur', 'proje geliştir', 'saas',
    'e-ticaret', 'ecommerce', 'mvp', 'web app', 'uygulama',
  ],
  automation_task: [
    'otomasyon', 'automation', 'otomatik', 'workflow', 'iş akışı', 'entegrasyon',
    'integration', 'zapier', 'make', 'n8n', 'webhook', 'tetikleyici', 'cron',
    'pipeline', 'trigger',
  ],
  internal_tool: [
    'iç araç', 'admin panel', 'dashboard', 'internal tool', 'ekip için', 'şirket içi',
    'raporlama', 'takip sistemi', 'yönetim paneli', 'ops tool', 'management',
  ],
  learning_request: [
    'öğren', 'anlat', 'nedir', 'nasıl', 'ne demek', 'açıkla', 'öğrenmek istiyorum',
    'explain', 'what is', 'how to', 'learn', 'teach', 'tutorial', 'ders',
    'eğitim', 'kurs', 'workshop',
  ],
  growth_asset: [
    'büyüme', 'growth', 'içerik', 'content', 'sosyal medya', 'social media',
    'email', 'newsletter', 'pazarlama içeriği', 'blog', 'seo', 'marka',
    'kampanya', 'strateji', 'plan yap',
  ],
  unknown: [],
};

export function classifyIntent(message: string): IntentType {
  const lower = message.toLowerCase();

  let bestIntent: IntentType = 'unknown';
  let bestScore = 0;

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS) as [IntentType, string[]][]) {
    if (intent === 'unknown') continue;
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        score += kw.split(' ').length; // multi-word keywords score higher
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  return bestIntent;
}

export function getConfidence(message: string, intent: IntentType): 'low' | 'medium' | 'high' {
  if (intent === 'unknown') return 'low';
  const lower = message.toLowerCase();
  const keywords = INTENT_KEYWORDS[intent];
  const matches = keywords.filter((kw) => lower.includes(kw)).length;
  if (matches >= 3) return 'high';
  if (matches >= 1) return 'medium';
  return 'low';
}
