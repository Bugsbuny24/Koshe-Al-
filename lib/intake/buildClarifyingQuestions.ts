import type { IntentType } from '@/types/intake';

const CLARIFYING_QUESTIONS: Record<IntentType, string[]> = {
  landing_page: [
    'Hangi sektör veya ürün için bir açılış sayfası istiyorsunuz?',
    'Sayfanın birincil amacı nedir? (lead toplama, satış, tanıtım)',
    'Mevcut bir marka kimliğiniz var mı? (renk, logo, ton)',
  ],
  offer_page: [
    'Hangi hizmet veya ürün için teklif sayfası hazırlanacak?',
    'Kaç adet paket veya fiyat seçeneği olmasını istiyorsunuz?',
    'Hedef kitleniz kimler?',
  ],
  whatsapp_booking_flow: [
    'Hangi tür rezervasyon veya randevu akışı gerekiyor?',
    'Müşteriler hangi bilgileri dolduracak? (isim, tarih, hizmet)',
    'Onay bildirimi nasıl gönderilmeli? (otomatik mesaj, e-posta)',
  ],
  simple_code_task: [
    'Hangi programlama dilinde kod gerekiyor?',
    'Bu kodun tam olarak ne yapmasını istiyorsunuz?',
    'Herhangi bir kısıtlama veya özel gereksinim var mı?',
  ],
  technical_web_project: [
    'Projenin ana amacı ve hedef kitlesi nedir?',
    'Hangi temel özellikler olmalı?',
    'Tercih ettiğiniz bir teknoloji stack var mı?',
    'Projenin tahmini kapsamı ve teslim tarihi nedir?',
  ],
  automation_task: [
    'Hangi süreç veya iş akışını otomatikleştirmek istiyorsunuz?',
    'Hangi araçlar veya platformlar kullanılıyor? (Slack, Google Sheets, vb.)',
    'Tetikleyici olay nedir ve sonuç ne olmalı?',
  ],
  learning_request: [
    'Hangi konuyu öğrenmek istiyorsunuz?',
    'Mevcut bilgi seviyeniz nedir? (başlangıç, orta, ileri)',
    'Pratik mi yoksa teorik öğrenmeyi mi tercih edersiniz?',
  ],
  unknown: [
    'Projeniz veya talebiniz hakkında daha fazla detay verebilir misiniz?',
    'Çıktı olarak ne elde etmek istiyorsunuz?',
    'Bu talep ne zaman tamamlanmalı?',
  ],
};

export function buildClarifyingQuestions(intent: IntentType): string[] {
  return CLARIFYING_QUESTIONS[intent] ?? CLARIFYING_QUESTIONS.unknown;
}
