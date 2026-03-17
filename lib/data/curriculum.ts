import type { Department } from "@/types/university";

// ─── Badge image mappings ─────────────────────────────────────────────────────
// A1 → beginner, A2 → beginner, B1 → mid, B2 → advanced, C1 → advanced, C2 → master
function badgeImageForLevel(level: string): string {
  if (level === "A1" || level === "A2") return "/badges/beginner.svg";
  if (level === "B1") return "/badges/mid.svg";
  if (level === "B2" || level === "C1") return "/badges/advanced.svg";
  return "/badges/master.svg";
}

function certImageForLevel(level: string): string | null {
  if (level === "A1" || level === "A2") return null; // no cert at A levels
  if (level === "B1") return "/certs/certificate-middle.svg";
  if (level === "B2" || level === "C1") return "/certs/certificate-advanced.svg";
  return "/certs/certificate-master.svg";
}

function badgeCodeForLevel(langCode: string, level: string): string {
  return `${langCode.toUpperCase()}_${level}`;
}

function makeUnits(count: number, langName: string, level: string) {
  const topicsByLevel: Record<string, string[][]> = {
    A1: [
      ["Selamlaşma", "Tanışma", "Sayılar"],
      ["Renkler", "Günler", "Aylar"],
      ["Aile üyeleri", "Ev eşyaları"],
      ["Yiyecekler", "İçecekler"],
      ["Günlük rutinler", "Saatler"],
      ["Vücut parçaları", "Sağlık"],
    ],
    A2: [
      ["Geçmiş zaman", "Hikaye anlatımı"],
      ["Alışveriş", "Fiyatlar"],
      ["Ulaşım", "Yol tarifi"],
      ["Hava durumu", "Mevsimler"],
      ["Hobiler", "Boş zaman"],
      ["Restoran & Sipariş"],
    ],
    B1: [
      ["İş hayatı temelleri", "E-posta yazımı"],
      ["Seyahat & Rezervasyon"],
      ["Medya & Haberler"],
      ["Çevre & Doğa"],
      ["Kültür & Gelenekler"],
      ["Sağlık & Yaşam tarzı"],
      ["Teknoloji & Sosyal medya"],
      ["Tartışma & Görüş bildirme"],
    ],
    B2: [
      ["İş görüşmesi", "CV hazırlama"],
      ["Akademik yazı", "Sunum"],
      ["Ekonomi & Finans"],
      ["Politika & Toplum"],
      ["Felsefe & Etik tartışmaları"],
      ["Edebiyat analizi"],
      ["Bilim & Araştırma"],
      ["Müzakere & İkna"],
    ],
    C1: [
      ["Üst düzey akademik dil"],
      ["Nüanslı iletişim", "Deyimler"],
      ["Profesyonel konferans dili"],
      ["Medya analizi", "Eleştiri"],
      ["Hukuki & Teknik dil"],
      ["Liderlik & Yönetim dili"],
    ],
    C2: [
      ["Yerli konuşmacı akıcılığı"],
      ["Edebi & Şiirsel dil"],
      ["Sosyolinguistik"],
      ["Dil tarihçesi"],
      ["Dialekt & Lehçe anlayışı"],
    ],
  };

  const topics = topicsByLevel[level] || [["Temel konular"]];
  const units = [];
  for (let i = 0; i < count; i++) {
    const t = topics[i % topics.length];
    units.push({
      id: `${langName.toLowerCase()}-${level.toLowerCase()}-unit-${i + 1}`,
      order: i + 1,
      title: `${level} Unit ${i + 1}: ${t[0]}`,
      description: `${langName} dilinde ${t.join(", ")} konularını kapsar.`,
      topics: t,
    });
  }
  return units;
}

function makeLevels(langCode: string, langName: string): Department["levels"] {
  const configs = [
    { level: "A1", title: "Başlangıç", description: `${langName} diline giriş. Temel kelimeler ve basit cümleler.`, unitCount: 6 },
    { level: "A2", title: "Temel", description: `Günlük konuşma ve yaygın ifadeler.`, unitCount: 6 },
    { level: "B1", title: "Orta Seviye", description: `İş hayatı ve seyahat için yeterli dil becerisi.`, unitCount: 8 },
    { level: "B2", title: "Üst Orta", description: `Karmaşık konularda akıcı iletişim.`, unitCount: 8 },
    { level: "C1", title: "İleri Seviye", description: `Esnek ve etkili profesyonel iletişim.`, unitCount: 6 },
    { level: "C2", title: "Usta", description: `Yerli konuşmacı düzeyi ve akademik ustalık.`, unitCount: 5 },
  ];

  return configs.map(({ level, title, description, unitCount }) => ({
    level,
    title,
    description,
    units: makeUnits(unitCount, langName, level),
    badgeCode: badgeCodeForLevel(langCode, level),
    badgeImageUrl: badgeImageForLevel(level),
    certificateImageUrl: certImageForLevel(level),
  }));
}

// ─── Departments / Language Catalog ──────────────────────────────────────────

export const DEPARTMENTS: Department[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    icon: "🇬🇧",
    description: "Dünyanın en yaygın dili. İş, akademi ve seyahat için vazgeçilmez.",
    levels: makeLevels("en", "İngilizce"),
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    icon: "🇩🇪",
    description: "Avrupa'nın ekonomi dili. Almanya, Avusturya ve İsviçre için temel.",
    levels: makeLevels("de", "Almanca"),
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    icon: "🇫🇷",
    description: "Diplomatik dil. Kültür, moda ve gastronomi dünyasının kapısı.",
    levels: makeLevels("fr", "Fransızca"),
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    icon: "🇪🇸",
    description: "20+ ülkede konuşulan dil. Latin Amerika ve İspanya için.",
    levels: makeLevels("es", "İspanyolca"),
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    icon: "🇮🇹",
    description: "Müzik, sanat ve mutfak kültürünün anahtarı.",
    levels: makeLevels("it", "İtalyanca"),
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    icon: "🇷🇺",
    description: "Doğu Avrupa ve Orta Asya'nın ortak dili.",
    levels: makeLevels("ru", "Rusça"),
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    icon: "🇯🇵",
    description: "Teknoloji, anime ve kültür için Japonca.",
    levels: makeLevels("ja", "Japonca"),
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    icon: "🇨🇳",
    description: "Dünyanın en çok konuşulan dili. İş ve ticaret için kritik.",
    levels: makeLevels("zh", "Çince"),
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    icon: "🇸🇦",
    description: "Orta Doğu ve Kuzey Afrika'nın dili. 22 ülkede resmi dil.",
    levels: makeLevels("ar", "Arapça"),
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    icon: "🇰🇷",
    description: "K-pop, K-drama ve teknoloji dünyasının dili.",
    levels: makeLevels("ko", "Korece"),
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    icon: "🇧🇷",
    description: "Brezilya ve Portekiz için. Latin Amerika'ya açılan kapı.",
    levels: makeLevels("pt", "Portekizce"),
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    icon: "🇮🇳",
    description: "Hindistan'ın ulusal dili. 500 milyondan fazla konuşucu.",
    levels: makeLevels("hi", "Hintçe"),
  },
];

export function getDepartment(code: string): Department | undefined {
  return DEPARTMENTS.find((d) => d.code === code);
}

export function getCourseLevel(
  langCode: string,
  level: string
): Department["levels"][number] | undefined {
  return getDepartment(langCode)?.levels.find((l) => l.level === level);
}

export function getCourseId(langCode: string, level: string): string {
  return `${langCode}-${level.toLowerCase()}`;
}
