import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { text, lang = "en" } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    // Google Translate TTS - no API key needed
    // Split text into chunks max 200 chars (Google limit)
    const chunks = splitText(text, 200);
    const audioChunks: Buffer[] = [];

    for (const chunk of chunks) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${lang}&client=tw-ob`;

      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)",
          Referer: "https://translate.google.com/",
        },
      });

      if (!res.ok) {
        throw new Error(`Google TTS error: ${res.status}`);
      }

      const buf = Buffer.from(await res.arrayBuffer());
      audioChunks.push(buf);
    }

    const combined = Buffer.concat(audioChunks);

    return new NextResponse(combined, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": combined.byteLength.toString(),
      },
    });
  } catch (e: any) {
    console.error("TTS error:", e?.message);
    return NextResponse.json({ error: e?.message || "tts error" }, { status: 500 });
  }
}

function splitText(text: string, maxLen: number): string[] {
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const s of sentences) {
    if ((current + s).length > maxLen) {
      if (current) chunks.push(current.trim());
      current = s;
    } else {
      current += s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}
