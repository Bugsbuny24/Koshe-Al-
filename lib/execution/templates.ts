import type { TemplateRuntimeResult } from '@/types/execution';

export const EXECUTION_TEMPLATES: Record<string, TemplateRuntimeResult> = {
  'hotel-landing': {
    template_id: 'hotel-landing',
    title: 'Hotel Landing Page Project',
    description: 'Direct booking focused hotel landing page',
    brief_seed: 'Otel için direkt rezervasyon odaklı landing page ve CTA yapısı oluştur',
    scope_seed:
      'Direkt rezervasyon odaklı hotel landing page. Hero section, oda tipleri, fiyat kartları, rezervasyon formu ve WhatsApp CTA içermeli. Mobile-first, SEO temel.',
    default_milestone_mode: 'standard',
    revision_policy: [
      '2 revizyon hakkı dahildir',
      'Revizyon talepleri scope kapsamında değerlendirilir',
      'Ek özellikler yeni iş talebi olarak değerlendirilir',
    ],
    acceptance_criteria: [
      'Tüm sayfalar mobile ve desktop\'ta düzgün görüntüleniyor',
      'Rezervasyon formu çalışıyor',
      'WhatsApp yönlendirmesi aktif',
      'Sayfa yüklenme süresi 3 saniyenin altında',
    ],
    delivery_checklist_seed: [
      'Hero section tasarım ve içerik tamamlandı',
      'Oda tipleri kartları eklendi',
      'Rezervasyon formu entegre edildi',
      'WhatsApp CTA bağlantısı aktif',
      'Mobile responsive test tamamlandı',
      'SEO meta tagları eklendi',
      'Analytics kodu yerleştirildi',
    ],
  },
  'hotel-whatsapp': {
    template_id: 'hotel-whatsapp',
    title: 'Hotel WhatsApp Booking Flow',
    description: 'WhatsApp reservation inquiry flow',
    brief_seed: 'Otel için WhatsApp rezervasyon ve talep toplama akışı oluştur',
    scope_seed:
      'WhatsApp üzerinden rezervasyon talep akışı. Ön rezervasyon formu, otomatik WhatsApp mesaj şablonu, talep toplama ve yönlendirme sistemi.',
    default_milestone_mode: 'fast',
    revision_policy: [
      '1 revizyon hakkı dahildir',
      'Mesaj şablonları müşteri onayına göre güncellenir',
    ],
    acceptance_criteria: [
      'WhatsApp yönlendirme bağlantıları çalışıyor',
      'Form verileri WhatsApp mesajına dönüşüyor',
      'Mobil cihazlarda akış test edildi',
    ],
    delivery_checklist_seed: [
      'Rezervasyon talep formu oluşturuldu',
      'WhatsApp mesaj şablonları hazırlandı',
      'Form → WhatsApp yönlendirme entegrasyonu tamamlandı',
      'Mobil test tamamlandı',
      'Test rezervasyon akışı onaylandı',
    ],
  },
  'hotel-offer': {
    template_id: 'hotel-offer',
    title: 'Hotel Offer Page',
    description: 'Campaign / offer landing page',
    brief_seed: 'Otel kampanyası için teklif ve dönüşüm odaklı özel sayfa oluştur',
    scope_seed:
      'Kampanya ve teklif odaklı hotel landing page. Kampanya banner, özel fiyatlar, sınırlı süre sayacı, dönüşüm odaklı CTA ve rezervasyon formu.',
    default_milestone_mode: 'standard',
    revision_policy: [
      '2 revizyon hakkı dahildir',
      'Kampanya tarihleri müşteri tarafından sağlanır',
      'Görsel içerik müşteriden teslim alınır',
    ],
    acceptance_criteria: [
      'Kampanya bilgileri doğru görüntüleniyor',
      'Geri sayım sayacı çalışıyor',
      'CTA butonları aktif ve yönlendirme yapıyor',
      'Mobile görünüm test edildi',
    ],
    delivery_checklist_seed: [
      'Kampanya banner tasarımı tamamlandı',
      'Özel fiyat kartları eklendi',
      'Geri sayım sayacı entegre edildi',
      'Rezervasyon / iletişim CTA aktif',
      'Mobile responsive test tamamlandı',
      'Kampanya süresi ve koşullar eklendi',
    ],
  },
};

export function getTemplate(templateId: string): TemplateRuntimeResult | null {
  return EXECUTION_TEMPLATES[templateId] ?? null;
}

export function listTemplates(): TemplateRuntimeResult[] {
  return Object.values(EXECUTION_TEMPLATES);
}
