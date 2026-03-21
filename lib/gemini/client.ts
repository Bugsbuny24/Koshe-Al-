import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// ── Modeller ─────────────────────────────────────────────────────────────────
export const MODELS = {
  FLASH_LITE:  'gemini-2.5-flash-lite',
  FLASH:       'gemini-2.5-flash',
  PRO:         'gemini-2.5-pro',
  FLASH_TTS:   'gemini-2.5-flash-tts',
  PRO_TTS:     'gemini-2.5-pro-tts',
  LIVE_AUDIO:  'gemini-2.5-flash-live',
  IMAGE_GEN:   'imagen-4',
  IMAGE_FAST:  'imagen-4-fast',
  VIDEO:       'veo-3',
  VIDEO_FAST:  'veo-3-fast',
  EMBEDDING:   'gemini-embedding-2',
} as const;

export type ModelKey = keyof typeof MODELS;

// ── Kredi maliyetleri ─────────────────────────────────────────────────────────
export const CREDIT_COSTS = {
  mentor_lite:  0.5,
  mentor_flash: 1.0,
  builder:      5.0,
  image_gen:    10.0,
  live_audio:   2.0,
  tts:          0.5,
  video_15s:    50.0,
} as const;

export type FeatureKey = keyof typeof CREDIT_COSTS;

// ── Plan limitleri ────────────────────────────────────────────────────────────
export const PLAN_FEATURES: Record<string, FeatureKey[]> = {
  starter:  ['mentor_lite', 'mentor_flash', 'tts'],
  growth:   ['mentor_lite', 'mentor_flash', 'tts', 'builder'],
  pro:      ['mentor_lite', 'mentor_flash', 'tts', 'builder', 'image_gen', 'live_audio'],
  prestige: ['mentor_lite', 'mentor_flash', 'tts', 'builder', 'image_gen', 'live_audio', 'video_15s'],
  // legacy alias
  ultra:    ['mentor_lite', 'mentor_flash', 'tts', 'builder', 'image_gen', 'live_audio', 'video_15s'],
};

// ── Feature → Model routing ───────────────────────────────────────────────────
export const FEATURE_MODEL: Record<FeatureKey, ModelKey> = {
  mentor_lite:  'FLASH_LITE',
  mentor_flash: 'FLASH',
  builder:      'PRO',
  image_gen:    'IMAGE_GEN',
  live_audio:   'LIVE_AUDIO',
  tts:          'FLASH_TTS',
  video_15s:    'VIDEO_FAST',
};

// ── Supabase client ───────────────────────────────────────────────────────────
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ── Gemini client ─────────────────────────────────────────────────────────────
let _genAI: GoogleGenerativeAI | null = null;

export function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY eksik');
    _genAI = new GoogleGenerativeAI(key);
  }
  return _genAI;
}

// ── Erişim ve kota kontrolü ───────────────────────────────────────────────────
export async function checkAccess(
  userId: string,
  feature: FeatureKey
): Promise<{
  allowed: boolean;
  reason?: string;
  credits_remaining?: number;
  plan?: string;
}> {
  try {
    const sb = getSupabase();
    const { data } = await sb
      .from('user_quotas')
      .select('credits_remaining, plan_id, is_active, plan_expires_at')
      .eq('user_id', userId)
      .single();

    if (!data || !data.is_active) {
      return { allowed: false, reason: 'no_plan' };
    }

    if (data.plan_expires_at && new Date(data.plan_expires_at) < new Date()) {
      return { allowed: false, reason: 'plan_expired' };
    }

    const plan = (data.plan_id as string) ?? 'starter';
    const allowedFeatures = PLAN_FEATURES[plan] ?? [];

    if (!allowedFeatures.includes(feature)) {
      return { allowed: false, reason: 'upgrade_required', plan };
    }

    const cost = CREDIT_COSTS[feature];
    const remaining = (data.credits_remaining as number) ?? 0;

    if (remaining < cost) {
      return { allowed: false, reason: 'insufficient_credits', credits_remaining: remaining };
    }

    return { allowed: true, credits_remaining: remaining, plan };
  } catch {
    return { allowed: false, reason: 'check_failed' };
  }
}

// ── Kredi düş ─────────────────────────────────────────────────────────────────
export async function deductCredits(userId: string, feature: FeatureKey): Promise<boolean> {
  const cost = CREDIT_COSTS[feature];
  try {
    const sb = getSupabase();
    await sb
      .from('user_quotas')
      .update({
        credits_remaining: sb
          .from('user_quotas')
          .select('credits_remaining')
          .eq('user_id', userId) as never,
      })
      .eq('user_id', userId);

    // RPC ile düş
    await sb.rpc('deduct_credits' as never, { uid: userId, amount: cost } as never);
    return true;
  } catch {
    return false;
  }
}

// ── Cache ─────────────────────────────────────────────────────────────────────
function hashPrompt(prompt: string, model: string): string {
  return crypto.createHash('sha256').update(`${model}:${prompt}`).digest('hex');
}

async function getCache(hash: string): Promise<string | null> {
  try {
    const { data } = await getSupabase()
      .from('ai_cache')
      .select('response')
      .eq('prompt_hash', hash)
      .single();
    return (data?.response as { text: string } | null)?.text ?? null;
  } catch {
    return null;
  }
}

async function setCache(hash: string, model: string, text: string): Promise<void> {
  try {
    await getSupabase()
      .from('ai_cache')
      .upsert({ prompt_hash: hash, model, response: { text } });
  } catch {
    // cache yazma başarısız — devam
  }
}

export async function logUsage(userId: string, modelId: string, inputTokens: number, outputTokens: number, feature?: string): Promise<void> {
  try {
    await getSupabase().from('ai_usage').insert({
      user_id: userId,
      model: modelId,
      feature: feature ?? null,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cost: 0,
    });
  } catch {
    // loglama başarısız — devam
  }
}

// ── Metin üretimi (cache + routing dahil) ─────────────────────────────────────
export async function generateText(opts: {
  prompt: string;
  systemInstruction?: string;
  feature: FeatureKey;
  userId: string;
  useCache?: boolean;
}): Promise<{ text: string; cached: boolean }> {
  const access = await checkAccess(opts.userId, opts.feature);
  if (!access.allowed) {
    throw new Error(access.reason ?? 'access_denied');
  }

  const modelKey = FEATURE_MODEL[opts.feature];
  const modelId = MODELS[modelKey];

  // Cache kontrolü
  if (opts.useCache !== false) {
    const hash = hashPrompt(opts.prompt, modelId);
    const cached = await getCache(hash);
    if (cached) return { text: cached, cached: true };
  }

  // Üret
  const geminiModel = getGenAI().getGenerativeModel({
    model: modelId,
    ...(opts.systemInstruction ? { systemInstruction: opts.systemInstruction } : {}),
  });

  const result = await geminiModel.generateContent(opts.prompt);
  const text = result.response.text();
  const usage = result.response.usageMetadata;

  // Cache yaz
  if (opts.useCache !== false) {
    await setCache(hashPrompt(opts.prompt, modelId), modelId, text);
  }

  // Kredi düş + logla
  await deductCredits(opts.userId, opts.feature);
  await logUsage(
    opts.userId,
    modelId,
    usage?.promptTokenCount ?? 0,
    usage?.candidatesTokenCount ?? 0,
    opts.feature
  );

  return { text, cached: false };
}

// ── Streaming metin (mentor için) ─────────────────────────────────────────────
export async function* streamText(opts: {
  messages: { role: 'user' | 'model'; content: string }[];
  systemInstruction: string;
  feature: FeatureKey;
  userId: string;
}): AsyncGenerator<string> {
  const access = await checkAccess(opts.userId, opts.feature);
  if (!access.allowed) {
    throw new Error(access.reason ?? 'access_denied');
  }

  const modelKey = FEATURE_MODEL[opts.feature];
  const modelId = MODELS[modelKey];

  const geminiModel = getGenAI().getGenerativeModel({
    model: modelId,
    systemInstruction: opts.systemInstruction,
  });

  const history = opts.messages.slice(0, -1).map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  const chat = geminiModel.startChat({ history });
  const last = opts.messages[opts.messages.length - 1];
  const result = await chat.sendMessageStream(last.content);

  for await (const chunk of result.stream) {
    yield chunk.text();
  }

  // Kredi düş
  await deductCredits(opts.userId, opts.feature);
}
