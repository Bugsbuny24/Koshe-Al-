import type { IntentType, RecommendedFlow } from '@/types/intake';

/**
 * Generates a warm, natural Turkish conversational reply for Koschei.
 * Used as a fallback when the AI model cannot be reached.
 */
export function generateVisibleReply(
  message: string,
  intent: IntentType,
  confidence: 'low' | 'medium' | 'high',
  flow: RecommendedFlow,
): string {
  const lower = message.toLowerCase().trim();

  // Casual / greeting-like short messages
  if (lower.length <= 15 || /^(kanka|nbr|naber|ne haber|selam|merhaba|hey|hi|hello)/.test(lower)) {
    return 'Buradayım 👋 Ne üretmek istiyorsun? İstersen bir sayfa, kod, otomasyon ya da direkt iş akışı planlayabiliriz.';
  }

  if (confidence === 'low') {
    return 'Anladım. Seni daha iyi yönlendirebilmem için biraz daha detay yardımcı olur — tam olarak ne üretmek ya da çözmek istiyorsun?';
  }

  // Medium / high confidence — intent-based replies
  switch (intent) {
    case 'landing_page':
      return 'Açılış sayfası için doğru yerdesin. Hangi ürün veya hizmet için bir sayfa istiyorsun? Hedef kitleni ve asıl amacını (satış, lead, tanıtım) bilsem seni doğrudan planlama akışına sokarım.';
    case 'offer_page':
      return 'Teklif sayfası hazırlamak için iyi bir başlangıç. Hangi hizmet ya da ürün için? Paket sayısı ve hedef kitlen hakkında kısa bir bilgi versen hemen başlayabiliriz.';
    case 'whatsapp_booking_flow':
      return 'WhatsApp rezervasyon akışı kurmak için doğru yoldasın. Müşterilerden hangi bilgileri almak istiyorsun? Hangi sektör veya işletme tipi için olduğunu da söylersen seni en uygun akışa bağlarım.';
    case 'simple_code_task':
      return `Olur. ${flow === 'builder' ? 'Kod üretici' : 'Planlama'} akışını kullanacağız. Scriptin tam olarak neyi yapmasını istiyorsun? Çalışacağı ortam ve beklediğin çıktıyı söylersen seni builder'a doğrudan sokarım.`;
    case 'technical_web_project':
      return 'Güzel bir proje gibi görünüyor. Uygulamanın temel amacı ve hedef kitlesi nedir? Bunu anladıktan sonra sana hem teknik plan hem de başlangıç scope\'u çıkarabilirim.';
    case 'automation_task':
      return 'Otomasyon için doğru yoldasın. Hangi süreci otomatikleştirmek istiyorsun? Kullandığın platformları (Zapier, n8n, Make vb.) ve tetikleyici olayı bilsem seni en uygun akışa bağlarım.';
    case 'learning_request':
      return 'Bu konuyu birlikte ele alabiliriz. Mevcut bilgi seviyeni ve öğrenmek istediğin konuyu biraz daha açarsan sana kişiselleştirilmiş bir yol haritası çıkarayım.';
    default:
      return 'Anladım. Bunu birlikte netleştirelim — çıktı olarak elinde ne olmasını istiyorsun? Web sayfası, kod, otomasyon, içerik ya da iş planı gibi kategorilerden hangisi daha yakın?';
  }
}
