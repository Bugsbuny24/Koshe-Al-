import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserCredits, deductCredits } from "@/lib/credits/credit-service";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
        { error: "Yeterli krediniz yok.", code: "INSUFFICIENT", remaining: 0 },
        { status: 402 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const lang = String(formData.get("lang") || "en-US");

    if (!audioFile) {
      return NextResponse.json({ error: "audio is required" }, { status: 400 });
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = audioFile.type || "audio/webm";

    const langInstruction = lang === "tr-TR"
      ? "Bu ses Türkçe. Kelimesi kelimesine yaz."
      : `This audio is in ${lang}. Transcribe word for word.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [
              { inlineData: { mimeType, data: base64Audio } },
              { text: `${langInstruction} Only write the transcript, nothing else.` },
            ],
          }],
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
      return NextResponse.json({ error: err?.error?.message || "STT error" }, { status: 500 });
    }

    const data = await res.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const transcript = data?.candidates?.[0]?.content?.parts
      ?.map((p) => p?.text || "")
      .join("") || "";

    await deductCredits(user.id, "stt_request");

    return NextResponse.json({ transcript: transcript.trim() });
  } catch (e) {
    const err = e as { message?: string };
    return NextResponse.json({ error: err?.message || "stt error" }, { status: 500 });
  }
}

