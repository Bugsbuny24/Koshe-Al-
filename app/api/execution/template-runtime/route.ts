import { NextRequest, NextResponse } from 'next/server';
import { resolveTemplate, getAllTemplates } from '@/lib/execution/templateRuntime';

export async function GET() {
  try {
    const templates = getAllTemplates();
    return NextResponse.json({ success: true, data: templates });
  } catch (err) {
    console.error('execution/template-runtime GET error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: { templateId?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Geçersiz istek gövdesi' }, { status: 400 });
    }

    const { templateId } = body;

    if (!templateId?.trim()) {
      return NextResponse.json({ success: false, error: 'templateId gerekli' }, { status: 400 });
    }

    const template = resolveTemplate(templateId.trim());
    if (!template) {
      return NextResponse.json({ success: false, error: 'Şablon bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: template });
  } catch (err) {
    console.error('execution/template-runtime POST error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
