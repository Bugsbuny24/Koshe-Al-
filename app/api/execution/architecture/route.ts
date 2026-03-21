import { NextRequest, NextResponse } from 'next/server';
import { planArchitecture } from '@/lib/execution/architecturePlanner';
import type { RequirementExtractionResult } from '@/types/execution';

export async function POST(req: NextRequest) {
  try {
    let body: { requirement?: RequirementExtractionResult };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Geçersiz istek gövdesi' }, { status: 400 });
    }

    const { requirement } = body;

    if (!requirement || typeof requirement !== 'object') {
      return NextResponse.json({ success: false, error: 'requirement gerekli' }, { status: 400 });
    }

    const data = await planArchitecture(requirement);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('execution/architecture error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
