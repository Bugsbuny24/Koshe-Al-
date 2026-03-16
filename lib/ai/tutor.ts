type GenerateLessonParams = {
  language: string;
  level: string;
};

type LessonResponse = {
  lessonTitle: string;
  explanation: string;
  exampleSentence: string;
  practiceTask: string;
  conversationQuestion: string;
};

export async function generateLesson({
  language,
  level,
}: GenerateLessonParams): Promise<LessonResponse> {

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

  const prompt = `
You are Koshei AI.

Create a short language learning lesson.

Target language: ${language}
Student level: ${level}

Return JSON only.

{
 "lessonTitle": "string",
 "explanation": "string",
 "exampleSentence": "string",
 "practiceTask": "string",
 "conversationQuestion": "string"
}
`;

  const res = await fetch(
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
          temperature: 0.5,
          maxOutputTokens: 600,
        },
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Gemini API error");
  }

  const json = await res.json();

  const text =
    json?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  try {
    return JSON.parse(text);
  } catch {
    return {
      lessonTitle: "Daily Speaking",
      explanation:
        "Practice speaking using simple sentences.",
      exampleSentence: "Hello, how are you today?",
      practiceTask: "Say 3 sentences about your day.",
      conversationQuestion: "What did you do today?",
    };
  }
}
