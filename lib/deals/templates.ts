// Scope content templates for V1 pilot deals.
// These are reference constants – they can be used to pre-fill scope text in the UI or
// as internal guidelines when working with the first real clients.

export type ScopeTemplate = {
  name: string;
  summary: string;
  deliverables: string[];
  exclusions: string[];
  revision_policy: string[];
  acceptance_criteria: string[];
};

/**
 * Hotel Direct Booking Pack – V1 reference template.
 * This represents a typical direct-booking website package for a boutique hotel.
 */
export const HOTEL_DIRECT_BOOKING_PACK: ScopeTemplate = {
  name: 'Hotel Direct Booking Pack',
  summary:
    'Butik otelin rezervasyon dönüşümünü artırmak için tasarlanmış, mobil uyumlu, tek sayfalık bir doğrudan rezervasyon web sitesi paketi. Site; oda galerisi, fiyat karşılaştırma modülü, müşteri yorumları bölümü ve entegre rezervasyon formu içerir.',
  deliverables: [
    'Mobil uyumlu, tek sayfalık landing page (HTML/CSS/JS veya tercih edilen framework)',
    'Oda tipi galeri bölümü (en az 3 oda tipi)',
    'Fiyat avantajı karşılaştırma kartı (OTA fiyatı vs. doğrudan fiyat)',
    'Misafir yorumları bölümü (en az 5 yorum girişi)',
    'Rezervasyon formu (isim, tarih, oda tipi, iletişim)',
    'Temel SEO meta etiketleri (başlık, açıklama, og:image)',
    'Google Analytics veya Hotjar entegrasyon notları',
    'Sayfa performans raporu (Lighthouse skoru ≥ 85)',
  ],
  exclusions: [
    'Gerçek zamanlı kapasite kontrolü / PMS entegrasyonu',
    'Ödeme altyapısı (Stripe, iyzico vb.)',
    'Çok dilli içerik (yalnızca Türkçe veya İngilizce, tek dil)',
    'Blog veya içerik yönetim sistemi (CMS)',
    'E-posta pazarlama otomasyon kurulumu',
    'Sosyal medya reklam materyalleri',
    '3. sayfa veya alt sayfa tasarımı',
  ],
  revision_policy: [
    'Teslimat sonrası 2 tur revizyon hakkı mevcuttur',
    'Her tur revizyon istekleri tek bir belge/liste halinde iletilmelidir',
    'Kapsam dışı talepler ayrı teklif gerektirir',
    'Revizyonlar teslimattan itibaren 7 iş günü içinde talep edilmelidir',
    'Onaylanan içerik sonradan revize edilmek istenirse ek ücret uygulanır',
  ],
  acceptance_criteria: [
    'Tüm sayfalar masaüstü ve mobil cihazlarda hatasız açılır',
    'Rezervasyon formu doldurulup gönderilebilir durumdadır',
    'Lighthouse performans skoru ≥ 85, erişilebilirlik skoru ≥ 80',
    'Tüm görseller optimize edilmiş ve alt text içermektedir',
    'Müşteri temin ettiği tüm metin ve görseller sayfaya yerleştirilmiştir',
    'Teslim edilen kaynak kodlar GitHub veya zip olarak sağlanmaktadır',
  ],
};

/** All available scope templates – index for dynamic lookup. */
export const SCOPE_TEMPLATES: Record<string, ScopeTemplate> = {
  hotel_direct_booking: HOTEL_DIRECT_BOOKING_PACK,
};

/**
 * Convert a ScopeTemplate to the raw text format expected by the scope lock AI prompt.
 * Useful for pre-filling the scope lock textarea.
 */
export function templateToRawText(template: ScopeTemplate): string {
  const lines: string[] = [
    `KONU: ${template.name}`,
    '',
    `ÖZET: ${template.summary}`,
    '',
    'TESLİMATLAR:',
    ...template.deliverables.map((d) => `- ${d}`),
    '',
    'KAPSAM DIŞI:',
    ...template.exclusions.map((e) => `- ${e}`),
    '',
    'REVİZYON POLİTİKASI:',
    ...template.revision_policy.map((r) => `- ${r}`),
    '',
    'KABUL KRİTERLERİ:',
    ...template.acceptance_criteria.map((a) => `- ${a}`),
  ];
  return lines.join('\n');
}
