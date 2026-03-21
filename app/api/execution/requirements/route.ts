import { NextRequest, NextResponse } from 'next/server';
import { extractRequirements } from '@/lib/execution/requirementExtractor';

export async function POST(req: NextRequest) {
  try {
    let body: { brief?: string; templateId?: string | null };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Geçersiz istek gövdesi' }, { status: 400 });
    }

    const { brief, templateId } = body;

    if (!brief?.trim()) {
      return NextResponse.json({ success: false, error: 'Brief gerekli' }, { status: 400 });
    }

    const data = await extractRequirements(brief.trim(), templateId ?? null);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('execution/requirements error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
