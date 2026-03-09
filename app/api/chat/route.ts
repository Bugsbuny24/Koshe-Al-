import { NextRequest, NextResponse } from "next/server";
import { buildTutorPrompt } from "@/lib/ai/tutor";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const messages = Array.isArray(body?.messages) ? (body.messages as Message[]) : [];
    const targetLanguage = String(body?.targetLanguage || "English");
    const userNativeLanguage = String(body?.userNativeLanguage || "Turkish");
    const level = String(body?.level || "A2-B1");
    const mode = String(body?.mode || "conversation");

    if (!messages.length) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing." },
        { status: 500 }
      );
    }

    const prompt = buildTutorPrompt({
      targetLanguage,
      userNativeLanguage,
      level,
      mode,
      messages,
    });

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
            maxOutputTokens: 400,
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

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (!reply) {
      return NextResponse.json(
        { error: "Empty response from Gemini." },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);

    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
