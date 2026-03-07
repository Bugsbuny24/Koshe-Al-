export async function transcribeAudio(opts: {
  audioBuffer: ArrayBuffer;
  mimeType: string;
  lang: string;
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");

  const base64Audio = Buffer.from(opts.audioBuffer).toString("base64");

  const langInstruction =
    opts.lang === "tr-TR"
      ? "Bu ses Turkce. Kelimesi kelimesine yaz."
      : `This audio is in ${opts.lang}. Transcribe word for word.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: opts.mimeType,
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
    throw new Error((err as any)?.error?.message || "Gemini STT error");
  }

  const data = await res.json();
  const transcript =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p?.text)
      .filter(Boolean)
      .join("") || "";

  return transcript.trim();
}
