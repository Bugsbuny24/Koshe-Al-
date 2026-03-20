import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const MODELS = {
  FLASH_LITE: 'gemini-2.5-flash-lite',
  FLASH:      'gemini-2.5-flash',
  PRO:        'gemini-2.5-pro',
} as const;

export type ModelTier = keyof typeof MODELS;

const CATEGORY_TIERS: Record<string, { primary: ModelTier; fallback: ModelTier }> = {
  mentor_simple:  { primary: 'FLASH_LITE', fallback: 'FLASH' },
  mentor_complex: { primary: 'FLASH',      fallback: 'FLASH_LITE' },
  builder:        { primary: 'PRO',        fallback: 'FLASH' },
  review:         { primary: 'FLASH',      fallback: 'FLASH_LITE' },
};

const COST: Record<ModelTier, { input: number; output: number }> = {
  FLASH_LITE: { input: 0.0000001,  output: 0.0000004 },
  FLASH:      { input: 0.0000003,  output: 0.0000025 },
  PRO:        { input: 0.00000125, output: 0.00001 },
};

let _genAI: GoogleGenerativeAI | null = null;
export function getGenAI() {
  if (!_genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY eksik');
    _genAI = new GoogleGenerativeAI(key);
  }
  return _genAI;
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function hashPrompt(prompt: string, model: string) {
  return crypto.createHash('sha256').update(`${model}:${prompt}`).digest('hex');
}

async function getCache(hash: string): Promise<string | null> {
  try {
    const { data } = await getSupabase()
      .from('ai_cache')
      .select('response')
      .eq('prompt_hash', hash)
      .single();
    return (data?.response as { text: string })?.text ?? null;
  } catch { return null; }
}

async function setCache(hash: string, model: string, text: string) {
  try {
    await getSupabase().from('ai_cache').upsert({ prompt_hash: hash, model, response: { text } });
  } catch { /* devam */ }
}

export async function checkQuota(userId: string) {
  try {
    const { data } = await getSupabase()
      .from('user_quotas')
      .select('credits_remaining, tier, is_active')
      .eq('user_id', userId)
      .single();
    if (!data || !data.is_active) return { allowed: false, tier: 'free', remaining: 0 };
    return { allowed: data.credits_remaining > 0, tier: data.tier ?? 'free', remaining: data.credits_remaining ?? 0 };
  } catch { return { allowed: true, tier: 'free', remaining: 10 }; }
}

async function logUsage(userId: string, model: ModelTier, inputTokens: number, outputTokens: number) {
  try {
    const cost = inputTokens * COST[model].input + outputTokens * COST[model].output;
    const sb = getSupabase();
    await sb.from('ai_usage').insert({ user_id: userId, model: MODELS[model], input_tokens: inputTokens, output_tokens: outputTokens, cost });
    await sb.from('user_quotas').update({ credits_remaining: sb.rpc('decrement_credits', { uid: userId, amount: 1 }) as never }).eq('user_id', userId);
  } catch { /* devam */ }
}

export async function generateWithRouting(opts: {
  prompt: string;
  systemInstruction?: string;
  category: keyof typeof CATEGORY_TIERS;
  userId?: string;
  useCache?: boolean;
}) {
  const { primary, fallback } = CATEGORY_TIERS[opts.category];

  if (opts.useCache !== false) {
    const hash = hashPrompt(opts.prompt, MODELS[primary]);
    const cached = await getCache(hash);
    if (cached) return { text: cached, cached: true, model: primary };
  }

  for (const key of [primary, fallback] as ModelTier[]) {
    try {
      const model = getGenAI().getGenerativeModel({
        model: MODELS[key],
        ...(opts.systemInstruction ? { systemInstruction: opts.systemInstruction } : {}),
      });
      const result = await model.generateContent(opts.prompt);
      const text = result.response.text();
      const usage = result.response.usageMetadata;

      if (opts.useCache !== false) {
        await setCache(hashPrompt(opts.prompt, MODELS[key]), MODELS[key], text);
      }
      if (opts.userId) {
        await logUsage(opts.userId, key, usage?.promptTokenCount ?? 0, usage?.candidatesTokenCount ?? 0);
      }
      return { text, cached: false, model: key };
    } catch (err) {
      if (key === fallback) throw err;
      console.warn(`${MODELS[key]} başarısız, fallback deneniyor...`);
    }
  }
  throw new Error('Tüm modeller başarısız');
}

export async function* generateStream(opts: {
  messages: { role: 'user' | 'model'; content: string }[];
  systemInstruction: string;
  category: keyof typeof CATEGORY_TIERS;
  userId?: string;
}) {
  const { primary } = CATEGORY_TIERS[opts.category];
  const model = getGenAI().getGenerativeModel({
    model: MODELS[primary],
    systemInstruction: opts.systemInstruction,
  });

  const history = opts.messages.slice(0, -1).map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history });
  const last = opts.messages[opts.messages.length - 1];
  const result = await chat.sendMessageStream(last.content);

  let outputTokens = 0;
  for await (const chunk of result.stream) {
    const text = chunk.text();
    outputTokens += text.split(' ').length;
    yield text;
  }

  if (opts.userId) {
    await logUsage(opts.userId, primary, 0, outputTokens);
  }
}
