import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  const { courseId, languageCode, level, totalUnits } = await req.json();

  const { data, error } = await supabase
    .from("course_enrollments")
    .upsert(
      {
        user_id: user.id,
        course_id: courseId,
        language_code: languageCode,
        level,
        total_units_count: totalUnits,
      },
      { onConflict: "user_id,course_id" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ enrollment: data });
}
