# Deals V1 – Smoke Test Checklist

Bu doküman, Deals modülünün V1 pilot-ready durumunu doğrulamak için kullanılacak iç test adımlarını içerir.
Her adımı tamamladıktan sonra ✅ işaretle.

---

## Ortam Hazırlığı
- [ ] Supabase bağlantısı aktif (`SUPABASE_URL`, `SUPABASE_ANON_KEY` set)
- [ ] Gemini API anahtarı aktif (`GEMINI_API_KEY` set)
- [ ] `npm run build` başarılı – TypeScript ve ESLint hatası yok

---

## Adım 1 – Deal Oluştur
**URL:** `/deals/new`

- [ ] Başlık gir, toplam tutar gir, para birimi seç
- [ ] "Deal Oluştur" butonuna bas
- [ ] Submit sırasında buton devre dışı kalıyor mu?
- [ ] Başarılı oluşturmada `/deals/[id]` sayfasına yönlendiriliyor mu?
- [ ] Deal status `draft` olarak görünüyor mu?
- [ ] Activity log'da `deal_created` kaydı var mı?

---

## Adım 2 – Scope Lock
**URL:** `/deals/[id]/scope`

- [ ] Scope metin kutusuna proje kapsamını yaz
- [ ] "Scope Kilitle" butonuna bas
- [ ] AI analiz sırasında "AI analiz ediyor…" mesajı görünüyor mu?
- [ ] Başarılı kilitlenmede yeşil success mesajı çıkıyor mu?
- [ ] Kilitli scope: özet, teslimatlar, kapsam dışı, kabul kriterleri görünüyor mu?
- [ ] Deal status `scoped` olarak güncellendi mi?
- [ ] Activity log'da `scope_locked` kaydı var mı?

---

## Adım 3 – Milestone Planı Oluştur
**URL:** `/deals/[id]/milestones`

- [ ] "Standard (20/40/40)" butonuna bas
- [ ] 3 milestone oluşturuldu mu?
- [ ] Milestone tutarları deal toplam tutarıyla uyuşuyor mu? (toplam = deal.total_amount)
- [ ] sort_order 1, 2, 3 sıralı mı?
- [ ] Başarılı oluşturmada "X milestone oluşturuldu" mesajı çıkıyor mu?
- [ ] Deal status `in_progress` olarak güncellendi mi?
- [ ] Activity log'da `milestones_created` kaydı var mı?
- [ ] "Hızlı (50/50)" ve "İteratif (25×4)" şablonları da aynı şekilde çalışıyor mu?

---

## Adım 4 – Delivery Ekle
**URL:** `/deals/[id]/deliveries`

- [ ] Milestone seç, teslim türü seç, URL gir
- [ ] "Teslim Kaydet" butonuna bas
- [ ] Submit sırasında buton devre dışı kalıyor mu?
- [ ] Başarılı kayıtta "Teslim başarıyla kaydedildi" mesajı çıkıyor mu?
- [ ] Teslim geçmişinde yeni teslim görünüyor mu? (milestone adıyla birlikte)
- [ ] İlgili milestone status `delivered` oldu mu?
- [ ] Activity log'da `delivery_uploaded` kaydı var mı?
- [ ] Milestone yok iken "Teslimat eklemek için önce milestone oluşturun" mesajı görünüyor mu?

---

## Adım 5 – Revision Parse Et
**URL:** `/deals/[id]/revisions`

- [ ] Milestone seç, müşteri geri bildirimini yaz
- [ ] "AI ile Parse Et" butonuna bas
- [ ] AI analiz sırasında "AI analiz ediyor…" mesajı görünüyor mu?
- [ ] Başarılı parsede "Revizyon kaydedildi ve analiz tamamlandı" mesajı çıkıyor mu?
- [ ] Revizyon geçmişinde kapsam durumu badge'i görünüyor mu? (Kapsam İçi / Kısmen Dışı / Kapsam Dışı)
- [ ] Bağlı milestone adı görünüyor mu?
- [ ] İstenen değişiklikler ve aksiyon maddeleri listeleniyor mu?
- [ ] Activity log'da `revision_requested` kaydı var mı?

---

## Adım 6 – Approve / Reject
**URL:** `/deals/[id]/milestones`

- [ ] `delivered` veya `revision_requested` durumundaki milestone'da onay butonları görünüyor mu?
- [ ] "Onayla" butonuna bas → milestone status `approved` oluyor mu?
- [ ] Milestone kartında "✓ Onaylı" badge'i görünüyor mu?
- [ ] "Reddet" butonuna bas → red notu gir → milestone status `revision_requested` oluyor mu?
- [ ] "✗ Reddedildi" badge'i görünüyor mu?
- [ ] Double-submit koruması: ikinci tıklamada buton devre dışı mı?
- [ ] Activity log'da `milestone_approved` / `milestone_rejected` kaydı var mı?

---

## Adım 7 – Escrow Link
**URL:** `/deals/[id]/escrow`

- [ ] Provider, Transaction ID, tutar, para birimi gir
- [ ] "Escrow Bağla" butonuna bas
- [ ] Transaction ID boş bırakılınca hata veriyor mu?
- [ ] Negatif tutar girince hata veriyor mu?
- [ ] Başarılı bağlamada escrow detay kartı görünüyor mu?
- [ ] Provider, Transaction ID, Toplam Tutar, Funded, Released gösteriliyor mu?
- [ ] Activity log'da `escrow_linked` kaydı var mı?

---

## Adım 8 – Manuel Sync
**URL:** `/deals/[id]/escrow`

- [ ] Status seç, funded ve released amount gir
- [ ] "Manuel Sync" butonuna bas
- [ ] Released > Funded ise client-side hata mesajı veriyor mu?
- [ ] Negatif değer girince hata veriyor mu?
- [ ] Başarılı sync'de "✓ Escrow durumu güncellendi" banner'ı görünüyor mu?
- [ ] Escrow detay kartındaki değerler güncellendi mi?
- [ ] "Son Sync" tarihi güncellendi mi?
- [ ] Activity log'da `escrow_synced` kaydı var mı?

---

## Adım 9 – Activity Log Doğrula
**URL:** `/deals/[id]` (overview) veya `/deals/[id]/milestones`

- [ ] deal_created → "Deal oluşturuldu" görünüyor mu?
- [ ] scope_locked → "Scope kilitlendi (v1)" gibi görünüyor mu?
- [ ] milestones_created → "3 milestone oluşturuldu" görünüyor mu?
- [ ] delivery_uploaded → "Teslim eklendi (v1)" görünüyor mu?
- [ ] revision_requested → "Revizyon kaydı oluşturuldu" görünüyor mu?
- [ ] milestone_approved → "Milestone onaylandı" görünüyor mu?
- [ ] milestone_rejected → "Milestone revizyona döndü" görünüyor mu?
- [ ] escrow_linked → "Escrow transaction bağlandı" görünüyor mu?
- [ ] escrow_synced → "Escrow durumu güncellendi → Finanse Edildi" gibi görünüyor mu?
- [ ] Zaman göstergesi relative mi? ("5dk önce", "2sa önce")
- [ ] Hover'da tam tarih görünüyor mu?

---

## Adım 10 – Overview Ekranını Doğrula
**URL:** `/deals/[id]`

- [ ] Scope Locked / Not Locked doğru gösteriliyor mu?
- [ ] Milestone Count doğru mu?
- [ ] Approved Milestone Count doğru mu?
- [ ] Delivery Count doğru mu?
- [ ] Open Revision Count doğru mu?
- [ ] Latest Delivery Date doğru mu?
- [ ] Escrow Status, Funded Amount, Released Amount doğru mu?
- [ ] Escrow yoksa "Escrow bağlı değil" placeholder'ı görünüyor mu?
- [ ] Teslim yoksa "Henüz teslim yok" placeholder'ı görünüyor mu?
- [ ] Revizyon yoksa "Henüz revizyon yok" placeholder'ı görünüyor mu?
- [ ] Son 5 aktivite doğru sırada listeleniyor mu?

---

## Genel Kalite Kontrolleri

- [ ] Sayfalar arasında geçişte veri kopukluğu yok
- [ ] Sayfa yenileme sonrası tüm state doğru yükleniyor
- [ ] Network hatası durumunda kullanıcıya anlaşılır hata mesajı gösteriliyor
- [ ] Tüm submit butonları loading sırasında devre dışı kalıyor
- [ ] Null/undefined alanlar yüzünden client-side exception yok
- [ ] Build çıktısında TypeScript veya ESLint hatası yok

---

## V1 Kabul Kriteri

Tüm adımlar başarıyla tamamlandığında, Deals modülü **pilot-ready** kabul edilir.

Son güncelleme: V1 Hardening Sprint
