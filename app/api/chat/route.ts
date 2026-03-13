import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildTeacherPrompt, type KosheiMode } from "@/lib/ai/teacher-engine";
import { extractJson } from "@/lib/ai/parse-json";
import type { TeacherEngineResponse } from "@/lib/ai/types";

const FREE_TIER_DAILY_LIMIT = 20;

type ChatRequestBody = {
  conversationId?: string;
  targetLanguage?: string;
  nativeLanguage?: string;
  level?: string;
  mode?: KosheiMode;
  topic?: string;
  currentQuestion?: string;
  userAnswer?: string;
};

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as ChatRequestBody;

    const targetLanguage = String(body?.targetLanguage || "English").trim();
    const nativeLanguage = String(body?.nativeLanguage || "Turkish").trim();
    const level = String(body?.level || "A1").trim();
    const mode = normalizeMode(body?.mode, level);
    const topic = String(body?.topic || "Daily Life").trim();
    const currentQuestion = String(
      body?.currentQuestion || getDefaultQuestion(level, targetLanguage)
    ).trim();
    const userAnswer = String(body?.userAnswer || "").trim();

    if (!userAnswer) {
      return NextResponse.json(
        { error: "userAnswer is required." },
        { status: 400 }
      );
    }

    // Usage limit: free users get FREE_TIER_DAILY_LIMIT questions per day
    // Premium check via user_quotas.plan (not profiles.is_premium)
    const isPremium = await checkPremiumStatus({ supabase, userId: user.id });
    if (!isPremium) {
      const dailyCount = await getDailyMessageCount({ supabase, userId: user.id });
      if (dailyCount >= FREE_TIER_DAILY_LIMIT) {
        return NextResponse.json(
          {
            error: "daily_limit_reached",
            message: `Free plan limit: ${FREE_TIER_DAILY_LIMIT} speaking questions per day. Upgrade to Premium for unlimited access.`,
            limit: FREE_TIER_DAILY_LIMIT,
            used: dailyCount,
          },
          { status: 429 }
        );
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing." },
        { status: 500 }
      );
    }

    const conversationId = await getOrCreateConversation({
      supabase,
      userId: user.id,
      conversationId: body?.conversationId,
      language: targetLanguage,
      mode,
    });

    await insertUserMessage({
      supabase,
      conversationId,
      userId: user.id,
      userAnswer,
    });

    const contextSummary = await getConversationSummary({
      supabase,
      conversationId,
    });

    const recentMessages = await getRecentMessages({
      supabase,
      conversationId,
    });

    const prompt = buildTeacherPrompt({
      targetLanguage,
      nativeLanguage,
      level,
      mode,
      topic,
      currentQuestion,
      userAnswer,
      contextSummary,
      recentMessages,
    });

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: getTemperatureForMode(mode),
            topP: 0.9,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    const geminiData = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error("Gemini API error:", geminiData);
      return NextResponse.json(
        { error: "Gemini request failed.", details: geminiData },
        { status: 500 }
      );
    }

    const rawText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    const parsed = extractJson<TeacherEngineResponse>(rawText);

    if (!parsed) {
      return NextResponse.json(
        { error: "Model did not return valid JSON.", raw: rawText },
        { status: 500 }
      );
    }

    const inputTokens = estimateTokens(prompt);
    const outputTokens = estimateTokens(rawText);

    await insertAssistantMessage({
      supabase,
      conversationId,
      userId: user.id,
      content: parsed.teacherReply,
      model,
      inputTokens,
      outputTokens,
    });

    if (Array.isArray(parsed.memoryItems) && parsed.memoryItems.length > 0) {
      await insertLearningMemory({
        supabase,
        userId: user.id,
        language: targetLanguage,
        items: parsed.memoryItems,
      });
    }

    await insertAiUsage({
      supabase,
      userId: user.id,
      model,
      inputTokens,
      outputTokens,
      cost: estimateGeminiCost({ model, inputTokens, outputTokens }),
    });

    await updateConversationSummary({
      supabase,
      conversationId,
      targetLanguage,
      nativeLanguage,
      level,
      mode,
      topic,
    });

    // Save speaking session (with grammar_score + vocabulary_score via schema update)
    if (parsed.speakingScore) {
      await upsertSpeakingSession({
        supabase,
        userId: user.id,
        conversationId,
        language: targetLanguage,
        level,
        fluencyScore: parsed.speakingScore.fluency,
        grammarScore: parsed.speakingScore.grammar,
        vocabularyScore: parsed.speakingScore.vocabulary,
      });
    }

    return NextResponse.json({
      conversationId,
      teacherReply: parsed.teacherReply,
      correction: parsed.correction,
      grammarNotes: parsed.grammarNotes || [],
      nextAction: parsed.nextAction,
      nextQuestion: parsed.nextQuestion,
      difficulty: parsed.difficulty,
      speakingScore: parsed.speakingScore || null,
      memoryItems: parsed.memoryItems || [],
    });
  } catch (error) {
    console.error("Production chat route error:", error);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}

function normalizeMode(mode: KosheiMode | undefined, level: string): KosheiMode {
  if (mode === "foundation" || mode === "lesson" || mode === "practice" || mode === "conversation") {
    return mode;
  }
  if (level === "A1" || level === "A2") return "foundation";
  if (level === "B1" || level === "B2") return "lesson";
  if (level === "C1" || level === "C2") return "practice";
  return "conversation";
}

function getDefaultQuestion(level: string, targetLanguage: string) {
  if (level === "A1") return `Listen and repeat in ${targetLanguage}.`;
  if (level === "A2") return `Read and repeat a simple word in ${targetLanguage}.`;
  if (level === "B1") return `Describe your city in simple ${targetLanguage}.`;
  if (level === "B2") return `Tell me about your daily life in ${targetLanguage}.`;
  if (level === "C1") return `Practice speaking about your favorite topic in ${targetLanguage}.`;
  if (level === "C2") return `Explain your opinion clearly in ${targetLanguage}.`;
  if (level === "D1") return `Let's have a real conversation in ${targetLanguage}.`;
  return `Speak naturally in ${targetLanguage}.`;
}

function getTemperatureForMode(mode: KosheiMode) {
  if (mode === "foundation") return 0.4;
  if (mode === "lesson") return 0.55;
  if (mode === "practice") return 0.7;
  return 0.75;
}

// Premium check: user_quotas.plan = 'premium' (profiles.is_premium kolonu yok)
async function checkPremiumStatus({
  supabase,
  userId,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
}) {
  const { data } = await supabase
    .from("user_quotas")
    .select("plan")
    .eq("user_id", userId)
    .maybeSingle();
  return data?.plan === "premium" || data?.plan === "pro";
}

async function getDailyMessageCount({
  supabase,
  userId,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
}) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("role", "user")
    .gte("created_at", todayStart.toISOString());
  return count ?? 0;
}

async function upsertSpeakingSession({
  supabase,
  userId,
  conversationId,
  language,
  level,
  fluencyScore,
  grammarScore,
  vocabularyScore,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  conversationId: string;
  language: string;
  level: string;
  fluencyScore: number;
  grammarScore: number;
  vocabularyScore: number;
}) {
  const { error } = await supabase.from("speaking_sessions").insert({
    user_id: userId,
    conversation_id: conversationId,
    language,
    level,
    fluency_score: fluencyScore,
    grammar_score: grammarScore,
    vocabulary_score: vocabularyScore,
  });
  if (error) {
    console.error("Speaking session insert error:", error.message);
  }
}

async function getOrCreateConversation({
  supabase, userId, conversationId, language, mode,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  conversationId?: string;
  language: string;
  mode: KosheiMode;
}) {
  if (conversationId) {
    const { data, error } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("user_id", userId)
      .single();
    if (!error && data?.id) return data.id as string;
  }
  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: userId, language, mode })
    .select("id")
    .single();
  if (error || !data?.id) throw new Error(error?.message || "Failed to create conversation.");
  return data.id as string;
}

async function insertUserMessage({
  supabase, conversationId, userId, userAnswer,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  conversationId: string;
  userId: string;
  userAnswer: string;
}) {
  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    user_id: userId,
    role: "user",
    content: userAnswer,
    model: null,
    input_tokens: 0,
    output_tokens: 0,
  });
  if (error) throw new Error(`Failed to insert user message: ${error.message}`);
}

async function insertAssistantMessage({
  supabase, conversationId, userId, content, model, inputTokens, outputTokens,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  conversationId: string;
  userId: string;
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
}) {
  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    user_id: userId,
    role: "assistant",
    content,
    model,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
  });
  if (error) throw new Error(`Failed to insert assistant message: ${error.message}`);
}

async function getConversationSummary({
  supabase, conversationId,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  conversationId: string;
}) {
  const { data, error } = await supabase
    .from("conversation_context")
    .select("summary")
    .eq("conversation_id", conversationId)
    .maybeSingle();
  if (error) { console.error("Summary fetch error:", error.message); return ""; }
  return String(data?.summary || "");
}

async function getRecentMessages({
  supabase, conversationId,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  conversationId: string;
}) {
  const { data, error } = await supabase
    .from("messages")
    .select("role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(4);
  if (error || !data) { console.error("Recent messages fetch error:", error?.message); return []; }
  return [...data].reverse().map((m) => ({
    role: (m.role || "user") as "user" | "assistant" | "system",
    content: String(m.content || ""),
  }));
}

async function insertLearningMemory({
  supabase, userId, language, items,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  language: string;
  items: TeacherEngineResponse["memoryItems"];
}) {
  const payload = items
    .filter((item) => item && (item.wrongSentence?.trim() || item.correctSentence?.trim() || item.explanation?.trim()))
    .map((item) => ({
      user_id: userId,
      language,
      error_type: item.errorType,
      wrong_sentence: item.wrongSentence,
      correct_sentence: item.correctSentence,
      explanation: item.explanation,
    }));
  if (!payload.length) return;
  const { error } = await supabase.from("learning_memory").insert(payload);
  if (error) console.error("Learning memory insert error:", error.message);
}

async function insertAiUsage({
  supabase, userId, model, inputTokens, outputTokens, cost,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cost: number;
}) {
  const { error } = await supabase.from("ai_usage").insert({
    user_id: userId, model, input_tokens: inputTokens, output_tokens: outputTokens, cost,
  });
  if (error) console.error("AI usage insert error:", error.message);
}

async function updateConversationSummary({
  supabase, conversationId, targetLanguage, nativeLanguage, level, mode, topic,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  conversationId: string;
  targetLanguage: string;
  nativeLanguage: string;
  level: string;
  mode: KosheiMode;
  topic: string;
}) {
  const { data, error } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(8);
  if (error || !data?.length) return;

  const compactConversation = [...data]
    .reverse()
    .map((m) => `${m.role === "user" ? "Student" : "Koshei"}: ${m.content || ""}`)
    .join("\n");

  const summary = [
    `Target language: ${targetLanguage}`,
    `Native language: ${nativeLanguage}`,
    `Stage: ${level}`,
    `Mode: ${mode}`,
    `Topic: ${topic}`,
    `Recent summary: ${compactConversation.slice(0, 1200)}`,
  ].join("\n");

  const { data: existing } = await supabase
    .from("conversation_context")
    .select("id")
    .eq("conversation_id", conversationId)
    .maybeSingle();

  if (existing?.id) {
    const { error: updateError } = await supabase
      .from("conversation_context")
      .update({ summary, last_updated: new Date().toISOString() })
      .eq("conversation_id", conversationId);
    if (updateError) console.error("Conversation context update error:", updateError.message);
    return;
  }

  const { error: insertError } = await supabase
    .from("conversation_context")
    .insert({ conversation_id: conversationId, summary, last_updated: new Date().toISOString() });
  if (insertError) console.error("Conversation context insert error:", insertError.message);
}

function estimateTokens(text: string) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

function estimateGeminiCost({ model, inputTokens, outputTokens }: {
  model: string; inputTokens: number; outputTokens: number;
}) {
  const pricing: Record<string, { inputPerMillion: number; outputPerMillion: number }> = {
    "gemini-2.5-flash-lite": { inputPerMillion: 0.1, outputPerMillion: 0.4 },
    "gemini-2.5-flash": { inputPerMillion: 0.3, outputPerMillion: 2.5 },
    "gemini-2.5-pro": { inputPerMillion: 1.25, outputPerMillion: 10 },
  };
  const p = pricing[model] || pricing["gemini-2.5-flash-lite"];
  return Number(((inputTokens / 1_000_000) * p.inputPerMillion + (outputTokens / 1_000_000) * p.outputPerMillion).toFixed(8));
}
