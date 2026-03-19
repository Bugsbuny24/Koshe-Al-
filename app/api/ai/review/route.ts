import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const { code, language } = await req.json();

  if (!code) {
    return NextResponse.json({ error: 'Code required' }, { status: 400 });
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
    Aşağıdaki ${language || 'kod'} için kapsamlı bir kod incelemesi yap:
    - Güvenlik açıkları
    - Performans sorunları
    - Best practices
    - Pi Network entegrasyonu için öneriler
    
    Kod:
    \`\`\`
    ${code}
    \`\`\`
  `;

  try {
    const result = await model.generateContent(prompt);
    const review = result.response.text();
    return NextResponse.json({ review });
  } catch {
    return NextResponse.json({ error: 'Review failed' }, { status: 500 });
  }
}
