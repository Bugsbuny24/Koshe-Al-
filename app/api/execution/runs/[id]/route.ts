import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin, createSupabaseRouteClient } from '@/lib/supabase/server';
import type { ExecutionRunStatus } from '@/types/execution';

// GET /api/execution/runs/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, error: 'ID gerekli' }, { status: 400 });
  }

  try {
    const supabase = createSupabaseAdmin();
    const { data: run, error } = await supabase
      .from('execution_runs')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !run) {
      return NextResponse.json({ success: false, error: 'Execution run bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: run });
  } catch (err) {
    console.error('execution/runs GET error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}

// PATCH /api/execution/runs/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, error: 'ID gerekli' }, { status: 400 });
  }

  // Require authentication for PATCH — protects against unauthorized run modification.
  const supabaseAuth = await createSupabaseRouteClient();
  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user?.id) {
    return NextResponse.json({ success: false, error: 'Kimlik doğrulaması gerekli' }, { status: 401 });
  }

  let body: {
    project_id?: string | null;
    deal_id?: string | null;
    status?: ExecutionRunStatus;
    title?: string | null;
    milestone_mode?: string | null;
    revision_notes_json?: Record<string, unknown> | null;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Geçersiz istek gövdesi' }, { status: 400 });
  }

  // Only allow safe patch fields
  const allowed = ['project_id', 'deal_id', 'status', 'title', 'milestone_mode', 'revision_notes_json'] as const;
  type AllowedKey = (typeof allowed)[number];
  const patch: Partial<Record<AllowedKey, unknown>> = {};
  for (const key of allowed) {
    if (key in body) {
      patch[key] = (body as Record<string, unknown>)[key];
    }
  }

  // Validate status value if provided
  const VALID_STATUSES: ExecutionRunStatus[] = [
    'draft', 'analyzed', 'planned', 'ready_for_project', 'ready_for_deal', 'linked_to_project', 'linked_to_deal',
  ];
  if (patch.status !== undefined && !VALID_STATUSES.includes(patch.status as ExecutionRunStatus)) {
    return NextResponse.json({ success: false, error: 'Geçersiz status değeri' }, { status: 400 });
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ success: false, error: 'Güncellenecek alan yok' }, { status: 400 });
  }

  try {
    const supabase = createSupabaseAdmin();

    // Atomic update with ownership check: update only if user_id is NULL (anonymous run)
    // or user_id matches the authenticated caller. If no rows are updated, the run either
    // doesn't exist or belongs to a different user.
    const { data: run, error } = await supabase
      .from('execution_runs')
      .update(patch)
      .eq('id', id)
      .or(`user_id.is.null,user_id.eq.${user.id}`)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!run) {
      // No row was updated — determine whether it's 404 or 403
      const { data: existingRun } = await supabase
        .from('execution_runs')
        .select('id')
        .eq('id', id)
        .maybeSingle();
      if (!existingRun) {
        return NextResponse.json({ success: false, error: 'Execution run bulunamadı' }, { status: 404 });
      }
      return NextResponse.json({ success: false, error: 'Bu işlem için yetkiniz yok' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: run });
  } catch (err) {
    console.error('execution/runs PATCH error:', err);
    return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
  }
}
