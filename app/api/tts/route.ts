import { Buffer } from "node:buffer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function pcmToWav(
  pcmBuffer: Buffer,
  sampleRate = 24000,
  channels = 1,
  bitDepth = 16
): Uint8Array {
  const dataSize = pcmBuffer.length;
  const headerSize = 44;
  const wav = Buffer.alloc(headerSize + dataSize);

  wav.write("RIFF", 0);
  wav.writeUInt32LE(36 + dataSize, 4);
  wav.write("WAVE", 8);
  wav.write("fmt ", 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(channels, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE((sampleRate * channels * bitDepth) / 8, 28);
  wav.writeUInt16LE((channels * bitDepth) / 8, 32);
  wav.writeUInt16LE(bitDepth, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(dataSize, 40);
  pcmBuffer.copy(wav, 44);

  return new Uint8Array(wav);
}

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

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    const body = {
      contents: [{ parts: [{ text }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = (err as any)?.error?.message || "Gemini TTS error";
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const data = await res.json();
    const part = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData;

    if (!part?.data) {
      return NextResponse.json({ error: "No audio data returned" }, { status: 500 });
    }

    const pcmBuffer = Buffer.from(part.data, "base64");
    const isWav = pcmBuffer.slice(0, 4).toString() === "RIFF";

    const audioBytes: Uint8Array = isWav
      ? new Uint8Array(pcmBuffer)
      : pcmToWav(pcmBuffer);

    const responseBody = Buffer.from(
      audioBytes.buffer,
      audioBytes.byteOffset,
      audioBytes.byteLength
    );

    return new NextResponse(responseBody as unknown as BodyInit, {
  status: 200,
  headers: {
    "Content-Type": "audio/wav",
    "Content-Length": String(responseBody.length),
    "Cache-Control": "no-store",
  },
});
  } catch (e: any) {
    console.error("TTS error:", e?.message);
    return NextResponse.json(
      { error: e?.message || "tts error" },
      { status: 500 }
    );
  }
}
