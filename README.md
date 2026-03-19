# Koshe-Al (Koshei AI)

AI-powered language learning platform built with Next.js, Supabase, and Google Generative AI.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend/Auth:** Supabase
- **AI:** Google Generative AI (Gemini)
- **Deployment:** Render

---

## Repository Structure

```
Koshe-Al-/
├── app/                          # Next.js App Router pages & API routes
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   ├── globals.css               # Global styles
│   ├── error.tsx                 # Global error boundary
│   ├── loading.tsx               # Global loading UI
│   ├── not-found.tsx             # 404 page
│   │
│   ├── login/                    # Login page
│   │   └── page.tsx
│   ├── register/                 # Registration page
│   │   └── page.tsx
│   ├── logout/                   # Logout route handler
│   │   └── route.ts
│   ├── onboarding/               # User onboarding flow
│   │   └── page.tsx
│   ├── dashboard/                # User dashboard
│   │   └── page.tsx
│   ├── profile/                  # User profile
│   │   └── page.tsx
│   ├── pricing/                  # Pricing / credit packages
│   │   └── page.tsx
│   ├── feedback/                 # User feedback page
│   │   └── page.tsx
│   │
│   ├── courses/                  # Course browsing
│   │   ├── page.tsx              # All courses list
│   │   └── [language]/           # Language-specific courses
│   │       ├── page.tsx
│   │       └── [level]/          # Level-specific course detail
│   │           ├── page.tsx
│   │           └── CourseActions.tsx
│   │
│   ├── lesson/                   # Lesson experience
│   │   ├── page.tsx
│   │   └── lesson-client.tsx     # Client-side lesson UI
│   │
│   ├── live/                     # Live tutoring session
│   │   └── page.tsx
│   │
│   ├── admin/                    # Admin panel
│   │   ├── layout.tsx            # Admin layout
│   │   ├── page.tsx              # Admin home
│   │   ├── actions.ts            # Server actions for admin
│   │   ├── components/
│   │   │   └── DeleteButton.tsx
│   │   ├── overview/             # Platform overview/stats
│   │   │   └── page.tsx
│   │   ├── universities/         # University management (CRUD)
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── faculties/            # Faculty management (CRUD)
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── programs/             # Academic program management (CRUD)
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── courses/              # Course management (CRUD)
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── curriculum/           # Curriculum management
│   │   │   └── page.tsx
│   │   ├── credits/              # Credit management
│   │   │   └── page.tsx
│   │   ├── rewards/              # Reward management
│   │   │   └── page.tsx
│   │   └── students/             # Student management
│   │       └── page.tsx
│   │
│   └── api/                      # API route handlers
│       ├── chat/route.ts         # AI chat endpoint
│       ├── lesson/route.ts        # Lesson generation endpoint
│       ├── stt/route.ts           # Speech-to-text endpoint
│       ├── tts/route.ts           # Text-to-speech endpoint
│       ├── collectibles/route.ts  # Collectible items endpoint
│       ├── credits/route.ts       # User credits endpoint
│       ├── courses/
│       │   ├── enroll/route.ts    # Course enrollment endpoint
│       │   └── complete-unit/route.ts  # Unit completion endpoint
│       └── admin/
│           └── credits/route.ts   # Admin credit management endpoint
│
├── components/                   # Reusable React components
│   ├── board/                    # Lesson board components
│   │   ├── BoardShell.tsx        # Board container/wrapper
│   │   ├── MainBoard.tsx         # Main lesson board
│   │   ├── AnswerBoard.tsx       # Answer input board
│   │   ├── CorrectionBoard.tsx   # Correction/feedback board
│   │   ├── GrammarBoard.tsx      # Grammar explanation board
│   │   ├── VocabBoard.tsx        # Vocabulary board
│   │   └── NextActionBoard.tsx   # Next action prompt board
│   ├── credits/                  # Credit UI components
│   │   ├── CreditDisplay.tsx     # Credit balance display
│   │   ├── CreditBalanceCard.tsx # Credit balance card
│   │   ├── CreditPackages.tsx    # Credit package selection
│   │   └── CreditWarning.tsx     # Low-credit warning
│   ├── landing/                  # Landing page components
│   │   ├── HeroTyping.tsx        # Animated typing hero text
│   │   └── SpeakingWave.tsx      # Audio wave animation
│   ├── live/                     # Live session components
│   │   ├── LiveClient.tsx        # Live session client UI
│   │   └── MentorCard.tsx        # Mentor/tutor card
│   ├── shared/                   # Shared layout components
│   │   └── Navbar.tsx            # Navigation bar
│   └── ui/                       # Generic UI primitives
│       └── Surface.tsx           # Card/surface container
│
├── lib/                          # Business logic & utilities
│   ├── ai/                       # AI engine modules
│   │   ├── lesson-engine.ts      # Lesson content generation
│   │   ├── memory-engine.ts      # Learner memory/progress tracking
│   │   ├── parse-json.ts         # AI response JSON parser
│   │   ├── score-engine.ts       # Answer scoring logic
│   │   ├── teacher-engine.ts     # Teacher persona logic
│   │   ├── tutor.ts              # Tutor orchestration
│   │   └── types.ts              # AI-related TypeScript types
│   ├── constants/
│   │   └── languages.ts          # Supported language definitions
│   ├── credits/                  # Credit system logic
│   │   ├── credit-service.ts     # Credit service (earn/spend)
│   │   ├── credit-helpers.ts     # Credit utility functions
│   │   └── mock-credits.ts       # Mock data for development
│   ├── data/                     # Static/seed data
│   │   ├── academic-catalog.ts   # Academic catalog data
│   │   ├── credit-packages.ts    # Available credit packages
│   │   ├── credit-rules.ts       # Credit earning/spending rules
│   │   ├── curriculum.ts         # Course curriculum data
│   │   ├── mentors.ts            # Mentor/tutor profiles
│   │   └── university-templates.ts  # University template data
│   ├── lesson/
│   │   └── alphabet.ts           # Alphabet/character lesson data
│   ├── live/
│   │   └── speech.ts             # Speech processing utilities
│   ├── supabase/                 # Supabase client configuration
│   │   ├── client.ts             # Browser-side Supabase client
│   │   └── server.ts             # Server-side Supabase client
│   └── utils/                    # General utility functions
│       ├── api-error.ts          # API error handling
│       ├── form-helpers.ts       # Form utility functions
│       └── supabase-client-guard.ts  # Supabase client safety guard
│
├── types/                        # Global TypeScript type definitions
│   ├── academic.ts               # Academic entity types
│   ├── credit.ts                 # Credit system types
│   └── university.ts             # University entity types
│
├── public/                       # Static assets
│   ├── badges/                   # Achievement badge SVGs
│   │   ├── beginner.svg
│   │   ├── mid.svg
│   │   ├── advanced.svg
│   │   └── master.svg
│   ├── certs/                    # Certificate SVGs
│   │   ├── certificate-middle.svg
│   │   ├── certificate-advanced.svg
│   │   └── certificate-master.svg
│   └── rewards/                  # Reward asset SVGs
│       └── reward-placeholder.svg
│
├── middleware.ts                 # Next.js middleware (auth guard)
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.mjs            # PostCSS configuration
├── tsconfig.json                 # TypeScript configuration
├── env.example                   # Environment variable template
├── render.yaml                   # Render deployment configuration
└── package.json                  # Project dependencies & scripts
```

## Getting Started

1. Copy the environment template and fill in your credentials:

   ```bash
   cp env.example .env.local
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start development server     |
| `npm run build` | Build for production         |
| `npm run start` | Start production server      |
| `npm run lint`  | Run ESLint                   |
