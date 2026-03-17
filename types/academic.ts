// University System Types

export type DegreeType = "BA" | "BS" | "MA" | "MSc" | "PhD" | "Certificate" | "Diploma" | "Prep";

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
  level: string | null; // 100, 200, 300, 400, 500 etc
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
  content_type: "text" | "video" | "quiz" | "practice" | "speaking" | "project";
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

// University template type for seed data
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
