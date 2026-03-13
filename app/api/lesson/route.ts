import { NextRequest, NextResponse } from "next/server";

type LessonRequest = {
  nativeLanguage?: string;
  targetLanguage?: string;
  level?: string;
  difficulty?: number;
  topic?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LessonRequest;

    const targetLanguage = body.targetLanguage || "English";
    const nativeLanguage = body.nativeLanguage || "Turkish";
    const level = body.level || "A1";
    const difficulty = body.difficulty || 3;
    const topic = body.topic || "Daily Life";
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing." }, { status: 500 });
    }

    const prompt = `
You are Koshei AI lesson generator.
Create a short speaking lesson.

Student native language: ${nativeLanguage}
Target language: ${targetLanguage}
Level: ${level}
Difficulty: ${difficulty}
Topic: ${topic}

Return ONLY valid JSON:
{
  "lessonTitle": "string",
  "exampleSentence": "string",
  "explanation": "string",
  "practiceTask": "string",
  "conversationQuestion": "string"
}
`.trim();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    const jsonText = text.match(/\{[\s\S]*\}/)?.[0] || "{}";
    const parsed = JSON.parse(jsonText);

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      {
        lessonTitle: "Daily Speaking",
        exampleSentence: "I wake up early.",
        explanation: "Use simple present tense for daily routine.",
        practiceTask: "Say what time you wake up.",
        conversationQuestion: "What do you usually do in the morning?",
      },
      { status: 200 }
    );
  }
}
