import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import type {
  RequirementExtractionResult,
  ArchitecturePlanResult,
  TaskBreakdownResult,
  DeliveryChecklistResult,
} from '@/types/execution';

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseServer();

    let body: {
      brief?: string;
      templateId?: string | null;
      requirement?: RequirementExtractionResult | null;
      architecture?: ArchitecturePlanResult | null;
      tasks?: TaskBreakdownResult | null;
      checklist?: DeliveryChecklistResult | null;
      projectId?: string | null;
      dealId?: string | null;
    };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Geçersiz istek gövdesi' }, { status: 400 });
    }

    const { brief, templateId, requirement, architecture, tasks, checklist, projectId, dealId } = body;

    if (!brief?.trim()) {
      return NextResponse.json({ success: false, error: 'Brief gerekli' }, { status: 400 });
    }

    // Try to get user id (optional — execution runs can be anonymous)
    let userId: string | null = null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    } catch {
      // allow anonymous
    }

    const { data: run, error } = await supabase
      .from('execution_runs')
      .insert({
        user_id: userId,
        template_id: templateId ?? null,
        brief: brief.trim(),
        requirement_json: requirement ?? null,
        architecture_json: architecture ?? null,
        tasks_json: tasks ?? null,
        checklist_json: checklist ?? null,
        project_id: projectId ?? null,
        deal_id: dealId ?? null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: run }, { status: 201 });
  } catch (err) {
    console.error('execution/runs POST error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
