"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ─── University actions ────────────────────────────────────────────────────

export async function createUniversityAction(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const slug = (name || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const { error } = await supabase.from("universities").insert({
    name,
    slug,
    code: formData.get("code") as string,
    description: (formData.get("description") as string) || null,
    country: (formData.get("country") as string) || null,
    website: (formData.get("website") as string) || null,
    active: formData.get("active") === "true",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/universities");
  redirect("/admin/universities");
}

export async function updateUniversityAction(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const { error } = await supabase
    .from("universities")
    .update({
      name,
      code: formData.get("code") as string,
      description: (formData.get("description") as string) || null,
      country: (formData.get("country") as string) || null,
      website: (formData.get("website") as string) || null,
      active: formData.get("active") === "true",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/universities");
  redirect("/admin/universities");
}

export async function deleteUniversityAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("universities").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/universities");
}

// ─── Faculty actions ───────────────────────────────────────────────────────

export async function createFacultyAction(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const slug = (name || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const { error } = await supabase.from("faculties").insert({
    university_id: formData.get("university_id") as string,
    name,
    slug,
    code: formData.get("code") as string,
    description: (formData.get("description") as string) || null,
    dean_name: (formData.get("dean_name") as string) || null,
    active: formData.get("active") === "true",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/faculties");
  redirect("/admin/faculties");
}

export async function updateFacultyAction(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const { error } = await supabase
    .from("faculties")
    .update({
      university_id: formData.get("university_id") as string,
      name,
      code: formData.get("code") as string,
      description: (formData.get("description") as string) || null,
      dean_name: (formData.get("dean_name") as string) || null,
      active: formData.get("active") === "true",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/faculties");
  redirect("/admin/faculties");
}

export async function deleteFacultyAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("faculties").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/faculties");
}

// ─── Program actions ───────────────────────────────────────────────────────

export async function createProgramAction(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const slug = (title || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const { error } = await supabase.from("programs").insert({
    university_id: formData.get("university_id") as string,
    faculty_id: formData.get("faculty_id") as string,
    title,
    slug,
    code: formData.get("code") as string,
    degree_type: formData.get("degree_type") as string,
    duration_years: parseInt(formData.get("duration_years") as string) || 4,
    total_credits: parseInt(formData.get("total_credits") as string) || null,
    total_courses: parseInt(formData.get("total_courses") as string) || null,
    min_gpa: parseFloat(formData.get("min_gpa") as string) || null,
    language_of_instruction:
      (formData.get("language_of_instruction") as string) || "English",
    has_prep_year: formData.get("has_prep_year") === "true",
    has_thesis: formData.get("has_thesis") === "true",
    has_minor_option: formData.get("has_minor_option") === "true",
    has_honors_option: formData.get("has_honors_option") === "true",
    study_abroad_optional: formData.get("study_abroad_optional") === "true",
    description: (formData.get("description") as string) || null,
    active: formData.get("active") === "true",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/programs");
  redirect("/admin/programs");
}

export async function updateProgramAction(id: string, formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const { error } = await supabase
    .from("programs")
    .update({
      university_id: formData.get("university_id") as string,
      faculty_id: formData.get("faculty_id") as string,
      title,
      code: formData.get("code") as string,
      degree_type: formData.get("degree_type") as string,
      duration_years: parseInt(formData.get("duration_years") as string) || 4,
      total_credits: parseInt(formData.get("total_credits") as string) || null,
      total_courses: parseInt(formData.get("total_courses") as string) || null,
      min_gpa: parseFloat(formData.get("min_gpa") as string) || null,
      language_of_instruction:
        (formData.get("language_of_instruction") as string) || "English",
      has_prep_year: formData.get("has_prep_year") === "true",
      has_thesis: formData.get("has_thesis") === "true",
      has_minor_option: formData.get("has_minor_option") === "true",
      has_honors_option: formData.get("has_honors_option") === "true",
      study_abroad_optional: formData.get("study_abroad_optional") === "true",
      description: (formData.get("description") as string) || null,
      active: formData.get("active") === "true",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/programs");
  redirect("/admin/programs");
}

export async function deleteProgramAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("programs").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/programs");
}

// ─── Course actions ────────────────────────────────────────────────────────

export async function createCourseAction(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const slug = (title || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const programId = (formData.get("program_id") as string) || null;
  const { error } = await supabase.from("academic_courses").insert({
    university_id: formData.get("university_id") as string,
    faculty_id: formData.get("faculty_id") as string,
    program_id: programId || null,
    title,
    slug,
    code: formData.get("code") as string,
    credits: parseInt(formData.get("credits") as string) || 3,
    description: (formData.get("description") as string) || null,
    is_core: formData.get("is_core") === "true",
    is_elective: formData.get("is_elective") === "true",
    level: (formData.get("level") as string) || null,
    semester: (formData.get("semester") as string) || null,
    language_of_instruction:
      (formData.get("language_of_instruction") as string) || "English",
    active: formData.get("active") === "true",
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/courses");
  redirect("/admin/courses");
}

export async function updateCourseAction(id: string, formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const programId = (formData.get("program_id") as string) || null;
  const { error } = await supabase
    .from("academic_courses")
    .update({
      university_id: formData.get("university_id") as string,
      faculty_id: formData.get("faculty_id") as string,
      program_id: programId || null,
      title,
      code: formData.get("code") as string,
      credits: parseInt(formData.get("credits") as string) || 3,
      description: (formData.get("description") as string) || null,
      is_core: formData.get("is_core") === "true",
      is_elective: formData.get("is_elective") === "true",
      level: (formData.get("level") as string) || null,
      semester: (formData.get("semester") as string) || null,
      language_of_instruction:
        (formData.get("language_of_instruction") as string) || "English",
      active: formData.get("active") === "true",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/courses");
  redirect("/admin/courses");
}

export async function deleteCourseAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("academic_courses")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/courses");
}
