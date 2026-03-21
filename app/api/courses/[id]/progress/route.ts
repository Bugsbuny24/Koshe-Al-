import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    const supabase = createSupabaseServer();

    let userId: string | undefined;

    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userId = user?.id;
    }

    if (!userId) {
      const cookieHeader = req.headers.get('cookie') || '';
      const tokenMatch = cookieHeader.match(/sb-[^-]+-auth-token=([^;]+)/);
      if (tokenMatch) {
        try {
          const decoded = JSON.parse(decodeURIComponent(tokenMatch[1]));
          const { data: { user: u } } = await supabase.auth.getUser(decoded?.access_token);
          userId = u?.id;
        } catch {
          // ignore
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Kimlik doğrulaması gerekli' }, { status: 401 });
    }

    const { lesson_id, completed, progress_percent } = await req.json();

    if (!lesson_id) {
      return NextResponse.json({ error: 'Ders ID gerekli' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        lesson_id,
        completed: completed ?? false,
        progress_percent: progress_percent ?? 0,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Check if course is complete
    const { data: allLessons } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', courseId);

    const { data: completedLessons } = await supabase
      .from('lesson_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('completed', true);

    const courseComplete =
      allLessons &&
      completedLessons &&
      allLessons.length > 0 &&
      completedLessons.length >= allLessons.length;

    if (courseComplete) {
      await supabase.from('course_enrollments').upsert({
        user_id: userId,
        course_id: courseId,
        completed: true,
        completed_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ progress: data, course_complete: courseComplete });
  } catch (err) {
    console.error('Progress update error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
