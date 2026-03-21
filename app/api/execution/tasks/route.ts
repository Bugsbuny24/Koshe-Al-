import { NextRequest, NextResponse } from 'next/server';
import { breakdownTasks } from '@/lib/execution/taskBreakdown';
import type { RequirementExtractionResult, ArchitecturePlanResult } from '@/types/execution';

export async function POST(req: NextRequest) {
  try {
    let body: { requirement?: RequirementExtractionResult; architecture?: ArchitecturePlanResult };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Geçersiz istek gövdesi' }, { status: 400 });
    }

    const { requirement, architecture } = body;

    if (!requirement || typeof requirement !== 'object') {
      return NextResponse.json({ success: false, error: 'requirement gerekli' }, { status: 400 });
    }
    if (!architecture || typeof architecture !== 'object') {
      return NextResponse.json({ success: false, error: 'architecture gerekli' }, { status: 400 });
    }

    const data = await breakdownTasks(requirement, architecture);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('execution/tasks error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
