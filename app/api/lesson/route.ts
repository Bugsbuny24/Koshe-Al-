import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateLesson } from "@/lib/ai/tutor";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const language = body.language;
    const level = body.level;

    if (!language) {
      return NextResponse.json(
        { error: "Language missing" },
        { status: 400 }
      );
    }

    const lesson = await generateLesson({
      language,
      level,
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Lesson generation failed" },
      { status: 500 }
    );
  }
}
