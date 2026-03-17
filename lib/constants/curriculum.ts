export type CourseLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface CourseUnit {
  id: string;
  title: string;
  topics: string[];
  estimatedHours: number;
}

export interface Course {
  id: string;
  languageCode: string;
  languageName: string;
  flag: string;
  level: CourseLevel;
  title: string;
  description: string;
  units: CourseUnit[];
  totalHours: number;
  prerequisites: string | null;
}

const COURSES: Course[] = [
  // ─────────────────── ENGLISH ───────────────────
  {
    id: "en-a1",
    languageCode: "en",
    languageName: "English",
    flag: "🇬🇧",
    level: "A1",
    title: "English Başlangıç",
    description:
      "Temel İngilizce kalıpları, sayılar, renkler, günlük selamlaşmalar ve basit cümle yapısı öğren.",
    prerequisites: null,
    totalHours: 30,
    units: [
      {
        id: "en-a1-u1",
        title: "Merhaba Dünya",
        topics: ["Selamlaşmalar", "Tanışma cümleleri", "Alfabe ve telaffuz"],
        estimatedHours: 5,
      },
      {
        id: "en-a1-u2",
        title: "Sayılar ve Renkler",
        topics: ["1-100 arası sayılar", "Temel renkler", "Yaş ve tarih ifadeleri"],
        estimatedHours: 5,
      },
      {
        id: "en-a1-u3",
        title: "Aile ve İnsanlar",
        topics: ["Aile üyeleri", "Meslek isimleri", "To be fiili"],
        estimatedHours: 5,
      },
      {
        id: "en-a1-u4",
        title: "Günlük Nesneler",
        topics: ["Ev eşyaları", "Giysiler", "Have/has kullanımı"],
        estimatedHours: 5,
      },
      {
        id: "en-a1-u5",
        title: "Zaman ve Günler",
        topics: ["Haftanın günleri", "Aylar", "Saat sorma ve söyleme"],
        estimatedHours: 5,
      },
      {
        id: "en-a1-u6",
        title: "Yiyecek ve İçecek",
        topics: ["Restoranda sipariş", "Besin isimleri", "Beğeni ifadeleri"],
        estimatedHours: 5,
      },
    ],
  },
  {
    id: "en-a2",
    languageCode: "en",
    languageName: "English",
    flag: "🇬🇧",
    level: "A2",
    title: "English Temel",
    description:
      "Basit geçmiş zaman, alışveriş diyalogları, yön tarifi ve kısa hikâye anlatımı.",
    prerequisites: "English A1",
    totalHours: 40,
    units: [
      {
        id: "en-a2-u1",
        title: "Geçmiş Zamanla Hikâye Anlatma",
        topics: ["Simple Past", "Düzenli ve düzensiz fiiller", "Zaman zarfları"],
        estimatedHours: 7,
      },
      {
        id: "en-a2-u2",
        title: "Alışveriş ve Para",
        topics: ["Mağazada konuşma", "Fiyat sorma", "Karşılaştırma sıfatları"],
        estimatedHours: 7,
      },
      {
        id: "en-a2-u3",
        title: "Yolculuk ve Ulaşım",
        topics: ["Yön tarifi", "Ulaşım araçları", "Prepositions of place"],
        estimatedHours: 7,
      },
      {
        id: "en-a2-u4",
        title: "Sağlık ve Vücut",
        topics: ["Vücut parçaları", "Hastalık ifadeleri", "Modal: should/must"],
        estimatedHours: 6,
      },
      {
        id: "en-a2-u5",
        title: "Hobiler ve Boş Zaman",
        topics: ["Like/love/hate + -ing", "Frekans zarfları", "Soru kalıpları"],
        estimatedHours: 7,
      },
      {
        id: "en-a2-u6",
        title: "Gelecek Planlar",
        topics: ["Going to", "Present Continuous (gelecek)", "Takvim"],
        estimatedHours: 6,
      },
    ],
  },
  {
    id: "en-b1",
    languageCode: "en",
    languageName: "English",
    flag: "🇬🇧",
    level: "B1",
    title: "English Orta Seviye",
    description:
      "Present Perfect, koşullu cümleler, görüş bildirme ve iş hayatı İngilizcesi.",
    prerequisites: "English A2",
    totalHours: 50,
    units: [
      {
        id: "en-b1-u1",
        title: "Present Perfect Tense",
        topics: ["Have/has + past participle", "Since / For", "Deneyim anlatma"],
        estimatedHours: 8,
      },
      {
        id: "en-b1-u2",
        title: "Koşullu Cümleler",
        topics: ["Zero & First Conditional", "If-unless", "Olasılık ifadeleri"],
        estimatedHours: 9,
      },
      {
        id: "en-b1-u3",
        title: "Görüş ve Tartışma",
        topics: ["I think / In my opinion", "Agree & disagree", "Linking words"],
        estimatedHours: 9,
      },
      {
        id: "en-b1-u4",
        title: "İş ve Kariyer",
        topics: ["CV yazımı dili", "İş görüşmesi", "İş e-postası kalıpları"],
        estimatedHours: 8,
      },
      {
        id: "en-b1-u5",
        title: "Pasif Yapı",
        topics: ["Passive voice", "Bilimsel metinler", "Gazete haberleri"],
        estimatedHours: 8,
      },
      {
        id: "en-b1-u6",
        title: "Hikâye Anlatımı",
        topics: ["Reported speech", "Narratives", "Bağlaçlar"],
        estimatedHours: 8,
      },
    ],
  },
  {
    id: "en-b2",
    languageCode: "en",
    languageName: "English",
    flag: "🇬🇧",
    level: "B2",
    title: "English Orta-İleri",
    description:
      "İleri koşullu yapılar, akademik yazım, tartışma teknikleri ve akıcı konuşma.",
    prerequisites: "English B1",
    totalHours: 55,
    units: [
      {
        id: "en-b2-u1",
        title: "İleri Koşullu Yapılar",
        topics: ["Second & Third Conditional", "Mixed Conditionals", "Wish / If only"],
        estimatedHours: 9,
      },
      {
        id: "en-b2-u2",
        title: "Akademik Dil",
        topics: ["Akademik kelime bilgisi", "Essay yapısı", "Kaynak gösterme dili"],
        estimatedHours: 10,
      },
      {
        id: "en-b2-u3",
        title: "Medya ve Haberler",
        topics: ["Haber dili analizi", "Kritik okuma", "Tartışma ifadeleri"],
        estimatedHours: 9,
      },
      {
        id: "en-b2-u4",
        title: "Phrasal Verbs ve Deyimler",
        topics: ["En yaygın phrasal verbs", "Deyimler (idioms)", "Bağlam içinde kullanım"],
        estimatedHours: 9,
      },
      {
        id: "en-b2-u5",
        title: "Sunum ve Konuşma",
        topics: ["Sunum yapısı", "Ton ve vurgu", "Soru cevaplama"],
        estimatedHours: 9,
      },
      {
        id: "en-b2-u6",
        title: "İnce Dilbilgisi",
        topics: ["Inversion", "Cleft sentences", "Emphasis structures"],
        estimatedHours: 9,
      },
    ],
  },
  {
    id: "en-c1",
    languageCode: "en",
    languageName: "English",
    flag: "🇬🇧",
    level: "C1",
    title: "English İleri",
    description:
      "Akademik ve profesyonel dil, ileri dilbilgisi yapıları ve akıcı iletişim.",
    prerequisites: "English B2",
    totalHours: 60,
    units: [
      {
        id: "en-c1-u1",
        title: "İleri Pasif Yapılar",
        topics: ["Passive with modals", "Causative", "Impersonal passive"],
        estimatedHours: 10,
      },
      {
        id: "en-c1-u2",
        title: "Akademik Yazı",
        topics: ["Argümantatif makale", "Özet yazma", "Cohesion & coherence"],
        estimatedHours: 10,
      },
      {
        id: "en-c1-u3",
        title: "İleri Kelime Hazinesi",
        topics: ["Kolokasyonlar", "Akademik kelimeler", "Register değişimi"],
        estimatedHours: 10,
      },
      {
        id: "en-c1-u4",
        title: "Medeni Tartışma",
        topics: ["Diplomatik dil", "Müzakere", "İkna teknikleri"],
        estimatedHours: 10,
      },
      {
        id: "en-c1-u5",
        title: "Edebi Metin Analizi",
        topics: ["Roman ve hikâye dili", "Şiir analizi", "Eleştirel okuma"],
        estimatedHours: 10,
      },
      {
        id: "en-c1-u6",
        title: "Profesyonel Yazışma",
        topics: ["Rapor yazımı", "Teklife yanıt", "Hukuki / teknik dil giriş"],
        estimatedHours: 10,
      },
    ],
  },
  {
    id: "en-c2",
    languageCode: "en",
    languageName: "English",
    flag: "🇬🇧",
    level: "C2",
    title: "English Ustalık",
    description:
      "Anadil seviyesine yakın kullanım, nüans farkları, edebi dil ve ileri iletişim.",
    prerequisites: "English C1",
    totalHours: 60,
    units: [
      {
        id: "en-c2-u1",
        title: "Nüans ve Ton",
        topics: ["Ironi ve mizah", "Söylem analizi", "Bağlamsal anlam"],
        estimatedHours: 10,
      },
      {
        id: "en-c2-u2",
        title: "Edebi Türler",
        topics: ["Şiir yazımı", "Kısa hikâye", "Eleştiri yazısı"],
        estimatedHours: 10,
      },
      {
        id: "en-c2-u3",
        title: "Medya ve Söylem",
        topics: ["Gazetecilik dili", "Propaganda analizi", "Sosyal medya dili"],
        estimatedHours: 10,
      },
      {
        id: "en-c2-u4",
        title: "Hukuki ve Akademik Metin",
        topics: ["Hukuki dil temelleri", "Akademik makale okuma", "Referans yapısı"],
        estimatedHours: 10,
      },
      {
        id: "en-c2-u5",
        title: "Diyalekt ve Varyasyonlar",
        topics: ["Amerikan vs İngiliz İngilizcesi", "Argo ve gündelik dil", "Bölgesel farklılıklar"],
        estimatedHours: 10,
      },
      {
        id: "en-c2-u6",
        title: "İleri Söz Sanatları",
        topics: ["Metafor ve mecaz", "Alliteration", "Retorik analizi"],
        estimatedHours: 10,
      },
    ],
  },

  // ─────────────────── GERMAN ───────────────────
  {
    id: "de-a1",
    languageCode: "de",
    languageName: "German",
    flag: "🇩🇪",
    level: "A1",
    title: "Deutsch Başlangıç",
    description:
      "Temel Almanca selamlaşmalar, sayılar, renkler ve basit cümleler.",
    prerequisites: null,
    totalHours: 30,
    units: [
      {
        id: "de-a1-u1",
        title: "Guten Tag!",
        topics: ["Selamlaşmalar", "Tanışma", "Alfabe ve özel sesler (ä, ö, ü)"],
        estimatedHours: 5,
      },
      {
        id: "de-a1-u2",
        title: "Zahlen und Farben",
        topics: ["Sayılar 1-100", "Renkler", "Yaş ve tarih"],
        estimatedHours: 5,
      },
      {
        id: "de-a1-u3",
        title: "Familie und Berufe",
        topics: ["Aile üyeleri", "Meslekler", "sein fiili (to be)"],
        estimatedHours: 5,
      },
      {
        id: "de-a1-u4",
        title: "Artikel ve İsimler",
        topics: ["Der/Die/Das", "Çoğul yapılar", "Kein/nicht"],
        estimatedHours: 5,
      },
      {
        id: "de-a1-u5",
        title: "Yemek ve İçecek",
        topics: ["Yiyecek isimleri", "Restoranda sipariş", "Sayılar ve fiyatlar"],
        estimatedHours: 5,
      },
      {
        id: "de-a1-u6",
        title: "Günlük Hayat",
        topics: ["Saatler", "Haftanın günleri", "Basit rutin anlatımı"],
        estimatedHours: 5,
      },
    ],
  },
  {
    id: "de-a2",
    languageCode: "de",
    languageName: "German",
    flag: "🇩🇪",
    level: "A2",
    title: "Deutsch Temel",
    description:
      "Geçmiş zaman (Perfekt), yönler, alışveriş diyalogları ve modal fiiller.",
    prerequisites: "German A1",
    totalHours: 40,
    units: [
      {
        id: "de-a2-u1",
        title: "Perfekt Zamanı",
        topics: ["haben / sein ile Perfekt", "Geçmiş deneyimler", "Düzensiz fiiller"],
        estimatedHours: 7,
      },
      {
        id: "de-a2-u2",
        title: "Alışveriş",
        topics: ["Mağazada konuşma", "Fiyat sorma", "Komparativ"],
        estimatedHours: 7,
      },
      {
        id: "de-a2-u3",
        title: "Yol Tarifi",
        topics: ["Yön ifadeleri", "Ulaşım araçları", "Yerel prepositions"],
        estimatedHours: 7,
      },
      {
        id: "de-a2-u4",
        title: "Modal Fiiller",
        topics: ["können/müssen/wollen/dürfen", "İzin ve zorunluluk", "İstek cümleleri"],
        estimatedHours: 6,
      },
      {
        id: "de-a2-u5",
        title: "Hava ve Mevsimler",
        topics: ["Hava ifadeleri", "Mevsim isimleri", "Zaman zarfları"],
        estimatedHours: 7,
      },
      {
        id: "de-a2-u6",
        title: "Sağlık",
        topics: ["Vücut parçaları", "Doktor diyaloğu", "Semptomlar"],
        estimatedHours: 6,
      },
    ],
  },
  {
    id: "de-b1",
    languageCode: "de",
    languageName: "German",
    flag: "🇩🇪",
    level: "B1",
    title: "Deutsch Orta Seviye",
    description:
      "Konjunktiv II, Dativ ve Akkusativ kuralları, iş hayatı Almancası.",
    prerequisites: "German A2",
    totalHours: 50,
    units: [
      {
        id: "de-b1-u1",
        title: "Konjunktiv II",
        topics: ["Kibarca talep", "Koşul ifadeleri", "würde + infinitiv"],
        estimatedHours: 9,
      },
      {
        id: "de-b1-u2",
        title: "Dativ ve Akkusativ",
        topics: ["Dativ prepositions", "Akkusativ değişimleri", "Kasus özeti"],
        estimatedHours: 9,
      },
      {
        id: "de-b1-u3",
        title: "İş Hayatı",
        topics: ["İş görüşmesi", "E-posta yazımı", "Mesleki terimler"],
        estimatedHours: 8,
      },
      {
        id: "de-b1-u4",
        title: "Pasif Yapı",
        topics: ["werden + Partizip II", "Pasif cümle dönüşümü", "Teknik metinler"],
        estimatedHours: 8,
      },
      {
        id: "de-b1-u5",
        title: "Bağlaçlar ve Cümle Yapısı",
        topics: ["Nebensatz", "weil/obwohl/dass", "Sözcük dizisi kuralları"],
        estimatedHours: 8,
      },
      {
        id: "de-b1-u6",
        title: "Kültür ve Toplum",
        topics: ["Alman kültürü", "Bayramlar", "Görüş bildirme"],
        estimatedHours: 8,
      },
    ],
  },
  {
    id: "de-b2",
    languageCode: "de",
    languageName: "German",
    flag: "🇩🇪",
    level: "B2",
    title: "Deutsch Orta-İleri",
    description:
      "İleri dilbilgisi, akademik okuma ve Almanca iletişimde akıcılık.",
    prerequisites: "German B1",
    totalHours: 55,
    units: [
      {
        id: "de-b2-u1",
        title: "Genitiv",
        topics: ["Genitiv yapısı", "İyelik ifadeleri", "Formal yazı dili"],
        estimatedHours: 9,
      },
      {
        id: "de-b2-u2",
        title: "Partizipialkonstruktionen",
        topics: ["Partizip I ve II", "Katılım cümleleri", "Akademik dil"],
        estimatedHours: 10,
      },
      {
        id: "de-b2-u3",
        title: "Medya ve Haberler",
        topics: ["Gazete okuma", "Haber dili", "Kelime analizi"],
        estimatedHours: 9,
      },
      {
        id: "de-b2-u4",
        title: "İnce Kelime Farklılıkları",
        topics: ["Synonyme", "Konnotationen", "Nuance"],
        estimatedHours: 9,
      },
      {
        id: "de-b2-u5",
        title: "Tartışma ve Sunum",
        topics: ["Argüman yapısı", "Sunum dili", "Görüş karşılaştırma"],
        estimatedHours: 9,
      },
      {
        id: "de-b2-u6",
        title: "Edebiyat Giriş",
        topics: ["Kısa hikâye okuma", "Analiz ifadeleri", "Yazar dili"],
        estimatedHours: 9,
      },
    ],
  },

  // ─────────────────── FRENCH ───────────────────
  {
    id: "fr-a1",
    languageCode: "fr",
    languageName: "French",
    flag: "🇫🇷",
    level: "A1",
    title: "Français Başlangıç",
    description:
      "Temel Fransızca selamlaşmalar, cinsiyet kuralı ve basit diyaloglar.",
    prerequisites: null,
    totalHours: 30,
    units: [
      {
        id: "fr-a1-u1",
        title: "Bonjour!",
        topics: ["Selamlaşmalar", "Tanışma", "Nazal sesler"],
        estimatedHours: 5,
      },
      {
        id: "fr-a1-u2",
        title: "Chiffres et Couleurs",
        topics: ["Sayılar", "Renkler", "Tarih ve ay isimleri"],
        estimatedHours: 5,
      },
      {
        id: "fr-a1-u3",
        title: "La Famille",
        topics: ["Aile üyeleri", "Sahiplik sıfatları", "Être fiili"],
        estimatedHours: 5,
      },
      {
        id: "fr-a1-u4",
        title: "Les Articles",
        topics: ["le/la/les", "un/une/des", "Cinsiyet kuralı"],
        estimatedHours: 5,
      },
      {
        id: "fr-a1-u5",
        title: "Yiyecek ve Kafe",
        topics: ["Kafede sipariş", "Yiyecek isimleri", "Partitif artikeller"],
        estimatedHours: 5,
      },
      {
        id: "fr-a1-u6",
        title: "Günlük Rutinler",
        topics: ["Saatler", "Günlük aktiviteler", "-er fiil çekimi"],
        estimatedHours: 5,
      },
    ],
  },
  {
    id: "fr-a2",
    languageCode: "fr",
    languageName: "French",
    flag: "🇫🇷",
    level: "A2",
    title: "Français Temel",
    description: "Geçmiş zaman (Passé composé), seyahat ve yön tarifi.",
    prerequisites: "French A1",
    totalHours: 40,
    units: [
      {
        id: "fr-a2-u1",
        title: "Passé Composé",
        topics: ["avoir / être ile geçmiş", "Düzensiz fiiller", "Zaman ifadeleri"],
        estimatedHours: 7,
      },
      {
        id: "fr-a2-u2",
        title: "Seyahat",
        topics: ["Havalimanında", "Otel rezervasyonu", "Ulaşım"],
        estimatedHours: 7,
      },
      {
        id: "fr-a2-u3",
        title: "Yönler",
        topics: ["Yol tarifi", "Şehir isimleri", "Prepositions of place"],
        estimatedHours: 7,
      },
      {
        id: "fr-a2-u4",
        title: "Alışveriş",
        topics: ["Giyim isimleri", "Fiyat sorma", "Karşılaştırmalar"],
        estimatedHours: 6,
      },
      {
        id: "fr-a2-u5",
        title: "Imparfait",
        topics: ["Geçmişteki durumlar", "Alışkanlıklar", "Passé vs Imparfait"],
        estimatedHours: 7,
      },
      {
        id: "fr-a2-u6",
        title: "Futur Proche",
        topics: ["aller + infinitif", "Yakın gelecek", "Plan yapma"],
        estimatedHours: 6,
      },
    ],
  },
  {
    id: "fr-b1",
    languageCode: "fr",
    languageName: "French",
    flag: "🇫🇷",
    level: "B1",
    title: "Français Orta Seviye",
    description: "Subjonctif, conditionnel ve iş hayatı Fransızcası.",
    prerequisites: "French A2",
    totalHours: 50,
    units: [
      {
        id: "fr-b1-u1",
        title: "Subjonctif",
        topics: ["Subjonctif présent", "Duygu ve zorunluluk ifadeleri", "que + subjonctif"],
        estimatedHours: 9,
      },
      {
        id: "fr-b1-u2",
        title: "Conditionnel",
        topics: ["Conditionnel présent", "Nazik talepler", "Varsayım"],
        estimatedHours: 8,
      },
      {
        id: "fr-b1-u3",
        title: "İş Hayatı",
        topics: ["CV ve motivasyon mektubu", "Toplantı dili", "Mesleki yazışma"],
        estimatedHours: 9,
      },
      {
        id: "fr-b1-u4",
        title: "Medya",
        topics: ["Haber anlama", "Gazete dili", "Görüş bildirme"],
        estimatedHours: 8,
      },
      {
        id: "fr-b1-u5",
        title: "Pronoms relatifs",
        topics: ["qui/que/dont/où", "Bağlaçlı cümleler", "Metin akıcılığı"],
        estimatedHours: 8,
      },
      {
        id: "fr-b1-u6",
        title: "Fransız Kültürü",
        topics: ["Fransız mutfağı", "Bayramlar", "Sanat ve sinema"],
        estimatedHours: 8,
      },
    ],
  },

  // ─────────────────── SPANISH ───────────────────
  {
    id: "es-a1",
    languageCode: "es",
    languageName: "Spanish",
    flag: "🇪🇸",
    level: "A1",
    title: "Español Başlangıç",
    description:
      "Temel İspanyolca selamlaşmalar, ser/estar farkı ve basit diyaloglar.",
    prerequisites: null,
    totalHours: 30,
    units: [
      {
        id: "es-a1-u1",
        title: "¡Hola!",
        topics: ["Selamlaşmalar", "Tanışma", "İspanyolca telaffuz"],
        estimatedHours: 5,
      },
      {
        id: "es-a1-u2",
        title: "Números y Colores",
        topics: ["Sayılar", "Renkler", "Günler ve aylar"],
        estimatedHours: 5,
      },
      {
        id: "es-a1-u3",
        title: "Ser y Estar",
        topics: ["ser vs estar farkı", "Kimlik ve durum", "Basit tanımlama"],
        estimatedHours: 5,
      },
      {
        id: "es-a1-u4",
        title: "La Familia",
        topics: ["Aile üyeleri", "Sahiplik sıfatları", "Cinsiyet"],
        estimatedHours: 5,
      },
      {
        id: "es-a1-u5",
        title: "Comida y Bebida",
        topics: ["Yiyecek isimleri", "Restoran", "Beğeni ifadeleri"],
        estimatedHours: 5,
      },
      {
        id: "es-a1-u6",
        title: "Rutina Diaria",
        topics: ["Günlük rutinler", "Saatler", "Refleksif fiiller giriş"],
        estimatedHours: 5,
      },
    ],
  },
  {
    id: "es-a2",
    languageCode: "es",
    languageName: "Spanish",
    flag: "🇪🇸",
    level: "A2",
    title: "Español Temel",
    description: "Geçmiş zaman (Pretérito), alışveriş ve yön tarifi.",
    prerequisites: "Spanish A1",
    totalHours: 40,
    units: [
      {
        id: "es-a2-u1",
        title: "Pretérito Indefinido",
        topics: ["Düzenli geçmiş zaman", "Düzensiz fiiller", "Geçmiş zaman ifadeleri"],
        estimatedHours: 8,
      },
      {
        id: "es-a2-u2",
        title: "Pretérito Imperfecto",
        topics: ["Geçmişteki alışkanlıklar", "Tanımlama", "Karşılaştırma"],
        estimatedHours: 7,
      },
      {
        id: "es-a2-u3",
        title: "De Compras",
        topics: ["Alışveriş diyalogları", "Fiyat ve renk", "Karşılaştırma sıfatları"],
        estimatedHours: 7,
      },
      {
        id: "es-a2-u4",
        title: "Viaje",
        topics: ["Seyahat", "Yön tarifi", "Ulaşım"],
        estimatedHours: 7,
      },
      {
        id: "es-a2-u5",
        title: "Gustos y Opiniones",
        topics: ["Gustar yapısı", "Görüş bildirme", "Tercihler"],
        estimatedHours: 6,
      },
      {
        id: "es-a2-u6",
        title: "Futuro Inmediato",
        topics: ["ir a + infinitivo", "Yakın gelecek", "Plan yapma"],
        estimatedHours: 5,
      },
    ],
  },
  {
    id: "es-b1",
    languageCode: "es",
    languageName: "Spanish",
    flag: "🇪🇸",
    level: "B1",
    title: "Español Orta Seviye",
    description: "Subjuntivo, koşullu yapılar ve iş hayatı İspanyolcası.",
    prerequisites: "Spanish A2",
    totalHours: 50,
    units: [
      {
        id: "es-b1-u1",
        title: "Subjuntivo Presente",
        topics: ["Subjuntivo çekimi", "İstek ve duygu ifadeleri", "que + subjuntivo"],
        estimatedHours: 9,
      },
      {
        id: "es-b1-u2",
        title: "Condicional",
        topics: ["Condicional simple", "Varsayım", "Nazik talepler"],
        estimatedHours: 8,
      },
      {
        id: "es-b1-u3",
        title: "Negocios",
        topics: ["İş toplantısı", "E-posta", "Pazarlama dili"],
        estimatedHours: 9,
      },
      {
        id: "es-b1-u4",
        title: "Ser/Estar İleri",
        topics: ["Nüans farkları", "İleri kullanım", "Yaygın hatalar"],
        estimatedHours: 8,
      },
      {
        id: "es-b1-u5",
        title: "Medios de Comunicación",
        topics: ["Haber anlama", "Görüş bildirme", "Tartışma"],
        estimatedHours: 8,
      },
      {
        id: "es-b1-u6",
        title: "Cultura Hispana",
        topics: ["Latin Amerika kültürü", "İspanya kültürü", "Festival ve gelenekler"],
        estimatedHours: 8,
      },
    ],
  },

  // ─────────────────── ITALIAN ───────────────────
  {
    id: "it-a1",
    languageCode: "it",
    languageName: "Italian",
    flag: "🇮🇹",
    level: "A1",
    title: "Italiano Başlangıç",
    description:
      "Temel İtalyanca selamlaşmalar, artikeller ve basit günlük diyaloglar.",
    prerequisites: null,
    totalHours: 30,
    units: [
      {
        id: "it-a1-u1",
        title: "Ciao!",
        topics: ["Selamlaşmalar", "Tanışma", "İtalyanca telaffuz"],
        estimatedHours: 5,
      },
      {
        id: "it-a1-u2",
        title: "Numeri e Colori",
        topics: ["Sayılar 1-100", "Renkler", "Tarih söyleme"],
        estimatedHours: 5,
      },
      {
        id: "it-a1-u3",
        title: "Gli Articoli",
        topics: ["il/la/lo/gli/le", "Belirli ve belirsiz", "Cinsiyet kuralı"],
        estimatedHours: 5,
      },
      {
        id: "it-a1-u4",
        title: "La Famiglia",
        topics: ["Aile üyeleri", "Avere ve essere", "Sahiplik"],
        estimatedHours: 5,
      },
      {
        id: "it-a1-u5",
        title: "Al Bar",
        topics: ["Kafede sipariş", "Yiyecek ve içecek", "Teşekkür ifadeleri"],
        estimatedHours: 5,
      },
      {
        id: "it-a1-u6",
        title: "La Città",
        topics: ["Şehirde yerler", "Yön tarifi giriş", "Prepositions"],
        estimatedHours: 5,
      },
    ],
  },
  {
    id: "it-a2",
    languageCode: "it",
    languageName: "Italian",
    flag: "🇮🇹",
    level: "A2",
    title: "Italiano Temel",
    description: "Passato prossimo, seyahat ve alışveriş diyalogları.",
    prerequisites: "Italian A1",
    totalHours: 40,
    units: [
      {
        id: "it-a2-u1",
        title: "Passato Prossimo",
        topics: ["avere/essere ile geçmiş", "Düzensiz fiiller", "Geçmiş zaman"],
        estimatedHours: 8,
      },
      {
        id: "it-a2-u2",
        title: "In Viaggio",
        topics: ["Seyahat", "Bilet alma", "Ulaşım araçları"],
        estimatedHours: 7,
      },
      {
        id: "it-a2-u3",
        title: "Fare la Spesa",
        topics: ["Alışveriş", "Fiyatlar", "Besin grupları"],
        estimatedHours: 7,
      },
      {
        id: "it-a2-u4",
        title: "Imperfetto",
        topics: ["Geçmişteki alışkanlıklar", "Tanımlama", "Hikâye anlatımı"],
        estimatedHours: 7,
      },
      {
        id: "it-a2-u5",
        title: "Futuro Semplice",
        topics: ["Gelecek zaman", "Tahminler", "Plan yapma"],
        estimatedHours: 6,
      },
      {
        id: "it-a2-u6",
        title: "La Salute",
        topics: ["Vücut parçaları", "Doktorda", "Semptomlar"],
        estimatedHours: 5,
      },
    ],
  },

  // ─────────────────── ARABIC ───────────────────
  {
    id: "ar-a1",
    languageCode: "ar",
    languageName: "Arabic",
    flag: "🇸🇦",
    level: "A1",
    title: "عربي Başlangıç",
    description:
      "Arapça alfabesi, hareke sistemi ve temel selamlaşma kalıpları.",
    prerequisites: null,
    totalHours: 35,
    units: [
      {
        id: "ar-a1-u1",
        title: "Arap Alfabesi",
        topics: ["Harfler ve telaffuz", "Hareke (ünlü işaretleri)", "Yazı yönü"],
        estimatedHours: 6,
      },
      {
        id: "ar-a1-u2",
        title: "Merhaba!",
        topics: ["Selamlaşmalar", "الاسم والدين ifadeleri", "Temel diyaloglar"],
        estimatedHours: 6,
      },
      {
        id: "ar-a1-u3",
        title: "Sayılar ve Renkler",
        topics: ["Sayılar 1-20", "Renkler", "Cinsiyet uyumu"],
        estimatedHours: 6,
      },
      {
        id: "ar-a1-u4",
        title: "Aile",
        topics: ["Aile kelimeleri", "Tanımlama cümleleri", "Zamir sistemi"],
        estimatedHours: 6,
      },
      {
        id: "ar-a1-u5",
        title: "Yiyecekler",
        topics: ["Yiyecek isimleri", "Beğeni ifadeleri", "Basit cümleler"],
        estimatedHours: 5,
      },
      {
        id: "ar-a1-u6",
        title: "Günlük Hayat",
        topics: ["Günlük aktiviteler", "Saat sorma", "Gün ve aylar"],
        estimatedHours: 6,
      },
    ],
  },

  // ─────────────────── RUSSIAN ───────────────────
  {
    id: "ru-a1",
    languageCode: "ru",
    languageName: "Russian",
    flag: "🇷🇺",
    level: "A1",
    title: "Русский Başlangıç",
    description:
      "Kiril alfabesi, temel selamlaşmalar ve basit Rusça cümle kurma.",
    prerequisites: null,
    totalHours: 35,
    units: [
      {
        id: "ru-a1-u1",
        title: "Kiril Alfabesi",
        topics: ["33 harf", "Sesli/sessiz harfler", "Telaffuz kuralları"],
        estimatedHours: 7,
      },
      {
        id: "ru-a1-u2",
        title: "Привет!",
        topics: ["Selamlaşmalar", "Tanışma", "Teşekkür"],
        estimatedHours: 6,
      },
      {
        id: "ru-a1-u3",
        title: "Числа и Цвета",
        topics: ["Sayılar 1-20", "Renkler", "Temel sıfatlar"],
        estimatedHours: 6,
      },
      {
        id: "ru-a1-u4",
        title: "Семья",
        topics: ["Aile üyeleri", "Sahiplik", "Basit cümleler"],
        estimatedHours: 6,
      },
      {
        id: "ru-a1-u5",
        title: "Eда",
        topics: ["Yiyecek isimleri", "Kafede sipariş", "Sayı ve miktar"],
        estimatedHours: 5,
      },
      {
        id: "ru-a1-u6",
        title: "Günlük Hayat",
        topics: ["Günlük rutinler", "Saatler", "Temel fiil çekimi"],
        estimatedHours: 5,
      },
    ],
  },

  // ─────────────────── JAPANESE ───────────────────
  {
    id: "ja-a1",
    languageCode: "ja",
    languageName: "Japanese",
    flag: "🇯🇵",
    level: "A1",
    title: "日本語 Başlangıç",
    description:
      "Hiragana, Katakana, temel selamlaşmalar ve basit cümle yapısı.",
    prerequisites: null,
    totalHours: 40,
    units: [
      {
        id: "ja-a1-u1",
        title: "Hiragana",
        topics: ["46 hece", "Yazı pratiği", "Temel okuma"],
        estimatedHours: 8,
      },
      {
        id: "ja-a1-u2",
        title: "Katakana",
        topics: ["46 hece", "Yabancı kelimeler", "Katakana okuma"],
        estimatedHours: 7,
      },
      {
        id: "ja-a1-u3",
        title: "こんにちは!",
        topics: ["Selamlaşmalar", "Tanışma", "Nazik ifadeler"],
        estimatedHours: 6,
      },
      {
        id: "ja-a1-u4",
        title: "Sayılar ve Tarih",
        topics: ["Sayılar 1-100", "Tarih", "Saat"],
        estimatedHours: 6,
      },
      {
        id: "ja-a1-u5",
        title: "Aile ve İnsanlar",
        topics: ["Aile kelimeleri", "Meslekler", "です/は yapısı"],
        estimatedHours: 7,
      },
      {
        id: "ja-a1-u6",
        title: "Yiyecek ve Alışveriş",
        topics: ["Yiyecek isimleri", "Fiyat sorma", "Temel alışveriş"],
        estimatedHours: 6,
      },
    ],
  },

  // ─────────────────── CHINESE ───────────────────
  {
    id: "zh-a1",
    languageCode: "zh",
    languageName: "Chinese",
    flag: "🇨🇳",
    level: "A1",
    title: "中文 Başlangıç",
    description: "Pinyin sistemi, tonlar, temel selamlaşmalar ve basit cümleler.",
    prerequisites: null,
    totalHours: 40,
    units: [
      {
        id: "zh-a1-u1",
        title: "Pinyin ve Tonlar",
        topics: ["4 ton sistemi", "Pinyin alfabesi", "Telaffuz pratiği"],
        estimatedHours: 8,
      },
      {
        id: "zh-a1-u2",
        title: "你好!",
        topics: ["Selamlaşmalar", "Tanışma", "Teşekkür"],
        estimatedHours: 6,
      },
      {
        id: "zh-a1-u3",
        title: "Sayılar",
        topics: ["1-100", "Tarih ve saat", "Fiyatlar"],
        estimatedHours: 7,
      },
      {
        id: "zh-a1-u4",
        title: "Aile",
        topics: ["Aile üyeleri", "Basit cümleler", "是 yapısı"],
        estimatedHours: 6,
      },
      {
        id: "zh-a1-u5",
        title: "Temel Karakterler",
        topics: ["En yaygın 50 karakter", "Radikal sistemi", "Yazı pratiği"],
        estimatedHours: 7,
      },
      {
        id: "zh-a1-u6",
        title: "Yiyecek ve Restoran",
        topics: ["Yiyecek isimleri", "Sipariş verme", "量词 (ölçü kelimeleri)"],
        estimatedHours: 6,
      },
    ],
  },

  // ─────────────────── KOREAN ───────────────────
  {
    id: "ko-a1",
    languageCode: "ko",
    languageName: "Korean",
    flag: "🇰🇷",
    level: "A1",
    title: "한국어 Başlangıç",
    description: "Hangul alfabesi, temel selamlaşmalar ve basit Korece cümleler.",
    prerequisites: null,
    totalHours: 35,
    units: [
      {
        id: "ko-a1-u1",
        title: "한글 (Hangul)",
        topics: ["Sesli harfler", "Sessiz harfler", "Hece yapısı"],
        estimatedHours: 7,
      },
      {
        id: "ko-a1-u2",
        title: "안녕하세요!",
        topics: ["Selamlaşmalar", "Tanışma", "Resmi ve gayri resmi"],
        estimatedHours: 6,
      },
      {
        id: "ko-a1-u3",
        title: "Sayılar",
        topics: ["Sino-Korece sayılar", "Saf Korece sayılar", "Kullanım farkı"],
        estimatedHours: 6,
      },
      {
        id: "ko-a1-u4",
        title: "Aile",
        topics: ["Aile kelimeleri", "이다 yapısı", "Temel cümleler"],
        estimatedHours: 6,
      },
      {
        id: "ko-a1-u5",
        title: "Yiyecek ve Kafe",
        topics: ["Yiyecek isimleri", "Kafede sipariş", "Fiyat"],
        estimatedHours: 5,
      },
      {
        id: "ko-a1-u6",
        title: "Günlük Rutinler",
        topics: ["Günlük aktiviteler", "Saatler", "Temel fiil"],
        estimatedHours: 5,
      },
    ],
  },
];

export default COURSES;

export function getCoursesByLanguage(languageCode: string): Course[] {
  return COURSES.filter((c) => c.languageCode === languageCode);
}

export function getCourse(languageCode: string, level: string): Course | undefined {
  return COURSES.find(
    (c) => c.languageCode === languageCode && c.level === level
  );
}

export function getAvailableLanguages(): {
  code: string;
  name: string;
  flag: string;
  courseCount: number;
  levels: string[];
}[] {
  const map = new Map<string, { code: string; name: string; flag: string; courseCount: number; levels: string[] }>();
  for (const course of COURSES) {
    if (!map.has(course.languageCode)) {
      map.set(course.languageCode, {
        code: course.languageCode,
        name: course.languageName,
        flag: course.flag,
        courseCount: 0,
        levels: [],
      });
    }
    const entry = map.get(course.languageCode)!;
    entry.courseCount += 1;
    entry.levels.push(course.level);
  }
  return Array.from(map.values());
}
