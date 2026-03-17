import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { courseId, unitId, unitOrder, score } = await req.json();

  // 1. unit progress kaydet
  await supabase.from("unit_progress").upsert({
    user_id: user.id,
    course_id: courseId,
    unit_id: unitId,
    unit_order: unitOrder,
    completed: true,
    score,
    completed_at: new Date().toISOString(),
  });

  // 2. progress hesapla
  const { data: units } = await supabase
    .from("unit_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", courseId);

  const completedCount = units?.filter((u) => u.completed).length || 0;

  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  const total = enrollment.total_units_count || 1;
  const progress = Math.floor((completedCount / total) * 100);

  // 3. enrollment update
  await supabase
    .from("course_enrollments")
    .update({
      completed_units_count: completedCount,
      progress_percent: progress,
      current_unit: unitOrder + 1,
    })
    .eq("id", enrollment.id);

  // 4. achievement unlock
  if (progress >= 50) {
    await supabase.from("achievements").upsert({
      user_id: user.id,
      code: "LEVEL_MID",
      title: "Orta Seviye Rozeti",
      image_url: "/badges/mid.png",
      level: "B1",
    });
  }

  if (progress === 100) {
    await supabase.from("certificates").insert({
      user_id: user.id,
      course_id: courseId,
      language_code: enrollment.language_code,
      level: enrollment.level,
      title: "Kurs Sertifikası",
      image_url: "/certs/certificate.png",
    });
  }

  return NextResponse.json({
    success: true,
    progress,
  });
}
