import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const { prompt, techStack } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const systemPrompt = `
    Sen bir AI uygulama üreticisisin. Kullanıcının isteğine göre çalışır kod üret.
    Tech stack: ${techStack?.join(', ') || 'Next.js, React, TypeScript, Tailwind CSS'}
    
    Kurallar:
    - Tam çalışır kod üret
    - Her dosyayı ayrı code block içinde ver
    - Pi Network ile entegrasyon noktalarını belirt
    - TypeScript kullan
    - Tailwind CSS ile stil ver
    
    İstek: ${prompt}
  `;

  try {
    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();

    return NextResponse.json({ code: text });
  } catch {
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
  }
}
