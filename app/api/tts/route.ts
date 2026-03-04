import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    const body = {
      contents: [
        {
          parts: [{ text }]
        }
      ],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Kore" // Doğal, net kadın sesi
            }
          }
        }
      }
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = (err as any)?.error?.message || "Gemini TTS error";
      console.error("Gemini TTS error:", msg);
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const data = await res.json();

    // Gemini TTS returns base64 encoded audio
    const audioData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const mimeType = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || "audio/wav";

    if (!audioData) {
      return NextResponse.json({ error: "No audio data returned" }, { status: 500 });
    }

    const audioBuffer = Buffer.from(audioData, "base64");

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (e: any) {
    console.error("TTS error:", e?.message);
    return NextResponse.json({ error: e?.message || "tts error" }, { status: 500 });
  }
}
