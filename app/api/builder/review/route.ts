/**
 * Code Review API — /api/builder/review
 *
 * RuView-inspired AI code review endpoint. Analyzes submitted code,
 * returns a quality score, summary, and categorized issues with suggestions.
 * Reference: https://github.com/ruvnet/RuView
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteClient } from '@/lib/supabase/server';
import { generateText } from '@/lib/common/gemini-client';

interface ReviewIssue {
  severity: 'critical' | 'warning' | 'info';
  line?: number;
  description: string;
  suggestion: string;
}

interface CodeReviewResult {
  summary: string;
  score: number;
  issues: ReviewIssue[];
}

function parseReviewResponse(text: string): CodeReviewResult {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        summary: String(parsed.summary || 'İnceleme tamamlandı.'),
        score: Math.min(100, Math.max(0, Number(parsed.score) || 70)),
        issues: Array.isArray(parsed.issues)
          ? parsed.issues
              .filter((i: unknown) => i && typeof i === 'object')
              .map((i: Record<string, unknown>) => ({
                severity: ['critical', 'warning', 'info'].includes(String(i.severity))
                  ? (i.severity as ReviewIssue['severity'])
                  : 'info',
                line: i.line ? Number(i.line) : undefined,
                description: String(i.description || ''),
                suggestion: String(i.suggestion || ''),
              }))
          : [],
      };
    }
  } catch {
    // fallback below
  }

  // Fallback: return a generic result
  return {
    summary: text.slice(0, 200).trim() || 'Kod incelendi.',
    score: 70,
    issues: [],
  };
}

export async function POST(req: NextRequest) {
  try {
    const supabaseAuth = await createSupabaseRouteClient();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor. Lütfen giriş yapın.' },
        { status: 401 }
      );
    }

    const { code, language = 'python' } = await req.json();

    if (!code?.trim()) {
      return NextResponse.json({ error: 'İncelenecek kod gerekli' }, { status: 400 });
    }

    const systemPrompt = `Sen bir uzman kod inceleyicisisin. Kullanıcının ${language} kodunu analiz et ve aşağıdaki JSON formatında yanıt ver:

{
  "summary": "Kısa bir özet (1-2 cümle, Türkçe)",
  "score": <0-100 arası kalite puanı>,
  "issues": [
    {
      "severity": "critical" | "warning" | "info",
      "line": <satır numarası veya null>,
      "description": "Sorunun açıklaması (Türkçe)",
      "suggestion": "Düzeltme önerisi (Türkçe)"
    }
  ]
}

Sadece JSON döndür, başka açıklama ekleme. En fazla 5 issue döndür. Gerçek sorun yoksa issues dizisi boş olabilir.`;

    const userPrompt = `Aşağıdaki ${language} kodunu incele:\n\n\`\`\`${language}\n${code.slice(0, 4000)}\n\`\`\``;

    const result = await generateText({
      userId,
      feature: 'builder',
      systemInstruction: systemPrompt,
      prompt: userPrompt,
      useCache: false,
    });

    const review = parseReviewResponse(result.text || '');
    return NextResponse.json(review);
  } catch (err) {
    console.error('[builder/review] error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
