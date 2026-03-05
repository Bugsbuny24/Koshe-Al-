# Koshei AI
### The First AI-Native Digital Language University
> Reimagining global language education through structured artificial intelligence.

🌐 **Live Demo:** https://koshe-al.onrender.com

---

## Vision

Koshei AI is not a chatbot.

It is the foundation of a fully AI-native digital university.

We are building the world's first structured, AI-powered, multi-language academic system that mirrors the complete educational journey — from primary literacy to university-level linguistic mastery.

**From A1 to D2.**
**From phonetics to academic discourse.**
**From beginner to indistinguishable native-level competence.**

Koshei is education infrastructure — not a learning app.

---

## The Structural Problem

Global language learning platforms today:

- Optimize for vocabulary repetition
- Follow static CEFR A1–C2 categorization
- Separate conversation from structured curriculum
- Lack academic progression modeling
- Do not adapt instruction intensity in real time
- Treat AI as a chatbot layer — not as curriculum architecture

**There is no AI-native university model for language education.**
**Until now.**

---

## The Koshei Academic Framework (A1 → D2)

Koshei extends beyond CEFR by introducing an **8-tier progression system** inspired by real-world academic institutions.

| Level | Academic Equivalent | Competency |
|-------|-------------------|------------|
| A1 | Primary Year 1 | Alphabet & phonetics mastery |
| A2 | Elementary | Core vocabulary formation |
| B1 | Middle School | Structured sentence construction |
| B2 | Pre-High School | Conversational fluency |
| C1 | High School | Advanced natural speech |
| C2 | Graduate | Near-native control |
| D1 | Undergraduate | Academic discourse |
| D2 | Native-equivalent | Cultural & spontaneous fluency |

Each level is: **Measurable · Score-driven · Structured · Curriculum-bound · Behavior-adaptive**

Koshei behaves differently at every level.

---

## Language-Specific Curriculum Intelligence

Koshei does not teach languages uniformly. Each language has a distinct structural entry point:

- 🇨🇳 **Chinese** → Pinyin + tonal foundation before characters
- 🇯🇵 **Japanese** → Hiragana before Katakana before Kanji
- 🇸🇦 **Arabic** → Script forms + right-to-left orientation (4 letter forms)
- 🇷🇺 **Russian** → Cyrillic phonetic grounding (33 letters)
- 🇩🇪 **German** → Articles & case structure early-stage emphasis

The AI dynamically adjusts:
- Error correction intensity
- Native vs target language ratio
- Speaking tempo & cognitive load
- Repetition frequency
- Academic pressure level

**This is adaptive pedagogy — not scripted tutoring.**

---

## Real-Time AI Teaching Engine

Koshei operates on a layered AI architecture:

- Structured system prompt engine
- Curriculum intelligence layer
- Level-based behavioral constraints
- Dynamic language ratio control (100% Turkish at A1 → 100% target language at D2)
- Scoring & progression tracking
- Context-aware conversation memory
- Academic correction framework

Conversation is guided. Progression is measurable. Instruction is structured.

**This is guided adaptive education — not free-form AI chat.**

---

## Core Technology Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + TypeScript + Tailwind CSS |
| AI Core | Google Gemini 2.5 Flash |
| Speech Recognition | Gemini Audio API (MediaRecorder → Gemini) |
| Voice Synthesis | Gemini TTS (`gemini-2.5-flash-preview-tts`) |
| Backend | Node.js API Routes |
| Database | Supabase (PostgreSQL) |
| Infrastructure | Render (scalable deployment) |

Designed for modular scaling and future microservice extraction.

---

## Supported Languages

🇬🇧 English · 🇩🇪 German · 🇫🇷 French · 🇪🇸 Spanish · 🇮🇹 Italian · 🇧🇷 Portuguese · 🇳🇱 Dutch · 🇷🇺 Russian · 🇸🇦 Arabic · 🇯🇵 Japanese · 🇨🇳 Chinese · 🇰🇷 Korean

---

## Current Capabilities

- [x] Real-time voice conversation with AI teacher
- [x] Level-adaptive AI instruction (A1 → D2)
- [x] Per-language curriculum differentiation
- [x] Automated STT language switching (Turkish mic for A1-B1, target language for B2+)
- [x] Score-based progression system
- [x] Modular AI prompt engine
- [x] University-style academic structure
- [x] Scalable SaaS-ready architecture
- [x] Gemini STT — speech recognition via MediaRecorder API
- [x] Gemini TTS — natural voice responses

---

## Market Positioning

Koshei AI sits at the intersection of:
- AI-native education systems
- Structured language acquisition
- Adaptive tutoring infrastructure
- Digital university modeling

**Koshei is not Duolingo.**
**Koshei is not ChatGPT tutoring.**
**Koshei is academic AI infrastructure.**

---

## Roadmap

| Phase | Status |
|-------|--------|
| Phase 1 — Core AI Teaching Engine | ✅ Completed |
| Phase 2 — Per-Language Monetization Model | 🔄 In Progress |
| Phase 3 — Institutional Dashboard & Analytics | 📋 Planned |
| Phase 4 — Enterprise Licensing (Schools & Universities) | 📋 Planned |
| Phase 5 — Fully AI-powered Digital Campus | 📋 Planned |

---

## 🚧 Help Wanted

We are looking for contributors in the following areas:

### 1. 🎭 Talking Avatar / Lip Sync
**Our biggest need right now.**

We have a high-quality AI-generated avatar image (`public/koshei-avatar.png`). We need real-time lip sync animation synced to TTS audio playback.

**What we tried:**
- Three.js + VRM (too heavy, module resolution issues)
- Canvas-based mouth animation (basic, not convincing)
- CSS-only pulse effects (current state)

**What we want:**
- Realistic lip movement synced to audio
- Works in browser without heavy dependencies
- Possible approaches: [Rhubarb Lip Sync](https://github.com/DanielSWolf/rhubarb-lip-sync), [SadTalker](https://github.com/OpenTalker/SadTalker), [wav2lip](https://github.com/Rudrabha/Wav2Lip), or a custom WebGL solution
- Must work with a static PNG input image

### 2. 📱 Mobile Microphone
MediaRecorder works on Chrome desktop but is unreliable on mobile Safari / some Android browsers. Help needed with cross-browser audio capture and fallback strategies.

### 3. 💳 Stripe Integration
Per-language subscription model. Each language is a separate subscription with 4 duration tiers. Help needed with Stripe Checkout, Supabase schema, and webhook handling.

### 4. 🎙 STT Accuracy
Current STT has ~2-3 second delay. Ideas welcome: chunked streaming, Whisper.cpp, real-time partial transcripts.

---

## Investment Thesis

Global language education exceeds **$60B annually**.

Koshei introduces:
- AI-native curriculum architecture
- Structured academic progression
- Multi-language scalable model
- High-margin SaaS subscription framework
- Modular enterprise licensing potential

Built lean. Designed for global scale. Positioned for institutional adoption.

---

## Getting Started

```bash
git clone https://github.com/Bugsburny24/Koshe-Al-.git
cd Koshe-Al-
npm install
cp .env.example .env.local
# Add your GEMINI_API_KEY and Supabase keys
npm run dev
```

### Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Project Structure

```
├── app/
│   ├── (app)/
│   │   ├── dashboard/     # User dashboard
│   │   ├── live/          # Live conversation page
│   │   └── lesson/        # Structured lessons
│   └── api/
│       ├── chat/          # Gemini chat endpoint
│       ├── tts/           # Text-to-speech endpoint
│       └── stt/           # Speech-to-text endpoint
├── components/
│   ├── avatar/            # KosheiAvatar component
│   └── live/              # LiveClient (main UI)
├── lib/
│   └── ai/
│       ├── gemini.ts      # Gemini API wrapper
│       └── prompts.ts     # Education model & prompts (A1→D2)
└── public/
    └── koshei-avatar.png  # Avatar image
```

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/lip-sync`)
3. Commit your changes
4. Push and open a Pull Request

For major changes, please open an issue first.

---

## Mission

> To build the first AI-driven digital university for language mastery.
>
> Koshei is not an application.
> It is infrastructure for the future of education.

---

## License

MIT License — free to use, modify and distribute.

**Built with ❤️ using Next.js + Google Gemini AI**
