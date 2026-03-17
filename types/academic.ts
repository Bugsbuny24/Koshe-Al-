// ─── Generic Academic Core — domain types for the university system ───────────
//
// Shared reward/enrollment base types are imported from ./university so that
// the language-faculty domain and the generic-academic domain share a single
// source of truth for those concepts.
//
// Rule:
//   types/university.ts   → language-faculty domain (CourseUnit, CourseLevel,
//                           Department[language], EnrollmentRecord, badges,
//                           certificates, collectibles)
//   types/academic.ts     → generic academic core (universities, faculties,
//                           programs, academic_courses, transcript, awards)
//   Bridge types below    → explicit glue between the two domains

// Re-export shared reward / enrollment types so consumers can import
// from a single place when working in the academic context.
export type {
  EnrollmentRecord,
  EnrollmentStatus,
  AchievementRecord,
  BadgeDefinition,
  BadgeLevel,
  CertificateRecord,
  CollectibleRewardRecord,
  CollectibleMetadata,
  MintStatus,
  MarketplaceStatus,
} from "./university";

// ─── Degree / program metadata ────────────────────────────────────────────────

export type DegreeType =
  | "BA"
  | "BS"
  | "MA"
  | "MSc"
  | "PhD"
  | "Certificate"
  | "Diploma"
  | "Prep";

// ─── Database row types for new academic tables ───────────────────────────────

export type UniversityRow = {
  id: string;
  name: string;
  slug: string;
  code: string;
  description: string | null;
  country: string | null;
  website: string | null;
  logo_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type FacultyRow = {
  id: string;
  university_id: string;
  /** Set to "language" to mark this as the language-faculty that wraps the
   *  existing language-course system. Allows admin queries to identify it. */
  faculty_type: "language" | "generic";
  name: string;
  slug: string;
  code: string;
  description: string | null;
  dean_name: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type DepartmentRow = {
  id: string;
  faculty_id: string;
  university_id: string;
  name: string;
  slug: string;
  code: string;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProgramRow = {
  id: string;
  department_id: string | null;
  faculty_id: string;
  university_id: string;
  title: string;
  slug: string;
  code: string;
  degree_type: DegreeType;
  duration_years: number;
  total_courses: number | null;
  total_credits: number | null;
  min_gpa: number | null;
  language_of_instruction: string;
  has_prep_year: boolean;
  has_thesis: boolean;
  has_minor_option: boolean;
  has_honors_option: boolean;
  study_abroad_optional: boolean;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type RequirementType =
  | "writing_requirement"
  | "quantitative_requirement"
  | "language_requirement"
  | "general_education"
  | "humanities_requirement"
  | "social_science_requirement"
  | "natural_science_requirement"
  | "engineering_core"
  | "communication_requirement"
  | "internship_requirement"
  | "thesis_requirement"
  | "capstone_requirement"
  | "honors_requirement"
  | "elective_requirement"
  | "minor_requirement"
  | "concentration_requirement"
  | "lab_requirement"
  | "seminar_requirement";

export type ProgramRequirementRow = {
  id: string;
  program_id: string;
  requirement_type: RequirementType;
  title: string;
  description: string | null;
  min_credits: number | null;
  min_courses: number | null;
  is_mandatory: boolean;
  notes: string | null;
  created_at: string;
};

export type AcademicCourseRow = {
  id: string;
  program_id: string | null;
  faculty_id: string;
  university_id: string;
  title: string;
  slug: string;
  code: string;
  credits: number;
  description: string | null;
  is_core: boolean;
  is_elective: boolean;
  /** Numeric level: 100, 200, 300, 400, 500 … */
  level: string | null;
  semester: string | null;
  prerequisite_codes: string[] | null;
  language_of_instruction: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type CourseModuleRow = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  duration_hours: number | null;
  active: boolean;
  created_at: string;
};

export type ModuleLessonRow = {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  order_index: number;
  content_type:
    | "text"
    | "video"
    | "quiz"
    | "practice"
    | "speaking"
    | "project";
  duration_minutes: number | null;
  active: boolean;
  created_at: string;
};

export type DegreeRuleRow = {
  id: string;
  program_id: string;
  rule_type: string;
  description: string;
  value: string | null;
  created_at: string;
};

// ─── Student progression rows ─────────────────────────────────────────────────

export type StudentProgramEnrollmentRow = {
  id: string;
  user_id: string;
  program_id: string;
  university_id: string;
  enrollment_date: string;
  expected_graduation: string | null;
  status: "active" | "graduated" | "suspended" | "withdrawn";
  gpa: number | null;
  completed_credits: number;
  created_at: string;
  updated_at: string;
};

/**
 * Enrollments in academic_courses (new generic system).
 * Language-course enrollments stay in course_enrollments (existing table)
 * and are bridged via program_enrollment_id (nullable FK).
 */
export type StudentCourseEnrollmentRow = {
  id: string;
  user_id: string;
  course_id: string;
  program_enrollment_id: string | null;
  status: "enrolled" | "completed" | "failed" | "withdrawn";
  grade: string | null;
  score: number | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type StudentTranscriptRow = {
  id: string;
  user_id: string;
  university_id: string;
  program_id: string;
  course_id: string;
  course_code: string;
  course_title: string;
  credits: number;
  grade: string | null;
  score: number | null;
  semester: string | null;
  academic_year: string | null;
  completed_at: string | null;
  created_at: string;
};

// ─── Awards / milestones ──────────────────────────────────────────────────────

export type AcademicMilestoneType =
  | "program_enrollment"
  | "core_requirement_complete"
  | "honors_complete"
  | "capstone_complete"
  | "high_gpa"
  | "faculty_excellence"
  | "distinction"
  | "graduation"
  | "program_milestone"
  | "language_requirement_complete"
  | "internship_complete"
  | "thesis_submitted"
  | "thesis_approved";

/**
 * student_awards row.
 *
 * certificate_id  → FK to public.certificates.id   (existing language-cert table)
 * collectible_id  → FK to public.collectible_rewards.id (existing collectibles)
 * badge_code      → matches achievements.code (no FK; code is not a unique key)
 */
export type StudentAwardRow = {
  id: string;
  user_id: string;
  milestone_type: AcademicMilestoneType;
  title: string;
  description: string | null;
  program_id: string | null;
  course_id: string | null;
  university_id: string | null;
  badge_code: string | null;
  certificate_id: string | null;
  collectible_id: string | null;
  awarded_at: string;
};

// ─── Bridge: language-faculty ↔ academic-faculty ─────────────────────────────

/**
 * Describes how the existing language-course system maps into the academic
 * faculty/program hierarchy. Used only in admin UI / seed data; not a DB row.
 *
 * The "Faculty of Languages" row in public.faculties (faculty_type = 'language')
 * acts as the umbrella. Each language code (e.g. "en", "de") maps to a
 * DepartmentRow, and each CEFR level (A1…C2) maps to a program.
 * The actual lesson/unit content is still served by the existing
 * course_enrollments → curriculum system.
 */
export type LanguageFacultyBridge = {
  /** ID of the FacultyRow with faculty_type = 'language' */
  faculty_id: string;
  /** language code, e.g. "en" → matches Department.code in university.ts */
  language_code: string;
  /** ID of the DepartmentRow for this language */
  department_id: string;
  /** Maps each CEFR level to its program ID */
  level_program_map: Record<string, string>;
};

// ─── Seed / template types ────────────────────────────────────────────────────

export type UniversityTemplate = {
  name: string;
  code: string;
  country: string;
  description: string;
  inspired_by: string;
  faculties: {
    name: string;
    code: string;
    departments: {
      name: string;
      code: string;
      programs: {
        title: string;
        code: string;
        degree_type: DegreeType;
        duration_years: number;
        total_credits: number;
        total_courses: number;
        min_gpa: number;
        language_of_instruction: string;
        has_prep_year: boolean;
        has_thesis: boolean;
        has_minor_option: boolean;
        has_honors_option: boolean;
        requirements: {
          type: RequirementType;
          title: string;
          min_credits: number;
          is_mandatory: boolean;
        }[];
      }[];
    }[];
  }[];
};
