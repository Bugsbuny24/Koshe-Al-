// ─── Academic Catalog ─────────────────────────────────────────────────────────
//
// Maps the existing language curriculum (DEPARTMENTS) to the
// Faculty → Program → Course → Unit academic hierarchy used in the frontend.
//
// This is a pure frontend data layer — no SQL migrations required.
// The "source of truth" for actual student progress remains the Supabase
// course_enrollments / unit_progress tables.

import { DEPARTMENTS } from "./curriculum";
import type { Department } from "@/types/university";

// ─── Core academic types ─────────────────────────────────────────────────────

export type AcademicFaculty = {
  code: string;
  name: string;
  description: string;
  icon: string;
  programs: AcademicProgram[];
};

export type AcademicProgram = {
  slug: string;
  title: string;
  facultyCode: string;
  durationLabel: string;
  difficultyLabel: string;
  shortDescription: string;
  certificateEnabled: boolean;
  rewardTrackEnabled: boolean;
  courses: AcademicCourse[];
};

export type AcademicCourse = {
  id: string; // e.g. "en-a1"
  title: string;
  orderIndex: number;
  summary: string;
  estimatedDuration: string;
  programSlug: string;
  units: AcademicUnit[];
};

export type AcademicUnit = {
  id: string;
  title: string;
  description: string;
  practiceType: "speaking" | "text" | "quiz";
  aiPracticeEnabled: boolean;
  completionCriteria: string;
  orderIndex: number;
};

// ─── Map existing DEPARTMENTS → academic structure ────────────────────────────

function mapDeptToProgram(dept: Department): AcademicProgram {
  return {
    slug: dept.code,
    title: dept.name,
    facultyCode: "LANG",
    durationLabel: "6 seviye · A1 → C2",
    difficultyLabel: "Başlangıçtan Ustalığa",
    shortDescription: dept.description,
    certificateEnabled: true,
    rewardTrackEnabled: true,
    courses: dept.levels.map((lvl, idx) =>
      mapLevelToCourse(dept.code, dept.name, lvl, idx)
    ),
  };
}

function mapLevelToCourse(
  langCode: string,
  langName: string,
  lvl: Department["levels"][number],
  idx: number
): AcademicCourse {
  return {
    id: `${langCode}-${lvl.level.toLowerCase()}`,
    title: `${lvl.title} ${langName} (${lvl.level})`,
    orderIndex: idx + 1,
    summary: lvl.description,
    estimatedDuration: `${lvl.units.length} ünite`,
    programSlug: langCode,
    units: lvl.units.map((u, ui) => ({
      id: u.id,
      title: u.title,
      description: u.description,
      practiceType: "speaking" as const,
      aiPracticeEnabled: true,
      completionCriteria: "Tüm konuları tamamla ve AI speaking pratiği yap",
      orderIndex: ui + 1,
    })),
  };
}

// ─── Faculty of Languages (maps existing curriculum) ─────────────────────────

export const LANGUAGE_FACULTY: AcademicFaculty = {
  code: "LANG",
  name: "Faculty of Languages",
  description:
    "AI destekli dil programları. Başlangıçtan ustalığa, gerçek zamanlı mentor koçluğuyla akıcı konuş.",
  icon: "🗣️",
  programs: DEPARTMENTS.map(mapDeptToProgram),
};

// ─── Faculty of AI & Technology ───────────────────────────────────────────────

export const TECH_FACULTY: AcademicFaculty = {
  code: "TECH",
  name: "Faculty of AI & Technology",
  description:
    "AI geliştiriciler, içerik üreticileri ve teknoloji profesyonelleri için yeni nesil programlar.",
  icon: "🤖",
  programs: [
    {
      slug: "ai-developer",
      title: "AI Developer",
      facultyCode: "TECH",
      durationLabel: "12 ay",
      difficultyLabel: "Orta Seviye",
      shortDescription: "Sıfırdan AI destekli ürünler geliştir.",
      certificateEnabled: true,
      rewardTrackEnabled: true,
      courses: [],
    },
    {
      slug: "ai-content-creator",
      title: "AI Content Creator",
      facultyCode: "TECH",
      durationLabel: "6 ay",
      difficultyLabel: "Başlangıç",
      shortDescription: "AI araçlarıyla etkili içerik üret.",
      certificateEnabled: true,
      rewardTrackEnabled: true,
      courses: [],
    },
  ],
};

// ─── Faculty of Business & Communication ──────────────────────────────────────

export const BUSINESS_FACULTY: AcademicFaculty = {
  code: "BUS",
  name: "Faculty of Business & Communication",
  description:
    "İş İngilizcesi, ileri iletişim ve liderlik için profesyonel programlar.",
  icon: "💼",
  programs: [
    {
      slug: "business-english-pro",
      title: "Business English Pro",
      facultyCode: "BUS",
      durationLabel: "6 ay",
      difficultyLabel: "Orta Seviye",
      shortDescription: "Global iş dünyası için profesyonel İngilizceyi ustala.",
      certificateEnabled: true,
      rewardTrackEnabled: true,
      courses: [],
    },
    {
      slug: "advanced-communication",
      title: "Advanced Communication",
      facultyCode: "BUS",
      durationLabel: "4 ay",
      difficultyLabel: "İleri Seviye",
      shortDescription: "Liderlik iletişimi ve yönetici etkisi.",
      certificateEnabled: true,
      rewardTrackEnabled: true,
      courses: [],
    },
  ],
};

// ─── Faculty of Creative Arts ──────────────────────────────────────────────────

export const CREATIVE_FACULTY: AcademicFaculty = {
  code: "CREATIVE",
  name: "Faculty of Creative Arts",
  description:
    "Dil sanatları, yaratıcı yazarlık ve kültürel ifade programları.",
  icon: "🎨",
  programs: [
    {
      slug: "english-speaking-mastery",
      title: "English Speaking Mastery",
      facultyCode: "CREATIVE",
      durationLabel: "8 ay",
      difficultyLabel: "Tüm Seviyeler",
      shortDescription: "İngilizcede yerli konuşmacı düzeyine ulaş.",
      certificateEnabled: true,
      rewardTrackEnabled: true,
      courses: [],
    },
  ],
};

// ─── All faculties ─────────────────────────────────────────────────────────────

export const FACULTIES: AcademicFaculty[] = [
  LANGUAGE_FACULTY,
  TECH_FACULTY,
  BUSINESS_FACULTY,
  CREATIVE_FACULTY,
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getFacultyByCode(code: string): AcademicFaculty | undefined {
  return FACULTIES.find((f) => f.code === code);
}

export function getProgramBySlug(slug: string): AcademicProgram | undefined {
  for (const f of FACULTIES) {
    const p = f.programs.find((pr) => pr.slug === slug);
    if (p) return p;
  }
  return undefined;
}

export function getCourseFromLanguageCatalog(
  langCode: string,
  level: string
): AcademicCourse | undefined {
  return LANGUAGE_FACULTY.programs
    .find((p) => p.slug === langCode)
    ?.courses.find((c) => c.id === `${langCode}-${level.toLowerCase()}`);
}

/**
 * Given a language_code (e.g. "en") and CEFR level (e.g. "B1"),
 * return human-readable academic context labels for UI display.
 */
export function getAcademicContext(
  langCode: string,
  level?: string
): {
  facultyName: string;
  programTitle: string;
  courseTitle?: string;
} {
  const program = LANGUAGE_FACULTY.programs.find((p) => p.slug === langCode);
  const course = level
    ? program?.courses.find(
        (c) => c.id === `${langCode}-${level.toLowerCase()}`
      )
    : undefined;

  return {
    facultyName: LANGUAGE_FACULTY.name,
    programTitle: program?.title ?? langCode.toUpperCase(),
    courseTitle: course?.title,
  };
}
