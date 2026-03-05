import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
    }

    // FormData ile ses dosyası gelir: audio (blob) + lang (string)
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const lang      = String(formData.get("lang") || "tr-TR");

    if (!audioFile) {
      return NextResponse.json({ error: "audio is required" }, { status: 400 });
    }

    // Ses dosyasını base64'e çevir
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");
    const mimeType    = audioFile.type || "audio/webm";

    // Dil talimatı
    const langInstruction = lang === "tr-TR"
      ? "Bu ses Turkce. Kelimesi kelimesine yaz."
      : `This audio is in ${lang}. Transcribe word for word.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Audio,
              },
            },
            {
              text: `${langInstruction} Sadece transcript yaz, baska hicbir sey ekleme.`,
            },
          ],
        },
      ],
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = (err as any)?.error?.message || "Gemini STT error";
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const data = await res.json();
    const transcript =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: any) => p?.text)
        .filter(Boolean)
        .join("") || "";

    return NextResponse.json({ transcript: transcript.trim() });
  } catch (e: any) {
    console.error("STT error:", e?.message);
    return NextResponse.json({ error: e?.message || "stt error" }, { status: 500 });
  }
}
