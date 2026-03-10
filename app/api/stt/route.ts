import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
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
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: (err as any)?.error?.message || "STT error" }, { status: 500 });
    }

    const data = await res.json();
    const transcript = data?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p?.text || "")
      .join("") || "";

    return NextResponse.json({ transcript: transcript.trim() });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "stt error" }, { status: 500 });
  }
}

