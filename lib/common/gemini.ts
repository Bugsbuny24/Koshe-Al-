const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY env değişkeni eksik');
  return key;
}

async function callGemini(prompt: string): Promise<string> {
  const key = getApiKey();
  const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${key}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3 },
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`Gemini API hatası: ${response.status} ${errBody}`);
  }

  const json = await response.json();
  const text: string | undefined =
    json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error('Gemini API boş yanıt döndü');
  return text;
}

export async function generateText(prompt: string): Promise<string> {
  return callGemini(prompt);
}

export async function generateJson<T = unknown>(prompt: string): Promise<T> {
  const raw = await callGemini(prompt);

  // Strip markdown code fences if present
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(`Gemini JSON parse hatası. Ham yanıt: ${cleaned.slice(0, 300)}`);
  }
}
