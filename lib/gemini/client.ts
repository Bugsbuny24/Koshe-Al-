import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// ── Modeller ────────────────────────────────────────────────────────────────
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

// ── Kredi maliyetleri ────────────────────────────────────────────────────────
export const CREDIT_COSTS = {
  mentor_lite:  0.5,
  mentor_flash: 1.0,
  builder:      5.0,
  image_gen:    10.0,
  live_audio:   2.0,  // dakika başına
  tts:          0.5,
  video_15s:    50.0,
} as const;

export type FeatureKey = keyof typeof CREDIT_COSTS;

// ── Plan limitleri ───────────────────────────────────────────────────────────
export const PLAN_FEATURES: Record<string, FeatureKey[]> = {
  starter: ['mentor_lite', 'mentor_flash', 'tts'],
  pro:     ['mentor_lite', 'mentor_flash', 'tts', 'builder', 'image_gen', 'live_audio'],
  ultra:   ['mentor_lite', 'mentor_flash', 'tts', 'builder', 'image_gen', 'live_audio', 'video_15s'],
};

// ── Routing ──────────────────────────────────────────────────────────────────
export const FEATURE_MODEL: Record<FeatureKey, ModelKey> = {
  mentor_lite:  'FLASH_LITE',
  mentor_flash: 'FLASH',
  builder:      'PRO',
  image_gen:    'IMAGE_GEN',
  live_audio:   'LIVE_AUDIO',
  tts:          'FLASH_TTS',
  video_15s:    'VIDEO_FAST',
};

// ── Supabase ─────────────────────────────────────────────────────────────────
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ── GenAI ────────────────────────────────────────────────────────────────────
let _genAI: GoogleGenerativeAI | null = null;
export function getGenAI() {
  if (!_genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY eksik');
    _genAI = new GoogleGenerativeAI(key);
  }
  return _genAI;
}

// ── Kota + Plan kontrolü ─────────────────────────────────────────────────────
export async function checkAccess(userId: string, feature: FeatureKey): Promise<{
  allowed: boolean;
  reason?: string;
  credits_remaining?: number;
  plan?: string;
}> {
  const sb = getSupabase();
  const { data } = await sb
    .from('user_quotas')
    .select('credits_remaining, plan_id, is_active, plan_expires_at')
    .eq('user_id', userId)
    .single();

  if (!data || !data.is_active) {
    return { allowed: false, reason: 'no_plan' };
  }

  // Plan süresi dolmuş mu?
  if (data.plan_expires_at && new Date(data.plan_expires_at) < new Date()) {
    return { allowed: false, reason: 'plan_expired' };
  }

  // Bu özellik plana dahil mi?
  const plan = data.plan_id ?? 'starter';
  const allowed_features = PLAN_FEATURES[plan] ?? [];
  if (!allowed_features.includes(feature)) {
    return { allowed: false, reason: 'upgrade_required', plan };
  }

  // Kredi yeterli mi?
  const cost = CREDIT_COSTS[feature];
  if ((data.credits_remaining ?? 0) < cost) {
    return { allowed: false, reason: 'insufficient_credits', credits_remaining: data.credits_remaining };
  }

  return { allowed: true, credits_remaining: data.credits_remaining, plan };
}

// ── Kredi düş ────────────────────────────────────────────────────────────────
export async function deductCredits(userId: string, feature: FeatureKey): Promise<boolean> {
  const cost = CREDIT_COSTS[feature];
  const sb = getSupabase();
  const { data } = await sb.rpc('deduct_credits', { uid: userId, amount: cost });
  return data === true;
}

// ── Cache ────────────────────────────────────────────────────────────────────
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
    await getSupabase().from('ai_cache').upsert({
      prompt_hash: hash, model, response: { text }
    });
  } catch { /* devam */ }
}

// ── Ana üretim fonksiyonu ────────────────────────────────────────────────────
export async function generateText(opts: {
  prompt: string;
  systemInstruction?: string;
  feature: FeatureKey;
  userId: string;
  useCache?: boolean;
}): Promise<{ text: string; cached: boolean }> {

  // Erişim kontrolü
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
  const model = getGenAI().getGenerativeModel({
    model: modelId,
    ...(opts.systemInstruction ? { systemInstruction: opts.systemInstruction } : {}),
  });

  const result = await model.generateContent(opts.prompt);
  const text = result.response.text();

  // Cache yaz
  if (opts.useCache !== false) {
    await setCache(hashPrompt(opts.prompt, modelId), modelId, text);
  }

  // Kredi düş
  await deductCredits(opts.userId, opts.feature);

  // Kullanım logla
  const usage = result.response.usageMetadata;
  await getSupabase().from('ai_usage').insert({
    user_id: opts.userId,
    model: modelId,
    input_tokens: usage?.promptTokenCount ?? 0,
    output_tokens: usage?.candidatesTokenCount ?? 0,
    cost: 0,
  }).catch(() => {});

  return { text, cached: false };
}

// ── Streaming (mentor için) ──────────────────────────────────────────────────
export async function* streamText(opts: {
  messages: { role: 'user' | 'model'; content: string }[];
  systemInstruction: string;
  feature: FeatureKey;
  userId: string;
}): AsyncGenerator<string> {

  const access = await checkAccess(opts.userId, opts.feature);
  if (!access.allowed) throw new Error(access.reason);

  const modelKey = FEATURE_MODEL[opts.feature];
  const model = getGenAI().getGenerativeModel({
    model: MODELS[modelKey],
    systemInstruction: opts.systemInstruction,
  });

  const history = opts.messages.slice(0, -1).map(m => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history });
  const last = opts.messages[opts.messages.length - 1];
  const result = await chat.sendMessageStream(last.content);

  for await (const chunk of result.stream) {
    yield chunk.text();
  }

  // Kredi düş
  await deductCredits(opts.userId, opts.feature);
      }
