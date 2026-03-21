import { NextRequest, NextResponse } from 'next/server';
import { generateDeliveryChecklist } from '@/lib/execution/deliveryChecklist';
import type { RequirementExtractionResult, ArchitecturePlanResult, TaskBreakdownResult } from '@/types/execution';

export async function POST(req: NextRequest) {
  try {
    let body: {
      requirement?: RequirementExtractionResult;
      architecture?: ArchitecturePlanResult;
      tasks?: TaskBreakdownResult;
      scopeText?: string;
      milestoneMode?: string;
    };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Geçersiz istek gövdesi' }, { status: 400 });
    }

    const { requirement, architecture, tasks, scopeText, milestoneMode } = body;

    if (!requirement || typeof requirement !== 'object') {
      return NextResponse.json({ success: false, error: 'requirement gerekli' }, { status: 400 });
    }
    if (!architecture || typeof architecture !== 'object') {
      return NextResponse.json({ success: false, error: 'architecture gerekli' }, { status: 400 });
    }
    if (!tasks || typeof tasks !== 'object') {
      return NextResponse.json({ success: false, error: 'tasks gerekli' }, { status: 400 });
    }

    const data = await generateDeliveryChecklist(
      requirement,
      architecture,
      tasks,
      scopeText,
      milestoneMode
    );
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('execution/checklist error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
