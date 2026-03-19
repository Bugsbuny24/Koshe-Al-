import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RequestBody = {
  unitId?: string;
  courseId?: string;
};

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json() as RequestBody;
    const { unitId, courseId } = body;

    if (!unitId || !courseId) {
      return NextResponse.json({ error: "unitId ve courseId gerekli" }, { status: 400 });
    }

    // unit_progress upsert
    await supabase.from("unit_progress").upsert(
      {
        user_id: user.id,
        course_id: courseId,
        unit_id: unitId,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,course_id,unit_id" }
    );

    // Tamamlanan ünite sayısını güncelle
    const { count: completedCount } = await supabase
      .from("unit_progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .eq("completed", true);

    // course_enrollments güncelle
    const { data: enrollment } = await supabase
      .from("course_enrollments")
      .select("total_units_count")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();

    const totalUnits = enrollment?.total_units_count ?? 1;
    const completed = completedCount ?? 0;
    const progressPercent = Math.min(100, Math.round((completed / totalUnits) * 100));

    await supabase
      .from("course_enrollments")
      .update({
        completed_units_count: completed,
        progress_percent: progressPercent,
        status: progressPercent >= 100 ? "completed" : "active",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("course_id", courseId);

    return NextResponse.json({
      success: true,
      completedCount: completed,
      progressPercent,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
