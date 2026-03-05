import { NextResponse } from "next/server";
import { teacherSystemPrompt } from "@/lib/ai/prompts";
import { callGemini } from "@/lib/ai/gemini";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({}));
    const userText = String(payload?.text || "").trim();

    const targetLang  = String(payload?.targetLang  || "English");
    const nativeLang  = String(payload?.nativeLang  || "Turkish");
    const level       = String(payload?.level       || "A1");
    const nativeMode  = Boolean(payload?.nativeMode ?? true);
    const userName    = payload?.userName ? String(payload.userName) : undefined;

    if (!userText) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const system = teacherSystemPrompt({ targetLang, nativeLang, level, userName, nativeMode });
    const reply  = await callGemini({ system, user: userText });

    return NextResponse.json({ reply });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "chat error" }, { status: 500 });
  }
}
