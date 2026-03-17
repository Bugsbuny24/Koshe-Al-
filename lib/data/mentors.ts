// ─── Mentor Identity System ───────────────────────────────────────────────────
//
// Defines the AI mentor personas used across Live, Dashboard, Lesson, and
// Course pages. Each mentor has a specialization, visual identity, and
// state-driven UI behaviour.

export type MentorState = "idle" | "listening" | "thinking" | "speaking";

export type Mentor = {
  id: string;
  name: string;
  title: string;
  specialization: string;
  avatarInitials: string;
  /** Tailwind gradient classes for the avatar circle */
  gradientFrom: string;
  gradientTo: string;
  /** Optional public image path under /public/mentors/ */
  avatarImageUrl?: string;
  /** Language codes (from curriculum DEPARTMENTS) this mentor is assigned to */
  languageCodes?: string[];
};

export const MENTORS: Mentor[] = [
  {
    id: "elena",
    name: "Elena",
    title: "English Speaking Mentor",
    specialization: "Akıcılık, Konuşma & Telaffuz",
    avatarInitials: "EL",
    gradientFrom: "from-cyan-400",
    gradientTo: "to-blue-500",
    languageCodes: ["en", "fr", "de"],
  },
  {
    id: "atlas",
    name: "Atlas",
    title: "AI & Technology Mentor",
    specialization: "Teknik İngilizce, AI Kavramları & İnovasyon",
    avatarInitials: "AT",
    gradientFrom: "from-violet-400",
    gradientTo: "to-fuchsia-500",
  },
  {
    id: "mira",
    name: "Mira",
    title: "Communication Mentor",
    specialization: "İş İngilizcesi, Sunum & Liderlik",
    avatarInitials: "MI",
    gradientFrom: "from-amber-400",
    gradientTo: "to-orange-500",
    languageCodes: ["es", "it", "pt", "ar", "ru", "ja", "zh", "ko", "hi"],
  },
];

/** Return the most appropriate mentor for a given language code. */
export function getMentorForLanguage(langCode: string): Mentor {
  const mentor = MENTORS.find((m) => m.languageCodes?.includes(langCode));
  return mentor ?? MENTORS[0]; // default: Elena
}

export function getMentorById(id: string): Mentor | undefined {
  return MENTORS.find((m) => m.id === id);
}

/** Human-readable label for each mentor state */
export const MENTOR_STATE_LABELS: Record<MentorState, string> = {
  idle: "Hazır",
  listening: "Dinliyor",
  thinking: "Düşünüyor",
  speaking: "Konuşuyor",
};

/** Tailwind ring color for each mentor state */
export const MENTOR_STATE_RING: Record<MentorState, string> = {
  idle: "ring-white/20",
  listening: "ring-cyan-400/70",
  thinking: "ring-fuchsia-400/70",
  speaking: "ring-emerald-400/70",
};

/** Dot indicator color class for each state */
export const MENTOR_STATE_DOT: Record<MentorState, string> = {
  idle: "bg-slate-500",
  listening: "bg-cyan-400",
  thinking: "bg-fuchsia-400",
  speaking: "bg-emerald-400",
};

/** Text colour class for state label */
export const MENTOR_STATE_TEXT: Record<MentorState, string> = {
  idle: "text-slate-500",
  listening: "text-cyan-300",
  thinking: "text-fuchsia-300",
  speaking: "text-emerald-300",
};
