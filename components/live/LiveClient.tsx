"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Role = "user" | "assistant";
type Message = { id: string; role: Role; content: string; };

const LANGUAGES = [
  { code: "en-US",  label: "🇺🇸 English (US)",    targetLanguage: "English"     },
  { code: "en-GB",  label: "🇬🇧 English (UK)",    targetLanguage: "English"     },
  { code: "de-DE",  label: "🇩🇪 Deutsch",         targetLanguage: "German"      },
  { code: "nl-NL",  label: "🇳🇱 Nederlands",      targetLanguage: "Dutch"       },
  { code: "sv-SE",  label: "🇸🇪 Svenska",         targetLanguage: "Swedish"     },
  { code: "no-NO",  label: "🇳🇴 Norsk",           targetLanguage: "Norwegian"   },
  { code: "da-DK",  label: "🇩🇰 Dansk",           targetLanguage: "Danish"      },
  { code: "fr-FR",  label: "🇫🇷 Français",        targetLanguage: "French"      },
  { code: "es-ES",  label: "🇪🇸 Español",         targetLanguage: "Spanish"     },
  { code: "pt-PT",  label: "🇵🇹 Português (PT)",  targetLanguage: "Portuguese"  },
  { code: "pt-BR",  label: "🇧🇷 Português (BR)",  targetLanguage: "Portuguese"  },
  { code: "it-IT",  label: "🇮🇹 Italiano",        targetLanguage: "Italian"     },
  { code: "ro-RO",  label: "🇷🇴 Română",          targetLanguage: "Romanian"    },
  { code: "ru-RU",  label: "🇷🇺 Русский",         targetLanguage: "Russian"     },
  { code: "pl-PL",  label: "🇵🇱 Polski",          targetLanguage: "Polish"      },
  { code: "cs-CZ",  label: "🇨🇿 Čeština",         targetLanguage: "Czech"       },
  { code: "sk-SK",  label: "🇸🇰 Slovenčina",      targetLanguage: "Slovak"      },
  { code: "uk-UA",  label: "🇺🇦 Українська",      targetLanguage: "Ukrainian"   },
  { code: "bg-BG",  label: "🇧🇬 Български",       targetLanguage: "Bulgarian"   },
  { code: "hr-HR",  label: "🇭🇷 Hrvatski",        targetLanguage: "Croatian"    },
  { code: "sr-RS",  label: "🇷🇸 Српски",          targetLanguage: "Serbian"     },
  { code: "el-GR",  label: "🇬🇷 Ελληνικά",        targetLanguage: "Greek"       },
  { code: "hu-HU",  label: "🇭🇺 Magyar",          targetLanguage: "Hungarian"   },
  { code: "fi-FI",  label: "🇫🇮 Suomi",           targetLanguage: "Finnish"     },
  { code: "et-EE",  label: "🇪🇪 Eesti",           targetLanguage: "Estonian"    },
  { code: "lv-LV",  label: "🇱🇻 Latviešu",        targetLanguage: "Latvian"     },
  { code: "lt-LT",  label: "🇱🇹 Lietuvių",        targetLanguage: "Lithuanian"  },
  { code: "ar-SA",  label: "🇸🇦 العربية",         targetLanguage: "Arabic"      },
  { code: "he-IL",  label: "🇮🇱 עברית",           targetLanguage: "Hebrew"      },
  { code: "fa-IR",  label: "🇮🇷 فارسی",           targetLanguage: "Persian"     },
  { code: "tr-TR",  label: "🇹🇷 Türkçe",          targetLanguage: "Turkish"     },
  { code: "hi-IN",  label: "🇮🇳 हिन्दी",          targetLanguage: "Hindi"       },
  { code: "bn-BD",  label: "🇧🇩 বাংলা",           targetLanguage: "Bengali"     },
  { code: "ur-PK",  label: "🇵🇰 اردو",            targetLanguage: "Urdu"        },
  { code: "ta-IN",  label: "🇮🇳 தமிழ்",           targetLanguage: "Tamil"       },
  { code: "te-IN",  label: "🇮🇳 తెలుగు",          targetLanguage: "Telugu"      },
  { code: "mr-IN",  label: "🇮🇳 मराठी",           targetLanguage: "Marathi"     },
  { code: "gu-IN",  label: "🇮🇳 ગુજરાતી",         targetLanguage: "Gujarati"    },
  { code: "pa-IN",  label: "🇮🇳 ਪੰਜਾਬੀ",          targetLanguage: "Punjabi"     },
  { code: "ne-NP",  label: "🇳🇵 नेपाली",          targetLanguage: "Nepali"      },
  { code: "si-LK",  label: "🇱🇰 සිංහල",           targetLanguage: "Sinhala"     },
  { code: "ja-JP",  label: "🇯🇵 日本語",           targetLanguage: "Japanese"    },
  { code: "zh-CN",  label: "🇨🇳 中文 (简体)",       targetLanguage: "Chinese (Simplified)"  },
  { code: "zh-TW",  label: "🇹🇼 中文 (繁體)",       targetLanguage: "Chinese (Traditional)" },
  { code: "ko-KR",  label: "🇰🇷 한국어",           targetLanguage: "Korean"      },
  { code: "id-ID",  label: "🇮🇩 Bahasa Indonesia", targetLanguage: "Indonesian" },
  { code: "ms-MY",  label: "🇲🇾 Bahasa Melayu",   targetLanguage: "Malay"       },
  { code: "th-TH",  label: "🇹🇭 ภาษาไทย",         targetLanguage: "Thai"        },
  { code: "vi-VN",  label: "🇻🇳 Tiếng Việt",      targetLanguage: "Vietnamese"  },
  { code: "fil-PH", label: "🇵🇭 Filipino",        targetLanguage: "Filipino"    },
  { code: "km-KH",  label: "🇰🇭 ភាសាខ្មែរ",        targetLanguage: "Khmer"       },
  { code: "sw-KE",  label: "🇰🇪 Kiswahili",       targetLanguage: "Swahili"     },
  { code: "am-ET",  label: "🇪🇹 አማርኛ",            targetLanguage: "Amharic"     },
  { code: "yo-NG",  label: "🇳🇬 Yorùbá",          targetLanguage: "Yoruba"      },
  { code: "ha-NG",  label: "🇳🇬 Hausa",           targetLanguage: "Hausa"       },
  { code: "zu-ZA",  label: "🇿🇦 isiZulu",         targetLanguage: "Zulu"        },
  { code: "af-ZA",  label: "🇿🇦 Afrikaans",       targetLanguage: "Afrikaans"   },
  { code: "az-AZ",  label: "🇦🇿 Azərbaycan",      targetLanguage: "Azerbaijani" },
  { code: "kk-KZ",  label: "🇰🇿 Қазақша",         targetLanguage: "Kazakh"      },
  { code: "uz-UZ",  label: "🇺🇿 Oʻzbekcha",       targetLanguage: "Uzbek"       },
  { code: "ka-GE",  label: "🇬🇪 ქართული",         targetLanguage: "Georgian"    },
  { code: "hy-AM",  label: "🇦🇲 Հայերեն",         targetLanguage: "Armenian"    },
  { code: "mn-MN",  label: "🇲🇳 Монгол",          targetLanguage: "Mongolian"   },
];

const INITIAL_MESSAGES: Message[] = [{
  id: safeId(),
  role: "assistant",
  content: "Merhaba! Ben Koshei, AI dil öğretmenidir. Mikrofona bas ve konuş — ya da aşağıya yaz. Seni dinliyorum.",
}];

export default function LiveClient() {
  const [messages, setMessages]         = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput]               = useState("");
  const [isRecording, setIsRecording]   = useState(false);
  const [isThinking, setIsThinking]     = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [autoSpeak, setAutoSpeak]       = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const mediaRecRef    = useRef<MediaRecorder | null>(null);
  const chunksRef      = useRef<Blob[]>([]);
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
      setError("Mikrofon erişimi reddedildi.");
    }
  }

  function stopRecording() {
    if (mediaRecRef.current?.state !== "inactive") mediaRecRef.current?.stop();
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
      const t = data.transcript?.trim();
      if (!t) { setError("Ses anlaşılamadı, tekrar dene."); return; }
      await sendMessage(t);
    } catch (e: any) {
      setError(e?.message || "Ses anlaşılamadı.");
    } finally {
      setIsTranscribing(false);
    }
  }

  function speakText(text: string) {
    if (!autoSpeak || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = selectedLang.code;
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  }

  async function sendMessage(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText) return;
    setError(null);
    setIsThinking(true);
    const userMsg: Message = { id: safeId(), role: "user", content: userText };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          targetLanguage: selectedLang.targetLanguage,
          userNativeLanguage: "Turkish",
          level: "A2-B1",
          mode: "conversation",
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Hata");
      const reply = String(data.reply || "").trim();
      if (!reply) throw new Error("Boş cevap.");
      const msg: Message = { id: safeId(), role: "assistant", content: reply };
      setMessages(prev => [...prev, msg]);
      speakText(reply);
    } catch (e: any) {
      setError(e?.message || "Bilinmeyen hata.");
    } finally {
      setIsThinking(false);
    }
  }

  const canRecord = !isRecording && !isThinking && !isTranscribing;
  const status = isRecording ? "Dinliyorum..." : isTranscribing ? "Analiz ediliyor..." : isThinking ? "Koshei düşünüyor..." : "Hazır";

  return (
    <div className="flex flex-col h-[100dvh] md:grid md:grid-cols-[260px_1fr]">

      {/* Mobil üst bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5 md:hidden">
        <span className="font-bold text-lg">Koshei</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm"
          >
            {selectedLang.label.split(" ")[0]}
          </button>
          <label className="flex items-center gap-1 text-xs text-slate-400">
            <input type="checkbox" checked={autoSpeak} onChange={e => setAutoSpeak(e.target.checked)} className="accent-blue-500" />
            Ses
          </label>
        </div>
      </div>

      {/* Mobil dil menüsü */}
      {showLangMenu && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col md:hidden" onClick={() => setShowLangMenu(false)}>
          <div className="mt-auto bg-slate-900 rounded-t-3xl p-4 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="text-sm font-semibold mb-3 text-slate-300">Dil Seç</div>
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => { setSelectedLang(l); setShowLangMenu(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm rounded-xl mb-1 transition ${
                  selectedLang.code === l.code ? "bg-blue-500 text-white" : "hover:bg-white/10 text-slate-200"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop sol panel */}
      <aside className="hidden md:flex flex-col gap-4 border-r border-white/10 bg-white/5 p-5 overflow-y-auto">
        <div>
          <h1 className="text-xl font-bold">Koshei</h1>
          <p className="text-xs text-slate-400 mt-1">AI Dil Öğretmeni</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Dil</label>
          <select
            value={selectedLang.code}
            onChange={e => setSelectedLang(LANGUAGES.find(l => l.code === e.target.value) || LANGUAGES[0])}
            className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white outline-none"
          >
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={autoSpeak} onChange={e => setAutoSpeak(e.target.checked)} className="accent-blue-500" />
          <span className="text-slate-300">Sesi sesli oku</span>
        </label>
        <div className={`rounded-xl border px-3 py-2 text-xs ${
          isRecording ? "border-red-400/30 bg-red-400/10 text-red-200"
          : isTranscribing || isThinking ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
          : "border-blue-400/20 bg-blue-400/10 text-blue-200"
        }`}>
          {status}
        </div>
        {error && <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-xs text-red-200">{error}</div>}
        <button onClick={() => { window.speechSynthesis?.cancel?.(); setMessages(INITIAL_MESSAGES); setError(null); setInput(""); }}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition">
          Sıfırla
        </button>
      </aside>

      {/* Chat alanı */}
      <section className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map(msg => {
            const isUser = msg.role === "user";
            return (
              <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  isUser ? "bg-blue-500 text-white" : "border border-white/10 bg-slate-900/60 text-slate-100"
                }`}>
                  <div className="text-[10px] uppercase tracking-wider opacity-50 mb-1">{isUser ? "Sen" : "Koshei"}</div>
                  {msg.content}
                </div>
              </div>
            );
          })}
          {(isThinking || isTranscribing) && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-400">
                {isTranscribing ? "Ses analiz ediliyor" : "Koshei yazıyor"}<span className="animate-pulse ml-1">▊</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Kontroller */}
        <div className="border-t border-white/10 p-3 md:p-4 space-y-2">
          {error && <div className="text-xs text-red-300 px-1">{error}</div>}
          <div className="flex gap-2">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!canRecord && !isRecording}
              className={`flex-1 rounded-2xl py-3 text-sm font-semibold text-white transition disabled:opacity-50 ${
                isRecording ? "bg-red-500 hover:bg-red-400" : "bg-emerald-500 hover:bg-emerald-400"
              }`}
            >
              {isRecording ? "⏹ Gönder" : "🎙 Konuş"}
            </button>
          </div>
          <form onSubmit={e => { e.preventDefault(); void sendMessage(); }} className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Mesaj yaz..."
              className="flex-1 h-11 rounded-2xl border border-white/10 bg-slate-900/70 px-4 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={isThinking || !input.trim()}
              className="h-11 rounded-2xl bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
            >
              Gönder
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function safeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

