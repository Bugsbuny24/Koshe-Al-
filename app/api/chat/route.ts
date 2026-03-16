import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildTeacherPrompt } from "@/lib/ai/teacher-engine";
import { calculateSpeakingScore } from "@/lib/ai/score-engine";
import {
  createFallbackMemoryItem,
  formatRecentMistakesForPrompt,
  normalizeVocabularyWords,
  shouldCreateFallbackMemory,
} from "@/lib/ai/memory-engine";
import type {
  ChatRouteResponse,
  ChatMessageRole,
  MemoryItem,
  TeacherEngineResponse,
} from "@/lib/ai/types";

type ChatRequestBody = {
  message: string;
  conversationId?: string | null;
};

type ProfileRow = {
  native_language: string | null;
  target_language: string | null;
  difficulty_level: string | null;
  learning_stage: string | null;
  onboarding_completed: boolean | null;
};

type ConversationRow = {
  id: string;
};

type RecentMistakeRow = {
  wrong_sentence: string | null;
  correct_sentence: string | null;
  explanation: string | null;
};

type ExistingVocabRow = {
  id: string;
  strength: number | null;
};

function safeJsonParse(text: string): Partial<TeacherEngineResponse> | null {
  try {
    return JSON.parse(text);
  } catch {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.slice(firstBrace, lastBrace + 1));
      } catch {
        return null;
      }
    }

    return null;
  }
}

function normalizeMemoryItems(items: unknown): MemoryItem[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      const typed = item as MemoryItem;

      if (
        !typed ||
        !typed.errorType ||
        !typed.wrongSentence ||
        !typed.correctSentence ||
        !typed.explanation
      ) {
        return null;
      }

      return {
        errorType: typed.errorType,
        wrongSentence: String(typed.wrongSentence).trim(),
        correctSentence: String(typed.correctSentence).trim(),
        explanation: String(typed.explanation).trim(),
      } satisfies MemoryItem;
    })
    .filter(Boolean) as MemoryItem[];
}

function normalizeTeacherResponse(
  parsed: Partial<TeacherEngineResponse> | null,
  userMessage: string
): TeacherEngineResponse {
  return {
    teacherReply:
      parsed?.teacherReply?.toString().trim() ||
      "Güzel. Şimdi devam edelim ve bir sonraki soruya geçelim.",
    correction: parsed?.correction?.toString().trim() || userMessage,
    grammarNotes: Array.isArray(parsed?.grammarNotes)
      ? parsed.grammarNotes.map((item) => String(item))
      : [],
    nextAction:
      parsed?.nextAction?.toString().trim() ||
      "Daha doğal ve tam cümlelerle cevap vermeye çalış.",
    nextQuestion:
      parsed?.nextQuestion?.toString().trim() ||
      "Can you say the same idea again using a fuller sentence?",
    difficulty:
      parsed?.difficulty === "easier" ||
      parsed?.difficulty === "same" ||
      parsed?.difficulty === "harder"
        ? parsed.difficulty
        : "same",
    vocabulary: Array.isArray((parsed as TeacherEngineResponse | null)?.vocabulary)
      ? (parsed as TeacherEngineResponse).vocabulary.map((item) => String(item))
      : [],
    memoryItems: normalizeMemoryItems(parsed?.memoryItems),
    speakingScore: parsed?.speakingScore,
  };
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = (await req.json()) as ChatRequestBody;

    const userMessage = body.message?.trim();
    if (!userMessage) {
      return NextResponse.json({ error: "Message empty" }, { status: 400 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "native_language,target_language,difficulty_level,learning_stage,onboarding_completed"
      )
      .eq("id", user.id)
      .single<ProfileRow>();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (!profile.onboarding_completed) {
      return NextResponse.json(
        { error: "Onboarding incomplete" },
        { status: 403 }
      );
    }

    const { data: recentMistakes } = await supabase
      .from("learning_memory")
      .select("wrong_sentence,correct_sentence,explanation")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .returns<RecentMistakeRow[]>();

    const formattedMistakes = formatRecentMistakesForPrompt(recentMistakes);

    let conversationId = body.conversationId ?? null;

    if (!conversationId) {
      const { data: conversation, error: conversationError } = await supabase
        .from("conversations")
        .insert({
          user_id: user.id,
          language: profile.target_language || "English",
          mode: "speaking",
        })
        .select("id")
        .single<ConversationRow>();

      if (conversationError || !conversation) {
        return NextResponse.json(
          { error: "Conversation oluşturulamadı." },
          { status: 500 }
        );
      }

      conversationId = conversation.id;
    }

    const prompt = buildTeacherPrompt({
      nativeLanguage: profile.native_language || "Turkish",
      targetLanguage: profile.target_language || "English",
      level: String(profile.difficulty_level || "A1"),
      goal: String(profile.learning_stage || "conversation"),
      message: userMessage,
      recentMistakes: formattedMistakes,
    });

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY missing" },
        { status: 500 }
      );
    }

    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topP: 0.9,
            maxOutputTokens: 1200,
          },
        }),
      }
    );

    if (!aiResponse.ok) {
      const rawError = await aiResponse.text();
      return NextResponse.json(
        { error: `Gemini error: ${rawError}` },
        { status: 500 }
      );
    }

    const aiJson = await aiResponse.json();
    const aiText =
      aiJson?.candidates?.[0]?.content?.parts?.[0]?.text?.toString() || "{}";

    const parsed = safeJsonParse(aiText);
    const normalized = normalizeTeacherResponse(parsed, userMessage);

    const calculatedScore = calculateSpeakingScore({
      userAnswer: userMessage,
      correction: normalized.correction,
      grammarNotes: normalized.grammarNotes,
      vocabulary: normalized.vocabulary,
    });

    normalized.speakingScore = calculatedScore;
    normalized.vocabulary = normalizeVocabularyWords(normalized.vocabulary);

    const memoryItems =
      normalized.memoryItems.length > 0
        ? normalized.memoryItems
        : shouldCreateFallbackMemory({
            userMessage,
            correction: normalized.correction,
          })
        ? [
            createFallbackMemoryItem({
              userMessage,
              correction: normalized.correction,
              grammarNotes: normalized.grammarNotes,
            }),
          ]
        : [];

    const messageRows: {
      user_id: string;
      conversation_id: string;
      role: ChatMessageRole;
      content: string;
    }[] = [
      {
        user_id: user.id,
        conversation_id: conversationId,
        role: "user",
        content: userMessage,
      },
      {
        user_id: user.id,
        conversation_id: conversationId,
        role: "assistant",
        content: JSON.stringify(normalized),
      },
    ];

    await supabase.from("messages").insert(messageRows);

    if (memoryItems.length > 0) {
      const memoryRows = memoryItems.map((item) => ({
        user_id: user.id,
        language: profile.target_language || "English",
        error_type: item.errorType,
        wrong_sentence: item.wrongSentence,
        correct_sentence: item.correctSentence,
        explanation: item.explanation,
      }));

      await supabase.from("learning_memory").insert(memoryRows);
    }

    if (normalized.vocabulary.length > 0) {
      for (const word of normalized.vocabulary) {
        const { data: existing } = await supabase
          .from("vocab_memory")
          .select("id,strength")
          .eq("user_id", user.id)
          .eq("language", profile.target_language || "English")
          .eq("word", word)
          .maybeSingle<ExistingVocabRow>();

        if (existing) {
          await supabase
            .from("vocab_memory")
            .update({
              strength: Number(existing.strength || 0) + 1,
              last_seen: new Date().toISOString(),
            })
            .eq("id", existing.id);
        } else {
          await supabase.from("vocab_memory").insert({
            user_id: user.id,
            language: profile.target_language || "English",
            word,
            meaning: "",
            strength: 1,
            last_seen: new Date().toISOString(),
          });
        }
      }
    }

    await supabase.from("speaking_sessions").upsert(
      {
        user_id: user.id,
        conversation_id: conversationId,
        language: profile.target_language || "English",
        level: String(profile.difficulty_level || "A1"),
        duration_seconds: 0,
        sentences_count: 1,
        mistakes_count: memoryItems.length,
        fluency_score: calculatedScore.fluency,
        grammar_score: calculatedScore.grammar,
        vocabulary_score: calculatedScore.vocabulary,
      },
      {
        onConflict: "conversation_id",
      }
    );

    await supabase.from("ai_usage").insert({
      user_id: user.id,
      model,
      input_tokens: 0,
      output_tokens: 0,
      cost: 0,
    });

    const response: ChatRouteResponse = {
      conversationId,
      ...normalized,
      memoryItems,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("chat route error", error);

    return NextResponse.json(
      { error: "Chat route error" },
      { status: 500 }
    );
  }
        }
