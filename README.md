# Koshei AI — AI-Powered Language Learning Platform

> An intelligent language tutor powered by Google Gemini AI. Teaches 12 languages from complete beginner (A1) to native-level fluency (D2) using a unique 8-level education model.

🌐 **Live Demo:** https://koshe-al.onrender.com

---

## 🎯 What is Koshei?

Koshei is an AI language teacher that adapts to the student's level — not just A1-C2 like standard CEFR, but an extended **A1 → D2** model that mirrors real educational progression from elementary school to university.

- **A1** = First grade (alphabet & sounds)
- **A2** = Elementary (basic vocabulary)
- **B1** = Middle school (short sentences)
- **B2** = Conversational practice
- **C1** = Advanced fluency
- **C2** = Near-native
- **D1** = Academic / spontaneous speech
- **D2** = Full native-level fluency

Each language has its **own curriculum** — learning Chinese starts with Pinyin + 4 tones, Japanese starts with Hiragana, Arabic with its 28-letter right-to-left script.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + TypeScript + Tailwind CSS |
| AI Brain | Google Gemini 2.5 Flash |
| Speech-to-Text | Gemini Audio API (MediaRecorder → Gemini) |
| Text-to-Speech | Gemini TTS (`gemini-2.5-flash-preview-tts`) |
| Backend | Next.js API Routes (Node.js) |
| Database | Supabase (PostgreSQL) |
| Hosting | Render.com |

---

## 🌍 Supported Languages

🇬🇧 English · 🇩🇪 German · 🇫🇷 French · 🇪🇸 Spanish · 🇮🇹 Italian · 🇧🇷 Portuguese · 🇳🇱 Dutch · 🇷🇺 Russian · 🇸🇦 Arabic · 🇯🇵 Japanese · 🇨🇳 Chinese · 🇰🇷 Korean

---

## ✅ Current Features

- [x] Live voice conversation with AI teacher
- [x] Gemini STT — speech recognition via MediaRecorder API
- [x] Gemini TTS — natural voice responses
- [x] 8-level education model (A1 → D2)
- [x] Language-specific curriculum (different start for Arabic, Japanese, Chinese)
- [x] Auto STT language switching (Turkish mic for A1-B1, target language for B2+)
- [x] Score tracking system
- [x] Avatar with CSS animations
- [x] Supabase integration (auth ready)

---

## 🚧 Help Wanted

We are looking for contributors to help with the following:

### 1. 🎭 Talking Avatar / Lip Sync
**This is our biggest need right now.**

We have a high-quality AI-generated avatar image (`public/koshei-avatar.png`). We need real-time lip sync animation that plays while the TTS audio is playing.

**What we tried:**
- Three.js + VRM (too heavy, module resolution issues on Vercel/Render)
- Canvas-based mouth animation (basic, not convincing)
- CSS-only pulse effects (current state)

**What we want:**
- Realistic lip movement synced to audio
- Works in browser without heavy dependencies
- Options we're considering: [Rhubarb Lip Sync](https://github.com/DanielSWolf/rhubarb-lip-sync), [SadTalker](https://github.com/OpenTalker/SadTalker), [wav2lip](https://github.com/Rudrabha/Wav2Lip), or a custom WebGL solution
- Must work with a static PNG input image

If you have experience with any of these or a better approach, **please open an issue or PR!**

---

### 2. 📱 Mobile Microphone Issues
MediaRecorder works on Chrome desktop but is unreliable on mobile Safari and some Android browsers.

**Help needed with:**
- Reliable cross-browser audio capture
- Fallback to Web Speech API when MediaRecorder is not supported
- Testing on iOS Safari

---

### 3. 💳 Stripe Payment Integration
Per-language subscription model:
- Each language is a separate subscription
- 4 duration tiers: 1 month / 3 months / 6 months / 12 months
- Price varies by language difficulty (e.g. Chinese/Japanese = higher tier)

Need help with:
- Stripe Checkout integration
- Supabase subscription table schema
- Webhook handling for subscription events

---

### 4. 🎙 STT Accuracy Improvements
Current STT sends full audio blob to Gemini. Works but has ~2-3 second delay.

Ideas welcome:
- Chunked streaming STT
- Whisper.cpp integration
- Real-time partial transcripts

---

## 🚀 Getting Started

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

## 📁 Project Structure

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
│       └── prompts.ts     # Education model & prompts
└── public/
    └── koshei-avatar.png  # Avatar image
```

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/lip-sync`)
3. Commit your changes
4. Push and open a Pull Request

For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT License — feel free to use, modify and distribute.

---

## 💬 Contact

Open an issue on GitHub or reach out via the repository discussions.

**Built with ❤️ using Next.js + Google Gemini AI**
