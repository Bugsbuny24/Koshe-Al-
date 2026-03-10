import { NextRequest, NextResponse } from "next/server";

function extractJson(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing." },
        { status: 500 }
      );
    }

    const mode = String(body?.mode || "board");
    const targetLanguage = String(body?.targetLanguage || "English");
    const userNativeLanguage = String(body?.userNativeLanguage || "Turkish");
    const level = String(body?.level || "A2");
    const topic = String(body?.topic || "Daily Life");
    const question = String(body?.question || "");
    const answer = String(body?.answer || "");
    const previousQuestion = String(body?.previousQuestion || "");
    const previousAnswer = String(body?.previousAnswer || "");

    let prompt = "";

    if (mode === "next-question") {
      prompt = `
You are Koshei, an elite AI language teacher.

Create the next speaking question for a student.

Context:
- Target language: ${targetLanguage}
- Native language: ${userNativeLanguage}
- Level: ${level}
- Topic: ${topic}
- Previous question: ${previousQuestion}
- Previous answer: ${previousAnswer}

Return ONLY valid JSON in this exact format:
{
  "reply": "short teacher guidance in ${targetLanguage}",
  "nextQuestion": "next speaking task in ${targetLanguage}",
  "vocab": ["word1", "word2", "word3", "word4", "word5"]
}

Rules:
- Keep the next question short and natural.
- Make it suitable for speaking practice.
- Increase difficulty only slightly.
- No markdown.
- No explanation outside JSON.
`.trim();
    } else {
      prompt = `
You are Koshei, an elite AI speaking teacher.

Analyze the student's answer and continue the lesson.

Context:
- Target language: ${targetLanguage}
- Native language: ${userNativeLanguage}
- Level: ${level}
- Topic: ${topic}
- Current question: ${question}
- Student answer: ${answer}

Return ONLY valid JSON in this exact format:
{
  "reply": "one short warm teacher response in ${targetLanguage}",
  "correction": "correct version of the student's answer in ${targetLanguage}",
  "grammarNotes": ["short note 1", "short note 2"],
  "vocab": ["word1", "word2", "word3", "word4", "word5"],
  "nextAction": "short instruction in ${targetLanguage}",
  "nextQuestion": "next speaking question in ${targetLanguage}"
}

Rules:
- Be concise.
- Correct the sentence naturally.
- Grammar notes must be short.
- Vocab should match the topic.
- nextAction should tell the student what to do.
- nextQuestion should continue the conversation lesson.
- No markdown.
- No explanation outside JSON.
`.trim();
    }

    const geminiResponse = await fetch(
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
            temperature: 0.8,
            topP: 0.95,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error("Gemini error:", data);
      return NextResponse.json(
        { error: "Gemini request failed.", details: data },
        { status: 500 }
      );
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    const parsed = extractJson(text);

    if (!parsed) {
      return NextResponse.json(
        { error: "Model did not return valid JSON.", raw: text },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
