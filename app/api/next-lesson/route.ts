import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DEPARTMENTS } from "@/lib/data/curriculum";

export async function GET(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ error: "courseId gerekli" }, { status: 400 });
  }

  // Verify the user is enrolled
  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("language_code,level,completed_units_count,total_units_count,status")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (!enrollment) {
    return NextResponse.json(
      { error: "Bu kursa kayıtlı değilsin.", code: "NOT_ENROLLED" },
      { status: 404 }
    );
  }

  // Get completed unit IDs for this course
  const { data: completedUnits, error: progressError } = await supabase
    .from("unit_progress")
    .select("unit_id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .eq("completed", true);

  if (progressError) {
    return NextResponse.json(
      { error: "İlerleme verisi alınamadı." },
      { status: 500 }
    );
  }

  const completedIds = new Set(
    (completedUnits ?? []).map((u: { unit_id: string }) => u.unit_id)
  );

  // Find the next uncompleted unit from the curriculum
  const dept = DEPARTMENTS.find((d) => d.code === enrollment.language_code);
  const courseLevel = dept?.levels.find((l) => l.level === enrollment.level);

  if (!courseLevel) {
    return NextResponse.json(
      { error: "Müfredat bulunamadı." },
      { status: 404 }
    );
  }

  const nextUnit = courseLevel.units.find((u) => !completedIds.has(u.id));

  if (!nextUnit) {
    // All units completed
    return NextResponse.json({
      allCompleted: true,
      languageCode: enrollment.language_code,
      level: enrollment.level,
      courseId,
      totalUnits: courseLevel.units.length,
    });
  }

  return NextResponse.json({
    allCompleted: false,
    unit: nextUnit,
    languageCode: enrollment.language_code,
    level: enrollment.level,
    courseId,
    completedCount: completedIds.size,
    totalUnits: courseLevel.units.length,
  });
}
