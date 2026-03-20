import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const supabase = createSupabaseServer();
    const cookieStore = await cookies();
    const userId = cookieStore.get('koshei-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ credits_remaining: 0 });
    }

    const { data } = await supabase
      .from('user_quotas')
      .select('credits_remaining, plan_id, is_active')
      .eq('user_id', userId)
      .single();

    return NextResponse.json(data ?? { credits_remaining: 0 });
  } catch {
    return NextResponse.json({ credits_remaining: 0 });
  }
}
