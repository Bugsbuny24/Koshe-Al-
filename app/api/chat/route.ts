import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { buildTeacherPrompt } from "@/lib/ai/teacher-engine"

export async function POST(req: Request) {
  try {

    const supabase = createClient()

    const body = await req.json()

    const userMessage = body.message
    const conversationId = body.conversationId

    if (!userMessage) {
      return NextResponse.json({ error: "Message empty" }, { status: 400 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Kullanıcı profilini çek

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Kullanıcının son hatalarını çek

    const { data: recentMistakes } = await supabase
      .from("learning_memory")
      .select("wrong_sentence, correct_sentence, explanation")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)

    const mistakesText = recentMistakes
      ?.map(
        (m) =>
          `${m.wrong_sentence} → ${m.correct_sentence} (${m.explanation})`
      )
      .join("\n")

    // Teacher Prompt oluştur

    const prompt = buildTeacherPrompt({
      nativeLanguage: profile.native_language,
      targetLanguage: profile.target_language,
      level: profile.difficulty_level,
      goal: profile.learning_stage,
      message: userMessage,
      mistakes: mistakesText || "",
    })

    // Gemini çağrısı

    const apiKey = process.env.GEMINI_API_KEY!

    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
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
        }),
      }
    )

    const aiJson = await aiResponse.json()

    const aiText =
      aiJson?.candidates?.[0]?.content?.parts?.[0]?.text || "{}"

    let parsed

    try {
      parsed = JSON.parse(aiText)
    } catch {
      parsed = {
        correction: {},
        grammarNotes: [],
        vocabulary: [],
        nextQuestion: "",
        nextAction: "",
      }
    }

    // learning_memory kaydet

    if (
      parsed.correction?.wrong &&
      parsed.correction?.correct &&
      parsed.correction.wrong !== parsed.correction.correct
    ) {
      await supabase.from("learning_memory").insert({
        user_id: user.id,
        language: profile.target_language,
        error_type: "grammar",
        wrong_sentence: parsed.correction.wrong,
        correct_sentence: parsed.correction.correct,
        explanation: parsed.correction.explanation,
      })
    }

    // vocab memory güncelle

    if (parsed.vocabulary?.length > 0) {
      for (const word of parsed.vocabulary) {

        const { data: existing } = await supabase
          .from("vocab_memory")
          .select("*")
          .eq("user_id", user.id)
          .eq("word", word)
          .single()

        if (existing) {

          await supabase
            .from("vocab_memory")
            .update({
              strength: existing.strength + 1,
              last_seen: new Date().toISOString(),
            })
            .eq("id", existing.id)

        } else {

          await supabase.from("vocab_memory").insert({
            user_id: user.id,
            language: profile.target_language,
            word,
            meaning: "",
            strength: 1,
            last_seen: new Date().toISOString(),
          })

        }
      }
    }

    // conversation mesaj kaydet

    await supabase.from("messages").insert({
      user_id: user.id,
      conversation_id: conversationId,
      role: "user",
      content: userMessage,
    })

    await supabase.from("messages").insert({
      user_id: user.id,
      conversation_id: conversationId,
      role: "assistant",
      content: JSON.stringify(parsed),
    })

    return NextResponse.json(parsed)

  } catch (error) {

    return NextResponse.json(
      { error: "Chat route error" },
      { status: 500 }
    )

  }
          }   
