import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { userId, courseId, languageCode, level, title } = await req.json();

  if (!userId || !courseId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from('certificates')
    .insert({
      course_id: courseId,
      language_code: languageCode || 'en',
      level: level || 'beginner',
      title: title || 'Course Completion Certificate',
      issued_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
