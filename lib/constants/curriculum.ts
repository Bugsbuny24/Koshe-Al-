// ─────────────────────────────────────────────────────────────────────────────
// Gerçek Üniversite Müfredatı — Yabancı Dil Üniversitesi
// 4 Yıllık Lisans Programı (8 Yarıyıl)
// ─────────────────────────────────────────────────────────────────────────────

export type CourseType = "zorunlu" | "seçmeli";

export interface Subject {
  code: string;
  title: string;
  credits: number;
  weeklyHours: number;
  type: CourseType;
  description: string;
  topics: string[];
}

export interface ProgramSemester {
  year: 1 | 2 | 3 | 4;
  semester: 1 | 2;
  slug: string;
  label: string;
  subjects: Subject[];
  totalCredits: number;
}

export interface UniversityProgram {
  languageCode: string;
  languageName: string;
  flag: string;
  programTitle: string;
  department: string;
  duration: string;
  description: string;
  semesters: ProgramSemester[];
}

export function parseSemesterSlug(slug: string): { year: number; sem: number } | null {
  const m = /^y(\d)s(\d)$/.exec(slug);
  if (!m) return null;
  return { year: parseInt(m[1], 10), sem: parseInt(m[2], 10) };
}

function makeSemester(
  year: 1 | 2 | 3 | 4,
  semester: 1 | 2,
  subjects: Subject[]
): ProgramSemester {
  const totalCredits = subjects.reduce((s, c) => s + c.credits, 0);
  return { year, semester, slug: `y${year}s${semester}`, label: `${year}. Sınıf / ${semester}. Yarıyıl`, subjects, totalCredits };
}

// ─── ORTAK ZORUNLU DERSLER ────────────────────────────────────────────────────
const COMMON_Y1_S1: Subject[] = [
  { code: "ATA101", title: "Atatürk İlkeleri ve İnkılâp Tarihi I", credits: 2, weeklyHours: 2, type: "zorunlu", description: "Türk inkılâbının temel ilkeleri ve tarihsel süreci.", topics: ["Osmanlı'dan Cumhuriyet'e", "İnkılâp hareketleri", "Atatürk ilkeleri"] },
  { code: "TDL101", title: "Türk Dili I", credits: 2, weeklyHours: 2, type: "zorunlu", description: "Türkçe yazılı ve sözlü anlatım becerileri.", topics: ["Yazı dili kuralları", "Paragraf yapısı", "Sözlü sunum"] },
  { code: "YDL101", title: "İkinci Yabancı Dil I", credits: 2, weeklyHours: 2, type: "zorunlu", description: "İkinci yabancı dil olarak temel iletişim.", topics: ["Temel iletişim kalıpları", "Kelime hazinesi", "Dinleme"] },
];

const COMMON_Y1_S2: Subject[] = [
  { code: "ATA102", title: "Atatürk İlkeleri ve İnkılâp Tarihi II", credits: 2, weeklyHours: 2, type: "zorunlu", description: "Çok partili sisteme geçiş ve cumhuriyetin gelişimi.", topics: ["Çok partili dönem", "Dış politika", "Cumhuriyet değerleri"] },
  { code: "TDL102", title: "Türk Dili II", credits: 2, weeklyHours: 2, type: "zorunlu", description: "İleri Türkçe yazım ve akademik yazarlık.", topics: ["Akademik metin yazımı", "Öz eleştiri", "Araştırma raporu"] },
  { code: "YDL102", title: "İkinci Yabancı Dil II", credits: 2, weeklyHours: 2, type: "zorunlu", description: "İkinci yabancı dil temel seviye devamı.", topics: ["Temel dilbilgisi", "Okuma becerileri", "Yazma alıştırmaları"] },
];

// ─── İNGİLİZ DİLİ VE EDEBİYATI ──────────────────────────────────────────────
const englishSemesters: ProgramSemester[] = [
  makeSemester(1, 1, [
    { code: "ING101", title: "İngilizce Okuma ve Yazma I", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Temel okuma stratejileri ve paragraf yazımı.", topics: ["Metin anlama stratejileri", "Paragraf yazımı", "Topic sentence", "Skimming & scanning", "Kelime bilgisi"] },
    { code: "ING102", title: "İngilizce Dinleme ve Konuşma I", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Günlük iletişim kalıpları ve dinleme becerileri.", topics: ["Günlük diyaloglar", "Dinleme stratejileri", "Telaffuz ve vurgu", "Rol yapma", "Kısa sunum"] },
    { code: "ING103", title: "İngilizce Dilbilgisi I", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Temel İngilizce dilbilgisi yapılarının sistematik incelenmesi.", topics: ["Present Tenses", "Past Tenses", "Future forms", "Modal verbs", "Passive voice giriş"] },
    { code: "DIL101", title: "Dilbilime Giriş", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Dilbilimin temel kavramları ve alt dalları.", topics: ["Dil nedir?", "Dilbilimin alt dalları", "Sesbilim", "Biçimbilim giriş", "Sözdizim giriş"] },
    ...COMMON_Y1_S1,
  ]),
  makeSemester(1, 2, [
    { code: "ING104", title: "İngilizce Okuma ve Yazma II", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Orta düzey okuma metinleri ve kısa deneme yazımı.", topics: ["Deneme yazımı", "Özet çıkarma", "Karşılaştırmalı metinler", "Kaynak kullanımı", "Giriş-gövde-sonuç"] },
    { code: "ING105", title: "İngilizce Dinleme ve Konuşma II", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Otantik materyallerle dinleme ve grup tartışmaları.", topics: ["Otantik dinleme", "Grup tartışması", "Resmi ve gayri resmi dil", "Soru sorma ve yanıt verme", "Tartışma yapıları"] },
    { code: "ING106", title: "İngilizce Dilbilgisi II", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Dilbilgisi yapılarının derinleştirilmesi.", topics: ["Conditionals (0,1,2,3)", "Passive voice ileri", "Reported speech", "Relative clauses", "Phrasal verbs"] },
    { code: "ING107", title: "İngiliz Edebiyatına Giriş", credits: 3, weeklyHours: 3, type: "zorunlu", description: "İngiliz edebiyatının tarihsel gelişimine genel bakış.", topics: ["Edebiyat nedir?", "Orta Çağ İngiliz Edebiyatı", "Rönesans ve Shakespeare", "18. yy Aydınlanma", "Romantizm"] },
    ...COMMON_Y1_S2,
  ]),
  makeSemester(2, 1, [
    { code: "ING201", title: "İleri Okuma ve Yazma I", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Akademik metin türleri ve argümantatif yazı.", topics: ["Argümantatif deneme", "Kaynak gösterme (APA/MLA)", "Eleştirel okuma", "Akademik kelime listeleri", "Dipnot ve atıf"] },
    { code: "ING202", title: "İleri Dinleme ve Konuşma I", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Akademik sunum hazırlama ve sunma.", topics: ["Akademik sunum yapısı", "Beden dili", "Görüş bildirme", "Soru-cevap yönetme", "Panel tartışması"] },
    { code: "ING203", title: "Sözdizimi (Syntax)", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Cümle yapısının dilbilimsel incelenmesi.", topics: ["Cümle ögeleri", "Öbekler (NP, VP, PP)", "Ağaç diyagramları", "Dönüşümsel dilbilgisi", "Karmaşık cümle yapıları"] },
    { code: "ING204", title: "Çeviriye Giriş I", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Çeviri kuramları ve İngilizce-Türkçe pratik çeviri.", topics: ["Çeviri nedir?", "Çeviri kuram yaklaşımları", "Sözcük düzeyinde sorunlar", "İng→Türkçe pratikler", "Eşdeğerlik kavramı"] },
    { code: "ING205", title: "19. Yüzyıl İngiliz Edebiyatı", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Viktorya dönemi romanları ve şiiri.", topics: ["Viktorya dönemi bağlamı", "Gerçekçilik akımı", "Dickens ve toplumsal eleştiri", "Viktorya şiiri", "Brontëler ve Eliot"] },
    { code: "ING206", title: "Seçmeli: Fonetik ve Fonoloji", credits: 3, weeklyHours: 3, type: "seçmeli", description: "İngilizce seslerin üretimi ve fonetik transkripsiyon.", topics: ["IPA", "Sesli ve sessiz harfler", "Vurgu ve tonlama", "Zayıf biçimler", "Bağlı konuşmada ses değişimleri"] },
  ]),
  makeSemester(2, 2, [
    { code: "ING207", title: "İleri Okuma ve Yazma II", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Araştırma önerisi ve akademik makale yazımı.", topics: ["Araştırma sorusu", "Literatür taraması", "Makale yapısı", "Revizyon süreci", "Akademik dürüstlük"] },
    { code: "ING208", title: "İleri Dinleme ve Konuşma II", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Medya içerikleriyle çalışma ve müzakere becerileri.", topics: ["Haber ve belgesel analizi", "Müzakere dili", "Panel yönetme", "Söylem analizi giriş", "Diksiyon"] },
    { code: "ING209", title: "Anlambilim (Semantics)", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Sözcük ve cümle düzeyinde anlam.", topics: ["Anlambilim nedir?", "Sözcüksel anlam", "Kompozisyonel anlam", "Gönderim ve anlam", "Anlam değişimleri"] },
    { code: "ING210", title: "Çeviriye Giriş II", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Metin türlerine göre çeviri stratejileri.", topics: ["Metin türleri ve çeviri", "Türkçe→İngilizce çeviri", "Deyim ve atasözü çevirisi", "Gazete haberi çevirisi", "Çeviri değerlendirme"] },
    { code: "ING211", title: "Modernizm ve İngiliz Edebiyatı", credits: 3, weeklyHours: 3, type: "zorunlu", description: "20. yüzyıl başı İngiliz ve İrlanda modernist edebiyatı.", topics: ["Modernizm nedir?", "Virginia Woolf", "James Joyce: bilinç akışı", "T.S. Eliot: modernist şiir", "Savaş edebiyatı"] },
    { code: "ING212", title: "Seçmeli: Sosyolinguistik", credits: 3, weeklyHours: 3, type: "seçmeli", description: "Dil ve toplum ilişkisi.", topics: ["Dil ve kimlik", "Lehçe farklılıkları", "Dil değişimi", "Çok dillililik", "Cinsiyet ve dil"] },
  ]),
  makeSemester(3, 1, [
    { code: "ING301", title: "Akademik Yazma", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Akademik makale ve rapor yazımı; bilimsel standartlar.", topics: ["Araştırma makalesi", "Literatür eleştirisi", "Akademik ton", "Biçimlendirme", "Akran değerlendirmesi"] },
    { code: "ING302", title: "Yazılı Çeviri I", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Bilgi metinleri ve gazete çevirileri.", topics: ["Haber çevirisi", "Bilgilendirici metin çevirisi", "Çeviri araçları", "Terminoloji yönetimi", "Kalite kontrolü"] },
    { code: "ING303", title: "Biçimbilim (Morphology)", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Sözcük yapısı ve sözcük oluşturma süreçleri.", topics: ["Morfem kavramı", "Serbest ve bağımlı morfemler", "Türetim ve çekim ekleri", "Sözcük oluşturma", "Dillerarası karşılaştırmalar"] },
    { code: "ING304", title: "Mesleki İngilizce I — İş İngilizcesi", credits: 3, weeklyHours: 3, type: "zorunlu", description: "İş hayatında İngilizce; görüşme, toplantı, yazışma.", topics: ["CV ve motivasyon mektubu", "İş görüşmesi", "Toplantı ve müzakere", "İş e-postası", "Sunum ve raporlama"] },
    { code: "ING305", title: "Amerikan Edebiyatı", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Amerikan edebiyatının gelişimi; Puritanizm'den modernizme.", topics: ["Erken Amerikan edebiyatı", "Whitman ve Thoreau", "Realizm: Twain, Henry James", "Modernizm: Faulkner, Hemingway", "Harlem Rönesansı"] },
    { code: "ING306", title: "Seçmeli: Kültürlerarası İletişim", credits: 3, weeklyHours: 3, type: "seçmeli", description: "Farklı kültürler arasında iletişim.", topics: ["Kültür kavramı", "Yüksek/düşük bağlam kültürleri", "Kültürel şok", "Kültürlerarası iş iletişimi", "Medya ve kültür"] },
  ]),
  makeSemester(3, 2, [
    { code: "ING307", title: "Akademik Sunum Becerileri", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Konferans sunumu ve akademik konuşma becerileri.", topics: ["Sunum yapısı", "Görsel materyal", "Konuşma hızı ve vurgu", "Soru-cevap", "Sanal sunum"] },
    { code: "ING308", title: "Yazılı Çeviri II", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Hukuki, tıbbi ve teknik metin çevirisi.", topics: ["Hukuki metin çevirisi", "Tıbbi metin çevirisi", "Teknik kılavuz", "Terminoloji veri tabanı", "Yerelleştirme giriş"] },
    { code: "ING309", title: "Edebiyat Kuramı", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Yapısalcılık, post-yapısalcılık, feminizm ve postkolonyal eleştiri.", topics: ["Neden edebiyat kuramı?", "Yapısalcılık ve göstergebilim", "Post-yapısalcılık", "Feminist eleştiri", "Postkolonyal kuram"] },
    { code: "ING310", title: "Pragmatik (Pragmatics)", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Dil kullanımı ve bağlam; söz eylem kuramı.", topics: ["Pragmatik nedir?", "Söz edimi kuramı", "İşbirliği ilkesi (Grice)", "Kibarlık kuramı", "Diyalog analizi"] },
    { code: "ING311", title: "Mesleki İngilizce II — Akademik İngilizce", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Akademik bağlamda İngilizce kullanımı.", topics: ["Akademik konferans dili", "Makale gönderme süreci", "Akademik e-posta", "Tez yazımına hazırlık", "Öz değerlendirme"] },
    { code: "ING312", title: "Seçmeli: Yazınsal Çeviri", credits: 3, weeklyHours: 3, type: "seçmeli", description: "Şiir, roman ve kısa hikâye gibi edebi türlerin çevirisi.", topics: ["Edebi çeviri kuramı", "Şiir çevirisi", "Hikâye çevirisi", "Tiyatro metni çevirisi", "Çevirmenin görünürlüğü"] },
  ]),
  makeSemester(4, 1, [
    { code: "ING401", title: "Bitirme Tezi / Araştırma Projesi I", credits: 6, weeklyHours: 4, type: "zorunlu", description: "Bağımsız akademik araştırma; metodoloji ve veri toplama.", topics: ["Araştırma sorusu", "Literatür taraması", "Metodoloji", "Veri toplama", "Danışmanla çalışma"] },
    { code: "ING402", title: "Özel Amaçlı İngilizce (ESP)", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Hukuk, tıp, finans, mühendislik için İngilizce.", topics: ["ESP nedir?", "Hukuki İngilizce", "Tıbbi İngilizce", "Akademik İngilizce (EAP)", "ESP materyal tasarımı"] },
    { code: "ING403", title: "Çağdaş İngiliz ve Amerikan Edebiyatı", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Postmodern ve çağdaş edebiyat; Nobel ödüllü yazarlar.", topics: ["Postmodernizm", "Çok kültürlü edebiyat", "Seamus Heaney, Salman Rushdie", "Güncel romanlar", "Distopik edebiyat"] },
    { code: "ING404", title: "Uygulamalı Dilbilim", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Dilbilim kuramlarının öğretime ve iletişime uygulanması.", topics: ["Dil edinimi kuramları", "Dil öğretim yöntemleri", "Hata analizi", "Söylem analizi uygulamaları", "Sosyodilbilimsel araştırma"] },
    { code: "ING405", title: "Seçmeli: Söylem Çözümlemesi", credits: 3, weeklyHours: 3, type: "seçmeli", description: "Yazılı ve sözlü metinlerin yapısal ve ideolojik analizi.", topics: ["Söylem nedir?", "Eleştirel söylem analizi", "Medya söylemi", "Siyasi söylem", "Kurumsal söylem"] },
  ]),
  makeSemester(4, 2, [
    { code: "ING406", title: "Bitirme Tezi / Araştırma Projesi II", credits: 6, weeklyHours: 4, type: "zorunlu", description: "Tezin tamamlanması, savunma hazırlığı ve jüri sunumu.", topics: ["Veri analizi", "Tez yazımı", "Savunma hazırlığı", "Jüri sorularına yanıt", "Yayına hazırlama"] },
    { code: "ING407", title: "Uzmanlık Çevirisi", credits: 4, weeklyHours: 4, type: "zorunlu", description: "İleri uzmanlık çevirisi; CAT araçları ve çeviri belleği.", topics: ["CAT araçları (SDL Trados, memoQ)", "Çeviri belleği", "Terminoloji yazılımları", "Makineli çeviri + insan", "Yerelleştirme projesi"] },
    { code: "ING408", title: "Çağdaş Dünya Edebiyatı (İngilizce'de)", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Nobel ödüllü yazarlar ve küresel edebiyat.", topics: ["Postkolonyal dünya edebiyatı", "Asya edebiyatı", "Latin Amerika edebiyatı", "Afrika edebiyatı", "Diaspora edebiyatı"] },
    { code: "ING409", title: "Dil Politikası ve Planlaması", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Devletlerin dil politikaları ve küreselleşme bağlamında dil.", topics: ["Dil politikası", "Resmî dil ve azınlık hakları", "AB dil politikaları", "İngilizce'nin küreselleşmesi (ELF)", "Dil ölümü ve koruma"] },
    { code: "ING410", title: "Seçmeli: Psikodilbilim", credits: 3, weeklyHours: 3, type: "seçmeli", description: "Dil ve zihin ilişkisi; dil işleme ve edinimi.", topics: ["Dil ve beyin", "Dil edinimi: Chomsky vs Piaget", "İki dilli dil işleme", "Afazi ve dil bozuklukları", "Okuma ve anlama süreçleri"] },
  ]),
];

// ─── ALMAN DİLİ VE EDEBİYATI ──────────────────────────────────────────────────
const germanSemesters: ProgramSemester[] = [
  makeSemester(1, 1, [
    { code: "ALM101", title: "Almanca Okuma ve Yazma I", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Temel Almanca metin anlama ve paragraf yazımı.", topics: ["Metin anlama", "Paragraf yapısı", "Temel dilbilgisi", "Kelime öğrenme"] },
    { code: "ALM102", title: "Almanca Dinleme ve Konuşma I", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Günlük Almanca iletişim ve dinleme.", topics: ["Günlük diyaloglar", "Telaffuz ve vurgu", "Dinleme stratejileri", "Rol yapma"] },
    { code: "ALM103", title: "Almanca Dilbilgisi I", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Artikel, isim çekimi ve temel zaman yapıları.", topics: ["Der/Die/Das", "Kasus (Nom./Akk./Dat.)", "Perfekt zamanı", "Modal fiiller"] },
    { code: "DIL101", title: "Dilbilime Giriş", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Dilbilimin temel kavramları.", topics: ["Dilbilim nedir?", "Sesbilim", "Biçimbilim", "Sözdizim", "Anlambilim"] },
    ...COMMON_Y1_S1,
  ]),
  makeSemester(1, 2, [
    { code: "ALM104", title: "Almanca Okuma ve Yazma II", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Orta düzey Almanca metinler ve kısa deneme yazımı.", topics: ["Özet yazımı", "Karşılaştırma metni", "Alman yazı dili standartları", "Akademik kelimeler"] },
    { code: "ALM105", title: "Almanca Dinleme ve Konuşma II", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Otantik Almanca materyallerle dinleme.", topics: ["Radyo haberleri", "Tartışma teknikleri", "Görüş bildirme", "Kısa sunum"] },
    { code: "ALM106", title: "Almanca Dilbilgisi II", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Almanca dilbilgisinin derinleştirilmesi.", topics: ["Konjunktiv II", "Genitif", "Pasif yapı", "Bağlaçlar ve cümle dizimi"] },
    { code: "ALM107", title: "Alman Edebiyatına Giriş", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Alman edebiyatının tarihsel gelişimine genel bakış.", topics: ["Orta Çağ edebiyatı", "Sturm und Drang", "Weimar Klasisizmi", "Romantizm: Goethe, Schiller"] },
    ...COMMON_Y1_S2,
  ]),
  makeSemester(2, 1, [
    { code: "ALM201", title: "İleri Almanca Okuma ve Yazma I", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Akademik Almanca metin türleri.", topics: ["Akademik metin analizi", "Erörterung (tartışma yazısı)", "Kaynak gösterme", "Alman akademik dili"] },
    { code: "ALM202", title: "İleri Almanca Dinleme ve Konuşma I", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Akademik sunum, tartışma ve medya Almancası.", topics: ["Referat (sözlü sunum)", "Podiumsdiskussion", "Deutsche Welle", "Resmi Almanca"] },
    { code: "ALM203", title: "Sözdizimi ve Biçimbilim", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Almanca cümle yapısı ve sözcük oluşturma.", topics: ["V2 kuralı", "Nebensatz yapıları", "Bileşik sözcükler", "Morfem analizi"] },
    { code: "ALM204", title: "Çeviriye Giriş", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Almanca-Türkçe temel çeviri ilkeleri.", topics: ["Çeviri kuram temelleri", "Alm→Türkçe pratikler", "Eşdeğerlik", "Sözlük kullanımı"] },
    { code: "ALM205", title: "19. Yüzyıl Alman Edebiyatı", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Biedermeier, Poetik Realizm ve fin-de-siècle.", topics: ["Heine ve şiiri", "Theodor Storm: Novelle", "Fontane: gerçekçi roman", "Nietzsche'nin etkisi"] },
    { code: "ALM206", title: "Seçmeli: Almanca Fonetik", credits: 3, weeklyHours: 3, type: "seçmeli", description: "Almanca seslerin üretimi ve transkripsiyon.", topics: ["Almanca sesli harfler (Umlaut)", "Sesli çiftleri", "Vurgu ve tonlama", "Standart Almanca telaffuzu"] },
  ]),
  makeSemester(2, 2, [
    { code: "ALM207", title: "İleri Almanca Okuma ve Yazma II", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Araştırma temelli yazı ve dönem ödevi hazırlama.", topics: ["Hausarbeit yazımı", "Literatür taraması", "Akademik atıf", "Revizyon süreci"] },
    { code: "ALM208", title: "Anlambilim ve Pragmatik", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Almancada anlam yapıları ve dil kullanım bağlamı.", topics: ["Sözcüksel anlam", "Söz edimi kuramı", "Kibarlık ifadeleri Almancada", "Pragmatik analiz"] },
    { code: "ALM209", title: "Yazılı Çeviri", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Çeşitli metin türlerinde Almanca-Türkçe çeviri.", topics: ["Gazete haberi çevirisi", "Edebi metin çevirisi", "Resmi yazışma çevirisi", "Çeviri değerlendirme"] },
    { code: "ALM210", title: "Modernizm ve Alman Edebiyatı", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Expresyonizm ve sürgün edebiyatı.", topics: ["Expresyonist şiir", "Brecht ve epik tiyatro", "Kafka: absürt ve anlam", "Sürgün yazarları"] },
    { code: "ALM211", title: "Mesleki Almanca", credits: 3, weeklyHours: 3, type: "zorunlu", description: "İş hayatında Almanca; yazışma ve müzakere.", topics: ["Geschäftsbrief", "Telefonkonferenz", "Bewerbungsschreiben", "Bericht yazımı"] },
    { code: "ALM212", title: "Seçmeli: Sosyolinguistik", credits: 3, weeklyHours: 3, type: "seçmeli", description: "Alman konuşan ülkelerde dil çeşitliliği.", topics: ["Alman lehçeleri", "Almanya-Avusturya-İsviçre farkları", "Dil ve kimlik", "Göçmen dili"] },
  ]),
  makeSemester(3, 1, [
    { code: "ALM301", title: "Akademik Almanca Yazımı", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Seminararbeit ve Hausarbeit standartlarında yazım.", topics: ["Seminararbeit yapısı", "Akademik ton", "Atıf sistemleri", "Editöryal süreç"] },
    { code: "ALM302", title: "Uzmanlık Çevirisi I", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Hukuki, teknik ve ekonomik metin çevirileri.", topics: ["Hukuki Almanca çevirisi", "AB belgeleri", "Teknik talimat", "Terminoloji veri tabanı"] },
    { code: "ALM303", title: "Alman Edebiyat Kuramı", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Hermeneutik ve Rezeptionsästhetik.", topics: ["Dilthey ve yorumlama", "Jauss ve Iser", "Alımlama kuramı", "Frankfurt Okulu"] },
    { code: "ALM304", title: "Günümüz Alman Edebiyatı", credits: 3, weeklyHours: 3, type: "zorunlu", description: "II. Dünya Savaşı sonrası Alman edebiyatı.", topics: ["Grup 47 (Böll, Grass)", "Doğu Alman edebiyatı", "Birleşme sonrası edebiyat", "Göçmen yazarlar"] },
    { code: "ALM305", title: "Seçmeli: Kültürlerarası İletişim", credits: 3, weeklyHours: 3, type: "seçmeli", description: "Alman kültürü ve Türk-Alman etkileşimi.", topics: ["Alman iş kültürü", "Türk-Alman ilişkileri", "Kültürel stereotipler", "Medyada Türk imgesi"] },
  ]),
  makeSemester(3, 2, [
    { code: "ALM306", title: "Sunum ve Tartışma Becerileri", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Almanca akademik sunum ve müzakere.", topics: ["Vortrag hazırlama", "Handout tasarımı", "Podiumsdiskussion", "Argumentation"] },
    { code: "ALM307", title: "Uzmanlık Çevirisi II", credits: 4, weeklyHours: 4, type: "zorunlu", description: "İleri uzmanlık çevirisi; CAT araçları.", topics: ["SDL Trados", "Çeviri belleği", "Proje yönetimi", "Kalite güvencesi"] },
    { code: "ALM308", title: "Uygulamalı Dilbilim", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Dilbilim kuramlarının Almanca öğretimine uygulanması.", topics: ["Almanca öğretim yöntemleri", "Hata analizi", "Dil edinimi araştırmaları", "Ders materyali"] },
    { code: "ALM309", title: "Seçmeli: Alman Sineması ve Medyası", credits: 3, weeklyHours: 3, type: "seçmeli", description: "Alman sinemasının tarihsel gelişimi.", topics: ["Weimar sineması", "Yeni Alman Sineması", "Güncel filmler", "Medya metni okuma"] },
  ]),
  makeSemester(4, 1, [
    { code: "ALM401", title: "Bitirme Tezi I", credits: 6, weeklyHours: 4, type: "zorunlu", description: "Almanca odaklı bağımsız araştırma projesi.", topics: ["Araştırma konusu belirleme", "Literatür taraması", "Metodoloji", "Danışmanla çalışma"] },
    { code: "ALM402", title: "Özel Amaçlı Almanca", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Hukuk, tıp, mühendislik için Almanca.", topics: ["Hukuki Almanca", "Teknik Almanca", "Ekonomi Almancası", "DSH/TestDaF hazırlık"] },
    { code: "ALM403", title: "Seçmeli: Psikodilbilim", credits: 3, weeklyHours: 3, type: "seçmeli", description: "Almanca dil edinimi ve iki dilli işleme.", topics: ["L1/L2 edinimi", "Transfer", "Almanca-Türkçe ikidillilik", "Dil bozuklukları"] },
  ]),
  makeSemester(4, 2, [
    { code: "ALM404", title: "Bitirme Tezi II", credits: 6, weeklyHours: 4, type: "zorunlu", description: "Tezin tamamlanması ve savunma.", topics: ["Veri analizi", "Tez yazımı", "Savunma sunumu", "Jüri sorularına yanıt"] },
    { code: "ALM405", title: "Almanca Dil Tarihi", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Eski Almancadan günümüze dilin tarihsel gelişimi.", topics: ["Hint-Avrupa dil ailesi", "Althochdeutsch", "Ortaçağ Almancası", "Yeni Yüksek Almanca standardı"] },
    { code: "ALM406", title: "Seçmeli: Söylem Çözümlemesi", credits: 3, weeklyHours: 3, type: "seçmeli", description: "Alman siyasi ve medya söylemi analizi.", topics: ["Eleştirel söylem analizi", "Siyasi söylem", "Reklam dili", "Kurumsal söylem"] },
  ]),
];

// ─── FRANSIZ DİLİ VE EDEBİYATI ──────────────────────────────────────────────
const frenchSemesters: ProgramSemester[] = [
  makeSemester(1, 1, [
    { code: "FRA101", title: "Fransızca Okuma ve Yazma I", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Temel Fransızca metin anlama ve paragraf yazımı.", topics: ["Metin anlama", "Paragraf yapısı", "Cinsiyet uyumu", "Temel artikeller"] },
    { code: "FRA102", title: "Fransızca Dinleme ve Konuşma I", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Günlük Fransızca iletişim ve dinleme.", topics: ["Günlük diyaloglar", "Fransız telaffuzu", "Nazal sesler", "Kafe ve restoranda konuşma"] },
    { code: "FRA103", title: "Fransızca Dilbilgisi I", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Fransızca artikeller ve temel zamanlar.", topics: ["le/la/les ve un/une/des", "Présent fiil çekimi", "Passé composé", "Frekans zarfları"] },
    { code: "DIL101", title: "Dilbilime Giriş", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Dilbilimin temel kavramları.", topics: ["Dilbilim nedir?", "Sesbilim", "Biçimbilim", "Sözdizim", "Anlambilim"] },
    ...COMMON_Y1_S1,
  ]),
  makeSemester(1, 2, [
    { code: "FRA104", title: "Fransızca Okuma ve Yazma II", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Orta düzey Fransızca metinler.", topics: ["Özet çıkarma", "Deneme yazımı", "Edebî metin okuma", "Fransız gazete dili"] },
    { code: "FRA105", title: "Fransızca Dinleme ve Konuşma II", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Otantik materyallerle dinleme ve sunum.", topics: ["RFI materyalleri", "Mini sunum", "Görüş bildirme", "Tartışma"] },
    { code: "FRA106", title: "Fransızca Dilbilgisi II", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Fransızca dilbilgisinin derinleştirilmesi.", topics: ["Subjonctif", "Conditionnel", "Pronoms relatifs", "Pasif yapı"] },
    { code: "FRA107", title: "Fransız Edebiyatına Giriş", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Fransız edebiyatının tarihsel gelişimine genel bakış.", topics: ["Orta Çağ", "Rönesans: Rabelais, Montaigne", "Klasik dönem: Racine, Molière", "Aydınlanma: Voltaire, Rousseau"] },
    ...COMMON_Y1_S2,
  ]),
  makeSemester(2, 1, [
    { code: "FRA201", title: "İleri Fransızca Okuma ve Yazma I", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Akademik Fransızca metin türleri.", topics: ["Akademik Fransızca", "Dissertation", "Kaynak gösterme", "Akademik kelimeler"] },
    { code: "FRA202", title: "İleri Fransızca Konuşma ve Sunum", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Akademik sunum, tartışma ve Fransız medyası.", topics: ["Exposé hazırlığı", "Le grand oral", "Débat yapısı", "Fransız medyası"] },
    { code: "FRA203", title: "Fransız Dilbilimi", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Fransızca sözdizimi, anlambilim ve pragmatik.", topics: ["Fransızcada cümle yapısı", "Anlambilim", "Söz edim kuramı", "Kibarlık"] },
    { code: "FRA204", title: "Çeviriye Giriş", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Fransızca-Türkçe temel çeviri ilkeleri.", topics: ["Çeviri kuram temelleri", "Fra→Türkçe pratikler", "Eşdeğerlik", "Metin analizi"] },
    { code: "FRA205", title: "19. Yüzyıl Fransız Edebiyatı", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Romantizm, realizm ve sembolizm.", topics: ["Hugo: romantizm", "Balzac ve Stendhal", "Flaubert: natüralizm giriş", "Baudelaire: sembolizm"] },
    { code: "FRA206", title: "Seçmeli: Fransız Kültürü ve Medeniyeti", credits: 3, weeklyHours: 3, type: "seçmeli", description: "Fransız kültürü, sanatı ve toplumu.", topics: ["Fransız mutfağı ve yaşam", "Fransız sineması", "Sanat ve müzeler", "Francophonie"] },
  ]),
  makeSemester(2, 2, [
    { code: "FRA207", title: "Yazılı Çeviri", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Çeşitli metin türlerinde Fransızca-Türkçe çeviri.", topics: ["Gazete çevirisi", "Edebi metin", "Resmi yazışma", "Çeviri değerlendirme"] },
    { code: "FRA208", title: "Modernizm ve Fransız Edebiyatı", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Empresyonizm, sürrealizm ve varoluşçuluk.", topics: ["Proust: bilinç akışı", "Sürrealizm: Breton", "Camus ve varoluşçuluk", "Beckett ve absürt"] },
    { code: "FRA209", title: "Mesleki Fransızca", credits: 3, weeklyHours: 3, type: "zorunlu", description: "İş hayatında Fransızca.", topics: ["Lettre commerciale", "Réunion dili", "CV Européen", "Économie français"] },
    { code: "FRA210", title: "Seçmeli: Francophonie Edebiyatı", credits: 3, weeklyHours: 3, type: "seçmeli", description: "Fransa dışında Fransızca yazan yazarlar.", topics: ["Kuzey Afrika (Camus, Djebar)", "Québec edebiyatı", "Fransızca Karibler", "Fransız Afrika"] },
  ]),
  makeSemester(3, 1, [
    { code: "FRA301", title: "Akademik Fransızca Yazımı", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Dissertation ve mémoire standartlarında yazım.", topics: ["Dissertation kuralları", "Mémoire yapısı", "Akademik ton", "Fransız kaynakça"] },
    { code: "FRA302", title: "Uzmanlık Çevirisi I", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Hukuki, ekonomik ve teknik metin çevirileri.", topics: ["AB Fransızcası", "Hukuki metin", "Teknik kılavuz", "CAT araçlarına giriş"] },
    { code: "FRA303", title: "Fransız Edebiyat Kuramı", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Barthes, Derrida ve Kristeva.", topics: ["Yapısalcılık: Saussure", "Post-yapısalcılık: Derrida", "Barthes: metnin ölümü", "Kristeva: metinlerarasılık"] },
    { code: "FRA304", title: "Çağdaş Fransız Edebiyatı", credits: 3, weeklyHours: 3, type: "zorunlu", description: "1970'lerden günümüze Fransız romanı.", topics: ["Nouveau Roman", "Patrick Modiano", "Güncel Fransız romanı", "Prix Goncourt eserleri"] },
  ]),
  makeSemester(3, 2, [
    { code: "FRA305", title: "Uzmanlık Çevirisi II", credits: 4, weeklyHours: 4, type: "zorunlu", description: "İleri uzmanlık çevirisi ve çeviri teknolojileri.", topics: ["SDL Trados / memoQ", "Çeviri belleği", "Yerelleştirme", "Çeviri projesi yönetimi"] },
    { code: "FRA306", title: "Uygulamalı Dilbilim", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Fransızca öğretim yöntemleri.", topics: ["FLE yöntemleri", "DELF/DALF hazırlık", "Hata analizi", "Ders materyali tasarımı"] },
    { code: "FRA307", title: "Seçmeli: Kültürlerarası İletişim", credits: 3, weeklyHours: 3, type: "seçmeli", description: "Fransız-Türk kültürel etkileşimi.", topics: ["Fransız-Türk tarihi ilişkiler", "Kültürel stereotipler", "Diplomatik dil", "Uluslararası kurumlarda Fransızca"] },
  ]),
  makeSemester(4, 1, [
    { code: "FRA401", title: "Bitirme Tezi I", credits: 6, weeklyHours: 4, type: "zorunlu", description: "Fransız dili veya çeviribilimi araştırma projesi.", topics: ["Araştırma sorusu", "Literatür taraması", "Metodoloji", "Danışmanla çalışma"] },
    { code: "FRA402", title: "Özel Amaçlı Fransızca", credits: 4, weeklyHours: 4, type: "zorunlu", description: "Hukuk, tıp, ekonomi için Fransızca.", topics: ["Hukuki Fransızca", "AB kurumları dili", "TCF/DALF hazırlık", "Diplomatik Fransızca"] },
  ]),
  makeSemester(4, 2, [
    { code: "FRA403", title: "Bitirme Tezi II", credits: 6, weeklyHours: 4, type: "zorunlu", description: "Tezin tamamlanması ve savunma.", topics: ["Veri analizi", "Tez yazımı", "Soutenance hazırlığı", "Jüri sorularına yanıt"] },
    { code: "FRA404", title: "Fransız Dil Tarihi", credits: 3, weeklyHours: 3, type: "zorunlu", description: "Latince'den günümüze Fransızcanın evrimi.", topics: ["Vulgar Latince", "Eski Fransızca", "Orta Fransızca", "Modern Fransızcanın standardı"] },
    { code: "FRA405", title: "Seçmeli: Psikodilbilim", credits: 3, weeklyHours: 3, type: "seçmeli", description: "Fransızca dil edinimi ve iki dilli işleme.", topics: ["L1/L2 edinimi", "Transfer", "Fransızca-Türkçe ikidillilik", "Dil bozuklukları"] },
  ]),
];

// ─── PROGRAMS REGISTRY ───────────────────────────────────────────────────────
const PROGRAMS: UniversityProgram[] = [
  {
    languageCode: "en",
    languageName: "English",
    flag: "🇬🇧",
    programTitle: "İngiliz Dili ve Edebiyatı",
    department: "İngiliz Dili ve Edebiyatı Bölümü",
    duration: "4 Yıl / 8 Yarıyıl",
    description: "Dil becerileri, dilbilim, edebiyat ve çeviri konularında kapsamlı lisans programı. Dilbilgisi ve konuşmadan akademik yazıma, edebiyat kuramından uzmanlık çevirisine uzanan tam bir müfredat.",
    semesters: englishSemesters,
  },
  {
    languageCode: "de",
    languageName: "German",
    flag: "🇩🇪",
    programTitle: "Alman Dili ve Edebiyatı",
    department: "Alman Dili ve Edebiyatı Bölümü",
    duration: "4 Yıl / 8 Yarıyıl",
    description: "Almanca dil becerileri, Alman edebiyatı ve kültürü ile çeviribilimi üzerine kapsamlı lisans programı.",
    semesters: germanSemesters,
  },
  {
    languageCode: "fr",
    languageName: "French",
    flag: "🇫🇷",
    programTitle: "Fransız Dili ve Edebiyatı",
    department: "Fransız Dili ve Edebiyatı Bölümü",
    duration: "4 Yıl / 8 Yarıyıl",
    description: "Fransız dil becerileri, edebiyat ve francophonie kültürü üzerine kapsamlı lisans programı.",
    semesters: frenchSemesters,
  },
];

export default PROGRAMS;

export function getProgram(languageCode: string): UniversityProgram | undefined {
  return PROGRAMS.find((p) => p.languageCode === languageCode);
}

export function getSemester(languageCode: string, slug: string): ProgramSemester | undefined {
  const program = getProgram(languageCode);
  return program?.semesters.find((s) => s.slug === slug);
}

export function getAvailableLanguages(): {
  code: string;
  name: string;
  flag: string;
  programTitle: string;
  semesterCount: number;
  totalSubjects: number;
  totalCredits: number;
}[] {
  return PROGRAMS.map((p) => ({
    code: p.languageCode,
    name: p.languageName,
    flag: p.flag,
    programTitle: p.programTitle,
    semesterCount: p.semesters.length,
    totalSubjects: p.semesters.reduce((sum, s) => sum + s.subjects.length, 0),
    totalCredits: p.semesters.reduce((sum, s) => sum + s.totalCredits, 0),
  }));
}
