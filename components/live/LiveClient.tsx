"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Role = "user" | "assistant";

type Message = {
  id: string;
  role: Role;
  content: string;
};

export const LANGUAGES = [
  // Avrupa - Germen
  { code: "en-US", label: "🇺🇸 English (US)",       targetLanguage: "English"     },
  { code: "en-GB", label: "🇬🇧 English (UK)",       targetLanguage: "English"     },
  { code: "de-DE", label: "🇩🇪 Deutsch",            targetLanguage: "German"      },
  { code: "nl-NL", label: "🇳🇱 Nederlands",         targetLanguage: "Dutch"       },
  { code: "af-ZA", label: "🇿🇦 Afrikaans",          targetLanguage: "Afrikaans"   },
  { code: "sv-SE", label: "🇸🇪 Svenska",            targetLanguage: "Swedish"     },
  { code: "no-NO", label: "🇳🇴 Norsk",              targetLanguage: "Norwegian"   },
  { code: "da-DK", label: "🇩🇰 Dansk",              targetLanguage: "Danish"      },
  { code: "is-IS", label: "🇮🇸 Íslenska",           targetLanguage: "Icelandic"   },
  // Avrupa - Roman
  { code: "fr-FR", label: "🇫🇷 Français",           targetLanguage: "French"      },
  { code: "es-ES", label: "🇪🇸 Español",            targetLanguage: "Spanish"     },
  { code: "pt-PT", label: "🇵🇹 Português (PT)",     targetLanguage: "Portuguese"  },
  { code: "pt-BR", label: "🇧🇷 Português (BR)",     targetLanguage: "Portuguese"  },
  { code: "it-IT", label: "🇮🇹 Italiano",           targetLanguage: "Italian"     },
  { code: "ro-RO", label: "🇷🇴 Română",             targetLanguage: "Romanian"    },
  { code: "ca-ES", label: "🏴 Català",              targetLanguage: "Catalan"     },
  // Avrupa - Slav
  { code: "ru-RU", label: "🇷🇺 Русский",            targetLanguage: "Russian"     },
  { code: "pl-PL", label: "🇵🇱 Polski",             targetLanguage: "Polish"      },
  { code: "cs-CZ", label: "🇨🇿 Čeština",            targetLanguage: "Czech"       },
  { code: "sk-SK", label: "🇸🇰 Slovenčina",         targetLanguage: "Slovak"      },
  { code: "uk-UA", label: "🇺🇦 Українська",         targetLanguage: "Ukrainian"   },
  { code: "bg-BG", label: "🇧🇬 Български",          targetLanguage: "Bulgarian"   },
  { code: "hr-HR", label: "🇭🇷 Hrvatski",           targetLanguage: "Croatian"    },
  { code: "sr-RS", label: "🇷🇸 Српски",             targetLanguage: "Serbian"     },
  { code: "sl-SI", label: "🇸🇮 Slovenščina",        targetLanguage: "Slovenian"   },
  // Avrupa - Diğer
  { code: "el-GR", label: "🇬🇷 Ελληνικά",           targetLanguage: "Greek"       },
  { code: "hu-HU", label: "🇭🇺 Magyar",             targetLanguage: "Hungarian"   },
  { code: "fi-FI", label: "🇫🇮 Suomi",              targetLanguage: "Finnish"     },
  { code: "et-EE", label: "🇪🇪 Eesti",              targetLanguage: "Estonian"    },
  { code: "lv-LV", label: "🇱🇻 Latviešu",           targetLanguage: "Latvian"     },
  { code: "lt-LT", label: "🇱🇹 Lietuvių",           targetLanguage: "Lithuanian"  },
  // Orta Doğu
  { code: "ar-SA", label: "🇸🇦 العربية",            targetLanguage: "Arabic"      },
  { code: "he-IL", label: "🇮🇱 עברית",              targetLanguage: "Hebrew"      },
  { code: "fa-IR", label: "🇮🇷 فارسی",              targetLanguage: "Persian"     },
  { code: "tr-TR", label: "🇹🇷 Türkçe",             targetLanguage: "Turkish"     },
  // Güney Asya
  { code: "hi-IN", label: "🇮🇳 हिन्दी",             targetLanguage: "Hindi"       },
  { code: "bn-BD", label: "🇧🇩 বাংলা",              targetLanguage: "Bengali"     },
  { code: "ur-PK", label: "🇵🇰 اردو",               targetLanguage: "Urdu"        },
  { code: "ta-IN", label: "🇮🇳 தமிழ்",              targetLanguage: "Tamil"       },
  { code: "te-IN", label: "🇮🇳 తెలుగు",             targetLanguage: "Telugu"      },
  { code: "mr-IN", label: "🇮🇳 मराठी",              targetLanguage: "Marathi"     },
  { code: "gu-IN", label: "🇮🇳 ગુજરાતી",            targetLanguage: "Gujarati"    },
  { code: "pa-IN", label: "🇮🇳 ਪੰਜਾਬੀ",             targetLanguage: "Punjabi"     },
  { code: "si-LK", label: "🇱🇰 සිංහල",              targetLanguage: "Sinhala"     },
  { code: "ne-NP", label: "🇳🇵 नेपाली",             targetLanguage: "Nepali"      },
  // Doğu Asya
  { code: "ja-JP", label: "🇯🇵 日本語",              targetLanguage: "Japanese"    },
  { code: "zh-CN", label: "🇨🇳 中文 (简体)",          targetLanguage: "Chinese (Simplified)"  },
  { code: "zh-TW", label: "🇹🇼 中文 (繁體)",          targetLanguage: "Chinese (Traditional)" },
  { code: "ko-KR", label: "🇰🇷 한국어",              targetLanguage: "Korean"      },
  // Güneydoğu Asya
  { code: "id-ID", label: "🇮🇩 Bahasa Indonesia",   targetLanguage: "Indonesian"  },
  { code: "ms-MY", label: "🇲🇾 Bahasa Melayu",      targetLanguage: "Malay"       },
  { code: "th-TH", label: "🇹🇭 ภาษาไทย",            targetLanguage: "Thai"        },
  { code: "vi-VN", label: "🇻🇳 Tiếng Việt",         targetLanguage: "Vietnamese"  },
  { code: "fil-PH",label: "🇵🇭 Filipino",           targetLanguage: "Filipino"    },
  { code: "km-KH", label: "🇰🇭 ភាសាខ្មែរ",          targetLanguage: "Khmer"       },
  // Afrika
  { code: "sw-KE", label: "🇰🇪 Kiswahili",          targetLanguage: "Swahili"     },
  { code: "am-ET", label: "🇪🇹 አማርኛ",               targetLanguage: "Amharic"     },
  { code: "yo-NG", label: "🇳🇬 Yorùbá",             targetLanguage: "Yoruba"      },
  { code: "ig-NG", label: "🇳🇬 Igbo",               targetLanguage: "Igbo"        },
  { code: "ha-NG", label: "🇳🇬 Hausa",              targetLanguage: "Hausa"       },
  { code: "zu-ZA", label: "🇿🇦 isiZulu",            targetLanguage: "Zulu"        },
  // Orta Asya & Kafkasya
  { code: "az-AZ", label: "🇦🇿 Azərbaycan",         targetLanguage: "Azerbaijani" },
  { code: "kk-KZ", label: "🇰🇿 Қазақша",            targetLanguage: "Kazakh"      },
  { code: "uz-UZ", label: "🇺🇿 Oʻzbekcha",          targetLanguage: "Uzbek"       },
  { code: "ky-KG", label: "🇰🇬 Кыргызча",           targetLanguage: "Kyrgyz"      },
  { code: "ka-GE", label: "🇬🇪 ქართული",            targetLanguage: "Georgian"    },
  { code: "hy-AM", label: "🇦🇲 Հայերեն",            targetLanguage: "Armenian"    },
  { code: "mn-MN", label: "🇲🇳 Монгол",             targetLanguage: "Mongolian"   },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: safeId(),
    role: "assistant",
    content: "Hello! I am Koshei. Press the microphone button and speak — or type below. I will respond as your personal language teacher.",
  },
];

export default function LiveClient() {
  const [messages, setMessages]       = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput]             = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking]   = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [autoSpeak, setAutoSpeak]     = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);

  const mediaRecRef   = useRef<MediaRecorder | null>(null);
  const chunksRef     = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const rec = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        if (blob.size < 500) return;
        await transcribeAndSend(blob, mimeType);
      };

      rec.start(200);
      mediaRecRef.current = rec;
      setIsRecording(true);
    } catch {
      setError("Mikrofon erişimi reddedildi. Tarayıcı ayarlarından izin ver.");
    }
  }

  function stopRecording() {
    if (mediaRecRef.current?.state !== "inactive") {
      mediaRecRef.current?.stop();
    }
    setIsRecording(false);
  }

  async function transcribeAndSend(blob: Blob, mimeType: string) {
    setIsTranscribing(true);
    try {
      const fd = new FormData();
      fd.append("audio", new File([blob], "audio.webm", { type: mimeType }));
      fd.append("lang", selectedLang.code);

      const res  = await fetch("/api/stt", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || data.error) throw new Error(data.error || "STT failed");

      const transcript = data.transcript?.trim();
      if (!transcript) {
        setError("Ses anlaşılamadı, tekrar dene.");
        return;
      }

      await sendMessage(transcript);
    } catch (e: any) {
      setError(e?.message || "Ses anlaşılamadı.");
    } finally {
      setIsTranscribing(false);
    }
  }

  function speakText(text: string) {
    if (!autoSpeak || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang.code;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  async function sendMessage(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText) return;

    setError(null);
    setIsThinking(true);

    const userMsg: Message = { id: safeId(), role: "user", content: userText };
    const nextMessages = [...messages, userMsg];

    setMessages(nextMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          targetLanguage: selectedLang.targetLanguage,
          userNativeLanguage: "Turkish",
          level: "A2-B1",
          mode: "conversation",
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "AI cevap alınamadı.");

      const reply = String(data.reply || "").trim();
      if (!reply) throw new Error("Boş cevap döndü.");

      const assistantMsg: Message = { id: safeId(), role: "assistant", content: reply };
      setMessages(prev => [...prev, assistantMsg]);
      speakText(reply);
    } catch (e: any) {
      setError(e?.message || "Bilinmeyen hata.");
    } finally {
      setIsThinking(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage();
  }

  function clearConversation() {
    window.speechSynthesis?.cancel?.();
    setMessages(INITIAL_MESSAGES);
    setError(null);
    setInput("");
  }

  const status = isRecording
    ? "Dinliyorum..."
    : isTranscribing
    ? "Ses analiz ediliyor..."
    : isThinking
    ? "Koshei düşünüyor..."
    : "Hazır";

  const canRecord = !isRecording && !isThinking && !isTranscribing;

  return (
    <div className="grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]">

      {/* SOL PANEL */}
      <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Koshei</h1>
          <p className="mt-1 text-sm text-slate-400">AI Dil Öğretmeni</p>
        </div>

        {/* Dil seçimi */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Dil</label>
          <select
            value={selectedLang.code}
            onChange={(e) => {
              const lang = LANGUAGES.find(l => l.code === e.target.value) || LANGUAGES[0];
              setSelectedLang(lang);
            }}
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* Auto speak */}
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 cursor-pointer">
          <input
            type="checkbox"
            checked={autoSpeak}
            onChange={(e) => setAutoSpeak(e.target.checked)}
            className="accent-blue-500"
          />
          <span className="text-sm">AI cevabını sesli oku</span>
        </label>

        {/* Durum */}
        <div className={`rounded-2xl border px-4 py-3 text-sm ${
          isRecording
            ? "border-red-400/30 bg-red-400/10 text-red-200"
            : isTranscribing || isThinking
            ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
            : "border-blue-400/20 bg-blue-400/10 text-blue-100"
        }`}>
          <p className="font-medium mb-1">Durum</p>
          <p>{status}</p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">
            {error}
          </div>
        )}

        <button
          onClick={clearConversation}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10"
          type="button"
        >
          Konuşmayı Sıfırla
        </button>
      </aside>

      {/* SAĞ: CHAT */}
      <section className="flex min-h-[75vh] flex-col rounded-3xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold">Conversation</h2>
          <p className="text-sm text-slate-400">Speak or type. Koshei will respond as your teacher.</p>
        </div>

        {/* Mesajlar */}
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 md:px-5">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 md:max-w-[75%] ${
                  isUser
                    ? "bg-blue-500 text-white"
                    : "border border-white/10 bg-slate-900/60 text-slate-100"
                }`}>
                  <div className="mb-1 text-[11px] uppercase tracking-wider opacity-60">
                    {isUser ? "Sen" : "Koshei"}
                  </div>
                  <div>{msg.content}</div>
                </div>
              </div>
            );
          })}

          {(isThinking || isTranscribing) && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-400">
                {isTranscribing ? "Ses analiz ediliyor..." : "Koshei düşünüyor..."}
                <span className="ml-1 animate-pulse">▊</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Alt kontroller */}
        <div className="border-t border-white/10 p-4 md:p-5">
          <div className="flex flex-col gap-3">
            {/* Mikrofon butonları */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={startRecording}
                disabled={!canRecord}
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-400"
                    : "bg-emerald-500 hover:bg-emerald-400"
                }`}
              >
                {isRecording ? "🔴 Dinliyorum..." : "🎙 Mikrofon"}
              </button>

              {isRecording && (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Gönder
                </button>
              )}
            </div>

            {/* Yazı ile gönder */}
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Mesaj yaz..."
                className="h-12 flex-1 rounded-2xl border border-white/10 bg-slate-900/70 px-4 text-white outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={isThinking || !input.trim()}
                className="h-12 rounded-2xl bg-blue-500 px-5 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Gönder
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function safeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
