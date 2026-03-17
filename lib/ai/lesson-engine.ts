import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateLesson({
  level,
  topic,
}: {
  level: string;
  topic: string;
}) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are Koshei AI, an elite language tutor.

Level: ${level}
Topic: ${topic}

Return JSON:

{
  "title": "",
  "explanation": "",
  "example": "",
  "practiceTask": "",
  "conversationQuestion": ""
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(text);
}
