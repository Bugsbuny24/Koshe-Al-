export async function callGemini(opts: {
  system: string;
  user: string;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");

  // Gemini REST (minimal): Google'ın resmi SDKsı yerine burada HTTP ile de yapılabilir.
  // Ama V1 için en basit: "generativelanguage" endpoint.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      { role: "user", parts: [{ text: `${opts.system}\n\nKULLANICI:\n${opts.user}` }] }
    ]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Gemini request failed");

  const text =
    data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join("") ||
    "Cevap alınamadı.";

  return text;
}
