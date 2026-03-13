export type KosheiLanguage = {
  code: string;
  name: string;
  nativeName: string;
  speechLocale?: string;
  isPopular?: boolean;
};

export const LANGUAGES: KosheiLanguage[] = [
  { code: "en", name: "English", nativeName: "English", speechLocale: "en-US", isPopular: true },
  { code: "de", name: "German", nativeName: "Deutsch", speechLocale: "de-DE", isPopular: true },
  { code: "fr", name: "French", nativeName: "Français", speechLocale: "fr-FR", isPopular: true },
  { code: "es", name: "Spanish", nativeName: "Español", speechLocale: "es-ES", isPopular: true },
  { code: "it", name: "Italian", nativeName: "Italiano", speechLocale: "it-IT", isPopular: true },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", speechLocale: "tr-TR", isPopular: true },
  { code: "ar", name: "Arabic", nativeName: "العربية", speechLocale: "ar-SA", isPopular: true },
  { code: "ru", name: "Russian", nativeName: "Русский", speechLocale: "ru-RU", isPopular: true },
  { code: "zh", name: "Chinese", nativeName: "中文", speechLocale: "zh-CN", isPopular: true },
  { code: "ja", name: "Japanese", nativeName: "日本語", speechLocale: "ja-JP", isPopular: true },
  { code: "ko", name: "Korean", nativeName: "한국어", speechLocale: "ko-KR", isPopular: true },
  { code: "pt", name: "Portuguese", nativeName: "Português", speechLocale: "pt-PT", isPopular: true },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", speechLocale: "hi-IN", isPopular: true },

  { code: "nl", name: "Dutch", nativeName: "Nederlands", speechLocale: "nl-NL" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", speechLocale: "sv-SE" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", speechLocale: "no-NO" },
  { code: "da", name: "Danish", nativeName: "Dansk", speechLocale: "da-DK" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", speechLocale: "fi-FI" },
  { code: "pl", name: "Polish", nativeName: "Polski", speechLocale: "pl-PL" },
  { code: "cs", name: "Czech", nativeName: "Čeština", speechLocale: "cs-CZ" },
  { code: "ro", name: "Romanian", nativeName: "Română", speechLocale: "ro-RO" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", speechLocale: "hu-HU" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", speechLocale: "el-GR" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", speechLocale: "uk-UA" },
  { code: "fa", name: "Persian", nativeName: "فارسی", speechLocale: "fa-IR" },
  { code: "ur", name: "Urdu", nativeName: "اردو", speechLocale: "ur-PK" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", speechLocale: "bn-BD" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", speechLocale: "id-ID" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", speechLocale: "ms-MY" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", speechLocale: "vi-VN" },
  { code: "th", name: "Thai", nativeName: "ไทย", speechLocale: "th-TH" },
  { code: "he", name: "Hebrew", nativeName: "עברית", speechLocale: "he-IL" },
  { code: "sr", name: "Serbian", nativeName: "Српски", speechLocale: "sr-RS" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", speechLocale: "hr-HR" },
  { code: "bg", name: "Bulgarian", nativeName: "Български", speechLocale: "bg-BG" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", speechLocale: "sk-SK" },
  { code: "sl", name: "Slovenian", nativeName: "Slovenščina", speechLocale: "sl-SI" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių", speechLocale: "lt-LT" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu", speechLocale: "lv-LV" },
  { code: "et", name: "Estonian", nativeName: "Eesti", speechLocale: "et-EE" },
  { code: "ca", name: "Catalan", nativeName: "Català", speechLocale: "ca-ES" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", speechLocale: "sw-KE" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans", speechLocale: "af-ZA" },
];

export const STAGES = ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2"] as const;

export function getSpeechLocaleByLanguageName(languageName: string) {
  return (
    LANGUAGES.find((lang) => lang.name === languageName)?.speechLocale || "en-US"
  );
  }
