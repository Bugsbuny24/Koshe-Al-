import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserCredits, deductCredits } from "@/lib/credits/credit-service";
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

    // ── Credit check ──────────────────────────────────────────────────────────
    const creditState = await getUserCredits(user.id);
    if (!creditState.exists) {
      return NextResponse.json(
        { error: "Kredi hesabınız bulunamadı.", code: "NO_QUOTA", remaining: 0 },
        { status: 402 }
      );
    }
    if (!creditState.isActive) {
      return NextResponse.json(
        { error: "Kredi hesabınız aktif değil.", code: "INACTIVE", remaining: 0 },
        { status: 402 }
      );
    }
    if (creditState.credits < 1) {
      return NextResponse.json(
        {
          error: "Yeterli krediniz yok.",
          code: "INSUFFICIENT",
          remaining: creditState.credits,
        },
        { status: 402 }
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

    await deductCredits(user.id, "lesson_generation");

    return NextResponse.json(lesson);
  } catch {
    return NextResponse.json(
      { error: "Lesson generation failed" },
      { status: 500 }
    );
  }
}
